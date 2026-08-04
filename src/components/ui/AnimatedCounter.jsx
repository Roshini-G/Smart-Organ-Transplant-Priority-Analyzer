import { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

const AnimatedCounter = ({ value, prefix = '', suffix = '', duration = 1.5, className = '' }) => {
  const [hasStarted, setHasStarted] = useState(false);
  const numericValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]+/g, '')) : value;
  
  // Spring configuration for smooth animation
  const springValue = useSpring(0, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    // Small delay before starting to ensure component is mounted and visible
    const timer = setTimeout(() => {
      setHasStarted(true);
      springValue.set(numericValue);
    }, 100);
    return () => clearTimeout(timer);
  }, [numericValue, springValue]);

  // Determine decimal places automatically
  const getDecimals = (val) => {
    if (Math.floor(val) === val) return 0;
    return val.toString().split('.')[1]?.length || 0;
  };
  
  const decimals = getDecimals(numericValue);
  
  // Format the spring value
  const displayValue = useTransform(springValue, (current) => {
    if (!hasStarted) return `0`;
    return current.toFixed(Math.min(decimals, 1)); // Max 1 decimal for ui cleanliness
  });

  // Handle case where value is not a number
  if (isNaN(numericValue)) return <span className={className}>{value}</span>;

  return (
    <span className={`inline-flex items-center ${className}`}>
      {prefix && <span>{prefix}</span>}
      <motion.span>{displayValue}</motion.span>
      {suffix && <span className="ml-[1px]">{suffix}</span>}
    </span>
  );
};

export default AnimatedCounter;
