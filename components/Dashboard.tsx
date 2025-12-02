import React from 'react';
import { Candidate } from '../types';

interface DashboardProps {
  candidates: Candidate[];
  onViewProfile: (candidate: Candidate) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ candidates, onViewProfile }) => {
  const totalCandidates = candidates.length;
  const verified = candidates.filter(c => c.status === 'VERIFIED').length;
  const hostCommunity = candidates.filter(c => c.report?.isHostCommunity).length;
  const highRisk = candidates.filter(c => c.report?.riskAssessment.level === 'HIGH' || c.report?.riskAssessment.level === 'CRITICAL').length;

  return (
    <div className="max-w-7xl mx-auto p-8 font-sans">
      <div className="mb-12 border-b border-stone-200 pb-6">
        <h1 className="text-4xl font-serif font-bold text-stone-900">Executive Dashboard</h1>
        <p className="text-lg text-stone-500 mt-2 font-light">Workforce Intelligence & Compliance Overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-8 border border-stone-200 shadow-sm hover:border-gold-400 transition-colors group">
          <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">Total Staff</p>
          <p className="text-5xl font-serif font-bold text-stone-900 mt-4">{totalCandidates}</p>
          <div className="mt-4 text-xs text-gold-600 font-bold uppercase tracking-wide group-hover:text-gold-500">
            Outsourced Personnel
          </div>
        </div>

        <div className="bg-white p-8 border border-stone-200 shadow-sm hover:border-gold-400 transition-colors group">
          <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">Compliance Verified</p>
          <p className="text-5xl font-serif font-bold text-stone-900 mt-4">{verified}</p>
          <div className="w-full bg-stone-100 h-1 mt-6 overflow-hidden">
            <div className="bg-gold-600 h-full" style={{ width: `${totalCandidates ? (verified/totalCandidates)*100 : 0}%` }}></div>
          </div>
        </div>

        <div className="bg-white p-8 border border-stone-200 shadow-sm hover:border-gold-400 transition-colors group">
          <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">Host Community</p>
          <p className="text-5xl font-serif font-bold text-stone-900 mt-4">{hostCommunity}</p>
          <p className="text-xs text-stone-500 mt-4 font-bold uppercase tracking-wide">Local Content Validated</p>
        </div>

        <div className="bg-white p-8 border border-stone-200 shadow-sm hover:border-red-400 transition-colors group">
          <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">Risk Alerts</p>
          <p className="text-5xl font-serif font-bold text-stone-900 mt-4">{highRisk}</p>
          <p className="text-xs text-red-600 mt-4 font-bold uppercase tracking-wide">Assurance Flags</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white border border-stone-200 shadow-lg">
        <div className="p-8 border-b border-stone-100 bg-ivory-50">
          <h3 className="text-xl font-serif font-bold text-stone-900">Recent Verifications</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-stone-100">
            <thead className="bg-white">
              <tr>
                <th className="px-8 py-5 text-left text-xs font-bold text-stone-400 uppercase tracking-widest">Candidate</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-stone-400 uppercase tracking-widest">District</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-stone-400 uppercase tracking-widest">Role</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-stone-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-stone-400 uppercase tracking-widest">Score</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-stone-100">
              {candidates.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-12 text-center text-sm text-stone-500 italic">
                    No candidates processed yet. Start a new audit.
                  </td>
                </tr>
              ) : (
                candidates.slice(0, 5).map((c) => (
                  <tr key={c.id} onClick={() => onViewProfile(c)} className="hover:bg-ivory-50 transition-colors cursor-pointer group">
                    <td className="px-8 py-5 whitespace-nowrap">
                      <div className="font-bold text-stone-900 text-sm group-hover:text-gold-700 transition-colors">{c.name}</div>
                      <div className="text-xs text-stone-400 font-mono mt-1">ID: {c.id}</div>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-sm text-stone-600 font-light">
                      {c.report?.districtOfOrigin || 'N/A'}
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-sm text-stone-600 font-light">
                      {c.role || 'Pending'}
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-[10px] uppercase font-bold tracking-wider ${c.status === 'VERIFIED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-sm text-stone-900 font-bold">
                      {c.report?.integrityScore}/100
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