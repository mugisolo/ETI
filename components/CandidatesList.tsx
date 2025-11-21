import React, { useState } from 'react';
import { Candidate } from '../types';

interface CandidatesListProps {
  candidates: Candidate[];
  onViewProfile: (candidate: Candidate) => void;
}

export const CandidatesList: React.FC<CandidatesListProps> = ({ candidates, onViewProfile }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCandidates = candidates.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Applicants & Staff</h1>
          <p className="text-gray-500 text-lg mt-1">Manage profiles, compliance status, and intelligence reports</p>
        </div>
        <div className="relative w-full sm:w-80">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-base shadow-sm transition-all"
            placeholder="Search Name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Applicant</th>
                <th className="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">District / Host</th>
                <th className="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Risk Profile</th>
                <th className="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">OSINT Status</th>
                <th className="px-8 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCandidates.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-16 text-center text-base text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mb-4 text-gray-300">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                        </svg>
                        <p className="font-medium">{searchTerm ? 'No candidates found matching your search.' : 'No applicants processed yet.'}</p>
                        <p className="text-sm text-gray-400 mt-1">Use the 'Compliance Scan' to add new candidates.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCandidates.map((c) => (
                  <tr key={c.id} onClick={() => onViewProfile(c)} className="hover:bg-gray-50 transition-colors cursor-pointer group">
                    <td className="px-8 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                         <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold mr-3">
                            {c.name.charAt(0)}
                         </div>
                         <div>
                           <div className="font-bold text-gray-900 text-base">{c.name}</div>
                           <div className="text-sm text-gray-500">{c.role}</div>
                         </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-sm text-gray-600">
                      <div>{c.report?.districtOfOrigin || 'N/A'}</div>
                      {c.report?.isHostCommunity && <span className="text-xs text-emerald-600 font-bold">Host Community</span>}
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${c.status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-800' : c.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                       <span className={`text-xs font-bold uppercase px-2 py-1 rounded ${
                          c.report?.riskAssessment.level === 'CRITICAL' || c.report?.riskAssessment.level === 'HIGH' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                       }`}>
                          {c.report?.riskAssessment.level}
                       </span>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-sm">
                       {c.osint ? (
                          <div className="flex items-center gap-2">
                              <span className={`h-2.5 w-2.5 rounded-full ${c.osint.criminalRecordMatch ? 'bg-red-500' : 'bg-emerald-500'}`}></span>
                              <span className="text-gray-700 font-medium">{c.osint.criminalRecordMatch ? 'FLAGS FOUND' : 'Clear'}</span>
                          </div>
                       ) : (
                          <span className="text-gray-400 text-xs italic border border-gray-200 px-2 py-1 rounded">Not Run</span>
                       )}
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={(e) => { e.stopPropagation(); onViewProfile(c); }}
                        className="text-white bg-indigo-900 hover:bg-indigo-800 px-4 py-2 rounded-lg text-xs font-bold shadow-sm transition-all"
                      >
                        View Full Profile
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};