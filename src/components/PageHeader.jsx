import { motion } from 'framer-motion';
import Breadcrumb from './ui/Breadcrumb';

export default function PageHeader({ title, subtitle, icon: Icon, action, className = '' }) {
  return (
    <div className={`mb-8 ${className}`}>
      <Breadcrumb className="mb-4" />
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          {Icon && (
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-md">
              <Icon className="w-6 h-6 text-white" />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
            {subtitle && <p className="text-sm text-slate-500 mt-0.5 max-w-2xl">{subtitle}</p>}
          </div>
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </motion.div>
    </div>
  );
}
