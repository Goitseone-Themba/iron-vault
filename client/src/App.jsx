import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthGuard from './components/AuthGuard';
import Login from './components/Login';
import NavBar from './components/NavBar';
import LoanForm from './components/LoanForm';
import CSVUpload from './components/CSVUpload';
import ResultsTable from './components/ResultsTable';

function Dashboard() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSubmitSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <LoanForm onSubmitSuccess={handleSubmitSuccess} />
            <CSVUpload onSubmitSuccess={handleSubmitSuccess} />
          </div>
          <div>
            <ResultsTable refreshTrigger={refreshTrigger} />
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<AuthGuard />}>
          <Route path="/" element={<Dashboard />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;