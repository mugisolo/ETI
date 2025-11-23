
import React, { useState } from 'react';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { ScannerView } from './components/ScannerView';
import { CandidateReport } from './components/CandidateReport';
import { CandidatesList } from './components/CandidatesList';
import { JobListings } from './components/JobListings';
import { CandidatePortal } from './components/CandidatePortal';
import { AiAssistant } from './components/AiAssistant';
import { AdminPanel } from './components/AdminPanel';
import { AppView, Candidate, UserRole, Job } from './types';

// Mock initial jobs
const INITIAL_JOBS: Job[] = [
  {
    id: '1',
    title: 'QHSE Supervisor',
    company: 'TotalEnergies EP',
    location: 'Tilenga Project',
    type: 'Full-time',
    description: 'Looking for an experienced QHSE supervisor with NEBOSH certification and at least 5 years in oil & gas. Must be willing to work in a rotational shift.',
    requiredSkills: ['NEBOSH', 'HSE', 'Audit', 'Risk Management'],
    postedDate: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Heavy Equipment Operator',
    company: 'CNOOC',
    location: 'Kingfisher',
    type: 'Contract',
    description: 'Certified operator for Excavators and Graders. Valid permit class H required. Minimum 3 years experience operating in challenging terrain.',
    requiredSkills: ['Driving Permit', 'Heavy Machinery', 'Excavator', 'Grader'],
    postedDate: new Date().toISOString()
  }
];

const App: React.FC = () => {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [currentView, setCurrentView] = useState<AppView>(AppView.LANDING);
  
  // Shared Data
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  
  // Selections
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    // Default views based on role
    if (role === 'ADMIN') {
        setCurrentView(AppView.ADMIN_PANEL);
    } else if (role === 'HR_MANAGER') {
        setCurrentView(AppView.DASHBOARD);
    } else {
        setCurrentView(AppView.CANDIDATE_PORTAL);
    }
  };

  const handleLogout = () => {
    setUserRole(null);
    setCurrentView(AppView.LANDING);
    setSelectedCandidate(null);
  };

  const handleAnalysisComplete = (candidate: Candidate) => {
    setCandidates(prev => [candidate, ...prev]);
    setSelectedCandidate(candidate);
  };

  const handleViewProfile = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
  };

  const handleUpdateCandidate = (updatedCandidate: Candidate) => {
    setCandidates(prev => prev.map(c => c.id === updatedCandidate.id ? updatedCandidate : c));
    setSelectedCandidate(updatedCandidate);
  };

  const handleCloseReport = () => {
    setSelectedCandidate(null);
    setCurrentView(AppView.CANDIDATES);
  };

  const renderContent = () => {
    if (!userRole) {
      return <LandingPage onLogin={handleLogin} />;
    }

    const isManagement = userRole === 'HR_MANAGER' || userRole === 'ADMIN';

    // If a candidate is selected, show their report (Profile View)
    if (selectedCandidate && isManagement) {
      return <CandidateReport 
        candidate={selectedCandidate} 
        onClose={handleCloseReport} 
        onUpdateCandidate={handleUpdateCandidate}
      />;
    }

    switch (currentView) {
      case AppView.DASHBOARD:
        return isManagement 
          ? <Dashboard candidates={candidates} onViewProfile={handleViewProfile} /> 
          : <CandidatePortal jobs={jobs} />;
      case AppView.SCANNER:
        return isManagement ? <ScannerView onAnalysisComplete={handleAnalysisComplete} /> : null;
      case AppView.CANDIDATES:
        return isManagement ? <CandidatesList candidates={candidates} onViewProfile={handleViewProfile} /> : null;
      case AppView.JOBS:
        return <JobListings userRole={userRole} jobs={jobs} onAddJob={(j) => setJobs(prev => [j, ...prev])} />;
      case AppView.CANDIDATE_PORTAL:
        return <CandidatePortal jobs={jobs} />;
      case AppView.ADMIN_PANEL:
        return userRole === 'ADMIN' ? <AdminPanel /> : <Dashboard candidates={candidates} onViewProfile={handleViewProfile} />;
      default:
        return <Dashboard candidates={candidates} onViewProfile={handleViewProfile} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Header 
        currentView={currentView} 
        onNavigate={(view) => { setSelectedCandidate(null); setCurrentView(view); }} 
        userRole={userRole} 
        onLogout={handleLogout} 
        onLogin={handleLogin}
      />
      <main className="pt-6 pb-20">
        {renderContent()}
      </main>
      
      {/* AI Assistant Bot */}
      {userRole && <AiAssistant />}
    </div>
  );
};

export default App;
