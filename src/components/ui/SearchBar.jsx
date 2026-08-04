import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({ onSearch, placeholder = 'Search...', className = '' }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  // Keyboard shortcut listener (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (onSearch) onSearch(val);
  };

  const handleClear = () => {
    setQuery('');
    if (onSearch) onSearch('');
    inputRef.current?.focus();
  };

  return (
    <div 
      className={`
        relative flex items-center w-full max-w-md transition-all duration-200 rounded-xl
        ${isFocused ? 'bg-white shadow-sm ring-2 ring-primary-500/20 border border-primary-200' : 'bg-slate-100 border border-transparent'}
        ${className}
      `}
    >
      <div className="pl-3.5 pr-2 py-2.5 flex items-center pointer-events-none text-slate-400">
        <Search className={`w-4 h-4 transition-colors ${isFocused ? 'text-primary-500' : ''}`} />
      </div>
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="w-full bg-transparent border-none outline-none text-sm text-slate-700 placeholder:text-slate-400 py-2.5"
      />
      
      {!query && !isFocused && (
        <div className="pr-3.5 flex items-center pointer-events-none">
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-sans font-medium text-slate-400 bg-white border border-slate-200 rounded shadow-sm">
            <span className="text-xs mr-0.5">⌘</span>K
          </kbd>
        </div>
      )}

      {query && (
        <button
          onClick={handleClear}
          className="pr-3.5 pl-2 py-2 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
