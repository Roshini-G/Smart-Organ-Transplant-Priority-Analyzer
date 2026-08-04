import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Database, ArrowRight } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import PipelineStep from '../components/PipelineStep';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const pipelineSteps = [
  { id: 'import', label: 'Data Ingestion', description: 'Retrieving secure EHR records and normalizing vital signs.' },
  { id: 'clean', label: 'Data Cleaning', description: 'Handling missing variables, resolving anomalies using statistical imputation.' },
  { id: 'transform', label: 'Feature Engineering', description: 'Encoding categorical data, generating age-bracket metrics, scaling numeric tensors.' },
  { id: 'validate', label: 'Schema Validation', description: 'Ensuring structural integrity for ML tensor payload injection.' }
];

export default function DataPreprocessing() {
  const [activeStep, setActiveStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [patient, setPatient] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const pData = sessionStorage.getItem('currentPatient');
    if (pData) setPatient(JSON.parse(pData));

    // Staggered pipeline animation simulation
    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      setActiveStep(current);
      
      if (current >= pipelineSteps.length) {
        clearInterval(interval);
        setTimeout(() => setIsComplete(true), 800);
      }
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  if (!patient) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <PageHeader
        title="ML Data Pipeline"
        subtitle={`Preprocessing payload for patient ${patient.id} before statistical analysis.`}
        icon={Database}
      />

      <Card className="min-h-[500px]">
        <div className="py-6 px-4 md:px-8 space-y-6 relative">
          
          {pipelineSteps.map((step, index) => (
            <PipelineStep
              key={step.id}
              step={step}
              index={index}
              isActive={index <= activeStep}
              isComplete={index < activeStep}
              delay={index * 0.15}
              showConnector={index !== pipelineSteps.length - 1} // Hide connector on last item
            />
          ))}

          {isComplete && (
             <div className="mt-10 animate-slide-up border-t border-slate-100 pt-8 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 mb-4 flex items-center justify-center shadow-sm border border-emerald-100">
                <Database className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Preprocessing Complete</h3>
              <p className="text-slate-500 text-sm max-w-sm mb-6">
                All clinical features have been normalized and validated. Ready for architectural evaluation.
              </p>
              <Button 
                onClick={() => navigate('/sahp')} 
                rightIcon={ArrowRight}
                className="gradient-primary px-8"
              >
                Proceed to SAHP Analysis
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
