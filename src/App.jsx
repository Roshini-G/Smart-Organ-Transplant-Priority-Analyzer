import { Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import PatientInput from './pages/PatientInput';
import DataPreprocessing from './pages/DataPreprocessing';
import SAHPAnalysis from './pages/SAHPAnalysis';
import MLPrediction from './pages/MLPrediction';
import SHAPExplainability from './pages/SHAPExplainability';
import FinalDecision from './pages/FinalDecision';
import RankedPatients from './pages/RankedPatients';
import PatientRecords from './pages/PatientRecords';
import Reports from './pages/Reports';
import About from './pages/About';
import Workflow from './pages/Workflow';

export default function App() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/input" element={<PatientInput />} />
        <Route path="/preprocessing" element={<DataPreprocessing />} />
        <Route path="/sahp" element={<SAHPAnalysis />} />
        <Route path="/prediction" element={<MLPrediction />} />
        <Route path="/shap" element={<SHAPExplainability />} />
        <Route path="/decision" element={<FinalDecision />} />
        <Route path="/ranked" element={<RankedPatients />} />
        <Route path="/records" element={<PatientRecords />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/about" element={<About />} />
        <Route path="/workflow" element={<Workflow />} />
      </Route>
    </Routes>
  );
}
