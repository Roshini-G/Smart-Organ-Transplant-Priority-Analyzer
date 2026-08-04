import { motion } from 'framer-motion';
import Tooltip from './ui/Tooltip';

export default function SHAPBar({ feature, value, contribution, maxAbsContribution, delay = 0 }) {
  const isPositive = contribution >= 0;
  const barWidth = Math.min(Math.abs(contribution) / maxAbsContribution * 100, 100);

  return (
    <motion.div
      initial={{ opacity: 0, x: isPositive ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay }}
      className="flex items-center gap-3 py-2.5 group"
    >
      <div className="w-40 text-right flex-shrink-0">
        <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">{feature}</span>
      </div>
      <div className="flex-1 flex items-center gap-2">
        {!isPositive && (
          <div className="flex-1 flex justify-end">
            <Tooltip content={`Decreases priority by ${Math.abs(contribution).toFixed(1)} points`} position="top">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${barWidth}%` }}
                transition={{ duration: 0.8, delay: delay + 0.2, ease: 'easeOut' }}
                className="h-8 rounded-l-md bg-gradient-to-l from-rose-500 to-rose-400 relative flex items-center justify-end px-2.5 shadow-sm min-w-[2rem]"
              >
                <span className="text-xs font-bold text-white whitespace-nowrap">
                  {contribution.toFixed(1)}
                </span>
              </motion.div>
            </Tooltip>
          </div>
        )}
        
        {/* Center line with dot */}
        <div className="relative w-px h-10 bg-slate-200 flex-shrink-0">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-slate-300" />
        </div>

        {isPositive && (
          <div className="flex-1">
            <Tooltip content={`Increases priority by ${contribution.toFixed(1)} points`} position="top">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${barWidth}%` }}
                transition={{ duration: 0.8, delay: delay + 0.2, ease: 'easeOut' }}
                className="h-8 rounded-r-md bg-gradient-to-r from-emerald-400 to-teal-500 relative flex items-center px-2.5 shadow-sm min-w-[2rem]"
              >
                <span className="text-xs font-bold text-white whitespace-nowrap drop-shadow-sm">
                  +{contribution.toFixed(1)}
                </span>
              </motion.div>
            </Tooltip>
          </div>
        )}
        
        {!isPositive && <div className="flex-1" />}
        {isPositive && <div className="flex-1 hidden" />}
      </div>
      <div className="w-24 text-left flex-shrink-0">
        <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-md">{value}</span>
      </div>
    </motion.div>
  );
}
