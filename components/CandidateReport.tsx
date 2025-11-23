
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
      case 'LOW': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'HIGH': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'CRITICAL': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800';
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
    <div className="max-w-6xl mx-auto p-4 sm:p-8 animate-in fade-in zoom-in-95 duration-300">
      <div className="mb-6 flex items-center justify-between">
        <button onClick={onClose} className="text-sm text-gray-500 hover:text-indigo-900 flex items-center gap-2 font-bold transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Dashboard
        </button>
        <span className="text-xs font-mono text-gray-400">REF: {candidate.id}</span>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        {/* Header - Identity Section */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-gray-900 p-8 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-6">
               <div className="h-24 w-24 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20 text-3xl font-bold shadow-inner">
                  {candidate.name.charAt(0)}
               </div>
               <div>
                 <h2 className="text-3xl font-bold tracking-tight">{candidate.name}</h2>
                 <p className="text-indigo-200 text-lg mt-1">{candidate.role}</p>
                 <div className="flex gap-3 mt-3">
                    <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium backdrop-blur-sm border border-white/10 flex items-center gap-2">
                       <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 2.88-2.88 7.19-5 10-2.13-2.81-5-7.12-5-10z"/></svg>
                       {report.districtOfOrigin}
                    </span>
                    <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium backdrop-blur-sm border border-white/10">
                       Host Community: {report.isHostCommunity ? 'YES' : 'NO'}
                    </span>
                 </div>
               </div>
            </div>
            <div className="flex flex-col items-end gap-3">
               {/* Application Status Tracker */}
               <div className="flex bg-gray-900/50 rounded-lg p-1 backdrop-blur-md border border-gray-700/50">
                  {(['PENDING', 'VERIFIED', 'REJECTED'] as const).map((statusOption) => (
                    <button
                      key={statusOption}
                      onClick={() => handleStatusChange(statusOption)}
                      className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${
                        candidate.status === statusOption
                          ? (statusOption === 'VERIFIED' ? 'bg-emerald-500 text-white shadow-lg' : statusOption === 'REJECTED' ? 'bg-red-500 text-white shadow-lg' : 'bg-yellow-500 text-white shadow-lg')
                          : 'text-gray-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {statusOption}
                    </button>
                  ))}
               </div>

               <div className={`px-5 py-2 rounded-lg border text-sm font-bold tracking-wide uppercase shadow-lg ${getRiskColor(report.riskAssessment.level)}`}>
                  {report.riskAssessment.level} RISK
               </div>
               <p className="text-xs text-gray-400 opacity-80">Verified: {new Date(candidate.timestamp).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Basic Info Grid */}
        <div className="p-8 bg-gray-50 border-b border-gray-200">
           <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Compliance & Identity Audit</h3>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-center items-center relative overflow-hidden">
                 <p className="text-xs text-gray-400 font-bold uppercase absolute top-6 left-6">Integrity Score</p>
                 
                 {/* Circular Gauge integrated from OsintView for better optimization */}
                 <div className="relative w-32 h-32 flex items-center justify-center mt-4">
                   <svg className="w-full h-full transform -rotate-90">
                     <circle cx="64" cy="64" r="56" stroke="#f3f4f6" strokeWidth="8" fill="none" />
                     <circle 
                        cx="64" cy="64" r="56" 
                        stroke={report.integrityScore > 80 ? '#10b981' : report.integrityScore > 50 ? '#eab308' : '#ef4444'} 
                        strokeWidth="8" 
                        fill="none" 
                        strokeDasharray={351} 
                        strokeDashoffset={351 - (351 * report.integrityScore) / 100} 
                        className="transition-all duration-1000 ease-out"
                     />
                   </svg>
                   <div className="absolute text-center">
                      <span className={`text-3xl font-black ${report.integrityScore > 80 ? 'text-emerald-600' : 'text-yellow-600'}`}>{report.integrityScore}</span>
                      <span className="block text-[10px] text-gray-400 font-bold">/ 100</span>
                   </div>
                 </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm md:col-span-2">
                 <p className="text-xs text-gray-400 font-bold uppercase">Audit Summary</p>
                 <p className="text-gray-700 mt-2 text-sm leading-relaxed">{report.auditNotes}</p>
                 <div className="mt-4 pt-4 border-t border-gray-100 flex gap-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                       <div className={`w-2 h-2 rounded-full ${report.certificationsValid ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                       Qualifications Validated
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                       <div className={`w-2 h-2 rounded-full ${report.missingDocuments.length === 0 ? 'bg-emerald-500' : 'bg-orange-500'}`}></div>
                       Documentation Status
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Document Repository Section */}
        <div className="p-8 bg-white border-b border-gray-200">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Document Repository</h3>
                        <p className="text-xs text-gray-500 font-medium">Managed Files & HR Attachments</p>
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
                        className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-all"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Add Document
                    </button>
                </div>
            </div>

            <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                {candidate.documents && candidate.documents.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                        {candidate.documents.map((doc, index) => (
                            <li key={index} className="p-4 flex items-center justify-between hover:bg-white transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${doc.type === 'hr_upload' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-200 text-gray-500'}`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">{doc.name}</p>
                                        <p className="text-xs text-gray-500">
                                            {doc.type === 'hr_upload' ? 'Uploaded by HR' : 'Applicant Upload'} • {doc.mimeType.split('/')[1]?.toUpperCase() || 'FILE'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={() => downloadDocument(doc)}
                                        className="text-indigo-600 hover:text-indigo-800 p-2 rounded-lg hover:bg-indigo-50 text-xs font-bold"
                                    >
                                        Download
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteDocument(index)}
                                        className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50"
                                        title="Remove Document"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                        </svg>
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="p-8 text-center text-gray-500 text-sm">
                        No documents attached to this profile yet.
                    </div>
                )}
            </div>
        </div>

        {/* DEEP OSINT Section */}
        <div className="p-8 bg-white">
           <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-purple-900 text-white flex items-center justify-center shadow-lg shadow-purple-200">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-900">Deep Forensic OSINT</h3>
                    <p className="text-xs text-gray-500 font-medium">Criminal, Lifestyle & Digital Footprint Analysis</p>
                </div>
              </div>
              
              {!osint && (
                 <button 
                    onClick={handleRunOsint}
                    disabled={isAnalyzingOsint}
                    className="bg-purple-900 text-white px-6 py-3 rounded-lg font-bold hover:bg-purple-800 transition-all shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                    {isAnalyzingOsint ? (
                       <>
                          <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                          Running Deep Scan...
                       </>
                    ) : (
                       'Run Deep Intelligence Scan'
                    )}
                 </button>
              )}
           </div>

           {!osint ? (
              <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-12 text-center">
                 <p className="text-gray-500 font-medium">No Deep Intelligence data available for this candidate.</p>
                 <p className="text-sm text-gray-400 mt-1">Run a scan to check Criminal Records, Digital Footprint, and Lifestyle Analysis.</p>
              </div>
           ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4 duration-500">
                 
                 {/* Criminal Record - Main Focus */}
                 <div className={`md:col-span-2 p-6 rounded-xl border-l-4 shadow-sm ${osint.criminalRecordMatch ? 'bg-red-50 border-red-500' : 'bg-emerald-50 border-emerald-500'}`}>
                    <div className="flex justify-between items-start mb-4">
                        <h4 className="text-sm font-bold uppercase text-gray-600">Criminal & Sanctions Check</h4>
                        <span className={`px-3 py-1 rounded text-xs font-bold uppercase ${osint.criminalRecordMatch ? 'bg-red-200 text-red-800' : 'bg-emerald-200 text-emerald-800'}`}>
                            {osint.criminalRecordMatch ? 'MATCH FOUND' : 'CLEAN RECORD'}
                        </span>
                    </div>
                    
                    <p className="text-base text-gray-800 leading-relaxed font-medium">
                        {osint.criminalDetails}
                    </p>
                    <div className="mt-3 text-xs text-gray-400 flex gap-4 mb-4">
                        <span>• Interpol Check</span>
                        <span>• Police Watchlist</span>
                        <span>• AML/Sanctions</span>
                        <span>• Court Records</span>
                    </div>

                    {/* Detailed Case Table */}
                    {osint.criminalRecords && osint.criminalRecords.length > 0 && (
                        <div className="mt-4 bg-white rounded-lg border border-red-100 overflow-hidden shadow-inner">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-red-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-red-800 uppercase tracking-wider">Case ID</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-red-800 uppercase tracking-wider">Offense</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-red-800 uppercase tracking-wider">Court / Jurisdiction</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-red-800 uppercase tracking-wider">Date</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-red-800 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {osint.criminalRecords.map((record, idx) => (
                                        <tr key={idx} className="hover:bg-red-50/30">
                                            <td className="px-4 py-3 text-sm text-gray-700 font-mono">{record.caseId}</td>
                                            <td className="px-4 py-3 text-sm text-gray-900 font-medium">{record.offense}</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">{record.court}</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">{record.date}</td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${
                                                    record.status === 'Convicted' ? 'bg-red-100 text-red-800' :
                                                    record.status === 'Wanted' ? 'bg-orange-100 text-orange-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {record.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                 </div>

                 {/* Digital Footprint */}
                 <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
                    <div>
                        <h4 className="text-xs font-bold uppercase text-gray-500 mb-3">Digital Footprint</h4>
                        <div className="flex items-center justify-between">
                           <div>
                              <div className="text-4xl font-extrabold text-gray-900">{osint.digitalFootprintScore}<span className="text-sm font-normal text-gray-400">/100</span></div>
                              <p className="text-xs text-gray-500 mt-1">Online Visibility Score</p>
                           </div>
                           <div className={`px-3 py-1 rounded text-xs font-bold uppercase ${osint.socialMediaSentiment === 'POSITIVE' ? 'bg-emerald-100 text-emerald-800' : osint.socialMediaSentiment === 'NEGATIVE' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                              {osint.socialMediaSentiment} Sentiment
                           </div>
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-xs text-gray-500"><strong>Political Exposure (PEP):</strong> {osint.familyBackground}</p>
                    </div>
                 </div>

                 {/* Lifestyle Analysis */}
                 <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h4 className="text-xs font-bold uppercase text-indigo-900 mb-3">Lifestyle & Behavioral Analysis</h4>
                    <p className="text-sm text-gray-700 leading-relaxed">{osint.lifestyleAnalysis}</p>
                 </div>

                 {/* Red Flags */}
                 {osint.redFlags.length > 0 && (
                   <div className="md:col-span-2 bg-red-50 p-6 rounded-xl border border-red-200">
                      <h4 className="text-xs font-bold uppercase text-red-800 mb-3">Identified Risk Vectors</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {osint.redFlags.map((flag, i) => (
                           <div key={i} className="flex items-center gap-2 text-sm text-red-900 font-medium bg-white/50 p-2 rounded border border-red-100">
                              <span className="text-red-500 text-lg">•</span> {flag}
                           </div>
                        ))}
                      </div>
                   </div>
                 )}

                 {/* Brand Improvement Tips - NEW SECTION */}
                 {osint.improvementTips && osint.improvementTips.length > 0 && (
                   <div className="md:col-span-2 mt-4 bg-indigo-50 p-6 rounded-xl border border-indigo-200 shadow-sm">
                      <h4 className="text-sm font-bold uppercase text-indigo-900 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        Brand Improvement Advice (Candidate Action Plan)
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {osint.improvementTips.map((tip, i) => (
                           <div key={i} className="flex gap-3 bg-white p-4 rounded-lg border border-indigo-100 shadow-sm items-start hover:shadow-md transition-shadow">
                              <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">
                                {i + 1}
                              </span>
                              <p className="text-sm text-gray-700 leading-snug">{tip}</p>
                           </div>
                        ))}
                      </div>
                      <p className="text-xs text-indigo-400 mt-4 font-medium italic">
                        * Share these insights with the candidate to help them improve their professional digital footprint and employability.
                      </p>
                   </div>
                 )}
              </div>
           )}
        </div>
      </div>
    </div>
  );
};
