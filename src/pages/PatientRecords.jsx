import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ClipboardList, Plus, Download, Eye, Play, Trash2, ShieldAlert } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Table from '../components/ui/Table';
import Modal from '../components/ui/Modal';
import { getAllPatients, deletePatient } from '../utils/patientStore';

export default function PatientRecords() {
  const [patients, setPatients] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [patientToDelete, setPatientToDelete] = useState(null);
  const navigate = useNavigate();

  const loadPatients = () => {
    setPatients(getAllPatients().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const handleAction = (patient, action) => {
    sessionStorage.setItem('currentPatient', JSON.stringify(patient));
    switch (action) {
      case 'view':
        navigate('/decision');
        break;
      case 'analyze':
        navigate('/preprocessing');
        break;
      default:
        break;
    }
  };

  const confirmDelete = (patient) => {
    setPatientToDelete(patient);
  };

  const handleDelete = () => {
    if (patientToDelete) {
      deletePatient(patientToDelete.id);
      toast.success(`${patientToDelete.name} removed from registry`);
      setPatientToDelete(null);
      loadPatients();
    }
  };

  const handleExport = () => {
    const csvContent = [
      ['ID', 'Name', 'Age', 'Organ Needed', 'Priority Category', 'Status', 'Registration Date'].join(','),
      ...patients.map(p => 
        [p.id, p.name, p.age, p.organNeeded, p.priorityCategory || 'Pending', p.status, p.createdAt].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `patient_registry_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    toast.success('Patient registry exported successfully');
  };

  const filteredPatients = activeTab === 'All' 
    ? patients 
    : activeTab === 'Pending' 
      ? patients.filter(p => p.status === 'Waiting')
      : patients.filter(p => (p.priorityCategory || '') === activeTab);

  const tabs = ['All', 'Critical Priority', 'High Priority', 'Medium Priority', 'Low Priority', 'Pending'];

  const columns = [
    {
      key: 'id',
      label: 'Patient Details',
      sortable: true,
      render: (val, row) => (
        <div>
          <p className="font-semibold text-slate-800">{row.name}</p>
          <p className="text-xs text-slate-500">{val} • {row.age} yrs • {row.gender}</p>
        </div>
      )
    },
    {
      key: 'organNeeded',
      label: 'Organ Required',
      sortable: true,
      render: (val) => <span className="font-medium text-slate-700">{val}</span>
    },
    {
      key: 'priorityCategory',
      label: 'Priority Class',
      sortable: true,
      render: (val, row) => (
        <Badge variant={val ? val.replace(' Priority', '').toLowerCase() : 'neutral'}>
          {val || 'Not Computed'}
        </Badge>
      )
    },
    {
      key: 'priorityScore',
      label: 'AI Match Score',
      sortable: true,
      align: 'center',
      render: (val) => val ? (
        <span className="font-bold text-slate-700">{val.toFixed(1)}</span>
      ) : (
        <span className="text-slate-400 italic">--</span>
      )
    },
    {
      key: 'status',
      label: 'System Status',
      sortable: true,
      render: (val) => <Badge variant="outline">{val}</Badge>
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      render: (_, row) => (
        <div className="flex items-center justify-end gap-2" onClick={e => e.stopPropagation()}>
          {row.analyzed ? (
            <button 
              onClick={() => handleAction(row, 'view')}
              className="p-1.5 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              title="View Results"
            >
              <Eye className="w-4 h-4" />
            </button>
          ) : (
             <button 
              onClick={() => handleAction(row, 'analyze')}
              className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
              title="Run Analysis"
            >
              <Play className="w-4 h-4" />
            </button>
          )}
          <button 
            onClick={() => confirmDelete(row)}
            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
            title="Remove Record"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Patient Records Registry"
        subtitle="Manage and analyze the centralized database of all registered candidates."
        icon={ClipboardList}
        action={
          <div className="flex gap-3">
            <Button variant="outline" leftIcon={Download} onClick={handleExport}>
              Export Data
            </Button>
            <Button leftIcon={Plus} onClick={() => navigate('/input')} className="gradient-primary">
              Register New
            </Button>
          </div>
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

      {/* Main Table */}
      <Table 
        columns={columns}
        data={filteredPatients}
        keyField="id"
        searchable
        searchFields={['name', 'id', 'organNeeded']}
        itemsPerPage={10}
        emptyStateTitle="No records found"
        emptyStateDesc="Start by adding a new patient to the registry."
        emptyStateIcon={ClipboardList}
        emptyStateAction={
          <Button leftIcon={Plus} onClick={() => navigate('/input')}>Register Patient</Button>
        }
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!patientToDelete}
        onClose={() => setPatientToDelete(null)}
        title="Confirm Deletion"
        maxWidth="max-w-md"
      >
        <div className="text-center py-4">
          <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-4 text-rose-500">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h4 className="text-lg font-bold text-slate-800 mb-2">Are you fully sure?</h4>
          <p className="text-sm text-slate-500 mb-6">
            You are about to remove <span className="font-semibold text-slate-700">{patientToDelete?.name} ({patientToDelete?.id})</span> from the registry. This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="ghost" onClick={() => setPatientToDelete(null)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete}>Yes, Remove Patient</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
