import React, { useState, useRef } from 'react';
import { CandidateDocument, Job, JobMatchResult, ComplianceReport, OsintReport } from '../types';
import { matchCandidateToJob, analyzeDocuments, generateOsintReport } from '../services/geminiService';

interface CandidatePortalProps {
  jobs: Job[];
}

export const CandidatePortal: React.FC<CandidatePortalProps> = ({ jobs }) => {
  const [documents, setDocuments] = useState<CandidateDocument[]>([]);
  const [basicScore, setBasicScore] = useState<number | null>(null);
  const [recommendations, setRecommendations] = useState<JobMatchResult[]>([]);
  const [profileInfo, setProfileInfo] = useState<ComplianceReport | null>(null);
  const [osintResult, setOsintResult] = useState<OsintReport | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isOsintProcessing, setIsOsintProcessing] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      // 1. Run Identity/Compliance check first to extract Name and details
      const complianceData = await analyzeDocuments(documents);
      setProfileInfo(complianceData);

      // 2. Process matches sequentially
      const recs: JobMatchResult[] = [];
      
      // Slice to avoid rate limits in demo
      for (const job of jobs.slice(0, 5)) {
        try {
           const result = await matchCandidateToJob(documents, job);
           recs.push(result);
        } catch (e) {
           console.error(`Failed to match job ${job.id}`, e);
        }
      }
      
      setRecommendations(recs.sort((a,b) => b.overallScore - a.overallScore));
      
      // Calculate a simple profile strength based on average match
      if (recs.length > 0) {
         const avg = recs.reduce((acc, curr) => acc + curr.overallScore, 0) / recs.length;
         setBasicScore(Math.round(avg));
      }

    } catch (error) {
      console.error("Analysis failed", error);
      alert("Could not analyze documents. Please try again.");
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
    } catch (error) {
      console.error("OSINT failed", error);
    } finally {
      setIsOsintProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Profile & Brand */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Profile Summary Card */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-white rounded-full mx-auto mb-4 flex items-center justify-center text-indigo-300 border border-indigo-50 shadow-inner relative">
                 {profileInfo ? (
                   <span className="text-3xl font-bold text-indigo-900">{profileInfo.candidateName.charAt(0)}</span>
                 ) : (
                   <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                 )}
                 {profileInfo && (
                    <div className="absolute bottom-0 right-0 bg-emerald-500 h-6 w-6 rounded-full border-4 border-white flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                 )}
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{profileInfo ? profileInfo.candidateName : 'My Profile'}</h2>
              <p className="text-sm text-gray-500 mt-1">
                {profileInfo ? `${profileInfo.districtOfOrigin} • Verified` : 'Upload documents to build your profile'}
              </p>
            </div>

            {profileInfo && (
              <div className="grid grid-cols-2 gap-3 mb-6">
                 <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <p className="text-xs text-gray-500 uppercase">Integrity</p>
                    <p className="font-bold text-indigo-900">{profileInfo.integrityScore}/100</p>
                 </div>
                 <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <p className="text-xs text-gray-500 uppercase">Local Content</p>
                    <p className="font-bold text-indigo-900">{profileInfo.isHostCommunity ? 'Host' : 'National'}</p>
                 </div>
              </div>
            )}

            {/* Document List */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center">
                 <h3 className="text-sm font-bold text-gray-800">My Documents</h3>
                 {documents.length > 0 && (
                    <button 
                      onClick={() => fileInputRef.current?.click()} 
                      className="text-xs text-indigo-600 font-bold hover:underline"
                    >
                      + Add More
                    </button>
                 )}
              </div>
              
              <div className="max-h-48 overflow-y-auto space-y-2 scrollbar-hide">
                {documents.map((doc, i) => (
                  <div key={i} className="flex items-center justify-between text-xs bg-gray-50 p-3 rounded-lg border border-gray-100 group hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-2 overflow-hidden">
                       <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                       <span className="truncate max-w-[120px] font-medium text-gray-700">{doc.name}</span>
                    </div>
                    <button onClick={() => handleRemoveDocument(i)} className="text-gray-400 hover:text-red-500">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                ))}
              </div>
              
              <input type="file" multiple ref={fileInputRef} className="hidden" onChange={handleUpload} />
              
              {documents.length === 0 && (
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-gray-300 p-4 rounded-xl text-gray-500 hover:bg-gray-50 hover:border-gray-400 text-sm font-medium transition-colors flex flex-col items-center"
                >
                  <svg className="w-8 h-8 mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                  Upload CV, ID, Certificates
                </button>
              )}
              
              <button 
                onClick={analyzeProfile}
                disabled={documents.length === 0 || isProcessing}
                className={`w-full py-3 rounded-xl font-bold text-white shadow-md transition-all flex justify-center items-center gap-2
                  ${documents.length === 0 || isProcessing ? 'bg-gray-300 cursor-not-allowed' : 'bg-indigo-900 hover:bg-indigo-800'}
                `}
              >
                 {isProcessing ? (
                   <>
                     <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                     Scanning Profile...
                   </>
                 ) : (
                   'Analyze & Find Matches'
                 )}
              </button>
            </div>
          </div>

          {/* Personal Brand / Self OSINT Section */}
          {profileInfo && (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 animate-in slide-in-from-bottom-4">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Personal Brand Health</h3>
              <p className="text-sm text-gray-500 mb-4">Check your digital footprint and get improvement tips.</p>
              
              {!osintResult ? (
                <div className="text-center p-6 bg-purple-50 rounded-xl border border-purple-100">
                  <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-purple-600">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  </div>
                  <p className="text-sm text-purple-900 font-medium mb-4">Run a scan to see how employers view your online presence.</p>
                  <button 
                    onClick={handleSelfOsint}
                    disabled={isOsintProcessing}
                    className="w-full bg-purple-600 text-white py-2 rounded-lg text-sm font-bold hover:bg-purple-700 transition-colors shadow-sm disabled:opacity-50"
                  >
                    {isOsintProcessing ? 'Scanning...' : 'Check My Brand Health'}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                    <span className="text-sm font-bold text-gray-600">Brand Visibility</span>
                    <span className="text-lg font-extrabold text-purple-600">{osintResult.digitalFootprintScore}/100</span>
                  </div>
                  
                  <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                     <span className="text-sm font-bold text-gray-600">Net Sentiment</span>
                     <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${osintResult.socialMediaSentiment === 'POSITIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {osintResult.socialMediaSentiment}
                     </span>
                  </div>

                  <div className="mt-4 bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                    <h4 className="text-xs font-bold text-indigo-900 uppercase mb-2 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        Improvement Tips
                    </h4>
                    <ul className="space-y-2">
                      {osintResult.improvementTips?.map((tip, idx) => (
                        <li key={idx} className="text-xs text-gray-700 flex gap-2 items-start">
                          <span className="text-emerald-500 font-bold min-w-[10px]">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-gray-100 text-center">
                     <p className="text-xs text-gray-400 mb-2">Need to fix your professional image?</p>
                     <button className="text-indigo-600 text-xs font-bold hover:underline">
                        Contact HRBL Branding Experts →
                     </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Recommendations */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
             <h2 className="text-2xl font-bold text-gray-900">Job Recommendations</h2>
             {recommendations.length > 0 && <span className="text-sm bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-bold">{recommendations.length} Matches</span>}
          </div>
          
          {recommendations.length > 0 ? (
            <div className="space-y-6">
              {recommendations.map((rec, index) => {
                const job = jobs.find(j => j.id === rec.jobId);
                if (!job) return null;
                return (
                  <div key={index} className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-start gap-8 hover:border-indigo-300 transition-colors">
                     <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-xl text-gray-900">{job.title}</h3>
                          <span className="bg-gray-100 text-gray-600 text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wide">{job.type}</span>
                        </div>
                        <p className="text-sm text-gray-500 mb-4 font-medium">{job.company} • {job.location}</p>
                        
                        <div className="mb-4 bg-indigo-50 p-4 rounded-xl text-sm text-indigo-900 border border-indigo-100 relative overflow-hidden">
                           <div className="absolute top-0 right-0 -mt-2 -mr-2 w-8 h-8 bg-indigo-200 rounded-full opacity-20"></div>
                           <span className="font-bold block mb-1 text-xs uppercase tracking-wide text-indigo-400">Fit Analysis</span> 
                           {rec.reason}
                           {(rec.experienceAnalysis || rec.locationAnalysis) && (
                               <div className="mt-3 pt-3 border-t border-indigo-200/50 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                   {rec.experienceAnalysis && 
                                      <div>
                                        <span className="font-bold text-[10px] block text-indigo-700 uppercase mb-1">Experience Match</span>
                                        <span className="text-xs">{rec.experienceAnalysis}</span>
                                      </div>
                                   }
                                   {rec.locationAnalysis && 
                                      <div>
                                        <span className="font-bold text-[10px] block text-indigo-700 uppercase mb-1">Location Match</span>
                                        <span className="text-xs">{rec.locationAnalysis}</span>
                                      </div>
                                   }
                               </div>
                           )}
                        </div>

                        {/* Skills Breakdown */}
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Skill Match</p>
                          <div className="flex flex-wrap gap-2">
                            {rec.matchedSkills.map((skill, i) => (
                              <span key={`m-${i}`} className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                {skill}
                              </span>
                            ))}
                            {rec.missingSkills.map((skill, i) => (
                              <span key={`mis-${i}`} className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-red-50 text-red-600 text-xs font-medium border border-red-100 opacity-70">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                     </div>

                     <div className="flex flex-row md:flex-col items-center gap-6 md:w-32 flex-shrink-0 border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-6 w-full justify-between">
                        <div className="text-center">
                           <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mb-1">Match Score</div>
                           <div className={`text-3xl font-black ${rec.overallScore > 75 ? 'text-emerald-600' : rec.overallScore > 50 ? 'text-yellow-600' : 'text-red-500'}`}>
                              {rec.overallScore}%
                           </div>
                        </div>
                        <button className="text-sm bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 w-full md:w-auto font-bold shadow-lg transform transition-transform hover:-translate-y-0.5">
                           Apply
                        </button>
                     </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-16 text-center">
              <div className="mx-auto h-16 w-16 text-gray-300 mb-4 bg-white rounded-full flex items-center justify-center shadow-sm">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900">Start Your Career Journey</h3>
              <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">Upload your CV and Documents on the left to find matching roles.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};