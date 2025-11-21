
import React, { useState, useEffect } from 'react';
import { Candidate, OsintReport } from '../types';
import { generateOsintReport } from '../services/geminiService';

interface OsintViewProps {
  candidate: Candidate;
  onClose: () => void;
}

export const OsintView: React.FC<OsintViewProps> = ({ candidate, onClose }) => {
  const [report, setReport] = useState<OsintReport | null>(candidate.osint || null);
  const [loading, setLoading] = useState(!candidate.osint);

  useEffect(() => {
    if (!candidate.osint) {
      // Simulate context from candidate data
      const context = `Role: ${candidate.role}. District: ${candidate.report?.districtOfOrigin}. Integrity Score: ${candidate.report?.integrityScore}.`;
      
      generateOsintReport(candidate.name, context)
        .then(data => {
          setReport(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [candidate]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white p-10 rounded-2xl shadow-2xl flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mb-6"></div>
          <p className="text-xl font-bold text-gray-800">Scanning Global Databases...</p>
          <p className="text-base text-gray-500 mt-2">Checking Interpol, Social Media, & Digital Footprint</p>
        </div>
      </div>
    );
  }

  if (!report) return null;

  return (
    <div className="fixed inset-0 bg-gray-100 z-50 overflow-y-auto font-sans">
      <div className="max-w-6xl mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <span className="bg-purple-600 text-white text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow-md">Top Secret</span>
              OSINT Intelligence Report
            </h1>
            <p className="text-gray-500 mt-2 text-lg">Target: <span className="font-bold text-gray-700">{candidate.name}</span> | ID: {candidate.id}</p>
          </div>
          <button onClick={onClose} className="bg-white border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 font-bold text-gray-700 shadow-sm transition-all">
            Close Report
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Digital Footprint Score */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 md:col-span-1">
             <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6">Digital Visibility</h3>
             <div className="flex items-center justify-center py-2">
               <div className="relative w-40 h-40 flex items-center justify-center">
                 <svg className="w-full h-full transform -rotate-90">
                   <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="10" className="text-gray-100" fill="none" />
                   <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="10" className="text-purple-600" fill="none" strokeDasharray={440} strokeDashoffset={440 - (440 * report.digitalFootprintScore) / 100} />
                 </svg>
                 <span className="absolute text-4xl font-extrabold text-purple-900">{report.digitalFootprintScore}</span>
               </div>
             </div>
             <p className="text-center text-base text-gray-600 font-medium mt-4">Online Presence Score</p>
          </div>

          {/* Criminal Record */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 md:col-span-2">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6">Criminal Background Check</h3>
            <div className={`p-6 rounded-xl border-l-8 border ${report.criminalRecordMatch ? 'bg-red-50 border-red-200 border-l-red-500' : 'bg-emerald-50 border-emerald-200 border-l-emerald-500'}`}>
               <div className="flex items-center gap-4 mb-3">
                  {report.criminalRecordMatch ? (
                    <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  ) : (
                    <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  )}
                  <span className={`font-extrabold text-xl tracking-tight ${report.criminalRecordMatch ? 'text-red-800' : 'text-emerald-800'}`}>
                    {report.criminalRecordMatch ? 'MATCH FOUND' : 'CLEAR RECORD'}
                  </span>
               </div>
               <p className="text-lg text-gray-700 mt-2 font-medium leading-relaxed">{report.criminalDetails}</p>

               {/* Detailed Case Table */}
               {report.criminalRecords && report.criminalRecords.length > 0 && (
                  <div className="mt-6 bg-white rounded-lg border border-red-100 overflow-hidden shadow-sm">
                      <div className="px-4 py-2 bg-red-50 border-b border-red-100">
                         <h4 className="text-xs font-bold text-red-800 uppercase">Forensic Case Details</h4>
                      </div>
                      <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                              <tr>
                                  <th className="px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase">Case ID</th>
                                  <th className="px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase">Offense</th>
                                  <th className="px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase">Court</th>
                                  <th className="px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase">Date</th>
                                  <th className="px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase">Status</th>
                              </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-100">
                              {report.criminalRecords.map((record, idx) => (
                                  <tr key={idx}>
                                      <td className="px-4 py-2 text-sm text-gray-700 font-mono">{record.caseId}</td>
                                      <td className="px-4 py-2 text-sm text-gray-900 font-medium">{record.offense}</td>
                                      <td className="px-4 py-2 text-sm text-gray-600">{record.court}</td>
                                      <td className="px-4 py-2 text-sm text-gray-600">{record.date}</td>
                                      <td className="px-4 py-2 whitespace-nowrap">
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
          </div>

          {/* Lifestyle Analysis */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 md:col-span-2">
             <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6">Lifestyle & Behavioral Analysis</h3>
             <p className="text-lg text-gray-700 leading-relaxed mb-6">{report.lifestyleAnalysis}</p>
             
             <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 flex items-center gap-4">
                <span className="text-sm font-bold text-gray-500 uppercase">Social Media Sentiment</span>
                <div className="flex items-center gap-2">
                   <div className={`h-4 w-4 rounded-full ${report.socialMediaSentiment === 'POSITIVE' ? 'bg-emerald-500' : report.socialMediaSentiment === 'NEGATIVE' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                   <span className="font-bold text-gray-900">{report.socialMediaSentiment}</span>
                </div>
             </div>
          </div>

          {/* Family / PEP */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
             <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6">Family & PEP Check</h3>
             <p className="text-base text-gray-700 leading-relaxed">{report.familyBackground}</p>
          </div>

          {/* Red Flags */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 md:col-span-3">
             <h3 className="text-sm font-bold text-red-500 uppercase tracking-wider mb-6">Identified Risk Vectors</h3>
             {report.redFlags.length > 0 ? (
               <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {report.redFlags.map((flag, i) => (
                   <li key={i} className="flex items-start gap-3 text-red-700 bg-red-50 p-4 rounded-lg text-base font-medium border border-red-100">
                     <span>⚠️</span> {flag}
                   </li>
                 ))}
               </ul>
             ) : (
               <p className="text-emerald-600 text-base font-medium italic bg-emerald-50 p-4 rounded-lg inline-block">No significant risk vectors identified.</p>
             )}
          </div>

        </div>
      </div>
    </div>
  );
};
