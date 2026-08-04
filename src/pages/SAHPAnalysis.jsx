import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scale, ArrowRight, TrendingUp } from 'lucide-react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell
} from 'recharts';
import PageHeader from '../components/PageHeader';
import Button from '../components/ui/Button';
import Card, { CardHeader } from '../components/ui/Card';
import Badge from '../components/ui/Badge';

// Fixed weights based on existing logic
const WEIGHTS = {
  medicalUrgency: 0.35,
  survivalProbability: 0.25,
  waitingTime: 0.20,
  compatibilityScore: 0.15,
  pediatricStatus: 0.05
};

export default function SAHPAnalysis() {
  const [patient, setPatient] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const pData = sessionStorage.getItem('currentPatient');
    if (pData) setPatient(JSON.parse(pData));
  }, []);

  if (!patient) return null;

  const radarData = [
    { subject: 'Urgency', A: patient.medicalUrgency * 10, fullMark: 100 },
    { subject: 'Survival', A: patient.survivalProbability, fullMark: 100 },
    { subject: 'Waiting', A: Math.min((patient.waitingTime / 120) * 100, 100), fullMark: 100 },
    { subject: 'Match', A: patient.compatibilityScore, fullMark: 100 },
    { subject: 'Age Fact.', A: patient.age < 18 ? 100 : Math.max(100 - (patient.age / 100 * 100), 0), fullMark: 100 },
  ];

  const weightData = [
    { name: 'Urgency', weight: WEIGHTS.medicalUrgency * 100 },
    { name: 'Survival', weight: WEIGHTS.survivalProbability * 100 },
    { name: 'Waiting Time', weight: WEIGHTS.waitingTime * 100 },
    { name: 'Compatibility', weight: WEIGHTS.compatibilityScore * 100 },
    { name: 'Pediatric (Age)', weight: WEIGHTS.pediatricStatus * 100 },
  ];

  const customTooltipStyle = {
    background: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)',
    fontSize: '12px',
    padding: '8px 12px',
    fontWeight: '500'
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="SAHP Baseline Evaluation"
        subtitle="Analytic Hierarchy Process multi-criteria decision modeling"
        icon={Scale}
        action={
          <Button onClick={() => navigate('/prediction')} rightIcon={ArrowRight} className="gradient-primary">
            Proceed to ML Prediction
          </Button>
        }
      />

      {/* Top Cards: Final Score & Method details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-1 gradient-card border-primary-100 flex flex-col justify-center items-center text-center p-8">
           <p className="text-sm font-semibold text-primary-600 uppercase tracking-widest mb-2">SAHP Baseline Score</p>
           <div className="flex items-end gap-2 text-primary-800">
              <span className="text-6xl font-bold font-display tracking-tight">{patient.sahpScore.toFixed(1)}</span>
              <span className="text-lg font-medium text-primary-500 mb-2">/ 100</span>
           </div>
           <div className="mt-4 pt-4 border-t border-primary-200/60 w-full text-center">
             <Badge variant="medium" className="bg-white">Analytic Hierarchy Process</Badge>
           </div>
        </Card>

        {/* Dynamic Weight Vector representation */}
        <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-5 gap-3">
          {weightData.map((w, i) => (
            <div key={i} className="glass-panel p-4 flex flex-col justify-between items-center text-center group hover:bg-white transition-colors duration-300">
              <span className="text-xs font-semibold text-slate-500 mb-3 block">{w.name}</span>
              <div className="relative w-16 h-16 rounded-full border-[3px] border-slate-100 flex items-center justify-center group-hover:border-primary-100 group-hover:shadow-glow-blue transition-all">
                <span className="font-bold text-slate-800">{w.weight}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Radar Chart */}
        <Card>
          <CardHeader title="Normalized Criteria Metrics" icon={Radar} />
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#cbd5e1', fontSize: 10 }} />
                <Radar name="Patient Vector" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                <Tooltip contentStyle={customTooltipStyle} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Weights Bar Chart */}
        <Card>
           <CardHeader title="Criterion Eigenvector Weights" icon={TrendingUp} />
           <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={weightData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" domain={[0, 40]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 11, fill: '#64748b', fontWeight: 500 }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={customTooltipStyle} />
                <Bar dataKey="weight" radius={[0, 6, 6, 0]} maxBarSize={30}>
                  {weightData.map((entry, index) => (
                    <Cell key={index} fill={entry.weight > 25 ? '#3b82f6' : entry.weight > 10 ? '#60a5fa' : '#93c5fd'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

      </div>
    </div>
  );
}
