import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  className = '',
  disabled,
  fullWidth,
  ...props
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-primary-500 disabled:opacity-60 disabled:pointer-events-none disabled:active:scale-100';
  
  const variants = {
    primary: 'gradient-primary text-white shadow-md hover:shadow-lg hover:opacity-90',
    secondary: 'bg-primary-50 text-primary-700 border border-primary-200 hover:bg-primary-100',
    danger: 'bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100',
    ghost: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
    outline: 'bg-transparent border-2 border-primary-200 text-primary-600 hover:bg-primary-50',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5',
    icon: 'p-2.5',
  };
  
  return (
    <motion.button
      ref={ref}
      disabled={isLoading || disabled}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin -ml-1" />}
      {!isLoading && LeftIcon && <LeftIcon className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />}
      {children}
      {!isLoading && RightIcon && <RightIcon className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />}
    </motion.button>
  );
});

Button.displayName = 'Button';
export default Button;
