import { useState, useEffect, useMemo } from 'react';
import { ListOrdered, Download, ArrowUpRight } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Table from '../components/ui/Table';
import { getAllPatients } from '../utils/patientStore';

export default function RankedPatients() {
  const [patients, setPatients] = useState([]);
  const [activeTab, setActiveTab] = useState('All');

  useEffect(() => {
    const all = getAllPatients()
      .filter(p => p.analyzed) // Only show patients that have been through the ML pipeline
      .sort((a, b) => b.priorityScore - a.priorityScore); // Primary sort by descending score
    
    setPatients(all);
  }, []);

  const filteredPatients = useMemo(() => {
    if (activeTab === 'All') return patients;
    return patients.filter(p => p.priorityCategory === activeTab);
  }, [patients, activeTab]);

  const tabs = ['All', 'Critical', 'High', 'Medium', 'Low'];

  // Medal icons for top 3
  const getRankBadge = (index, pageIndex = 0) => {
    const globalRank = index + (pageIndex * 10) + 1; // Assuming 10 items per page
    if (globalRank === 1) return <span className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 border border-yellow-300 text-yellow-700 font-bold shadow-sm">1</span>;
    if (globalRank === 2) return <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 border border-slate-300 text-slate-600 font-bold shadow-sm">2</span>;
    if (globalRank === 3) return <span className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 border border-orange-300 text-orange-800 font-bold shadow-sm">3</span>;
    return <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-50 text-slate-500 font-semibold">{globalRank}</span>;
  };

  const columns = [
    {
      key: 'rank',
      label: 'Rank',
      width: '80px',
      align: 'center',
      render: (_, __, i) => getRankBadge(i) // i is current index in table view
    },
    {
      key: 'id',
      label: 'Patient Information',
      render: (val, row) => (
        <div>
          <p className="font-semibold text-slate-800">{row.name}</p>
          <p className="text-xs text-slate-500">{val} • {row.organNeeded}</p>
        </div>
      )
    },
    {
      key: 'priorityScore',
      label: 'AI Score',
      sortable: true,
      align: 'center',
      render: (val) => (
        <span className={`font-bold text-lg ${val >= 80 ? 'text-rose-600' : val >= 60 ? 'text-amber-600' : 'text-primary-600'}`}>
          {val.toFixed(1)}
        </span>
      )
    },
    {
      key: 'priorityCategory',
      label: 'Category',
      sortable: true,
      render: (val) => <Badge variant={val.toLowerCase()}>{val}</Badge>
    },
    {
      key: 'medicalUrgency',
      label: 'Urgency',
      sortable: true,
      align: 'center',
      render: (val) => <span className="font-medium text-slate-600">{val}/10</span>
    },
    {
      key: 'waitingTime',
      label: 'Wait Time',
      sortable: true,
      align: 'right',
      render: (val) => <span className="text-slate-600">{val} mo</span>
    },
    {
      key: 'actions',
      label: '',
      align: 'right',
      render: (_, row) => (
        <button 
          className="text-primary-600 hover:text-primary-700 flex items-center gap-1 text-sm font-semibold transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            sessionStorage.setItem('currentPatient', JSON.stringify(row));
            // Navigate to decision if needed, or open modal
          }}
        >
          Review <ArrowUpRight className="w-4 h-4" />
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Global Priority Rankings"
        subtitle="Sorted registry of all analyzed patients based on the final ensemble AI score."
        icon={ListOrdered}
        action={
          <Button variant="outline" leftIcon={Download}>
            Export Waitlist
          </Button>
        }
      />

       {/* Filter Tabs */}
       <div className="flex flex-wrap gap-2 mb-2">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === tab 
                ? 'bg-primary-50 text-primary-700 border border-primary-200 shadow-sm' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab}
            {tab === 'All' && <span className="ml-2 text-xs opacity-60">({patients.length})</span>}
          </button>
        ))}
      </div>

      <Table 
        columns={columns}
        data={filteredPatients}
        keyField="id"
        itemsPerPage={15}
        emptyStateTitle="No analyzed patients"
        emptyStateDesc="Run priority analysis on patients to see them on the global waitlist."
        emptyStateIcon={ListOrdered}
      />
    </div>
  );
}
