// Patient Store - localStorage CRUD operations

const STORAGE_KEY = 'organ_transplant_patients';

export function getAllPatients() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function savePatient(patient) {
  const patients = getAllPatients();
  const existingIndex = patients.findIndex(p => p.id === patient.id);
  
  if (existingIndex >= 0) {
    patients[existingIndex] = { ...patients[existingIndex], ...patient, updatedAt: new Date().toISOString() };
  } else {
    patients.push({
      ...patient,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: patient.status || 'Waiting',
    });
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
  return patient;
}

export function getPatientById(id) {
  const patients = getAllPatients();
  return patients.find(p => p.id === id) || null;
}

export function deletePatient(id) {
  const patients = getAllPatients().filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
}

export function updatePatientStatus(id, status) {
  const patients = getAllPatients();
  const index = patients.findIndex(p => p.id === id);
  if (index >= 0) {
    patients[index].status = status;
    patients[index].updatedAt = new Date().toISOString();
    if (status === 'Completed') {
      patients[index].completedAt = new Date().toISOString();
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
  }
}

export function getPatientStats() {
  const patients = getAllPatients().filter(p => p.status !== 'Archived');
  const analyzed = patients.filter(p => p.priorityScore !== undefined);

  const critical = analyzed.filter(p => p.priorityCategory === 'Critical Priority').length;
  const high = analyzed.filter(p => p.priorityCategory === 'High Priority').length;
  const medium = analyzed.filter(p => p.priorityCategory === 'Medium Priority').length;
  const low = analyzed.filter(p => p.priorityCategory === 'Low Priority').length;

  const avgUrgency = analyzed.length > 0
    ? Math.round(analyzed.reduce((sum, p) => sum + (p.medicalUrgency || 0), 0) / analyzed.length * 10) / 10
    : 0;

  const avgCompatibility = analyzed.length > 0
    ? Math.round(analyzed.reduce((sum, p) => sum + (p.compatibilityScore || 0), 0) / analyzed.length * 10) / 10
    : 0;

  const avgPriority = analyzed.length > 0
    ? Math.round(analyzed.reduce((sum, p) => sum + (p.priorityScore || 0), 0) / analyzed.length * 10) / 10
    : 0;

  const organDistribution = {};
  patients.forEach(p => {
    const organ = p.organNeeded || 'Unknown';
    organDistribution[organ] = (organDistribution[organ] || 0) + 1;
  });

  return {
    total: patients.length,
    analyzed: analyzed.length,
    critical,
    high,
    medium,
    low,
    avgUrgency,
    avgCompatibility,
    avgPriority,
    organDistribution,
    priorityDistribution: { critical, high, medium, low },
  };
}

// Initialize with sample data if empty
export function initializeSampleData(samplePatients) {
  const existing = getAllPatients();
  if (existing.length === 0) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(samplePatients));
  }
}
