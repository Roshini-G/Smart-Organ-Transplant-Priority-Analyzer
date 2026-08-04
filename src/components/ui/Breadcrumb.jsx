import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

// Common route mappings for readable names
const routeMap = {
  'input': 'Patient Input',
  'records': 'Patient Records',
  'preprocessing': 'Data Preprocessing',
  'sahp': 'SAHP Analysis',
  'prediction': 'ML Prediction',
  'shap': 'SHAP Explainability',
  'decision': 'Final Decision',
  'ranked': 'Ranked Patients',
  'reports': 'Reports',
  'workflow': 'Workflow',
  'about': 'About',
};

const Breadcrumb = ({ className = '' }) => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (pathnames.length === 0) return null; // Don't show on dashboard

  return (
    <nav className={`flex items-center text-sm text-slate-500 font-medium ${className}`}>
      <Link
        to="/"
        className="flex items-center hover:text-primary-600 transition-colors"
        title="Dashboard"
      >
        <Home className="w-4 h-4" />
      </Link>
      
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const displayName = routeMap[name.toLowerCase()] || name.charAt(0).toUpperCase() + name.slice(1);

        return (
          <div key={name} className="flex items-center">
            <ChevronRight className="w-4 h-4 mx-1.5 text-slate-300" />
            {isLast ? (
              <span className="text-slate-800 font-semibold">{displayName}</span>
            ) : (
              <Link
                to={routeTo}
                className="hover:text-primary-600 transition-colors"
              >
                {displayName}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
