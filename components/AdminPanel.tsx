
import React, { useState } from 'react';

type AdminTab = 'OVERVIEW' | 'USERS' | 'SETTINGS';

export const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('OVERVIEW');
  
  // Mock Settings State
  const [riskThreshold, setRiskThreshold] = useState(80);
  const [autoArchiveDays, setAutoArchiveDays] = useState(90);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Mock data for system management
  const hrUsers = [
    { id: 1, name: 'Sarah Jenkins', email: 's.jenkins@salus.co.ug', status: 'Active', role: 'HR Manager', lastLogin: '2 mins ago' },
    { id: 2, name: 'David Okello', email: 'd.okello@hrbl.co.ug', status: 'Active', role: 'Recruiter', lastLogin: '1 hour ago' },
    { id: 3, name: 'Pending User', email: 'new.hr@partner.com', status: 'Pending Approval', role: '-', lastLogin: '-' },
  ];

  const systemLogs = [
    { id: 101, action: 'API_CALL_GEMINI', user: 'SYSTEM', status: 'SUCCESS', time: '10:42:01 AM' },
    { id: 102, action: 'CANDIDATE_UPLOAD', user: 'Sarah Jenkins', status: 'SUCCESS', time: '10:40:15 AM' },
    { id: 103, action: 'OSINT_SCAN', user: 'David Okello', status: 'FLAGGED', time: '09:15:22 AM' },
    { id: 104, action: 'LOGIN_ADMIN', user: 'SysAdmin', status: 'SUCCESS', time: '08:00:00 AM' },
    { id: 105, action: 'JOB_POST_CREATE', user: 'Sarah Jenkins', status: 'SUCCESS', time: 'Yesterday' },
  ];

  return (
    <div className="max-w-7xl mx-auto p-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Administration</h1>
          <p className="text-gray-500">Platform Oversight & Global Configuration</p>
        </div>
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {(['OVERVIEW', 'USERS', 'SETTINGS'] as AdminTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${
                activeTab === tab 
                  ? 'bg-white text-indigo-900 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'OVERVIEW' && (
        <div className="space-y-8 animate-in slide-in-from-bottom-2">
          {/* System Health / API Usage Stats */}
          <div className="bg-gradient-to-r from-gray-900 to-indigo-900 text-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-lg font-bold mb-6 text-indigo-200 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
                Live Resource Usage (Gemini 2.5 Flash)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="p-6 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10">
                  <div className="text-4xl font-black text-white mb-1">1,204</div>
                  <div className="text-xs text-indigo-200 font-bold uppercase tracking-widest">Requests Today</div>
              </div>
              <div className="p-6 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10">
                  <div className="text-4xl font-black text-emerald-400 mb-1">99.9%</div>
                  <div className="text-xs text-indigo-200 font-bold uppercase tracking-widest">System Uptime</div>
              </div>
              <div className="p-6 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10">
                  <div className="text-4xl font-black text-indigo-400 mb-1">45ms</div>
                  <div className="text-xs text-indigo-200 font-bold uppercase tracking-widest">Avg Latency</div>
              </div>
            </div>
          </div>

          {/* Recent Logs */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                    </svg>
                    System Audit Logs
                </h2>
                <button className="text-sm text-indigo-600 font-bold hover:bg-indigo-50 px-3 py-1 rounded">
                  Export CSV
                </button>
             </div>
             <div className="space-y-3">
               {systemLogs.map(log => (
                 <div key={log.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-100 text-sm hover:bg-gray-100 transition-colors">
                    <div>
                      <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[10px] text-gray-500 bg-gray-200 px-1 rounded">{log.time}</span>
                          <span className="font-bold text-gray-800 text-xs">{log.action}</span>
                      </div>
                      <div className="text-xs text-gray-400 mt-1 pl-1">User: {log.user}</div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${log.status === 'SUCCESS' ? 'bg-emerald-100 text-emerald-700' : log.status === 'FLAGGED' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                      {log.status}
                    </span>
                 </div>
               ))}
             </div>
          </div>
        </div>
      )}

      {activeTab === 'USERS' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 animate-in slide-in-from-right-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-indigo-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
                HR & Partner Account Management
            </h2>
            <button className="text-sm bg-indigo-900 text-white px-4 py-2 rounded-lg font-bold hover:bg-indigo-800 transition-colors shadow-md">
              + Add New User
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3 rounded-tl-lg">User</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Last Login</th>
                  <th className="px-4 py-3 rounded-tr-lg">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {hrUsers.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-bold text-gray-900">{user.name}</div>
                      <div className="text-xs text-gray-400">{user.email}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{user.role}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${user.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{user.lastLogin}</td>
                    <td className="px-4 py-3 flex gap-3">
                      <button className="text-indigo-600 font-bold hover:underline">Edit</button>
                      <button className="text-red-600 font-bold hover:underline">Revoke</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'SETTINGS' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 animate-in slide-in-from-right-2">
           <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.115 1.115 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.212 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Global Configuration
           </h2>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Risk Settings */}
              <div className="space-y-4">
                 <h3 className="text-sm font-bold text-gray-500 uppercase">Compliance & Risk</h3>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">High Risk Threshold (Integrity Score)</label>
                    <div className="flex items-center gap-4">
                       <input 
                          type="range" 
                          min="0" max="100" 
                          value={riskThreshold} 
                          onChange={(e) => setRiskThreshold(parseInt(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                       />
                       <span className="text-lg font-bold text-indigo-900 w-12">{riskThreshold}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Candidates below this score are automatically flagged as High Risk.</p>
                 </div>
              </div>

              {/* System Settings */}
              <div className="space-y-4">
                 <h3 className="text-sm font-bold text-gray-500 uppercase">Data Retention</h3>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Auto-Archive Candidate Data</label>
                    <select 
                       value={autoArchiveDays}
                       onChange={(e) => setAutoArchiveDays(parseInt(e.target.value))}
                       className="block w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                    >
                       <option value={30}>After 30 Days</option>
                       <option value={90}>After 90 Days</option>
                       <option value={180}>After 6 Months</option>
                       <option value={365}>After 1 Year</option>
                    </select>
                 </div>
                 
                 <div className="pt-4">
                    <div className="flex items-center justify-between bg-red-50 p-4 rounded-lg border border-red-100">
                       <div>
                          <p className="text-sm font-bold text-red-800">Maintenance Mode</p>
                          <p className="text-xs text-red-600">Suspend all candidate logins.</p>
                       </div>
                       <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked={maintenanceMode} onChange={() => setMaintenanceMode(!maintenanceMode)} className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                       </label>
                    </div>
                 </div>
              </div>
           </div>
           
           <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
              <button className="bg-indigo-900 text-white px-6 py-3 rounded-lg font-bold hover:bg-indigo-800 transition-colors shadow-md">
                 Save Configuration
              </button>
           </div>
        </div>
      )}
    </div>
  );
}
