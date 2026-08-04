import { Workflow as WorkflowIcon, ArrowRight, UserPlus, Database, Scale, Brain, ShieldCheck, ListOrdered } from 'lucide-react';
import { motion } from 'framer-motion';
import PageHeader from '../components/PageHeader';
import Card from '../components/ui/Card';

const workflowSteps = [
  { id: 1, title: 'Patient Registration', icon: UserPlus, desc: 'Clerical input of clinical features and demographics.' },
  { id: 2, title: 'Data Preprocessing', icon: Database, desc: 'Normalization, missing value imputation, schema validation.' },
  { id: 3, title: 'SAHP Baseline Eval', icon: Scale, desc: 'Analytic Hierarchy Process generating multi-criteria baseline.' },
  { id: 4, title: 'ML Prediction', icon: Brain, desc: 'Ensemble model predicting mortality risk & compatibility.' },
  { id: 5, title: 'SHAP Explainability', icon: ShieldCheck, desc: 'Feature importance breakdown for clinical transparency.' },
  { id: 6, title: 'Priority Ranking', icon: ListOrdered, desc: 'Final unified score injected into global transplant queue.' },
];

export default function Workflow() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="System Architecture Workflow"
        subtitle="End-to-end data pipeline from registration to final priority tier allocation."
        icon={WorkflowIcon}
      />

      <Card className="py-12">
        <div className="relative">
          {/* Central Connecting Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-200 via-primary-300 to-emerald-200 -translate-x-1/2 hidden md:block" />

          <div className="space-y-12">
            {workflowSteps.map((step, idx) => (
              <motion.div 
                key={step.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className={`relative flex items-center justify-between md:justify-center ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
              >
                
                {/* Connector Arrow (Desktop) */}
                <div className={`hidden md:flex absolute top-1/2 -translate-y-1/2 ${idx % 2 === 0 ? 'right-1/2 translate-x-1/2 pr-12' : 'left-1/2 -translate-x-1/2 pl-12'}`}>
                  <ArrowRight className={`w-6 h-6 text-slate-300 ${idx % 2 === 0 ? 'rotate-180' : ''}`} />
                </div>

                {/* Node Box */}
                <div className={`w-full md:w-[45%] flex ${idx % 2 === 0 ? 'justify-start md:justify-start' : 'justify-start md:justify-end'} z-10`}>
                  <div className={`bg-white border-2 border-slate-100 shadow-elevated rounded-2xl p-6 w-full group hover:border-primary-300 transition-colors duration-300 ${idx === workflowSteps.length - 1 ? 'border-emerald-200' : ''}`}>
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-inner group-hover:scale-110 transition-transform ${idx === workflowSteps.length - 1 ? 'bg-emerald-100 text-emerald-600' : 'bg-primary-50 text-primary-600'}`}>
                        <step.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-1 block">Step 0{step.id}</span>
                        <h3 className="text-base font-bold text-slate-800 leading-tight mb-1">{step.title}</h3>
                        <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Center Node (Desktop) */}
                <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border-4 border-primary-500 z-10 shadow-sm items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-primary-500" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
