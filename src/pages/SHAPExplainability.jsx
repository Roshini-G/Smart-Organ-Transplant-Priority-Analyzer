import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, CheckCircle, Info } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import SHAPBar from '../components/SHAPBar';
import Button from '../components/ui/Button';
import Card, { CardHeader } from '../components/ui/Card';
import { computeSHAPValues } from '../utils/scoringEngine';

export default function SHAPExplainability() {
  const [patient, setPatient] = useState(null);
  const [shapData, setShapData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const pData = sessionStorage.getItem('currentPatient');
    if (pData) {
      const parsed = JSON.parse(pData);
      setPatient(parsed);
      const shap = computeSHAPValues(parsed);
      
      const formattedShap = [
        { feature: 'Medical Urgency', value: parsed.medicalUrgency, contribution: shap.medicalUrgency },
        { feature: 'Disease Severity', value: parsed.diseaseSeverity, contribution: shap.diseaseSeverity },
        { feature: 'Waiting Time (mo)', value: parsed.waitingTime, contribution: shap.waitingTime },
        { feature: 'Compatibility Match', value: `${parsed.compatibilityScore}%`, contribution: shap.compatibilityScore },
        { feature: 'Survival Probability', value: `${parsed.survivalProbability}%`, contribution: shap.survivalProbability },
        { feature: 'Comorbidities', value: parsed.comorbidities, contribution: shap.comorbidities },
      ].sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution));

      setShapData(formattedShap);
    }
  }, []);

  if (!patient || shapData.length === 0) return null;

  const maxAbsContrib = Math.max(...shapData.map(d => Math.abs(d.contribution)));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Model Explainability (SHAP)"
        subtitle="Transparent unpacking of feature contributions to the final algorithmic decision."
        icon={ShieldCheck}
        action={
          <Button onClick={() => navigate('/decision')} rightIcon={ArrowRight} className="gradient-primary">
            View Final Decision
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Waterfall Chart */}
        <Card className="lg:col-span-2 relative overflow-hidden">
          <CardHeader title="SHAP Waterfall Impact Chart" icon={ShieldCheck} />
          
          <div className="flex text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-3 mb-4 px-2">
            <div className="w-40 text-right">Feature</div>
            <div className="flex-1 text-center">Impact Magnitude</div>
            <div className="w-24 pl-3 text-left">Input Value</div>
          </div>
          
          <div className="space-y-1 relative">
            <div className="absolute top-0 bottom-0 left-[200px] right-24 border-x border-slate-100 bg-slate-50/30 z-0 pointer-events-none" />
            
            <div className="relative z-10 py-2">
              {shapData.map((data, idx) => (
                <SHAPBar 
                  key={idx}
                  feature={data.feature} 
                  value={data.value} 
                  contribution={data.contribution} 
                  maxAbsContribution={maxAbsContrib}
                  delay={idx * 0.15}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-slate-100">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <div className="w-3 h-3 rounded-full bg-rose-500 shadow-sm" /> Decreases Priority
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm" /> Increases Priority
            </div>
          </div>
        </Card>

        {/* Explainability Summary Panel */}
        <div className="space-y-6">
          <Card delay={0.2} className="gradient-card border-primary-100">
             <div className="flex items-start gap-4 mb-4">
               <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center shrink-0">
                 <Info className="w-5 h-5" />
               </div>
               <div>
                 <h3 className="font-semibold text-slate-800">Interpretation</h3>
                 <p className="text-xs text-slate-600 mt-1">
                   The predicted score is <span className="font-bold text-slate-800">{Math.round(patient.priorityScore)}</span> vs. baseline <span className="font-bold text-slate-800">{Math.round(patient.sahpScore)}</span>.
                 </p>
               </div>
             </div>
             
             <div className="space-y-3 mt-4">
                <p className="text-sm font-medium text-slate-700">Key driving factors (Top 2):</p>
                <div className="bg-white p-3 rounded-lg border border-primary-100 shadow-sm text-sm text-slate-600">
                   <strong className="text-slate-800">{shapData[0].feature}</strong> shifted the prediction by <strong className={shapData[0].contribution > 0 ? 'text-emerald-600' : 'text-rose-600'}>{Math.abs(shapData[0].contribution).toFixed(1)}</strong> points.
                </div>
                <div className="bg-white p-3 rounded-lg border border-primary-100 shadow-sm text-sm text-slate-600">
                   <strong className="text-slate-800">{shapData[1].feature}</strong> shifted the prediction by <strong className={shapData[1].contribution > 0 ? 'text-emerald-600' : 'text-rose-600'}>{Math.abs(shapData[1].contribution).toFixed(1)}</strong> points.
                </div>
             </div>
          </Card>

          <Card delay={0.3}>
            <div className="flex gap-3">
              <div className="text-emerald-500 flex-shrink-0 mt-0.5">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">Why Explainability Matters</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Healthcare decisions require transparency. SHAP (SHapley Additive exPlanations) ensures that the AI's allocation logic is interpretable, unbiased, and mathematically verifiable by medical professionals.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
