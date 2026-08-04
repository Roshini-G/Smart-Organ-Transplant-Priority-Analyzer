import { motion } from 'framer-motion';

const Card = ({
  children,
  className = '',
  interactive = false,
  glass = false,
  elevated = false,
  noPadding = false,
  delay = 0,
  onClick,
  ...props
}) => {
  const baseStyle = 'overflow-hidden';
  
  const variantStyles = {
    standard: 'bg-white rounded-2xl shadow-card border border-slate-100',
    interactive: 'bg-white rounded-2xl shadow-card border border-slate-100 hover:shadow-card-hover hover:border-primary-200/60 transition-all duration-300 cursor-pointer',
    glass: 'bg-white/80 backdrop-blur-md rounded-2xl border border-white/40 shadow-card',
    elevated: 'bg-white rounded-2xl shadow-elevated border border-slate-100/50',
  };

  const getVariant = () => {
    if (glass) return variantStyles.glass;
    if (elevated) return variantStyles.elevated;
    if (interactive || onClick) return variantStyles.interactive;
    return variantStyles.standard;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={`${baseStyle} ${getVariant()} ${className}`}
      onClick={onClick}
      {...props}
    >
      {noPadding ? children : <div className="p-6">{children}</div>}
    </motion.div>
  );
};

export const CardHeader = ({ title, subtitle, icon: Icon, action, className = '' }) => (
  <div className={`mb-5 ${className}`}>
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <div>
          <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
          {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  </div>
);

export default Card;
