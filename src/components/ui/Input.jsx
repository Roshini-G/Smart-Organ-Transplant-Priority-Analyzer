import { forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';

const Input = forwardRef(({
  label,
  error,
  helperText,
  icon: Icon,
  className = '',
  id,
  fullWidth = true,
  ...props
}, ref) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  
  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-slate-700 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            input-field
            ${Icon ? 'pl-10' : ''}
            ${error ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20 bg-rose-50/30' : ''}
          `}
          {...props}
        />
        {error && (
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-rose-500">
            <AlertCircle className="w-4 h-4" />
          </div>
        )}
      </div>
      {(error || helperText) && (
        <p className={`mt-1.5 text-xs ${error ? 'text-rose-500 font-medium' : 'text-slate-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
