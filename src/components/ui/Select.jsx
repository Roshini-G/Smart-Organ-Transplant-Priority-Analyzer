import { forwardRef } from 'react';
import { AlertCircle, ChevronDown } from 'lucide-react';

const Select = forwardRef(({
  label,
  error,
  helperText,
  icon: Icon,
  options = [],
  className = '',
  id,
  fullWidth = true,
  placeholder = 'Select an option',
  ...props
}, ref) => {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');
  
  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-slate-700 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 z-10">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <select
          ref={ref}
          id={selectId}
          className={`
            input-field appearance-none
            ${Icon ? 'pl-10' : ''}
            ${error ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20 bg-rose-50/30' : ''}
          `}
          {...props}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value || opt} value={opt.value || opt}>
              {opt.label || opt}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
          {error ? <AlertCircle className="w-4 h-4 text-rose-500" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </div>
      {(error || helperText) && (
        <p className={`mt-1.5 text-xs ${error ? 'text-rose-500 font-medium' : 'text-slate-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';
export default Select;
