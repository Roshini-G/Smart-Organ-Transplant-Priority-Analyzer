import { motion } from 'framer-motion';
import { CheckCircle2, Loader2, ArrowDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import Card from './ui/Card';

export default function PipelineStep({ step, index, isActive, isComplete, delay = 0, showConnector = true }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isActive && !isComplete) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + Math.random() * 15 + 5;
        });
      }, 150);
      return () => clearInterval(interval);
    }
    if (isComplete) setProgress(100);
  }, [isActive, isComplete]);

  // Color mapping
  const activeColor = 'bg-primary-50 border-primary-200 shadow-md';
  const activeIconBg = 'bg-primary-500 text-white';
  const completeColor = 'bg-emerald-50 bg-opacity-50 border-emerald-100';
  const completeIconBg = 'bg-emerald-500 text-white';
  const pendingColor = 'bg-slate-50 border-slate-200';
  const pendingIconBg = 'bg-slate-200 text-slate-500';

  const containerClasses = isComplete ? completeColor : isActive ? activeColor : pendingColor;
  const iconClasses = isComplete ? completeIconBg : isActive ? activeIconBg : pendingIconBg;
  const textColor = isComplete ? 'text-emerald-700' : isActive ? 'text-primary-700' : 'text-slate-500';
  const barColor = isComplete ? 'bg-emerald-500' : 'bg-primary-500';

  return (
    <div className="relative">
      {/* Connector Line */}
      {showConnector && (
        <div className="absolute left-9 top-14 bottom-[-1rem] w-0.5 bg-slate-200 -translate-x-1/2 z-0" />
      )}
      
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay }}
        className={`relative z-10 flex items-start gap-4 p-4 rounded-xl border transition-all duration-300 ${containerClasses}`}
      >
        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${iconClasses}`}>
          {isComplete ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : isActive ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <span className="text-sm font-bold">{index + 1}</span>
          )}
        </div>

        <div className="flex-1 min-w-0 pt-1">
          <div className="flex items-center justify-between mb-1">
            <h4 className={`text-sm font-semibold transition-colors duration-300 ${textColor}`}>
              {step.label}
            </h4>
            {isComplete && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                Complete
              </span>
            )}
            {isActive && !isComplete && (
              <span className="text-xs font-bold text-primary-600 tabular-nums">
                {Math.min(Math.round(progress), 100)}%
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 leading-relaxed mt-1">{step.description}</p>
          
          {(isActive || isComplete) && (
            <div className="mt-3 w-full bg-slate-200/60 rounded-full h-1.5 overflow-hidden ring-1 ring-inset ring-slate-900/5">
              <motion.div
                className={`h-full rounded-full ${barColor}`}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
