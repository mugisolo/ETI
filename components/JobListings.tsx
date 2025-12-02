import React, { useState, useMemo } from 'react';
import { Job, UserRole, SourcingResult, Candidate } from '../types';
import { generateSourcingStrategies, parseProfileText } from '../services/geminiService';

interface JobListingsProps {
  userRole: UserRole;
  jobs: Job[];
  onAddJob: (job: Job) => void;
  onImportCandidate?: (candidate: Candidate) => void;
}

export const JobListings: React.FC<JobListingsProps> = ({ userRole, jobs, onAddJob, onImportCandidate }) => {
  const [showForm, setShowForm] = useState(false);
  const [showSourcingModal, setShowSourcingModal] = useState(false);
  const [viewJob, setViewJob] = useState<Job | null>(null);
  const [selectedJobForSourcing, setSelectedJobForSourcing] = useState<Job | null>(null);
  const [sourcingResult, setSourcingResult] = useState<SourcingResult | null>(null);
  const [isSourcing, setIsSourcing] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [sourcingTab, setSourcingTab] = useState<'AUTO' | 'MANUAL'>('AUTO');
  const [profileText, setProfileText] = useState('');

  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set());
  const [newJob, setNewJob] = useState<Partial<Job>>({
    title: '',
    company: '',
    location: 'Kampala, Uganda',
    type: 'Full-time',
    description: ''
  });

  // Filter States
  const [filterType, setFilterType] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterCompany, setFilterCompany] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');

  // Derived Lists
  const uniqueLocations = Array.from(new Set(jobs.map(j => j.location)));
  const uniqueTypes = Array.from(new Set(jobs.map(j => j.type)));
  
  const uniqueCompanies = useMemo(() => {
    const companies = jobs.map(j => j.company);
    const unique = Array.from(new Set(companies));
    return unique.map(company => ({
      name: company,
      count: jobs.filter(j => j.company === company).length
    }));
  }, [jobs]);

  const isManagement = userRole === 'HR_MANAGER' || userRole === 'ADMIN';

  const filteredJobs = useMemo(() => {
    let result = jobs.filter(job => {
      const matchType = filterType ? job.type === filterType : true;
      const matchLocation = filterLocation ? job.location === filterLocation : true;
      const matchCompany = filterCompany ? job.company === filterCompany : true;
      return matchType && matchLocation && matchCompany;
    });

    result.sort((a, b) => {
        if (sortOrder === 'newest') {
            return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
        } else if (sortOrder === 'oldest') {
            return new Date(a.postedDate).getTime() - new Date(b.postedDate).getTime();
        }
        return 0;
    });

    return result;
  }, [jobs, filterType, filterLocation, filterCompany, sortOrder]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newJob.title && newJob.description) {
      onAddJob({
        id: Math.random().toString(36).substr(2, 9),
        title: newJob.title,
        company: newJob.company || 'Unknown',
        location: newJob.location || 'Uganda',
        type: newJob.type as any,
        description: newJob.description,
        requiredSkills: [],
        postedDate: new Date().toISOString()
      });
      setShowForm(false);
      setNewJob({ title: '', company: '', location: 'Kampala, Uganda', type: 'Full-time', description: '' });
    }
  };

  const toggleApply = (id: string) => {
    setAppliedJobs(prev => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
    });
  };

  const handleSourceTalent = async (job: Job) => {
    setSelectedJobForSourcing(job);
    setShowSourcingModal(true);
    setSourcingTab('AUTO');
    setSourcingResult(null);
    setIsSourcing(true);

    try {
        const result = await generateSourcingStrategies(job);
        setSourcingResult(result);
    } catch (e) {
        console.error("Sourcing failed", e);
    } finally {
        setIsSourcing(false);
    }
  };

  const handleImportCandidate = (match: any) => {
    if (!onImportCandidate) return;
    const newCandidate: Candidate = {
        id: Math.random().toString(36).substring(7),
        name: match.name,
        role: match.currentRole,
        status: 'PENDING',
        source: 'LINKEDIN',
        timestamp: new Date().toISOString(),
        basicScore: 75,
        report: {
            candidateName: match.name,
            districtOfOrigin: 'Unknown',
            isHostCommunity: false,
            certificationsValid: true,
            integrityScore: 80,
            riskAssessment: { level: 'LOW', reason: 'Sourced from LinkedIn professional network.' },
            auditNotes: `Imported via LinkedIn X-Ray Search. Headline: ${match.headline}. Logic: ${match.matchExplanation}`,
            missingDocuments: ['CV', 'National ID', 'Certifications']
        }
    };
    onImportCandidate(newCandidate);
    alert(`Imported ${match.name} to Applicant Tracking System.`);
  };

  const handleManualImport = async () => {
    if (!profileText.trim()) return;
    setIsParsing(true);
    try {
        const report = await parseProfileText(profileText);
        if (onImportCandidate) {
            const newCandidate: Candidate = {
                id: Math.random().toString(36).substring(7),
                name: report.candidateName || "Imported Candidate",
                role: "Sourced Profile",
                status: 'PENDING',
                source: 'LINKEDIN',
                timestamp: new Date().toISOString(),
                basicScore: report.integrityScore,
                report: report
            };
            onImportCandidate(newCandidate);
            alert("Profile successfully parsed and imported.");
            setProfileText('');
            setShowSourcingModal(false);
        }
    } catch (e) {
        alert("Failed to parse profile text. Please check the content and try again.");
    } finally {
        setIsParsing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8 relative font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 border-b border-stone-200 pb-6">
        <div>
          <h1 className="text-4xl font-serif font-bold text-stone-900">Executive Opportunities</h1>
          <p className="text-stone-500 text-lg mt-2 font-light">
            {isManagement ? 'Manage recruitment for partner organizations.' : 'Strategic positions in Uganda.'}
          </p>
        </div>
        {isManagement && (
          <div className="flex gap-3">
             <button
                onClick={() => setShowForm(!showForm)}
                className="bg-gold-600 text-white px-8 py-3 text-sm font-bold uppercase tracking-widest hover:bg-gold-700 shadow-md transition-all"
            >
                {showForm ? 'Cancel' : '+ New Position'}
            </button>
          </div>
        )}
      </div>

      {/* Sourcing Modal - Keeping existing logic but updating style */}
      {showSourcingModal && selectedJobForSourcing && (
          <div className="fixed inset-0 z-50 bg-stone-900/80 backdrop-blur-sm flex items-center justify-center p-4">
             <div className="bg-white shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                 <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50">
                     <div>
                        <h2 className="text-xl font-serif font-bold text-stone-900">Talent Acquisition AI</h2>
                        <p className="text-sm text-stone-500">Sourcing: <span className="font-bold text-gold-600">{selectedJobForSourcing.title}</span></p>
                     </div>
                     <button onClick={() => setShowSourcingModal(false)} className="text-stone-400 hover:text-stone-600">✕</button>
                 </div>

                 {/* Tab Navigation */}
                 <div className="flex border-b border-stone-100 bg-white">
                    <button 
                        onClick={() => setSourcingTab('AUTO')}
                        className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-colors ${sourcingTab === 'AUTO' ? 'border-gold-600 text-gold-600 bg-ivory-50' : 'border-transparent text-stone-400 hover:text-stone-600'}`}
                    >
                        Auto-Source
                    </button>
                    <button 
                        onClick={() => setSourcingTab('MANUAL')}
                        className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-colors ${sourcingTab === 'MANUAL' ? 'border-gold-600 text-gold-600 bg-ivory-50' : 'border-transparent text-stone-400 hover:text-stone-600'}`}
                    >
                        Manual Import
                    </button>
                 </div>
                 
                 <div className="p-8">
                    {sourcingTab === 'AUTO' ? (
                        <>
                            {isSourcing ? (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <p className="text-gold-600 font-bold uppercase tracking-widest animate-pulse">Running Intelligence Scan...</p>
                                </div>
                            ) : sourcingResult ? (
                                <div className="space-y-6">
                                    <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest">Identified Candidates</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {sourcingResult.simulatedMatches.map((match, idx) => (
                                            <div key={idx} className="border border-stone-200 p-6 hover:border-gold-400 transition-all bg-white shadow-sm group">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h4 className="font-serif font-bold text-stone-900 text-lg group-hover:text-gold-600 transition-colors">{match.name}</h4>
                                                        <p className="text-xs text-stone-500 uppercase mt-1">{match.currentRole}</p>
                                                    </div>
                                                </div>
                                                <p className="mt-4 text-sm text-stone-600 leading-relaxed italic border-l-2 border-gold-200 pl-3">{match.matchExplanation}</p>
                                                <button 
                                                    onClick={() => handleImportCandidate(match)}
                                                    className="mt-6 w-full bg-stone-900 text-white py-3 text-xs font-bold uppercase tracking-widest hover:bg-gold-600 transition-colors"
                                                >
                                                    Import Profile
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : null}
                        </>
                    ) : (
                        <div className="space-y-6">
                            <textarea 
                                className="w-full h-48 border border-stone-300 p-4 focus:ring-1 focus:ring-gold-500 focus:border-gold-500 text-sm font-mono"
                                placeholder="Paste LinkedIn Profile content here..."
                                value={profileText}
                                onChange={(e) => setProfileText(e.target.value)}
                            ></textarea>
                            <button 
                                onClick={handleManualImport}
                                disabled={isParsing || !profileText.trim()}
                                className="bg-gold-600 text-white px-8 py-3 text-sm font-bold uppercase tracking-widest hover:bg-gold-700 w-full"
                            >
                                {isParsing ? 'Processing...' : 'Analyze & Import'}
                            </button>
                        </div>
                    )}
                 </div>
             </div>
          </div>
      )}

      {/* Detailed Job View Modal */}
      {viewJob && (
         <div className="fixed inset-0 z-50 bg-stone-900/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col shadow-2xl">
               <div className="p-8 border-b border-stone-100 sticky top-0 bg-white z-10 flex justify-between">
                  <div>
                     <h2 className="text-3xl font-serif font-bold text-stone-900">{viewJob.title}</h2>
                     <p className="text-gold-600 font-bold uppercase tracking-wider text-xs mt-2">{viewJob.company} • {viewJob.location}</p>
                  </div>
                  <button onClick={() => setViewJob(null)} className="text-stone-400 hover:text-stone-900">✕</button>
               </div>
               
               <div className="p-8 flex-1 overflow-y-auto bg-ivory-50">
                  <div className="prose prose-stone max-w-none text-stone-700 leading-loose">
                     {viewJob.description}
                  </div>
                  
                  {viewJob.requiredSkills && viewJob.requiredSkills.length > 0 && (
                     <div className="mt-10 pt-10 border-t border-stone-200">
                        <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4">Core Competencies</h4>
                        <div className="flex flex-wrap gap-2">
                           {viewJob.requiredSkills.map((skill, idx) => (
                              <span key={idx} className="bg-white text-stone-800 px-4 py-2 text-xs font-bold border border-stone-200 shadow-sm">
                                 {skill}
                              </span>
                           ))}
                        </div>
                     </div>
                  )}
               </div>

               <div className="p-6 border-t border-stone-200 bg-white flex justify-end gap-4">
                  <button 
                     onClick={() => setViewJob(null)}
                     className="px-6 py-3 text-xs font-bold uppercase tracking-widest text-stone-500 hover:text-stone-900"
                  >
                     Close
                  </button>
                  {userRole === 'CANDIDATE' ? (
                     <button 
                        onClick={() => toggleApply(viewJob.id)}
                        className={`px-8 py-3 text-xs font-bold uppercase tracking-widest text-white transition-all ${
                            appliedJobs.has(viewJob.id) 
                            ? 'bg-emerald-700' 
                            : 'bg-gold-600 hover:bg-gold-700'
                        }`}
                     >
                        {appliedJobs.has(viewJob.id) ? 'Submitted' : 'Apply Now'}
                     </button>
                  ) : isManagement ? (
                     <button 
                        onClick={() => {
                           setViewJob(null);
                           handleSourceTalent(viewJob);
                        }}
                        className="px-8 py-3 bg-stone-900 text-white text-xs font-bold uppercase tracking-widest hover:bg-stone-800"
                     >
                        Source Talent
                     </button>
                  ) : null}
               </div>
            </div>
         </div>
      )}

      {/* Grid Layout for Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
         {/* Sidebar Filters */}
         <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-6 border border-stone-200 shadow-sm">
               <h3 className="font-serif font-bold text-stone-900 text-lg mb-6 border-b border-stone-100 pb-2">Filter Criteria</h3>
               
               <div className="space-y-6">
                   {/* Type Filter */}
                   <div>
                      <label className="block text-xs font-bold text-stone-400 uppercase mb-2 tracking-wide">Employment Type</label>
                      <select 
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="w-full border border-stone-300 p-2 text-sm bg-ivory-50 focus:border-gold-500 outline-none"
                      >
                         <option value="">All Types</option>
                         {uniqueTypes.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                   </div>

                   {/* Location Filter */}
                   <div>
                      <label className="block text-xs font-bold text-stone-400 uppercase mb-2 tracking-wide">Region</label>
                      <select 
                        value={filterLocation}
                        onChange={(e) => setFilterLocation(e.target.value)}
                        className="w-full border border-stone-300 p-2 text-sm bg-ivory-50 focus:border-gold-500 outline-none"
                      >
                         <option value="">All Regions</option>
                         {uniqueLocations.map(l => <option key={l} value={l}>{l}</option>)}
                      </select>
                   </div>

                   {/* Company Filter */}
                   <div>
                      <label className="block text-xs font-bold text-stone-400 uppercase mb-2 tracking-wide">Client</label>
                      <select 
                        value={filterCompany}
                        onChange={(e) => setFilterCompany(e.target.value)}
                        className="w-full border border-stone-300 p-2 text-sm bg-ivory-50 focus:border-gold-500 outline-none"
                      >
                         <option value="">All Clients</option>
                         {uniqueCompanies.map(c => (
                            <option key={c.name} value={c.name}>{c.name} ({c.count})</option>
                         ))}
                      </select>
                   </div>
               </div>

               <button 
                  onClick={() => { setFilterType(''); setFilterLocation(''); setFilterCompany(''); }}
                  className="mt-6 w-full text-xs text-gold-600 font-bold uppercase tracking-widest hover:text-gold-700"
               >
                  Reset All
               </button>
            </div>
         </div>

         {/* Listings Column */}
         <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6 border-b border-stone-200 pb-2">
               <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">{filteredJobs.length} Positions Available</span>
            </div>

            <div className="space-y-4">
              {filteredJobs.length === 0 ? (
                 <div className="bg-ivory-50 p-12 text-center border border-dashed border-stone-300">
                    <p className="text-stone-500 italic font-serif">No positions match your criteria.</p>
                 </div>
              ) : (
                 filteredJobs.map(job => (
                    <div key={job.id} className="bg-white p-8 border border-stone-200 hover:border-gold-400 transition-all group relative">
                      {isManagement && (
                         <button 
                            onClick={(e) => { e.stopPropagation(); handleSourceTalent(job); }}
                            className="absolute top-8 right-8 text-[10px] font-bold uppercase tracking-widest bg-stone-50 text-stone-600 px-3 py-1 border border-stone-200 hover:bg-stone-900 hover:text-gold-500 transition-colors"
                         >
                            Source Talent
                         </button>
                      )}

                      <div className="cursor-pointer" onClick={() => setViewJob(job)}>
                          <h3 className="text-2xl font-serif font-bold text-stone-900 group-hover:text-gold-600 transition-colors">{job.title}</h3>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-stone-500 mt-2 font-medium">
                            <span className="text-stone-800 font-bold">{job.company}</span>
                            <span className="text-stone-300">•</span>
                            <span>{job.location}</span>
                            <span className="text-stone-300">•</span>
                            <span className="text-xs uppercase tracking-wide">{job.type}</span>
                          </div>
                      </div>
                      
                      <div className="mt-6 flex justify-between items-center pt-6 border-t border-stone-100">
                        <span className="text-xs text-stone-400 font-bold uppercase tracking-widest">Posted: {new Date(job.postedDate).toLocaleDateString()}</span>
                        {userRole === 'CANDIDATE' ? (
                          <button 
                            onClick={() => toggleApply(job.id)}
                            className={`px-6 py-2 text-xs font-bold uppercase tracking-widest transition-colors border ${
                                appliedJobs.has(job.id) 
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                : 'bg-white text-stone-900 border-stone-900 hover:bg-stone-900 hover:text-white'
                            }`}
                          >
                            {appliedJobs.has(job.id) ? 'Applied' : 'Apply Now'}
                          </button>
                        ) : (
                          <button 
                             onClick={() => setViewJob(job)}
                             className="text-gold-600 hover:text-gold-700 text-xs font-bold uppercase tracking-widest"
                          >
                             View Details →
                          </button>
                        )}
                      </div>
                    </div>
                 ))
              )}
            </div>
         </div>
      </div>
    </div>
  );
};