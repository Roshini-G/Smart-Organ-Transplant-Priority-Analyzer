const Skeleton = ({ className = '', variant = 'text', width, height }) => {
  const baseStyle = 'animate-pulse bg-slate-200';
  
  const variants = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-xl',
  };

  const style = {
    width: width || (variant === 'text' ? '100%' : undefined),
    height: height,
  };

  return (
    <div
      className={`${baseStyle} ${variants[variant]} ${className}`}
      style={style}
    />
  );
};

export const CardSkeleton = () => (
  <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm w-full">
    <div className="flex items-center gap-4 mb-6">
      <Skeleton variant="circular" width={48} height={48} />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" width="40%" height={16} />
        <Skeleton variant="text" width="20%" height={12} />
      </div>
    </div>
    <div className="space-y-3">
      <Skeleton variant="text" width="100%" />
      <Skeleton variant="text" width="90%" />
      <Skeleton variant="text" width="80%" />
    </div>
  </div>
);

export const TableSkeleton = ({ rows = 5 }) => (
  <div className="w-full bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
    <div className="border-b border-slate-100 p-4 bg-slate-50/50 flex gap-4">
      <Skeleton variant="text" width="10%" height={12} />
      <Skeleton variant="text" width="30%" height={12} />
      <Skeleton variant="text" width="20%" height={12} />
      <Skeleton variant="text" width="40%" height={12} />
    </div>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="p-4 border-b border-slate-50 flex gap-4 items-center">
        <Skeleton variant="circular" width={32} height={32} className="flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width="40%" />
          <Skeleton variant="text" width="20%" height={10} />
        </div>
        <Skeleton variant="rectangular" width={80} height={24} />
      </div>
    ))}
  </div>
);

export default Skeleton;
