import { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, UserPlus, Database, Scale, Brain, ShieldCheck,
  Award, ListOrdered, FileText, Info, Workflow, Menu, X, Heart,
  ChevronRight, Bell, User, Search, Settings, Shield, ClipboardList
} from 'lucide-react';
import SearchBar from '../components/ui/SearchBar';

// Grouped navigation for enterprise feel
const navGroups = [
  {
    title: 'Overview',
    items: [
      { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    ]
  },
  {
    title: 'Patient Management',
    items: [
      { path: '/input', label: 'Patient Registration', icon: UserPlus },
      { path: '/records', label: 'Patient Records', icon: ClipboardList },
      { path: '/ranked', label: 'Priority Rankings', icon: ListOrdered },
    ]
  },
  {
    title: 'AI Analysis Pipeline',
    items: [
      { path: '/preprocessing', label: 'Data Preprocessing', icon: Database },
      { path: '/sahp', label: 'SAHP Analysis', icon: Scale },
      { path: '/prediction', label: 'ML Prediction', icon: Brain },
      { path: '/shap', label: 'Explainability', icon: ShieldCheck },
      { path: '/decision', label: 'Final Decision', icon: Award },
    ]
  },
  {
    title: 'System & Reports',
    items: [
      { path: '/reports', label: 'Reports & Export', icon: FileText },
      { path: '/workflow', label: 'System Workflow', icon: Workflow },
      { path: '/about', label: 'About Platform', icon: Info },
    ]
  }
];

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false); // mobile search
  const location = useLocation();
  const navigate = useNavigate();

  // Close mobile sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);

  return (
    <div className="flex h-screen overflow-hidden bg-surface-50 font-sans">
      
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50 bg-white border-r border-slate-200 
          transform transition-all duration-300 ease-in-out flex flex-col shadow-sm
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${sidebarCollapsed ? 'lg:w-[80px]' : 'lg:w-[280px] w-72'}
        `}
      >
        {/* Logo Area */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 h-[72px]">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0 shadow-glow-blue">
              <Heart className="w-5 h-5 text-white" />
            </div>
            {!sidebarCollapsed && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }}
                className="flex-1 min-w-0"
              >
                <h1 className="text-sm font-bold text-slate-800 leading-tight truncate">SOTP Analyzer</h1>
                <p className="text-[10px] text-slate-400 font-semibold tracking-wide uppercase">Enterprise Edition</p>
              </motion.div>
            )}
          </div>
          
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Desktop Collapse Toggle */}
        <button 
          onClick={toggleSidebar}
          className="hidden lg:flex absolute -right-3.5 top-20 bg-white border border-slate-200 text-slate-400 p-1.5 rounded-full shadow-sm hover:text-primary-600 hover:border-primary-200 transition-all z-10"
        >
          <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${sidebarCollapsed ? '' : 'rotate-180'}`} />
        </button>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto custom-scrollbar px-3 py-6 space-y-8">
          {navGroups.map((group, groupIndex) => (
            <div key={group.title} className="space-y-1">
              {!sidebarCollapsed && (
                <h3 className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  {group.title}
                </h3>
              )}
              {sidebarCollapsed && (
                <div className="w-8 h-px bg-slate-100 mx-auto mb-4 mt-2" />
              )}
              
              {group.items.map(item => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/'}
                    className={({ isActive }) => `
                      group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                      ${isActive 
                        ? 'bg-primary-50 text-primary-700 font-semibold' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                      ${sidebarCollapsed ? 'justify-center' : ''}
                    `}
                    title={sidebarCollapsed ? item.label : undefined}
                  >
                    {({ isActive }) => (
                      <>
                        <Icon className={`
                          w-5 h-5 flex-shrink-0 transition-colors
                          ${isActive ? 'text-primary-600' : 'text-slate-400 group-hover:text-primary-500'}
                        `} />
                        {!sidebarCollapsed && (
                          <>
                            <span className="flex-1 truncate">{item.label}</span>
                            {isActive && (
                              <motion.div 
                                layoutId={`nav-indicator-${groupIndex}`}
                                className="w-1.5 h-1.5 rounded-full bg-primary-500 shadow-glow-blue" 
                              />
                            )}
                          </>
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer User Profile Summary */}
        <div className="border-t border-slate-100 p-4">
          <div className={`
            flex items-center gap-3 p-2 rounded-xl transition-colors
            ${sidebarCollapsed ? 'justify-center' : 'hover:bg-slate-50 cursor-pointer'}
          `}>
            <div className="w-9 h-9 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center flex-shrink-0 text-indigo-700 font-bold">
              Dr
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">Dr. Sarah Jenkins</p>
                <p className="text-xs text-slate-500 truncate">Head of Transplant</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        
        {/* Top Header - Desktop & Mobile */}
        <header className="h-[72px] bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 shadow-sm z-30 flex-shrink-0">
          
          {/* Mobile Left: Hamburger + Logo */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-2 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* Desktop Left: Global Search */}
          <div className="hidden lg:block w-96">
            <SearchBar placeholder="Search patients by ID or name..." />
          </div>

          {/* Desktop/Mobile Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Mobile Search Toggle */}
            <button className="lg:hidden p-2 rounded-lg hover:bg-slate-50 text-slate-500">
              <Search className="w-5 h-5" />
            </button>

            {/* Quick Actions (Desktop only) */}
            <div className="hidden md:flex items-center gap-1 border-r border-slate-200 pr-4 mr-1">
              <button className="p-2 rounded-lg hover:bg-slate-50 text-slate-500 tooltip-trigger relative group">
                <Shield className="w-5 h-5" />
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">Compliance</span>
              </button>
              <button className="p-2 rounded-lg hover:bg-slate-50 text-slate-500 tooltip-trigger relative group">
                <Settings className="w-5 h-5" />
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">Settings</span>
              </button>
            </div>

            {/* Notifications */}
            <button className="relative p-2 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 border border-white" />
            </button>

            {/* User Avatar (Mobile visible too) */}
            <div className="w-9 h-9 rounded-full bg-indigo-100 border border-indigo-200 flex sm:hidden items-center justify-center text-indigo-700 font-bold ml-1">
              Dr
            </div>
            
            <button className="hidden sm:flex items-center gap-2 pl-2 cursor-pointer">
               <div className="w-9 h-9 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold">
                Dr
              </div>
              <ChevronDownIcon className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </header>

        {/* Main Page Scrollable Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-surface-50 custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="p-4 md:p-6 lg:p-8 min-h-full flex flex-col"
            >
              <Outlet />
              
              {/* Main Area Footer */}
              <footer className="mt-auto pt-10 pb-2 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
                <p>&copy; {new Date().getFullYear()} SOTP Analytics Platform. All rights reserved.</p>
                <div className="flex items-center gap-4 mt-2 sm:mt-0">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-glow-success border border-white" />
                    System Healthy
                  </span>
                  <span>Version 2.0.0</span>
                </div>
              </footer>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

// Inline chevron down icon for user dropdown
function ChevronDownIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m6 9 6 6 6-6"/>
    </svg>
  );
}
