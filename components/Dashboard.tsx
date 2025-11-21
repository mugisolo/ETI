import React from 'react';
import { Candidate } from '../types';

interface DashboardProps {
  candidates: Candidate[];
}

export const Dashboard: React.FC<DashboardProps> = ({ candidates }) => {
  const totalCandidates = candidates.length;
  const verified = candidates.filter(c => c.status === 'VERIFIED').length;
  const hostCommunity = candidates.filter(c => c.report?.isHostCommunity).length;
  const highRisk = candidates.filter(c => c.report?.riskAssessment.level === 'HIGH' || c.report?.riskAssessment.level === 'CRITICAL').length;

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Workforce Intelligence Dashboard</h1>
        <p className="text-lg text-gray-500 mt-1">Equatorial Talent Intelligence Overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:border-indigo-300 transition-colors">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Total Staff</p>
          <p className="text-4xl font-extrabold text-gray-900 mt-4">{totalCandidates}</p>
          <div className="mt-3 text-sm text-emerald-600 flex items-center font-medium">
            Outsourced Personnel
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:border-indigo-300 transition-colors">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Compliance Verified</p>
          <p className="text-4xl font-extrabold text-indigo-900 mt-4">{verified}</p>
          <div className="w-full bg-gray-100 h-2 rounded-full mt-4 overflow-hidden">
            <div className="bg-indigo-900 h-full rounded-full" style={{ width: `${totalCandidates ? (verified/totalCandidates)*100 : 0}%` }}></div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:border-emerald-300 transition-colors">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Host Community</p>
          <p className="text-4xl font-extrabold text-emerald-600 mt-4">{hostCommunity}</p>
          <p className="text-sm text-gray-400 mt-3 font-medium">Local Content Validated</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:border-red-300 transition-colors">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Risk Alerts</p>
          <p className="text-4xl font-extrabold text-red-600 mt-4">{highRisk}</p>
          <p className="text-sm text-red-400 mt-3 font-medium">Assurance Flags</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-8 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-900">Recent Verifications</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Candidate</th>
                <th className="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">District</th>
                <th className="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Score</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {candidates.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-6 text-center text-base text-gray-500">
                    No candidates processed yet. Start a new audit.
                  </td>
                </tr>
              ) : (
                candidates.slice(0, 5).map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-8 py-5 whitespace-nowrap">
                      <div className="font-bold text-gray-900 text-base">{c.name}</div>
                      <div className="text-sm text-gray-500">ID: {c.id}</div>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-base text-gray-600">
                      {c.report?.districtOfOrigin || 'N/A'}
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-base text-gray-600">
                      {c.role || 'Pending'}
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${c.status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-base text-gray-600 font-medium">
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