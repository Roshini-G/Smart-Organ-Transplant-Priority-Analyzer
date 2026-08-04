import { Info, ExternalLink, ShieldCheck, Database, BrainCircuit, Activity } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

export default function About() {
  const specs = [
    { label: 'Architecture', value: 'React 18 + Vite (Frontend)', icon: BrainCircuit },
    { label: 'Styling Engine', value: 'Tailwind CSS 3 + Design System', icon: Activity },
    { label: 'State Management', value: 'Local Storage / React Context', icon: Database },
    { label: 'AI Evaluator', value: 'SAHP / Random Forest (Simulated)', icon: ShieldCheck },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <PageHeader
        title="About the Platform"
        subtitle="Technical overview and mission statement for the SOTP Analyzer."
        icon={Info}
      />

      <Card className="overflow-hidden" noPadding>
        <div className="gradient-hero p-10 md:p-14 text-center text-white">
          <Badge variant="outline" className="text-white border-white/30 bg-white/10 mb-6">Version 2.0.0 Enterprise</Badge>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Smart Organ Transplant Priority Analyzer</h2>
          <p className="text-white/80 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            A production-ready healthcare decision support system designed to modernize organ transplant 
            allocation by merging clinical guidelines (SAHP) with scalable Machine Learning techniques.
          </p>
        </div>
        
        <div className="p-8 md:p-10">
          <div className="prose prose-slate max-w-none">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Project Mission</h3>
            <p className="text-slate-600 leading-relaxed mb-8">
              Organ transplantation is severely constrained by organ shortages. The current allocation models, 
              while rigorous, can lack nuanced predictive power or suffer from opaque calculations. 
              The SOTP Analyzer was built to introduce an <strong>explainable AI layer</strong> to this process. 
              By utilizing the Analytic Hierarchy Process (AHP/SAHP) for fixed clinical guidelines and 
              combining it with SHAP-explained ML models for survival prediction, we aim to ensure the allocation 
              process is fair, medically sound, and entirely transparent.
            </p>

            <h3 className="text-xl font-bold text-slate-800 mb-6">Technical Architecture</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {specs.map((spec, i) => (
                <div key={i} className="flex items-center gap-4 bg-slate-50 border border-slate-100 p-4 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center text-primary-500 shrink-0">
                    <spec.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{spec.label}</p>
                    <p className="text-sm font-semibold text-slate-800">{spec.value}</p>
                  </div>
                </div>
              ))}
            </div>

             <div className="bg-primary-50 border border-primary-100 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h4 className="font-bold text-primary-900">Developer Documentation</h4>
                  <p className="text-sm text-primary-700 mt-1">Review the source code, contributing guidelines, and API specs.</p>
                </div>
                <a href="#" className="flex items-center gap-2 bg-white text-primary-700 px-5 py-2.5 rounded-xl font-semibold shadow-sm hover:shadow-md transition-all shrink-0 border border-primary-200">
                  View Repository <ExternalLink className="w-4 h-4" />
                </a>
             </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
