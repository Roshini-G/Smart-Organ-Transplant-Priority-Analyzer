import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import AnimatedCounter from './ui/AnimatedCounter';

export default function ScoreGauge({ 
  score, 
  size = 160, 
  strokeWidth = 12, 
  color, 
  label, 
  animate = true,
  gradient = false
}) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (animatedScore / 100) * circumference;

  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => setAnimatedScore(score), 200);
      return () => clearTimeout(timer);
    } else {
      setAnimatedScore(score);
    }
  }, [score, animate]);

  // Use new health-care palette for gauge colors
  // Default to standard priority colors if no color is provided
  const getGaugeColor = () => {
    if (color) return color;
    if (score >= 75) return '#ef4444'; // rose-500
    if (score >= 55) return '#f59e0b'; // amber-500
    if (score >= 35) return '#3b82f6'; // primary-500
    return '#10b981'; // emerald-500
  };

  const gaugeColor = getGaugeColor();
  const gradientId = `gauge-gradient-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {gradient && (
            <defs>
              <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={gaugeColor} />
                <stop offset="100%" stopColor={`${gaugeColor}80`} />
              </linearGradient>
            </defs>
          )}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#f1f5f9" // slate-100
            strokeWidth={strokeWidth}
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={gradient ? `url(#${gradientId})` : gaugeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-slate-800">
            <AnimatedCounter value={score} />
          </span>
          <span className="text-xs text-slate-400 font-medium">/ 100</span>
        </div>
      </div>
      {label && <p className="text-sm font-semibold text-slate-600 mt-3">{label}</p>}
    </div>
  );
}
