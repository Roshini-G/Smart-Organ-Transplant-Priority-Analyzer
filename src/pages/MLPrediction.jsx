import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, ArrowRight, Info, AlertTriangle } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import ScoreGauge from '../components/ScoreGauge';
import Button from '../components/ui/Button';
import Card, { CardHeader } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Tooltip from '../components/ui/Tooltip';

export default function MLPrediction() {
  const [patient, setPatient] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const pData = sessionStorage.getItem('currentPatient');
    if (pData) setPatient(JSON.parse(pData));
  }, []);

  if (!patient) return null;

  const isCritical = patient.priorityScore >= 80;

  return (
    <div className="space-y-6">
      <PageHeader
        title="ML Priority Prediction"
        subtitle={`Ensemble tree model output for patient ${patient.id}`}
        icon={Brain}
        action={
          <Button onClick={() => navigate('/shap')} rightIcon={ArrowRight} className="gradient-primary">
            View Model Explainability
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Score Gauge */}
        <Card className={`lg:col-span-1 flex flex-col justify-center items-center py-10 relative overflow-hidden ${isCritical ? 'border-rose-200 shadow-glow-danger' : 'border-primary-100 shadow-glow-blue'}`}>
          
          {/* Subtle colored background hint */}
          <div className={`absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2 ${isCritical ? 'bg-rose-500' : 'bg-primary-500'}`} />

          <Badge variant={isCritical ? 'critical' : 'medium'} className="mb-8" pulse={isCritical}>
            {patient.priorityCategory} Priority
          </Badge>

          <ScoreGauge 
            score={Math.round(patient.priorityScore)} 
            size={220} 
            strokeWidth={16} 
            label="Combined Priority Score"
            animate={true}
            gradient={true}
          />
          
          <div className="flex items-center gap-2 mt-8 text-sm text-slate-500 bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">
            <Info className="w-4 h-4 text-primary-500" />
            Model Confidence: <span className="font-bold text-slate-700">{patient.confidence}%</span>
          </div>
        </Card>

        {/* Factor Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          <Card delay={0.2}>
            <CardHeader title="Clinical Risk Assessment" icon={AlertTriangle} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="glass-panel p-5 bg-slate-50/50">
                <p className="text-sm font-semibold text-slate-800 mb-1">Mortality Risk Score</p>
                <p className="text-[11px] text-slate-500 mb-4">Calculated waitlist risk threshold</p>
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-3xl font-bold font-display text-amber-600">{patient.riskScore.toFixed(1)}</span>
                  <span className="text-sm font-medium text-slate-400 mb-1">/ 100</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                   <div 
                    className="h-full bg-amber-500 rounded-full transition-all duration-1000" 
                    style={{ width: `${patient.riskScore}%` }} 
                   />
                </div>
              </div>

               <div className="glass-panel p-5 bg-slate-50/50">
                <p className="text-sm font-semibold text-slate-800 mb-1">Post-Transplant Success</p>
                <p className="text-[11px] text-slate-500 mb-4">Predicted survival probability</p>
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-3xl font-bold font-display text-emerald-600">{patient.survivalProbability}</span>
                  <span className="text-sm font-medium text-slate-400 mb-1">%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                   <div 
                    className="h-full bg-emerald-500 rounded-full transition-all duration-1000" 
                    style={{ width: `${patient.survivalProbability}%` }} 
                   />
                </div>
              </div>

            </div>
          </Card>

          <Card delay={0.3}>
            <CardHeader title="Categorical Model Inputs" icon={Brain} />
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Donor Match", value: patient.donorMatchAvailability },
                  { label: "Blood Group", value: patient.bloodGroup },
                  { label: "Organ", value: patient.organNeeded },
                  { label: "ICU Needed", value: patient.icuRequirement }
                ].map(item => (
                  <div key={item.label} className="border border-slate-100 rounded-xl p-4 bg-white shadow-sm flex flex-col items-center justify-center text-center">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-2">{item.label}</span>
                    <span className="text-sm font-semibold text-slate-800">{item.value}</span>
                  </div>
                ))}
             </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
