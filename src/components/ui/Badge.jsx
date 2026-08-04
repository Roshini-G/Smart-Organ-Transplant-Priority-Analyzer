const Badge = ({
  children,
  variant = 'medium',
  className = '',
  pulse = false,
}) => {
  // Can explicitly map variations similar to existing global classes but scoped
  const variants = {
    critical: 'bg-rose-100 text-rose-700 border border-rose-200',
    high: 'bg-amber-100 text-amber-700 border border-amber-200',
    medium: 'bg-primary-50 text-primary-700 border border-primary-200', // updated to primary blue
    low: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
    outline: 'bg-transparent text-slate-600 border border-slate-200',
    neutral: 'bg-slate-100 text-slate-700 border border-slate-200',
  };
  
  // Custom mapping for string based statuses from standard app data
  const normalizedVariant = (() => {
    const text = (children?.toString() || '').toLowerCase();
    if (text.includes('critical')) return 'critical';
    if (text.includes('high')) return 'high';
    if (text.includes('medium')) return 'medium';
    if (text.includes('low')) return 'low';
    if (text.includes('wait')) return 'neutral';
    if (text.includes('complet')) return 'low'; // mapped to green
    if (text.includes('archiv')) return 'outline';
    return variant;
  })();

  const mappedVariant = variants[normalizedVariant] || variants.medium;

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${mappedVariant} ${className}`}>
      {pulse && (
        <span className="relative flex h-2 w-2 mr-1.5">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
            normalizedVariant === 'critical' ? 'bg-rose-400' :
            normalizedVariant === 'high' ? 'bg-amber-400' :
            normalizedVariant === 'low' ? 'bg-emerald-400' : 'bg-primary-400'
          }`}></span>
          <span className={`relative inline-flex rounded-full h-2 w-2 ${
            normalizedVariant === 'critical' ? 'bg-rose-500' :
            normalizedVariant === 'high' ? 'bg-amber-500' :
            normalizedVariant === 'low' ? 'bg-emerald-500' : 'bg-primary-500'
          }`}></span>
        </span>
      )}
      {children}
    </span>
  );
};

export default Badge;
