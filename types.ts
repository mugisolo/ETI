
export enum AppView {
  LANDING = 'LANDING',
  DASHBOARD = 'DASHBOARD',
  SCANNER = 'SCANNER',
  CANDIDATES = 'CANDIDATES',
  JOBS = 'JOBS',
  CANDIDATE_PORTAL = 'CANDIDATE_PORTAL',
  ADMIN_PANEL = 'ADMIN_PANEL'
}

export type UserRole = 'ADMIN' | 'HR_MANAGER' | 'CANDIDATE' | null;

export interface CandidateDocument {
  name: string;
  type: string; // 'id', 'lc1_letter', 'certificate', 'cv', 'hr_upload', 'selfie'
  base64: string;
  mimeType: string;
}

export interface ComplianceRisk {
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  reason: string;
}

export interface CriminalRecord {
  caseId: string;
  offense: string;
  date: string;
  court: string;
  status: 'Convicted' | 'Acquitted' | 'Pending' | 'Wanted' | 'Closed';
}

export interface OsintReport {
  criminalRecordMatch: boolean;
  criminalDetails: string; // Detailed analysis
  criminalRecords?: CriminalRecord[]; // New structured data
  digitalFootprintScore: number; // 0-100
  lifestyleAnalysis: string;
  familyBackground: string;
  socialMediaSentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
  redFlags: string[];
  improvementTips: string[]; // Advice for the candidate
  sources?: string[]; // Real links found during search
}

export interface ComplianceReport {
  candidateName: string;
  districtOfOrigin: string;
  isHostCommunity: boolean; // e.g., Hoima/Buliisa
  certificationsValid: boolean;
  integrityScore: number; // 0-100
  riskAssessment: ComplianceRisk;
  auditNotes: string;
  missingDocuments: string[];
  identityVerification?: {
    isMatch: boolean;
    confidence: number; // 0-100
    reason: string;
  };
  sectorCompliance?: {
    sector: string;
    details: Record<string, any>;
  };
  pauCompliance?: {
    nationalContentTier: string;
    nogtrRegistered: boolean;
    hseCertifications: string[];
  };
}

export interface Candidate {
  id: string;
  name: string;
  role: string; // Job Role
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  report?: ComplianceReport;
  osint?: OsintReport;
  timestamp: string;
  documents?: CandidateDocument[]; // Store docs for later viewing
  basicScore?: number; // Initial automated score
  source?: 'UPLOAD' | 'LINKEDIN'; // Track origin
  email?: string;
  emailVerified?: boolean;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Contract' | 'Casual';
  description: string;
  requiredSkills: string[];
  postedDate: string;
}

export interface JobMatchResult {
  jobId: string;
  overallScore: number;
  skillsMatchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  reason: string;
  experienceAnalysis?: string; // New: Specific analysis
  locationAnalysis?: string; // New: Specific analysis
}

export interface SourcingResult {
  searchString: string; // The Boolean string
  explanation: string;
  simulatedMatches: {
    name: string;
    headline: string;
    currentRole: string;
    matchExplanation: string;
    profileUrl: string; // Fake linkedin URL
  }[];
}
