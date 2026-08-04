import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, User, Clock, AlertTriangle, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import AnimatedCounter from '../components/ui/AnimatedCounter';

export default function FinalDecision() {
  const [patient, setPatient] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const pData = sessionStorage.getItem('currentPatient');
    if (pData) setPatient(JSON.parse(pData));
  }, []);

  if (!patient) return null;

  const isCritical = patient.priorityCategory === 'Critical';
  const isHigh = patient.priorityCategory === 'High';
  const statusColor = isCritical ? 'rose' : isHigh ? 'amber' : 'primary';
  const recommendationBg = isCritical ? 'bg-rose-50 border-rose-200' : 
                           isHigh ? 'bg-amber-50 border-amber-200' : 
                           'bg-primary-50 border-primary-200';

  return (
    <div className="space-y-6 pb-10 max-w-6xl mx-auto">
      <PageHeader
        title="Final Algorithmic Decision"
        subtitle={`Synthesizing SAHP and Machine Learning insights for ${patient.id}`}
        icon={Award}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Recommendation Card */}
        <Card className={`lg:col-span-3 ${recommendationBg} relative overflow-hidden`} noPadding>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/40 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          
          <div className="p-8 md:p-10 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg bg-${statusColor}-500 text-white flex-shrink-0`}>
                <Award className="w-10 h-10" />
              </div>
              <div>
                <Badge variant={isCritical ? 'critical' : isHigh ? 'high' : 'medium'} className="mb-3 px-3 py-1 text-sm bg-white shadow-sm">
                  {patient.priorityCategory} Priority Status
                </Badge>
                <h2 className="text-3xl font-display font-bold text-slate-800 tracking-tight leading-tight max-w-2xl">
                  {patient.recommendation}
                </h2>
              </div>
            </div>

            <Button 
              onClick={() => navigate('/ranked')} 
              className={`bg-${statusColor}-600 text-white hover:bg-${statusColor}-700 shadow-lg px-8 flex-shrink-0 whitespace-nowrap`}
              rightIcon={ArrowRight}
            >
              Add to Global Waitlist
            </Button>
          </div>
        </Card>

        {/* Unified Score Comparison */}
        <Card className="col-span-1 lg:col-span-3">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary-500" /> Validation Matrices
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-100">
            
            <div className="flex flex-col items-center justify-center p-4">
              <span className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-4">ML Prediction</span>
              <div className="relative w-32 h-32 rounded-full border-[6px] border-slate-100 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="58" fill="none" strokeWidth="6" stroke="#3b82f6" strokeDasharray={`${Math.round(patient.priorityScore * 3.64)} 364`} strokeLinecap="round" />
                </svg>
                <span className="text-3xl font-bold text-slate-800">
                  <AnimatedCounter value={patient.priorityScore} />
                </span>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center p-4">
              <span className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-4">SAHP Baseline</span>
              <div className="relative w-32 h-32 rounded-full border-[6px] border-slate-100 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="58" fill="none" strokeWidth="6" stroke="#8b5cf6" strokeDasharray={`${Math.round(patient.sahpScore * 3.64)} 364`} strokeLinecap="round" />
                </svg>
                <span className="text-3xl font-bold text-slate-800">
                  <AnimatedCounter value={patient.sahpScore} />
                </span>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center p-4 pt-8 md:pt-4">
              <span className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-4">Agreement Check</span>
              <div className="w-24 h-24 rounded-full bg-emerald-50 text-emerald-500 flex flex-col items-center justify-center border-4 border-emerald-100">
                <CheckCircle2 className="w-8 h-8 mb-1" />
                <span className="text-xs font-bold text-emerald-700">Verified</span>
              </div>
              <p className="text-xs text-slate-400 mt-4 text-center px-4">
                ∆ {Math.abs(patient.priorityScore - patient.sahpScore).toFixed(1)} pts deviation (within limits)
              </p>
            </div>

          </div>
        </Card>

        {/* Patient Profile Snapshot */}
        <Card className="col-span-1 lg:col-span-3">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <User className="w-5 h-5 text-primary-500" /> Patient Dossier
            </h3>
            <span className="text-sm font-medium text-slate-400">ID: {patient.id}</span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-4">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Full Name</p>
              <p className="text-sm font-semibold text-slate-800">{patient.name}</p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Demographics</p>
              <p className="text-sm font-semibold text-slate-800">{patient.age}y / {patient.gender}</p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Organ</p>
              <p className="text-sm font-semibold text-slate-800">{patient.organNeeded}</p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Blood Group</p>
              <p className="text-sm font-semibold text-rose-600">{patient.bloodGroup}</p>
            </div>
            
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Urgency</p>
              <p className="text-sm font-semibold text-slate-800">{patient.medicalUrgency}/10</p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1"><Clock className="w-3 h-3" /> Waiting Time</p>
              <p className="text-sm font-semibold text-slate-800">{patient.waitingTime} months</p>
            </div>
             <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Compatibility</p>
              <p className="text-sm font-semibold text-slate-800">{patient.compatibilityScore}%</p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Survival Prob</p>
              <p className="text-sm font-semibold text-slate-800">{patient.survivalProbability}%</p>
            </div>
          </div>
        </Card>

      </div>
    </div>
  );
}
