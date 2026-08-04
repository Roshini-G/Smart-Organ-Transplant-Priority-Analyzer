import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

const ProgressStepper = ({ steps, currentStep, className = '' }) => {
  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between relative">
        {/* Background Line */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 rounded-full z-0" />
        
        {/* Progress Line */}
        <motion.div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary-500 rounded-full z-0"
          initial={{ width: 0 }}
          animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        />

        {/* Steps */}
        {steps.map((step, index) => {
          const isCompleted = currentStep > index;
          const isCurrent = currentStep === index;
          
          return (
            <div key={step.id || index} className="relative z-10 flex flex-col items-center">
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: isCompleted || isCurrent ? '#2563eb' : '#fff', // primary-600
                  borderColor: isCompleted || isCurrent ? '#2563eb' : '#cbd5e1', // slate-300
                  scale: isCurrent ? 1.1 : 1
                }}
                className={`
                  w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors duration-300
                  ${isCompleted || isCurrent ? 'text-white' : 'text-slate-400'}
                `}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span className="text-xs font-semibold">{index + 1}</span>
                )}
              </motion.div>
              
              <div className="absolute top-10 w-24 text-center -ml-8">
                <p className={`text-xs font-medium transition-colors duration-300 ${isCurrent ? 'text-primary-600' : isCompleted ? 'text-slate-700' : 'text-slate-400'}`}>
                  {step.title}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressStepper;
