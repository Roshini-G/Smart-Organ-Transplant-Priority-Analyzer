import { FileText, Download, Printer, BarChart3, Users, ShieldAlert, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import PageHeader from '../components/PageHeader';
import Card, { CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';

export default function Reports() {
  
  const handleDownload = (reportType) => {
    toast.loading(`Generating ${reportType}...`, { id: 'report' });
    setTimeout(() => {
      toast.success(`${reportType} downloaded successfully!`, { id: 'report' });
    }, 1500);
  };

  const reportTypes = [
    {
      id: 'waitlist',
      title: 'Global Waitlist Roster',
      desc: 'Complete export of all analyzed patients ordered by priority score. Includes clinical parameters and AI categorizations.',
      icon: Users,
      color: 'blue'
    },
    {
      id: 'critical',
      title: 'Critical Risk Alert Report',
      desc: 'Filtered list of only Critical priority patients requiring immediate assessment, with high mortality risk scores.',
      icon: ShieldAlert,
      color: 'rose'
    },
    {
      id: 'analytics',
      title: 'System Analytics Monthly',
      desc: 'Aggregated metrics on organ distribution, average wait times, and model prediction confidence distributions.',
      icon: BarChart3,
      color: 'emerald'
    }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title="Reports & Export"
        subtitle="Generate and download standardized PDF and CSV reports for hospital administration."
        icon={FileText}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Report Cards List */}
        <div className="md:col-span-1 space-y-4">
          <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-widest pl-1 mb-2">Available Reports</h3>
          
          {reportTypes.map(report => (
            <Card key={report.id} interactive onClick={() => handleDownload(report.title)}>
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-${report.color}-50 text-${report.color}-600 border border-${report.color}-100`}>
                  <report.icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 mb-1 leading-tight">{report.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed mb-3">{report.desc}</p>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-primary-600 group-hover:text-primary-700">
                    Generate &rarr;
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* PDF Preview Area Placeholder */}
        <div className="md:col-span-2">
           <Card className="h-full min-h-[500px] flex flex-col bg-slate-50 border-dashed border-2 border-slate-200">
             <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <div className="w-20 h-20 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mb-6">
                  <FileText className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-700 mb-2">Report Preview Ready</h3>
                <p className="text-sm text-slate-500 max-w-sm mb-8">
                  Select a report type from the left pane to generate a preview. You can then download, print, or email the document directly to the administration board.
                </p>

                <div className="flex flex-wrap justify-center gap-3 w-full max-w-sm">
                  <Button variant="outline" leftIcon={Printer} className="flex-1" disabled>Print</Button>
                  <Button variant="outline" leftIcon={Mail} className="flex-1" disabled>Email</Button>
                  <Button className="w-full" leftIcon={Download} onClick={() => handleDownload('Latest Report')}>
                    Download PDF
                  </Button>
                </div>
             </div>
           </Card>
        </div>

      </div>
    </div>
  );
}
