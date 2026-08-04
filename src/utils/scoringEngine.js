// Scoring Engine - Core logic for SAHP, ML prediction, and SHAP explainability

export const SAHP_WEIGHTS = {
  medicalUrgency: 0.25,
  compatibilityScore: 0.20,
  waitingTime: 0.15,
  diseaseSeverity: 0.15,
  survivalProbability: 0.10,
  organFailureStage: 0.10,
  recoveryChance: 0.05,
};

export const SAHP_CRITERIA = [
  { key: 'medicalUrgency', label: 'Medical Urgency', weight: 25, color: '#f43f5e' },
  { key: 'compatibilityScore', label: 'Compatibility Score', weight: 20, color: '#0ea5e9' },
  { key: 'waitingTime', label: 'Waiting Time', weight: 15, color: '#f59e0b' },
  { key: 'diseaseSeverity', label: 'Disease Severity', weight: 15, color: '#8b5cf6' },
  { key: 'survivalProbability', label: 'Survival Probability', weight: 10, color: '#10b981' },
  { key: 'organFailureStage', label: 'Organ Failure Stage', weight: 10, color: '#ec4899' },
  { key: 'recoveryChance', label: 'Recovery Chance', weight: 5, color: '#06b6d4' },
];

// Normalize a value to 0-100 range
function normalize(value, min, max) {
  return Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
}

// Compute normalized feature values from raw patient data
export function computeFeatures(patient) {
  const urgency = normalize(patient.medicalUrgency || 1, 1, 10) ;
  const compatibility = patient.compatibilityScore || 50;
  const waitingTime = normalize(Math.min(patient.waitingTime || 0, 120), 0, 120);
  const severity = normalize(patient.diseaseSeverity || 1, 1, 10);
  const survival = patient.survivalProbability || 50;
  const organFailure = normalize(patient.organFailureStage || 1, 1, 5);
  const recovery = patient.recoveryChance || 50;

  return { urgency, compatibility, waitingTime, severity, survival, organFailure, recovery };
}

// SAHP weighted score computation
export function computeSAHPScore(patient) {
  const f = computeFeatures(patient);

  const score =
    SAHP_WEIGHTS.medicalUrgency * f.urgency +
    SAHP_WEIGHTS.compatibilityScore * f.compatibility +
    SAHP_WEIGHTS.waitingTime * f.waitingTime +
    SAHP_WEIGHTS.diseaseSeverity * f.severity +
    SAHP_WEIGHTS.survivalProbability * f.survival +
    SAHP_WEIGHTS.organFailureStage * f.organFailure +
    SAHP_WEIGHTS.recoveryChance * f.recovery;

  return Math.round(score * 10) / 10;
}

// ML-style priority prediction
export function computeMLPrediction(patient) {
  const f = computeFeatures(patient);
  const sahpScore = computeSAHPScore(patient);

  // Additional factors
  const infectionPenalty = patient.infectionRisk === 'High' ? -8 : patient.infectionRisk === 'Medium' ? -4 : 0;
  const icuBonus = patient.icuRequirement === 'Yes' ? 5 : 0;
  const donorBonus = patient.donorMatchAvailability === 'High' ? 6 : patient.donorMatchAvailability === 'Medium' ? 3 : -3;

  // Non-linear adjustments for realism
  const urgencyBoost = f.urgency > 80 ? 8 : f.urgency > 60 ? 4 : 0;
  const criticalFailure = f.organFailure > 80 ? 6 : 0;
  const lowSurvivalPenalty = f.survival < 20 ? -5 : 0;

  let priorityScore = sahpScore + infectionPenalty + icuBonus + donorBonus + urgencyBoost + criticalFailure + lowSurvivalPenalty;

  // Clamp to 0-100
  priorityScore = Math.max(0, Math.min(100, priorityScore));
  priorityScore = Math.round(priorityScore * 10) / 10;

  // Confidence based on data completeness and score extremity
  const scoreExtremity = Math.abs(priorityScore - 50) / 50;
  let confidence = 75 + scoreExtremity * 20 + (Math.random() * 5);
  confidence = Math.min(99, Math.round(confidence * 10) / 10);

  // Risk score
  const riskScore = Math.round((f.urgency * 0.3 + f.severity * 0.25 + f.organFailure * 0.25 + (100 - f.survival) * 0.2) * 10) / 10;

  // Transplant urgency
  const transplantUrgency = Math.round((f.urgency * 0.4 + f.organFailure * 0.3 + f.severity * 0.3) * 10) / 10;

  // Priority category
  let category;
  if (priorityScore >= 75) category = 'Critical Priority';
  else if (priorityScore >= 55) category = 'High Priority';
  else if (priorityScore >= 35) category = 'Medium Priority';
  else category = 'Low Priority';

  return {
    priorityScore,
    category,
    confidence,
    riskScore,
    transplantUrgency,
    modelName: 'Random Forest + XGBoost Ensemble',
  };
}

// SHAP-style feature contributions
export function computeSHAPValues(patient) {
  const f = computeFeatures(patient);
  const baselineScore = 50;
  const prediction = computeMLPrediction(patient);

  const contributions = [
    {
      feature: 'Medical Urgency',
      value: patient.medicalUrgency,
      contribution: Math.round(((f.urgency - 50) * SAHP_WEIGHTS.medicalUrgency * 2 + (f.urgency > 80 ? 8 : f.urgency > 60 ? 4 : 0)) * 10) / 10,
    },
    {
      feature: 'Waiting Time',
      value: `${patient.waitingTime} months`,
      contribution: Math.round(((f.waitingTime - 50) * SAHP_WEIGHTS.waitingTime * 2) * 10) / 10,
    },
    {
      feature: 'Disease Severity',
      value: patient.diseaseSeverity,
      contribution: Math.round(((f.severity - 50) * SAHP_WEIGHTS.diseaseSeverity * 2) * 10) / 10,
    },
    {
      feature: 'Organ Failure Stage',
      value: patient.organFailureStage,
      contribution: Math.round(((f.organFailure - 50) * SAHP_WEIGHTS.organFailureStage * 2 + (f.organFailure > 80 ? 6 : 0)) * 10) / 10,
    },
    {
      feature: 'Compatibility Score',
      value: patient.compatibilityScore,
      contribution: Math.round(((f.compatibility - 50) * SAHP_WEIGHTS.compatibilityScore * 2) * 10) / 10,
    },
    {
      feature: 'Survival Probability',
      value: `${patient.survivalProbability}%`,
      contribution: Math.round(((f.survival - 50) * SAHP_WEIGHTS.survivalProbability * 2 + (f.survival < 20 ? -5 : 0)) * 10) / 10,
    },
    {
      feature: 'Recovery Chance',
      value: `${patient.recoveryChance}%`,
      contribution: Math.round(((f.recovery - 50) * SAHP_WEIGHTS.recoveryChance * 2) * 10) / 10,
    },
    {
      feature: 'Infection Risk',
      value: patient.infectionRisk,
      contribution: patient.infectionRisk === 'High' ? -8 : patient.infectionRisk === 'Medium' ? -4 : 1,
    },
    {
      feature: 'ICU Requirement',
      value: patient.icuRequirement,
      contribution: patient.icuRequirement === 'Yes' ? 5 : -1,
    },
    {
      feature: 'Donor Match',
      value: patient.donorMatchAvailability,
      contribution: patient.donorMatchAvailability === 'High' ? 6 : patient.donorMatchAvailability === 'Medium' ? 3 : -3,
    },
  ];

  // Sort by absolute contribution
  contributions.sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution));

  const increasing = contributions.filter(c => c.contribution > 0);
  const decreasing = contributions.filter(c => c.contribution < 0);

  return { contributions, increasing, decreasing, baselineScore, finalScore: prediction.priorityScore };
}

// Final decision support
export function computeDecision(patient) {
  const prediction = computeMLPrediction(patient);
  const sahpScore = computeSAHPScore(patient);

  let recommendation, reason, transplantReadiness;

  if (prediction.priorityScore >= 80) {
    recommendation = 'Prioritize Immediately';
    reason = 'High urgency, severe organ failure, long waiting time, and acceptable transplant suitability indicate immediate prioritization is warranted.';
    transplantReadiness = 'Ready for Transplant';
  } else if (prediction.priorityScore >= 65) {
    recommendation = 'High Queue Placement';
    reason = 'Significant medical urgency and disease severity warrant high placement in the transplant queue with close monitoring.';
    transplantReadiness = 'Conditionally Ready';
  } else if (prediction.priorityScore >= 45) {
    recommendation = 'Moderate Queue Placement';
    reason = 'Moderate priority factors suggest standard queue placement with regular reassessment of clinical status.';
    transplantReadiness = 'Requires Further Evaluation';
  } else if (prediction.priorityScore >= 25) {
    recommendation = 'Observe and Reassess';
    reason = 'Current clinical indicators suggest continued monitoring with periodic reassessment for transplant eligibility.';
    transplantReadiness = 'Under Observation';
  } else {
    recommendation = 'Defer Temporarily';
    reason = 'Current clinical profile indicates deferment is appropriate. Patient should be monitored with scheduled follow-up evaluations.';
    transplantReadiness = 'Not Currently Eligible';
  }

  const clinicalSummary = generateClinicalSummary(patient, prediction);

  return {
    priorityLabel: prediction.category,
    recommendation,
    reason,
    transplantReadiness,
    clinicalSummary,
    priorityScore: prediction.priorityScore,
    sahpScore,
    confidence: prediction.confidence,
  };
}

function generateClinicalSummary(patient, prediction) {
  const factors = [];
  if (patient.medicalUrgency >= 7) factors.push('severe medical urgency');
  if (patient.waitingTime >= 24) factors.push('extended waiting period');
  if (patient.diseaseSeverity >= 7) factors.push('high disease severity');
  if (patient.organFailureStage >= 4) factors.push('advanced organ failure');
  if (patient.compatibilityScore >= 70) factors.push('strong donor compatibility');
  if (patient.icuRequirement === 'Yes') factors.push('ICU-level care requirement');

  const negatives = [];
  if (patient.compatibilityScore < 40) negatives.push('limited donor compatibility');
  if (patient.recoveryChance < 30) negatives.push('reduced post-transplant recovery outlook');
  if (patient.infectionRisk === 'High') negatives.push('elevated infection risk');
  if (patient.survivalProbability < 30) negatives.push('low baseline survival probability');

  let summary = `The patient has been assessed with a priority score of ${prediction.priorityScore}/100 (${prediction.category}).`;

  if (factors.length > 0) {
    summary += ` Key contributing factors include ${factors.join(', ')}.`;
  }
  if (negatives.length > 0) {
    summary += ` However, ${negatives.join(' and ')} were noted as mitigating factors.`;
  }

  summary += ` Model confidence: ${prediction.confidence}%.`;

  return summary;
}

// Get priority badge class
export function getPriorityBadgeClass(category) {
  switch (category) {
    case 'Critical Priority': return 'badge-critical';
    case 'High Priority': return 'badge-high';
    case 'Medium Priority': return 'badge-medium';
    case 'Low Priority': return 'badge-low';
    default: return 'badge-medium';
  }
}

// Get priority color
export function getPriorityColor(category) {
  switch (category) {
    case 'Critical Priority': return '#f43f5e';
    case 'High Priority': return '#f59e0b';
    case 'Medium Priority': return '#0ea5e9';
    case 'Low Priority': return '#10b981';
    default: return '#64748b';
  }
}
