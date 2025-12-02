import React, { useState } from 'react';

type AdminTab = 'OVERVIEW' | 'USERS' | 'SETTINGS';

export const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('OVERVIEW');
  const [riskThreshold, setRiskThreshold] = useState(80);
  const [autoArchiveDays, setAutoArchiveDays] = useState(90);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const [hrUsers, setHrUsers] = useState([
    { id: 1, name: 'Sarah Jenkins', email: 's.jenkins@salus.co.ug', status: 'Active', role: 'HR Manager', lastLogin: '2 mins ago' },
    { id: 2, name: 'David Okello', email: 'd.okello@hrbl.co.ug', status: 'Active', role: 'Recruiter', lastLogin: '1 hour ago' },
  ]);

  const systemLogs = [
    { id: 101, action: 'API_CALL_GEMINI', user: 'SYSTEM', status: 'SUCCESS', time: '10:42:01 AM' },
    { id: 102, action: 'CANDIDATE_UPLOAD', user: 'Sarah Jenkins', status: 'SUCCESS', time: '10:40:15 AM' },
    { id: 103, action: 'OSINT_SCAN', user: 'David Okello', status: 'FLAGGED', time: '09:15:22 AM' },
  ];

  const handleExport = () => { /* Mock Export */ };
  const handleAddUser = () => {
    const name = window.prompt("Enter new user name:");
    if (name) {
        setHrUsers([...hrUsers, { id: hrUsers.length + 1, name, email: `${name.toLowerCase()}@example.com`, status: 'Active', role: 'Recruiter', lastLogin: 'Never' }]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8 font-sans">
      <div className="mb-10 flex justify-between items-end border-b border-stone-200 pb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-stone-900">System Administration</h1>
          <p className="text-stone-500 font-light mt-1">Platform Oversight & Global Configuration</p>
        </div>
        <div className="flex space-x-0 border border-stone-300">
          {(['OVERVIEW', 'USERS', 'SETTINGS'] as AdminTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-xs font-bold uppercase tracking-widest transition-all ${
                activeTab === tab 
                  ? 'bg-stone-900 text-gold-500' 
                  : 'bg-white text-stone-500 hover:bg-stone-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'OVERVIEW' && (
        <div className="space-y-8 animate-in slide-in-from-bottom-2">
          {/* System Health */}
          <div className="bg-stone-900 text-white p-10 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gold-500/10 rounded-full blur-3xl"></div>
            <h2 className="text-xl font-serif font-bold mb-8 text-gold-500 border-b border-stone-800 pb-2">
                System Status
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center relative z-10">
              <div className="p-6 bg-stone-800 border border-stone-700">
                  <div className="text-4xl font-bold text-white mb-2">1,204</div>
                  <div className="text-[10px] text-gold-500 font-bold uppercase tracking-widest">Requests Today</div>
              </div>
              <div className="p-6 bg-stone-800 border border-stone-700">
                  <div className="text-4xl font-bold text-emerald-400 mb-2">99.9%</div>
                  <div className="text-[10px] text-gold-500 font-bold uppercase tracking-widest">Uptime</div>
              </div>
              <div className="p-6 bg-stone-800 border border-stone-700">
                  <div className="text-4xl font-bold text-stone-400 mb-2">45ms</div>
                  <div className="text-[10px] text-gold-500 font-bold uppercase tracking-widest">Latency</div>
              </div>
            </div>
          </div>

          {/* Logs */}
          <div className="bg-white border border-stone-200 p-8 shadow-sm">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-serif font-bold text-stone-900">Audit Trail</h2>
                <button onClick={handleExport} className="text-xs text-gold-600 font-bold uppercase tracking-widest hover:text-gold-700">
                  Export CSV
                </button>
             </div>
             <div className="space-y-2">
               {systemLogs.map(log => (
                 <div key={log.id} className="flex items-center justify-between bg-ivory-50 p-4 border border-stone-100 hover:border-gold-300 transition-colors">
                    <div>
                      <div className="flex items-center gap-3">
                          <span className="font-mono text-[10px] text-stone-400">{log.time}</span>
                          <span className="font-bold text-sm text-stone-800">{log.action}</span>
                      </div>
                      <div className="text-xs text-stone-500 mt-1">User: {log.user}</div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-1 uppercase tracking-wider ${log.status === 'SUCCESS' ? 'text-emerald-700 bg-emerald-50' : log.status === 'FLAGGED' ? 'text-red-700 bg-red-50' : 'text-stone-500'}`}>
                      {log.status}
                    </span>
                 </div>
               ))}
             </div>
          </div>
        </div>
      )}

      {activeTab === 'USERS' && (
        <div className="bg-white border border-stone-200 p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-lg font-serif font-bold text-stone-900">User Management</h2>
            <button 
              onClick={handleAddUser}
              className="bg-gold-600 text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-gold-700 transition-colors"
            >
              + Add New User
            </button>
          </div>
          <table className="w-full text-left border-collapse">
              <thead className="bg-ivory-50 text-stone-400 uppercase text-[10px] tracking-widest font-bold">
                <tr>
                  <th className="px-6 py-4 border-b border-stone-200">User</th>
                  <th className="px-6 py-4 border-b border-stone-200">Role</th>
                  <th className="px-6 py-4 border-b border-stone-200">Status</th>
                  <th className="px-6 py-4 border-b border-stone-200">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {hrUsers.map(user => (
                  <tr key={user.id} className="hover:bg-ivory-50">
                    <td className="px-6 py-4 border-b border-stone-100 font-bold text-stone-800">{user.name}</td>
                    <td className="px-6 py-4 border-b border-stone-100 text-stone-600">{user.role}</td>
                    <td className="px-6 py-4 border-b border-stone-100">
                      <span className="bg-emerald-50 text-emerald-800 px-2 py-1 text-[10px] font-bold uppercase tracking-wider">{user.status}</span>
                    </td>
                    <td className="px-6 py-4 border-b border-stone-100">
                      <button className="text-gold-600 font-bold text-xs uppercase hover:underline">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
      )}

      {activeTab === 'SETTINGS' && (
        <div className="bg-white border border-stone-200 p-10 max-w-2xl">
           <h2 className="text-lg font-serif font-bold text-stone-900 mb-8 pb-4 border-b border-stone-100">Global Configuration</h2>

           <div className="space-y-8">
              <div>
                 <label className="block text-xs font-bold text-stone-400 uppercase mb-2 tracking-widest">Risk Sensitivity</label>
                 <input type="range" min="0" max="100" value={riskThreshold} onChange={(e) => setRiskThreshold(parseInt(e.target.value))} className="w-full accent-gold-600" />
                 <div className="text-right text-stone-900 font-bold mt-2">{riskThreshold} / 100</div>
              </div>

              <div>
                 <label className="block text-xs font-bold text-stone-400 uppercase mb-2 tracking-widest">Maintenance Mode</label>
                 <div className="flex items-center gap-4 border border-stone-200 p-4 bg-ivory-50">
                    <input type="checkbox" checked={maintenanceMode} onChange={() => setMaintenanceMode(!maintenanceMode)} className="h-5 w-5 accent-gold-600" />
                    <span className="text-sm font-bold text-stone-700">Suspend System Access</span>
                 </div>
              </div>
           </div>
           
           <div className="mt-10 pt-6 border-t border-stone-100">
              <button onClick={() => window.alert("Saved")} className="bg-stone-900 text-white px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-stone-800">
                 Save Changes
              </button>
           </div>
        </div>
      )}
    </div>
  );
}