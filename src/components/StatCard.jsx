import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import AnimatedCounter from './ui/AnimatedCounter';

export default function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  subtitle, 
  color = 'blue', 
  delay = 0,
  trend = null, // { value: number, isPercent: boolean, ascendingIsGood: boolean }
}) {
  const colorMap = {
    blue: { bg: 'bg-primary-50', icon: 'text-primary-600', border: 'border-primary-100' },
    teal: { bg: 'bg-teal-50', icon: 'text-teal-600', border: 'border-teal-100' },
    rose: { bg: 'bg-rose-50', icon: 'text-rose-600', border: 'border-rose-100' },
    amber: { bg: 'bg-amber-50', icon: 'text-amber-600', border: 'border-amber-100' },
    indigo: { bg: 'bg-indigo-50', icon: 'text-indigo-600', border: 'border-indigo-100' },
    emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-600', border: 'border-emerald-100' },
    slate: { bg: 'bg-slate-50', icon: 'text-slate-600', border: 'border-slate-100' },
  };

  const c = colorMap[color] || colorMap.blue;

  // Render trend indicator
  const renderTrend = () => {
    if (!trend) return null;
    const isPositive = trend.value > 0;
    const isNeutral = trend.value === 0;
    const isGood = isPositive === trend.ascendingIsGood;
    
    let trendColor = 'text-slate-500';
    let TrendIcon = Minus;
    
    if (!isNeutral) {
      trendColor = isGood ? 'text-emerald-500' : 'text-rose-500';
      TrendIcon = isPositive ? TrendingUp : TrendingDown;
    }

    return (
      <div className={`flex items-center gap-1 text-xs font-medium ${trendColor}`}>
        <TrendIcon className="w-3.5 h-3.5" />
        <span>{Math.abs(trend.value)}{trend.isPercent ? '%' : ''}</span>
      </div>
    );
  };

  // Determine if value is a string with suffix/prefix (like '78%') for AnimatedCounter
  const extractNumeric = (val) => {
    if (typeof val === 'number') return { num: val, pre: '', suf: '' };
    if (typeof val !== 'string') return { num: 0, pre: '', suf: '' };
    
    const match = val.match(/^([^0-9.-]*)([0-9.-]+)([^0-9.-]*)$/);
    if (match) {
      return { num: parseFloat(match[2]), pre: match[1], suf: match[3] };
    }
    return { num: val, pre: '', suf: '' };
  };

  const { num, pre, suf } = extractNumeric(value);
  const useAnimatedCounter = typeof num === 'number' && !isNaN(num);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 border border-slate-100/80 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${c.bg} ${c.border} border flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
          <Icon className={`w-6 h-6 ${c.icon}`} />
        </div>
        {renderTrend()}
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-800">
          {useAnimatedCounter ? (
            <AnimatedCounter value={num} prefix={pre} suffix={suf} />
          ) : (
            value
          )}
        </p>
        <p className="text-sm font-medium text-slate-500 mt-1">{label}</p>
        {subtitle && (
          <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
        )}
      </div>
    </motion.div>
  );
}
