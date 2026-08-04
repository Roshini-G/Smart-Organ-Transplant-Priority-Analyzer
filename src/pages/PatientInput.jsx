import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  UserPlus, Sparkles, Play, User, Activity, Thermometer, ArrowRight, ArrowLeft
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Card, { CardHeader } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import ProgressStepper from '../components/ui/ProgressStepper';
import { savePatient } from '../utils/patientStore';
import { autofillPatient } from '../utils/sampleData';
import { computeMLPrediction, computeSAHPScore, computeDecision } from '../utils/scoringEngine';

const STEPS = [
  { id: 0, title: 'Basic Identity', icon: User },
  { id: 1, title: 'Priority Metrics', icon: Activity },
  { id: 2, title: 'Clinical Vitals', icon: Thermometer },
];

function SliderField({ label, value, onChange, min, max, step = 1, suffix = '' }) {
  return (
    <div className="w-full">
      <div className="flex justify-between mb-2">
        <label className="block text-sm font-medium text-slate-700">{label}</label>
        <span className="text-sm font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-md">{value}{suffix}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full accent-primary-600"
      />
      <div className="flex justify-between text-[10px] text-slate-400 mt-1.5 font-medium">
        <span>{min}{suffix}</span>
        <span>{max}{suffix}</span>
      </div>
    </div>
  );
}

export default function PatientInput() {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const { control, handleSubmit, formState: { errors }, reset, trigger, setValue, watch } = useForm({
    defaultValues: {
      patientId: '', name: '', age: '', gender: '', bloodGroup: '', organNeeded: 'Kidney',
      medicalUrgency: 5, diseaseSeverity: 5, waitingTime: 6, compatibilityScore: 50,
      survivalProbability: 50, comorbidities: 0, organFailureStage: 2, infectionRisk: 'Low',
      recoveryChance: 50, icuRequirement: 'No', donorMatchAvailability: 'Medium',
      bmi: '', hemoglobin: '', creatinine: '', bloodPressure: '', oxygenSaturation: '',
    },
    mode: 'onTouched'
  });

  const nextStep = async () => {
    // Validate current step fields before progressing
    let fieldsToValidate = [];
    if (currentStep === 0) fieldsToValidate = ['patientId', 'name', 'age', 'gender', 'bloodGroup', 'organNeeded'];
    // For steps 1 & 2, everything has a default or is optional, so it generally passes
    
    const isStepValid = await trigger(fieldsToValidate);
    
    if (isStepValid) {
      setCurrentStep(curr => Math.min(curr + 1, STEPS.length - 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    setCurrentStep(curr => Math.max(curr - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onSubmit = (data) => {
    toast.loading('Analyzing patient data...', { id: 'analyze' });
    
    setTimeout(() => {
      const patient = {
        id: data.patientId,
        name: data.name,
        age: Number(data.age),
        gender: data.gender,
        bloodGroup: data.bloodGroup,
        organNeeded: data.organNeeded,
        medicalUrgency: data.medicalUrgency,
        diseaseSeverity: data.diseaseSeverity,
        waitingTime: data.waitingTime,
        compatibilityScore: data.compatibilityScore,
        survivalProbability: data.survivalProbability,
        comorbidities: data.comorbidities,
        organFailureStage: data.organFailureStage,
        infectionRisk: data.infectionRisk,
        recoveryChance: data.recoveryChance,
        icuRequirement: data.icuRequirement,
        donorMatchAvailability: data.donorMatchAvailability,
        bmi: data.bmi ? Number(data.bmi) : null,
        hemoglobin: data.hemoglobin ? Number(data.hemoglobin) : null,
        creatinine: data.creatinine ? Number(data.creatinine) : null,
        bloodPressure: data.bloodPressure || null,
        oxygenSaturation: data.oxygenSaturation ? Number(data.oxygenSaturation) : null,
      };

      const prediction = computeMLPrediction(patient);
      const sahpScore = computeSAHPScore(patient);
      const decision = computeDecision(patient);

      const fullPatient = {
        ...patient,
        priorityScore: prediction.priorityScore,
        priorityCategory: prediction.category,
        confidence: prediction.confidence,
        riskScore: prediction.riskScore,
        sahpScore,
        recommendation: decision.recommendation,
        analyzed: true,
        status: prediction.priorityScore >= 75 ? 'High Priority' : 'Waiting',
      };

      savePatient(fullPatient);
      sessionStorage.setItem('currentPatient', JSON.stringify(fullPatient));
      
      toast.success('Analysis complete!', { id: 'analyze' });
      navigate('/preprocessing');
    }, 600);
  };

  const handleAutofill = () => {
    const newId = `PT-${String(Date.now()).slice(-4)}`;
    reset({ ...autofillPatient, patientId: newId });
    toast.success('Sample data loaded automatically.');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5"
          >
            <Controller
              name="patientId"
              control={control}
              rules={{ required: 'Patient ID is required' }}
              render={({ field }) => (
                <Input {...field} label="Patient ID *" placeholder="e.g., PT-001" error={errors.patientId?.message} />
              )}
            />
            <Controller
              name="name"
              control={control}
              rules={{ required: 'Name is required' }}
              render={({ field }) => (
                <Input {...field} label="Full Name *" placeholder="Enter full name" error={errors.name?.message} />
              )}
            />
            <Controller
              name="age"
              control={control}
              rules={{ required: 'Age is required', min: { value: 1, message: 'Invalid age' }, max: { value: 120, message: 'Invalid age' } }}
              render={({ field }) => (
                <Input {...field} type="number" label="Age *" placeholder="Age in years" error={errors.age?.message} />
              )}
            />
            <Controller
              name="gender"
              control={control}
              rules={{ required: 'Gender is required' }}
              render={({ field }) => (
                <Select {...field} label="Gender *" options={['Male', 'Female', 'Other']} error={errors.gender?.message} />
              )}
            />
            <Controller
              name="bloodGroup"
              control={control}
              rules={{ required: 'Blood Group is required' }}
              render={({ field }) => (
                <Select {...field} label="Blood Group *" options={['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']} error={errors.bloodGroup?.message} />
              )}
            />
            <Controller
              name="organNeeded"
              control={control}
              rules={{ required: 'Organ needed is required' }}
              render={({ field }) => (
                <Select {...field} label="Organ Needed *" options={['Kidney', 'Liver', 'Heart', 'Lung']} error={errors.organNeeded?.message} />
              )}
            />
          </motion.div>
        );
      case 1:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6"
          >
             <Controller name="medicalUrgency" control={control} render={({ field: { value, onChange } }) => (
              <SliderField label="Medical Urgency Level" value={value} onChange={onChange} min={1} max={10} />
            )} />
            <Controller name="diseaseSeverity" control={control} render={({ field: { value, onChange } }) => (
              <SliderField label="Disease Severity" value={value} onChange={onChange} min={1} max={10} />
            )} />
            <Controller name="waitingTime" control={control} render={({ field: { value, onChange } }) => (
              <SliderField label="Waiting Time" value={value} onChange={onChange} min={0} max={120} suffix=" mo" />
            )} />
            <Controller name="compatibilityScore" control={control} render={({ field: { value, onChange } }) => (
              <SliderField label="Compatibility Score" value={value} onChange={onChange} min={0} max={100} suffix="%" />
            )} />
            <Controller name="survivalProbability" control={control} render={({ field: { value, onChange } }) => (
              <SliderField label="Survival Probability" value={value} onChange={onChange} min={0} max={100} suffix="%" />
            )} />
            <Controller name="comorbidities" control={control} render={({ field: { value, onChange } }) => (
              <SliderField label="Existing Comorbidities" value={value} onChange={onChange} min={0} max={5} />
            )} />
            <Controller name="organFailureStage" control={control} render={({ field: { value, onChange } }) => (
              <SliderField label="Organ Failure Stage" value={value} onChange={onChange} min={1} max={5} />
            )} />
            
            <Controller name="infectionRisk" control={control} render={({ field }) => (
               <Select {...field} label="Infection Risk" options={['Low', 'Medium', 'High']} />
            )} />
            <Controller name="recoveryChance" control={control} render={({ field: { value, onChange } }) => (
              <SliderField label="Post-Transplant Recovery Chance" value={value} onChange={onChange} min={0} max={100} suffix="%" />
            )} />
            <Controller name="icuRequirement" control={control} render={({ field }) => (
               <Select {...field} label="ICU Requirement" options={['No', 'Yes']} />
            )} />
            <Controller name="donorMatchAvailability" control={control} render={({ field }) => (
               <Select {...field} label="Donor Match Availability" options={['Low', 'Medium', 'High']} />
            )} />
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5"
          >
            <Controller name="bmi" control={control} render={({ field }) => (
              <Input {...field} type="number" step="0.1" label="BMI (Optional)" placeholder="e.g., 24.5" />
            )} />
            <Controller name="hemoglobin" control={control} render={({ field }) => (
              <Input {...field} type="number" step="0.1" label="Hemoglobin Level (g/dL)" placeholder="e.g., 12.5" />
            )} />
            <Controller name="creatinine" control={control} render={({ field }) => (
              <Input {...field} type="number" step="0.1" label="Creatinine Level (mg/dL)" placeholder="e.g., 1.2" />
            )} />
            <Controller name="bloodPressure" control={control} render={({ field }) => (
              <Input {...field} label="Blood Pressure" placeholder="e.g., 120/80" />
            )} />
            <Controller name="oxygenSaturation" control={control} render={({ field }) => (
              <Input {...field} type="number" label="Oxygen Saturation (%)" placeholder="e.g., 98" min={0} max={100} />
            )} />
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <PageHeader
        title="Patient Registration"
        subtitle="Enter comprehensive patient data to generate an AI-driven priority assessment."
        icon={UserPlus}
        action={
          <Button onClick={handleAutofill} variant="secondary" leftIcon={Sparkles}>
            Autofill Sample
          </Button>
        }
      />

      {/* Stepper Progress */}
      <Card className="mb-6">
        <div className="max-w-3xl mx-auto py-2">
           <ProgressStepper steps={STEPS} currentStep={currentStep} />
        </div>
      </Card>

      {/* Form Container */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="min-h-[400px] flex flex-col">
          <CardHeader 
            title={STEPS[currentStep].title} 
            subtitle="Please carefully verify all parameters before submitting."
            icon={STEPS[currentStep].icon} 
          />
          
          <div className="flex-1 py-4">
            <AnimatePresence mode="wait">
              {renderStepContent()}
            </AnimatePresence>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
            <Button 
              type="button"
              variant="outline" 
              leftIcon={ArrowLeft} 
              onClick={prevStep}
              className={currentStep === 0 ? 'invisible' : ''}
            >
              Back
            </Button>
            
            {currentStep < STEPS.length - 1 ? (
              <Button type="button" onClick={nextStep} rightIcon={ArrowRight}>
                Continue
              </Button>
            ) : (
              <Button type="submit" leftIcon={Play} className="gradient-primary">
                Run Priority Analysis
              </Button>
            )}
          </div>
        </Card>
      </form>
    </div>
  );
}
