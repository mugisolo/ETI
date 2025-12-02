import React, { useState, useRef } from 'react';
import { Candidate, CandidateDocument } from '../types';
import { generateOsintReport } from '../services/geminiService';

interface CandidateReportProps {
  candidate: Candidate;
  onClose: () => void;
  onUpdateCandidate: (candidate: Candidate) => void;
}

export const CandidateReport: React.FC<CandidateReportProps> = ({ candidate, onClose, onUpdateCandidate }) => {
  const { report, osint } = candidate;
  const [isAnalyzingOsint, setIsAnalyzingOsint] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!report) return null;

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'LOW': return 'bg-emerald-50 text-emerald-800 border-emerald-100';
      case 'MEDIUM': return 'bg-yellow-50 text-yellow-800 border-yellow-100';
      case 'HIGH': return 'bg-orange-50 text-orange-800 border-orange-100';
      case 'CRITICAL': return 'bg-red-50 text-red-800 border-red-100';
      default: return 'bg-stone-50 text-stone-800';
    }
  };

  const handleRunOsint = async () => {
    setIsAnalyzingOsint(true);
    try {
      const context = `Role: ${candidate.role}. District: ${candidate.report?.districtOfOrigin}. Integrity Score: ${candidate.report?.integrityScore}.`;
      const osintReport = await generateOsintReport(candidate.name, context);
      
      const updatedCandidate = {
        ...candidate,
        osint: osintReport
      };
      
      onUpdateCandidate(updatedCandidate);
    } catch (e) {
      console.error("OSINT Failed", e);
    } finally {
      setIsAnalyzingOsint(false);
    }
  };

  const handleStatusChange = (newStatus: 'PENDING' | 'VERIFIED' | 'REJECTED') => {
    onUpdateCandidate({ ...candidate, status: newStatus });
  };

  const handleAddDocument = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        const newDoc: CandidateDocument = {
          name: file.name,
          type: 'hr_upload',
          base64: base64,
          mimeType: file.type
        };
        
        const updatedDocs = [...(candidate.documents || []), newDoc];
        onUpdateCandidate({ ...candidate, documents: updatedDocs });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteDocument = (index: number) => {
    if (!candidate.documents) return;
    const updatedDocs = candidate.documents.filter((_, i) => i !== index);
    onUpdateCandidate({ ...candidate, documents: updatedDocs });
  };

  const downloadDocument = (doc: CandidateDocument) => {
    const link = document.createElement('a');
    link.href = `data:${doc.mimeType};base64,${doc.base64}`;
    link.download = doc.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8 animate-in fade-in zoom-in-95 duration-300 font-sans">
      <div className="mb-6 flex items-center justify-between">
        <button onClick={onClose} className="text-sm text-stone-500 hover:text-gold-600 flex items-center gap-2 font-bold uppercase tracking-wide transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Return to Dashboard
        </button>
        <span className="text-xs font-mono text-stone-400">REF: {candidate.id}</span>
      </div>

      <div className="bg-white shadow-xl border border-stone-200">
        {/* Header - Identity Section - Rich Black & Gold */}
        <div className="bg-stone-900 p-10 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 border-t border-r border-gold-500/20"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative z-10">
            <div className="flex items-center gap-8">
               <div className="h-28 w-28 bg-stone-800 rounded-none flex items-center justify-center border border-gold-500/30 text-4xl font-serif font-bold text-gold-500 shadow-2xl">
                  {candidate.name.charAt(0)}
               </div>
               <div>
                 <h2 className="text-4xl font-serif font-bold tracking-tight text-white">{candidate.name}</h2>
                 <p className="text-gold-400 text-lg mt-1 font-light tracking-wide">{candidate.role}</p>
                 <div className="flex gap-4 mt-4">
                    <span className="px-4 py-1 bg-stone-800 border border-stone-700 text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-stone-300">
                       {report.districtOfOrigin}
                    </span>
                    <span className="px-4 py-1 bg-stone-800 border border-stone-700 text-xs font-bold uppercase tracking-wider text-stone-300">
                       Host Community: <span className={report.isHostCommunity ? 'text-gold-500' : 'text-stone-500'}>{report.isHostCommunity ? 'YES' : 'NO'}</span>
                    </span>
                 </div>
               </div>
            </div>
            <div className="flex flex-col items-end gap-4">
               {/* Application Status Tracker */}
               <div className="flex bg-stone-800 p-1 border border-stone-700">
                  {(['PENDING', 'VERIFIED', 'REJECTED'] as const).map((statusOption) => (
                    <button
                      key={statusOption}
                      onClick={() => handleStatusChange(statusOption)}
                      className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all ${
                        candidate.status === statusOption
                          ? (statusOption === 'VERIFIED' ? 'bg-emerald-700 text-white' : statusOption === 'REJECTED' ? 'bg-red-700 text-white' : 'bg-gold-600 text-white')
                          : 'text-stone-500 hover:text-stone-300'
                      }`}
                    >
                      {statusOption}
                    </button>
                  ))}
               </div>

               <div className={`px-6 py-2 border text-xs font-bold tracking-[0.2em] uppercase ${getRiskColor(report.riskAssessment.level)}`}>
                  {report.riskAssessment.level} RISK
               </div>
            </div>
          </div>
        </div>

        {/* Basic Info Grid */}
        <div className="p-10 bg-ivory-50 border-b border-stone-200">
           <h3 className="text-xs font-bold text-stone-400 uppercase tracking-[0.2em] mb-6">Compliance & Identity Audit</h3>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 border border-stone-200 shadow-sm flex flex-col justify-center items-center relative">
                 <p className="text-[10px] text-stone-400 font-bold uppercase absolute top-4 left-4 tracking-widest">Integrity Score</p>
                 
                 <div className="relative w-32 h-32 flex items-center justify-center mt-4">
                   <svg className="w-full h-full transform -rotate-90">
                     <circle cx="64" cy="64" r="56" stroke="#f5f5f4" strokeWidth="8" fill="none" />
                     <circle 
                        cx="64" cy="64" r="56" 
                        stroke={report.integrityScore > 80 ? '#C5A059' : report.integrityScore > 50 ? '#EAB308' : '#EF4444'} 
                        strokeWidth="8" 
                        fill="none" 
                        strokeDasharray={351} 
                        strokeDashoffset={351 - (351 * report.integrityScore) / 100} 
                        className="transition-all duration-1000 ease-out"
                     />
                   </svg>
                   <div className="absolute text-center">
                      <span className={`text-3xl font-serif font-bold ${report.integrityScore > 80 ? 'text-gold-600' : 'text-stone-600'}`}>{report.integrityScore}</span>
                   </div>
                 </div>
              </div>
              
              <div className="bg-white p-8 border border-stone-200 shadow-sm md:col-span-2">
                 <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">Audit Summary</p>
                 <p className="text-stone-700 mt-4 text-sm leading-relaxed font-light">{report.auditNotes}</p>
                 <div className="mt-6 pt-6 border-t border-stone-100 flex gap-8">
                    <div className="flex items-center gap-3 text-xs font-bold uppercase text-stone-500">
                       <div className={`w-2 h-2 ${report.certificationsValid ? 'bg-gold-500' : 'bg-red-500'}`}></div>
                       Qualifications
                    </div>
                    <div className="flex items-center gap-3 text-xs font-bold uppercase text-stone-500">
                       <div className={`w-2 h-2 ${report.missingDocuments.length === 0 ? 'bg-gold-500' : 'bg-orange-500'}`}></div>
                       Docs Status
                    </div>
                 </div>
              </div>
           </div>

           {/* Sector Compliance Widget */}
           {report.sectorCompliance && (
              <div className="mt-8 bg-white border border-stone-200 p-6">
                  <h4 className="text-xs font-bold text-stone-400 uppercase tracking-[0.2em] mb-4">Sector Specific Compliance: {report.sectorCompliance.sector}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.entries(report.sectorCompliance.details).map(([key, value], idx) => (
                          <div key={idx} className="bg-stone-50 p-4 border border-stone-100">
                              <p className="text-[10px] font-bold text-stone-400 uppercase mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                              <p className="text-sm font-bold text-stone-800">{String(value)}</p>
                          </div>
                      ))}
                  </div>
              </div>
           )}

           {/* PAU National Content Widget */}
           {report.pauCompliance && (
              <div className="mt-8 bg-stone-900 text-white p-6 border border-gold-900 relative overflow-hidden">
                  <div className="absolute right-0 top-0 p-2 opacity-10 text-6xl">🛢️</div>
                  <h4 className="text-xs font-bold text-gold-500 uppercase tracking-[0.2em] mb-4">PAU National Content (Oil & Gas)</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative z-10">
                      <div>
                          <p className="text-[10px] font-bold text-stone-400 uppercase">Supplier Tier</p>
                          <p className="text-xl font-serif font-bold mt-1">{report.pauCompliance.nationalContentTier}</p>
                      </div>
                      <div>
                          <p className="text-[10px] font-bold text-stone-400 uppercase">NOGTR Status</p>
                          <span className={`inline-block mt-1 px-2 py-1 text-[10px] font-bold uppercase ${report.pauCompliance.nogtrRegistered ? 'bg-emerald-900 text-emerald-200 border border-emerald-800' : 'bg-red-900 text-red-200 border border-red-800'}`}>
                             {report.pauCompliance.nogtrRegistered ? 'Registered' : 'Not Found'}
                          </span>
                      </div>
                      <div>
                          <p className="text-[10px] font-bold text-stone-400 uppercase">HSE Readiness</p>
                          <div className="flex gap-1 mt-2">
                             {['OPITO', 'NEBOSH', 'ISO'].map(cert => (
                                <span key={cert} className={`text-[9px] px-1 py-0.5 border ${report.pauCompliance?.hseCertifications.some(c => c.includes(cert)) ? 'border-gold-500 text-gold-500' : 'border-stone-700 text-stone-600'}`}>
                                    {cert}
                                </span>
                             ))}
                          </div>
                      </div>
                  </div>
              </div>
           )}
        </div>

        {/* Document Repository Section */}
        <div className="p-10 bg-white border-b border-stone-200">
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-stone-900 text-gold-500 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-xl font-serif font-bold text-stone-900">Document Repository</h3>
                        <p className="text-xs text-stone-400 font-bold uppercase tracking-wide">Managed HR Attachments</p>
                    </div>
                </div>
                <div>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleAddDocument} 
                        className="hidden" 
                    />
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 bg-stone-100 hover:bg-gold-50 text-stone-800 px-5 py-2 text-xs font-bold uppercase tracking-widest transition-all border border-stone-200"
                    >
                        + Add Document
                    </button>
                </div>
            </div>

            <div className="bg-ivory-50 border border-stone-200">
                {candidate.documents && candidate.documents.length > 0 ? (
                    <ul className="divide-y divide-stone-200">
                        {candidate.documents.map((doc, index) => (
                            <li key={index} className="p-5 flex items-center justify-between hover:bg-white transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className={`h-8 w-8 flex items-center justify-center border ${doc.type === 'hr_upload' ? 'bg-gold-50 border-gold-200 text-gold-700' : 'bg-white border-stone-200 text-stone-400'}`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-stone-800">{doc.name}</p>
                                        <p className="text-[10px] text-stone-500 uppercase tracking-wide mt-0.5">
                                            {doc.type === 'hr_upload' ? 'Internal HR File' : 'Applicant Upload'} • {doc.mimeType.split('/')[1]?.toUpperCase() || 'FILE'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button 
                                        onClick={() => downloadDocument(doc)}
                                        className="text-stone-500 hover:text-gold-600 text-xs font-bold uppercase tracking-wider"
                                    >
                                        Download
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteDocument(index)}
                                        className="text-stone-300 hover:text-red-500"
                                        title="Remove Document"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="p-8 text-center text-stone-500 text-sm italic">
                        No documents attached to this profile.
                    </div>
                )}
            </div>
        </div>

        {/* DEEP OSINT Section */}
        <div className="p-10 bg-white">
           <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-stone-900 text-gold-500 flex items-center justify-center shadow-md">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                </div>
                <div>
                    <h3 className="text-xl font-serif font-bold text-stone-900">Forensic Intelligence</h3>
                    <p className="text-xs text-stone-400 font-bold uppercase tracking-wide">Criminal, Lifestyle & Digital Footprint</p>
                </div>
              </div>
              
              {!osint && (
                 <button 
                    onClick={handleRunOsint}
                    disabled={isAnalyzingOsint}
                    className="bg-stone-900 text-gold-500 border border-stone-900 px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-stone-800 transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
                 >
                    {isAnalyzingOsint ? 'Scanning...' : 'Run Deep Scan'}
                 </button>
              )}
           </div>

           {!osint ? (
              <div className="bg-ivory-50 border border-stone-200 p-12 text-center">
                 <p className="text-stone-500 font-serif text-lg italic">Intelligence data unavailable.</p>
                 <p className="text-xs text-stone-400 mt-2 uppercase tracking-widest">Initiate scan to retrieve forensic data.</p>
              </div>
           ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4 duration-500">
                 
                 {/* Criminal Record */}
                 <div className={`md:col-span-2 p-8 border-l-4 shadow-sm ${osint.criminalRecordMatch ? 'bg-red-50 border-red-800' : 'bg-ivory-50 border-emerald-700'}`}>
                    <div className="flex justify-between items-start mb-4">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-stone-500">Criminal & Sanctions Check</h4>
                        <span className={`px-3 py-1 text-[10px] font-bold uppercase border ${osint.criminalRecordMatch ? 'bg-red-800 text-white border-red-900' : 'bg-emerald-800 text-white border-emerald-900'}`}>
                            {osint.criminalRecordMatch ? 'MATCH FOUND' : 'CLEAN RECORD'}
                        </span>
                    </div>
                    
                    <p className="text-stone-800 leading-relaxed font-serif text-lg">
                        {osint.criminalDetails}
                    </p>
                 </div>

                 {/* Digital Footprint */}
                 <div className="bg-white p-8 border border-stone-200 shadow-sm">
                    <h4 className="text-xs font-bold uppercase text-stone-400 mb-4 tracking-widest">Digital Footprint</h4>
                    <div className="flex items-center justify-between">
                       <div>
                          <div className="text-5xl font-serif font-bold text-stone-900">{osint.digitalFootprintScore}</div>
                          <p className="text-xs text-stone-400 mt-1 uppercase tracking-wider">Visibility Score</p>
                       </div>
                       <div className={`px-3 py-1 border text-[10px] font-bold uppercase ${osint.socialMediaSentiment === 'POSITIVE' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
                          {osint.socialMediaSentiment} Sentiment
                       </div>
                    </div>
                 </div>

                 {/* Lifestyle Analysis */}
                 <div className="bg-white p-8 border border-stone-200 shadow-sm">
                    <h4 className="text-xs font-bold uppercase text-stone-400 mb-4 tracking-widest">Lifestyle Analysis</h4>
                    <p className="text-sm text-stone-600 leading-relaxed">{osint.lifestyleAnalysis}</p>
                 </div>
              </div>
           )}
        </div>
      </div>
    </div>
  );
};