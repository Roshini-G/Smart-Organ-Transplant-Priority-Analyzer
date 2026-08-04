import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users, AlertTriangle, Activity, HeartPulse,
  Stethoscope, Clock, ShieldCheck, ArrowRight, Eye, TrendingUp, Calendar, Beaker
} from 'lucide-react';
import {
  PieChart, Pie, Cell, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend
} from 'recharts';
import StatCard from '../components/StatCard';
import Button from '../components/ui/Button';
import Card, { CardHeader } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { getAllPatients, getPatientStats, initializeSampleData } from '../utils/patientStore';
import { samplePatients } from '../utils/sampleData';

const ORGAN_COLORS = { 
  Kidney: '#3b82f6', // blue
  Liver: '#8b5cf6', // purple
  Heart: '#ef4444', // rose
  Lung: '#10b981'  // emerald
};

// Premium palette for charting
const PRIORITY_COLORS = { 
  critical: '#ef4444', 
  high: '#f59e0b', 
  medium: '#3b82f6', 
  low: '#10b981' 
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [patients, setPatients] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    initializeSampleData(samplePatients);
    setStats(getPatientStats());
    setPatients(getAllPatients().filter(p => p.status !== 'Archived'));
  }, []);

  if (!stats) return null;

  const organData = Object.entries(stats.organDistribution).map(([name, value]) => ({ name, value }));
  const priorityData = [
    { name: 'Critical', value: stats.critical, color: PRIORITY_COLORS.critical },
    { name: 'High', value: stats.high, color: PRIORITY_COLORS.high },
    { name: 'Medium', value: stats.medium, color: PRIORITY_COLORS.medium },
    { name: 'Low', value: stats.low, color: PRIORITY_COLORS.low },
  ];

  const trendData = patients.slice(0, 8).map((p) => ({
    name: p.id,
    priority: p.priorityScore || 0,
    risk: p.riskScore || 0,
    sahp: p.sahpScore || 0,
  }));

  const urgencyDistribution = [
    { range: 'Low (1-3)', count: patients.filter(p => p.medicalUrgency <= 3).length },
    { range: 'Mid (4-6)', count: patients.filter(p => p.medicalUrgency > 3 && p.medicalUrgency <= 6).length },
    { range: 'High (7-8)', count: patients.filter(p => p.medicalUrgency > 6 && p.medicalUrgency <= 8).length },
    { range: 'Crit (9-10)', count: patients.filter(p => p.medicalUrgency > 8).length },
  ];

  const recentPatients = [...patients].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  const customTooltipStyle = {
    background: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
    fontSize: '12px',
    padding: '8px 12px',
    fontWeight: '500'
  };

  return (
    <div className="space-y-8 pb-4">
      
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="gradient-hero rounded-3xl p-8 md:p-10 text-white relative overflow-hidden shadow-elevated"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl mix-blend-overlay" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-500 rounded-full translate-y-1/3 -translate-x-1/4 blur-3xl mix-blend-overlay" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20">
                <HeartPulse className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold tracking-widest bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm uppercase">
                Enterprise AI Healthcare
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-display font-bold mb-4 tracking-tight leading-tight">
              SOTP Analytics <br/><span className="text-blue-100 font-medium">Command Center</span>
            </h1>
            <p className="text-white/80 text-sm md:text-base leading-relaxed mb-8 max-w-xl">
              Intelligent decision support leveraging SAHP and Machine Learning for transparent, fair, and data-driven organ transplant prioritization.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button onClick={() => navigate('/input')} className="bg-white text-primary-700 hover:bg-slate-50 border-0 shadow-lg group">
                Register Patient <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button onClick={() => navigate('/ranked')} variant="outline" className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm">
                View Global Rankings
              </Button>
            </div>
          </div>
          
          {/* Hero Quick Insights */}
          <div className="hidden lg:grid grid-cols-2 gap-4 w-full max-w-md flex-shrink-0">
             <div className="glass-panel p-5 text-white">
                <p className="text-white/60 text-xs font-semibold uppercase mb-1">Queue Health</p>
                <div className="flex items-end gap-2 text-2xl font-bold">
                  92<span className="text-sm font-medium text-white/60 mb-1">%</span>
                </div>
             </div>
             <div className="glass-panel p-5 text-white">
                <p className="text-white/60 text-xs font-semibold uppercase mb-1">Active Cases</p>
                <div className="text-2xl font-bold">{stats.total}</div>
             </div>
             <div className="glass-panel p-5 text-white relative overflow-hidden">
                <div className="absolute -right-2 -bottom-2 w-16 h-16 bg-rose-500 rounded-full opacity-20 blur-xl" />
                <p className="text-white/60 text-xs font-semibold uppercase mb-1">Critical Priority</p>
                <div className="text-2xl font-bold text-rose-200">{stats.critical}</div>
             </div>
             <div className="glass-panel p-5 text-white relative overflow-hidden">
                <div className="absolute -right-2 -bottom-2 w-16 h-16 bg-emerald-500 rounded-full opacity-20 blur-xl" />
                <p className="text-white/60 text-xs font-semibold uppercase mb-1">Avg Comp. Score</p>
                <div className="flex items-end gap-2 text-2xl font-bold text-emerald-200">
                  {stats.avgCompatibility}<span className="text-sm font-medium text-emerald-200/60 mb-1">%</span>
                </div>
             </div>
          </div>
        </div>
      </motion.div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard icon={Users} label="Total Registered Patients" value={stats.total} color="blue" delay={0.1} trend={{ value: 12, isPercent: true, ascendingIsGood: true }} />
        <StatCard icon={AlertTriangle} label="Critical Urgency Patients" value={stats.critical} color="rose" delay={0.15} subtitle="Requires immediate attention" trend={{ value: 2, isPercent: false, ascendingIsGood: false }} />
        <StatCard icon={TrendingUp} label="Global Avg Priority Score" value={stats.avgPriority} color="amber" delay={0.2} trend={{ value: 4.5, isPercent: true, ascendingIsGood: false }} />
        <StatCard icon={Activity} label="System Avg Compatibility" value={`${stats.avgCompatibility}%`} color="emerald" delay={0.25} trend={{ value: 1.2, isPercent: true, ascendingIsGood: true }} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column - 2/3 width */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Main Chart ROW 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card delay={0.3}>
              <CardHeader title="Organ Type Distribution" icon={Stethoscope} />
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={organData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={95}
                      paddingAngle={6}
                      dataKey="value"
                      stroke="none"
                      cornerRadius={4}
                    >
                      {organData.map((entry, index) => (
                        <Cell key={index} fill={ORGAN_COLORS[entry.name] || '#94a3b8'} />
                      ))}
                    </Pie>
                    <RechartsTooltip contentStyle={customTooltipStyle} cursor={{fill: 'transparent'}} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card delay={0.35}>
              <CardHeader title="Priority Allocation Category" icon={ShieldCheck} />
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={priorityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                    <RechartsTooltip contentStyle={customTooltipStyle} cursor={{ fill: '#f8fafc' }} />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={50}>
                      {priorityData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Main Chart ROW 2 */}
          <Card delay={0.4}>
            <CardHeader title="Patient Evaluation Score Matrix" icon={TrendingUp} />
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 10, right: 20, left: -20, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                  <RechartsTooltip contentStyle={customTooltipStyle} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                  <Line type="monotone" dataKey="priority" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6 }} name="Priority Score" />
                  <Line type="monotone" dataKey="risk" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} name="Risk Score" />
                  <Line type="monotone" dataKey="sahp" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} name="SAHP Baseline" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-6">
          
          {/* Recent Patients */}
          <Card delay={0.45}>
            <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-4">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary-500" /> Recent Patients
              </h3>
              <button 
                onClick={() => navigate('/records')}
                className="text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors"
              >
                View All
              </button>
            </div>
            
            <div className="space-y-4">
              {recentPatients.map((p, i) => (
                <div key={p.id} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs flex-shrink-0 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                      {p.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-700 truncate">{p.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{p.id} • {p.organNeeded}</p>
                    </div>
                  </div>
                  <Badge variant={p.status}>{p.status === 'Waiting' ? 'Wait' : p.status.replace(' Priority', '')}</Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* Activity Timeline */}
          <Card delay={0.5}>
            <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-4">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary-500" /> Recent Activity
              </h3>
            </div>
            
            <div className="space-y-5">
              {[
                { time: '10 min ago', title: 'New Analysis Run', desc: 'Patient PT-008 analyzed by Dr. Jenkins', icon: Beaker, color: 'text-primary-500', bg: 'bg-primary-50' },
                { time: '2 hours ago', title: 'System Report Generated', desc: 'Weekly queue metrics exported', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
                { time: 'Yesterday', title: 'Status Update', desc: 'PT-004 marked as Completed', icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-50' },
              ].map((act, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${act.bg}`}>
                    <act.icon className={`w-4 h-4 ${act.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700">{act.title}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{act.desc}</p>
                    <span className="text-[10px] text-slate-400 block mt-1">{act.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
