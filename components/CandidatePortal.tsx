
import React, { useState, useRef, useEffect } from 'react';
import { CandidateDocument, Job, JobMatchResult, ComplianceReport, OsintReport, Candidate } from '../types';
import { matchCandidateToJob, analyzeDocuments, generateOsintReport } from '../services/geminiService';

interface CandidatePortalProps {
  jobs: Job[];
  initialCandidate?: Candidate;
}

export const CandidatePortal: React.FC<CandidatePortalProps> = ({ jobs, initialCandidate }) => {
  const [documents, setDocuments] = useState<CandidateDocument[]>(initialCandidate?.documents || []);
  const [basicScore, setBasicScore] = useState<number | null>(initialCandidate?.basicScore || null);
  const [recommendations, setRecommendations] = useState<JobMatchResult[]>([]);
  const [profileInfo, setProfileInfo] = useState<ComplianceReport | null>(initialCandidate?.report || null);
  const [osintResult, setOsintResult] = useState<OsintReport | null>(initialCandidate?.osint || null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isOsintProcessing, setIsOsintProcessing] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set());
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialCandidate) {
        setDocuments(initialCandidate.documents || []);
        setProfileInfo(initialCandidate.report || null);
        setOsintResult(initialCandidate.osint || null);
    }
  }, [initialCandidate]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      newFiles.forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          setDocuments(prev => [...prev, {
            name: file.name,
            type: file.name.toLowerCase().includes('cv') ? 'cv' : 'support_doc',
            base64: base64String.split(',')[1],
            mimeType: file.type
          }]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemoveDocument = (index: number) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const analyzeProfile = async () => {
    if (documents.length === 0) return;
    setIsProcessing(true);
    try {
      const complianceData = await analyzeDocuments(documents);
      setProfileInfo(complianceData);
      const recs: JobMatchResult[] = [];
      for (const job of jobs.slice(0, 5)) {
        try {
           const result = await matchCandidateToJob(documents, job);
           recs.push(result);
        } catch (e) { console.error(`Failed to match job ${job.id}`, e); }
      }
      setRecommendations(recs.sort((a,b) => b.overallScore - a.overallScore));
      if (recs.length > 0) {
         const avg = recs.reduce((acc, curr) => acc + curr.overallScore, 0) / recs.length;
         setBasicScore(Math.round(avg));
      }
    } catch (error) {
      console.error("Analysis failed", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSelfOsint = async () => {
    if (!profileInfo) return;
    setIsOsintProcessing(true);
    try {
      const context = `Candidate Self-Check Request. District: ${profileInfo.districtOfOrigin}. Integrity: ${profileInfo.integrityScore}`;
      const report = await generateOsintReport(profileInfo.candidateName, context);
      setOsintResult(report);
    } catch (error) { console.error("OSINT failed", error); } finally { setIsOsintProcessing(false); }
  };

  const downloadDocument = (doc: CandidateDocument) => {
    const link = document.createElement('a');
    link.href = `data:${doc.mimeType};base64,${doc.base64}`;
    link.download = doc.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleApply = (id: string) => {
    setAppliedJobs(prev => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Profile & Brand */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 border border-stone-200 shadow-sm">
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-stone-900 rounded-none mx-auto mb-4 flex items-center justify-center text-gold-500 border border-gold-500 shadow-lg">
                 {profileInfo ? (
                   <span className="text-4xl font-serif font-bold">{profileInfo.candidateName.charAt(0)}</span>
                 ) : (
                   <span className="text-4xl">?</span>
                 )}
              </div>
              <h2 className="text-xl font-serif font-bold text-stone-900">{profileInfo ? profileInfo.candidateName : 'My Profile'}</h2>
              <p className="text-xs text-stone-500 mt-1 uppercase tracking-widest">
                {profileInfo ? `${profileInfo.districtOfOrigin} • Verified` : 'Build your profile'}
              </p>
            </div>

            {profileInfo && (
              <div className="grid grid-cols-2 gap-3 mb-8">
                 <div className="bg-ivory-50 p-3 border border-stone-100 text-center">
                    <p className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">Integrity</p>
                    <p className="font-serif font-bold text-stone-900 text-xl">{profileInfo.integrityScore}</p>
                 </div>
                 <div className="bg-ivory-50 p-3 border border-stone-100 text-center">
                    <p className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">Origin</p>
                    <p className="font-serif font-bold text-stone-900 text-sm mt-1">{profileInfo.isHostCommunity ? 'Host' : 'National'}</p>
                 </div>
              </div>
            )}

            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                 <h3 className="text-xs font-bold text-stone-900 uppercase tracking-widest">Documents</h3>
                 {documents.length > 0 && (
                    <button onClick={() => fileInputRef.current?.click()} className="text-xs text-gold-600 font-bold hover:underline">+ Add</button>
                 )}
              </div>
              
              <div className="space-y-2">
                {documents.map((doc, i) => (
                  <div key={i} className="flex items-center justify-between text-xs bg-ivory-50 p-3 border border-stone-100 cursor-pointer hover:border-gold-300 transition-colors">
                    <div className="flex items-center gap-2 overflow-hidden" onClick={() => downloadDocument(doc)}>
                       <span className="truncate max-w-[120px] font-bold text-stone-700">{doc.name}</span>
                    </div>
                    <button onClick={() => handleRemoveDocument(i)} className="text-stone-400 hover:text-red-500">×</button>
                  </div>
                ))}
              </div>
              
              <input type="file" multiple ref={fileInputRef} className="hidden" onChange={handleUpload} />
              
              {documents.length === 0 && (
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-stone-300 p-6 text-stone-400 hover:bg-ivory-50 hover:border-gold-400 text-xs font-bold uppercase tracking-widest transition-all"
                >
                  Upload CV & ID
                </button>
              )}
              
              <button 
                onClick={analyzeProfile}
                disabled={documents.length === 0 || isProcessing}
                className={`w-full py-4 text-xs font-bold uppercase tracking-widest text-white transition-all
                  ${documents.length === 0 || isProcessing ? 'bg-stone-300 cursor-not-allowed' : 'bg-stone-900 hover:bg-gold-600'}
                `}
              >
                 {isProcessing ? 'Analyzing...' : 'Run Analysis'}
              </button>
            </div>
          </div>

          {profileInfo && (
            <div className="bg-stone-900 p-8 border border-stone-800 shadow-lg text-white">
              <h3 className="text-lg font-serif font-bold text-gold-500 mb-2">Brand Health</h3>
              <p className="text-xs text-stone-400 mb-6 font-light">Forensic analysis of your digital presence.</p>
              
              {!osintResult ? (
                <button 
                  onClick={handleSelfOsint}
                  disabled={isOsintProcessing}
                  className="w-full bg-gold-600 text-white py-3 text-xs font-bold uppercase tracking-widest hover:bg-gold-700 transition-colors"
                >
                  {isOsintProcessing ? 'Scanning...' : 'Check My Brand'}
                </button>
              ) : (
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-stone-800 pb-2">
                    <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Visibility Score</span>
                    <span className="text-xl font-serif font-bold text-white">{osintResult.digitalFootprintScore}/100</span>
                  </div>
                  
                  <div className="bg-stone-800 p-4 border border-stone-700">
                    <h4 className="text-[10px] font-bold text-gold-500 uppercase mb-2">Improvement Tips</h4>
                    <ul className="space-y-2 mb-4">
                      {osintResult.improvementTips?.map((tip, idx) => (
                        <li key={idx} className="text-xs text-stone-300 flex gap-2 items-start">
                          <span className="text-gold-500">•</span> {tip}
                        </li>
                      ))}
                    </ul>
                    <a href="mailto:info@eti.co.ug" className="block text-center bg-white/10 hover:bg-white/20 py-2 text-[10px] font-bold uppercase tracking-widest text-white transition-colors">
                        Contact Branding Experts
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Recommendations */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-stone-200">
             <h2 className="text-3xl font-serif font-bold text-stone-900">Opportunities</h2>
          </div>
          
          <div className="space-y-6">
            {recommendations.length > 0 ? recommendations.map((rec, index) => {
                const job = jobs.find(j => j.id === rec.jobId);
                if (!job) return null;
                return (
                  <div key={index} className="bg-white p-8 border border-stone-200 hover:border-gold-400 transition-colors group">
                     <div className="flex justify-between items-start mb-4">
                        <div>
                           <h3 className="font-serif font-bold text-xl text-stone-900 group-hover:text-gold-600 transition-colors">{job.title}</h3>
                           <p className="text-xs text-stone-500 mt-1 uppercase tracking-wide">{job.company} • {job.location}</p>
                        </div>
                        <div className="text-right">
                           <div className={`text-3xl font-serif font-bold ${rec.overallScore > 75 ? 'text-emerald-700' : 'text-stone-400'}`}>{rec.overallScore}%</div>
                           <div className="text--[10px] text-stone-400 uppercase tracking-widest">Match</div>
                        </div>
                     </div>
                     
                     <div className="bg-ivory-50 p-4 border-l-2 border-gold-400 mb-6">
                        <p className="text-sm text-stone-700 leading-relaxed italic">{rec.reason}</p>
                     </div>

                     <button 
                        onClick={() => toggleApply(job.id)}
                        className={`w-full py-3 text-xs font-bold uppercase tracking-widest transition-all ${
                          appliedJobs.has(job.id)
                            ? 'bg-emerald-700 text-white'
                            : 'bg-stone-900 text-white hover:bg-stone-800'
                        }`}
                     >
                        {appliedJobs.has(job.id) ? 'Application Sent' : 'Apply Now'}
                     </button>
                  </div>
                );
            }) : (
                <div className="text-center p-12 bg-ivory-50 border border-stone-200">
                    <p className="text-stone-400 font-serif italic">Upload your profile to see matched opportunities.</p>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
