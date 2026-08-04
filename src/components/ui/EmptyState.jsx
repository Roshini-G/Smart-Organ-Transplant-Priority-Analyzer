import { motion } from 'framer-motion';

const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  className = '',
  compact = false
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center text-center ${compact ? 'py-8' : 'py-16'} ${className}`}
    >
      {Icon && (
        <div className={`
          ${compact ? 'w-12 h-12 mb-3' : 'w-16 h-16 mb-5'} 
          rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300
        `}>
          <Icon className={compact ? 'w-6 h-6' : 'w-8 h-8'} />
        </div>
      )}
      <h3 className={`font-semibold text-slate-800 ${compact ? 'text-base mb-1' : 'text-lg mb-2'}`}>
        {title}
      </h3>
      {description && (
        <p className={`text-slate-500 max-w-sm mx-auto ${compact ? 'text-xs' : 'text-sm mb-6'}`}>
          {description}
        </p>
      )}
      {action && (
        <div className={compact ? 'mt-4' : ''}>
          {action}
        </div>
      )}
    </motion.div>
  );
};

export default EmptyState;
