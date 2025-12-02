
import React, { useState, useEffect } from 'react';
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
import { db } from './lib/firebase';
import { collection, onSnapshot, addDoc, updateDoc, doc, query, orderBy } from 'firebase/firestore';

// --- MOCK DATA ---
const MOCK_CANDIDATES: Candidate[] = [
  {
    id: "ETI-2025-001",
    name: "John Baptist Okello",
    role: "Rig Welder (6G)",
    status: "VERIFIED",
    source: "UPLOAD",
    timestamp: new Date().toISOString(),
    report: {
      candidateName: "John Baptist Okello",
      districtOfOrigin: "Hoima",
      isHostCommunity: true,
      certificationsValid: true,
      integrityScore: 98,
      riskAssessment: { level: "LOW", reason: "All documents valid. Native of Hoima (Host Community)." },
      auditNotes: "Candidate possesses valid OPITO certification and National ID confirms Hoima residence. Cleared for Tier 1 contracting.",
      missingDocuments: []
    },
    osint: {
      criminalRecordMatch: false,
      criminalDetails: "No negative matches found in global or local criminal databases (Interpol, Uganda Police).",
      digitalFootprintScore: 65,
      lifestyleAnalysis: "Social media indicates stable family life in Buliisa. No unexplained wealth markers.",
      familyBackground: "No political exposure identified.",
      socialMediaSentiment: "POSITIVE",
      redFlags: [],
      improvementTips: ["Update LinkedIn profile with recent welding projects", "Join 'Uganda Oil & Gas' professional groups"]
    }
  },
  {
    id: "ETI-2025-004",
    name: "Sarah Namukasa",
    role: "Senior Accountant",
    status: "REJECTED",
    source: "UPLOAD",
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    report: {
      candidateName: "Sarah Namukasa",
      districtOfOrigin: "Kampala",
      isHostCommunity: false,
      certificationsValid: false,
      integrityScore: 45,
      riskAssessment: { level: "CRITICAL", reason: "Discrepancy in ACCA certification number. Potential document forgery." },
      auditNotes: "ACCA certificate number does not match official registry. Digital artifacts suggest editing.",
      missingDocuments: ["Original ACCA Certificate"]
    },
    osint: {
      criminalRecordMatch: true,
      criminalDetails: "Flagged in preliminary checks. Name matches records related to procurement fraud in 2021.",
      criminalRecords: [
        { caseId: "ACC-004-2021", offense: "Embezzlement", court: "Anti-Corruption Court", date: "2021-11-15", status: "Pending" }
      ],
      digitalFootprintScore: 30,
      lifestyleAnalysis: "Lifestyle appears inconsistent with declared previous income. Frequent high-value travel noted.",
      familyBackground: "Unknown.",
      socialMediaSentiment: "NEGATIVE",
      redFlags: ["Unexplained Wealth", "Adverse Media Match"],
      improvementTips: []
    }
  },
  {
    id: "ETI-2025-009",
    name: "David K. Muwonge",
    role: "Telecom Engineer",
    status: "PENDING",
    source: "UPLOAD",
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    report: {
      candidateName: "David K. Muwonge",
      districtOfOrigin: "Masaka",
      isHostCommunity: false,
      certificationsValid: true,
      integrityScore: 88,
      riskAssessment: { level: "MEDIUM", reason: "ERB Registration pending renewal." },
      auditNotes: "Technical qualifications are solid. ERB license expired last month, needs renewal receipt.",
      missingDocuments: ["Current ERB Practicing License"]
    }
  }
];

const MOCK_JOBS: Job[] = [
  {
    id: "JOB-101",
    title: "Senior QHSE Supervisor",
    company: "TotalEnergies",
    location: "Tilenga Project (Buliisa)",
    type: "Contract",
    description: "Oversee Health, Safety, and Environment compliance for the Tilenga feeder pipeline. Must have NEBOSH Diploma and 7+ years experience in O&G.",
    requiredSkills: ["NEBOSH", "ISO 45001", "Risk Assessment", "Audit"],
    postedDate: new Date().toISOString()
  },
  {
    id: "JOB-102",
    title: "Branch Manager",
    company: "Stanbic Bank",
    location: "Hoima",
    type: "Full-time",
    description: "Lead branch operations and drive growth in the oil city. Strong background in commercial banking and credit risk required.",
    requiredSkills: ["Credit Risk", "Leadership", "Sales", "Banking"],
    postedDate: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: "JOB-103",
    title: "Fiber Optic Technician",
    company: "MTN Uganda",
    location: "Kampala",
    type: "Casual",
    description: "Deployment of last-mile fiber connectivity. Must be comfortable working at heights and have valid driving permit.",
    requiredSkills: ["Fiber Splicing", "Driving", "Work at Heights"],
    postedDate: new Date(Date.now() - 172800000).toISOString()
  },
  {
    id: "JOB-104",
    title: "Agronomist",
    company: "AgriConnect Uganda",
    location: "Gulu",
    type: "Full-time",
    description: "Manage large scale maize production. Knowledge of post-harvest handling and export standards (Global GAP) is essential.",
    requiredSkills: ["Crop Science", "Global GAP", "Team Management"],
    postedDate: new Date(Date.now() - 259200000).toISOString()
  }
];

const App: React.FC = () => {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [currentView, setCurrentView] = useState<AppView>(AppView.LANDING);
  
  // Shared Data
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Selections
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  // 1. Subscribe to Candidates Collection (With Mock Fallback)
  useEffect(() => {
    try {
        const q = query(collection(db, 'candidates'), orderBy('timestamp', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
          if (snapshot.empty) {
            console.log("Database empty. Loading mock data...");
            setCandidates(MOCK_CANDIDATES);
          } else {
            const candidatesData = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id 
            })) as Candidate[];
            setCandidates(candidatesData);
          }
          setLoading(false);
        }, (error) => {
            console.warn("Firestore connection failed (likely missing keys). Using Mock Data.", error);
            setCandidates(MOCK_CANDIDATES);
            setLoading(false);
        });

        return () => unsubscribe();
    } catch (e) {
        console.warn("Firestore init error. Using Mock Data.");
        setCandidates(MOCK_CANDIDATES);
        setLoading(false);
    }
  }, []);

  // 2. Subscribe to Jobs Collection (With Mock Fallback)
  useEffect(() => {
    try {
        const q = query(collection(db, 'jobs'), orderBy('postedDate', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
          if (snapshot.empty) {
             setJobs(MOCK_JOBS);
          } else {
             const jobsData = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
             })) as Job[];
             setJobs(jobsData);
          }
        }, (error) => {
             setJobs(MOCK_JOBS);
        });

        return () => unsubscribe();
    } catch (e) {
        setJobs(MOCK_JOBS);
    }
  }, []);

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

  // Write new candidate to Firestore
  const handleAnalysisComplete = async (candidate: Candidate) => {
    try {
        // Remove the temporary ID generated by the frontend, Firestore creates its own
        const { id, ...candidateData } = candidate;
        
        // If DB is connected, write to it
        if (db) {
            const docRef = await addDoc(collection(db, 'candidates'), candidateData);
            const newCandidate = { ...candidate, id: docRef.id };
            // If it's a direct scan, we select it, if it's an import, we just add it
            if (currentView === AppView.SCANNER) {
                setSelectedCandidate(newCandidate);
            }
        } else {
            // Fallback for demo
            setCandidates([candidate, ...candidates]);
            if (currentView === AppView.SCANNER) {
                setSelectedCandidate(candidate);
            }
        }
    } catch (e) {
        console.error("Error adding document: ", e);
        // Fallback
        setCandidates([candidate, ...candidates]);
        if (currentView === AppView.SCANNER) {
            setSelectedCandidate(candidate);
        }
    }
  };

  const handleViewProfile = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
  };

  // Update existing candidate in Firestore
  const handleUpdateCandidate = async (updatedCandidate: Candidate) => {
    try {
        if (db) {
             const candidateRef = doc(db, 'candidates', updatedCandidate.id);
             const { id, ...data } = updatedCandidate;
             await updateDoc(candidateRef, data);
        } else {
             // Fallback
             setCandidates(candidates.map(c => c.id === updatedCandidate.id ? updatedCandidate : c));
        }
        setSelectedCandidate(updatedCandidate);
    } catch (e) {
        console.error("Error updating document: ", e);
        // Fallback update local state if DB fails
        setCandidates(candidates.map(c => c.id === updatedCandidate.id ? updatedCandidate : c));
        setSelectedCandidate(updatedCandidate);
    }
  };

  // Write new Job to Firestore
  const handleAddJob = async (job: Job) => {
      try {
          const { id, ...jobData } = job;
          if (db) {
            await addDoc(collection(db, 'jobs'), jobData);
          } else {
            setJobs([job, ...jobs]);
          }
      } catch (e) {
          console.error("Error adding job: ", e);
          setJobs([job, ...jobs]);
      }
  };

  const handleCloseReport = () => {
    setSelectedCandidate(null);
    setCurrentView(AppView.CANDIDATES);
  };

  const renderContent = () => {
    if (!userRole) {
      return <LandingPage onLogin={handleLogin} />;
    }

    if (loading) {
        return <div className="flex h-screen items-center justify-center text-indigo-900 font-bold animate-pulse">Loading ETI Database...</div>;
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
          : <CandidatePortal jobs={jobs} initialCandidate={candidates[0]} />; // Demo: Log candidate in as the first mock user
      case AppView.SCANNER:
        return isManagement ? <ScannerView onAnalysisComplete={handleAnalysisComplete} /> : null;
      case AppView.CANDIDATES:
        return isManagement ? <CandidatesList candidates={candidates} onViewProfile={handleViewProfile} /> : null;
      case AppView.JOBS:
        return <JobListings userRole={userRole} jobs={jobs} onAddJob={handleAddJob} onImportCandidate={handleAnalysisComplete} />;
      case AppView.CANDIDATE_PORTAL:
        return <CandidatePortal jobs={jobs} initialCandidate={candidates[0]} />; // Demo: Log candidate in as the first mock user
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
