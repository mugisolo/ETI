
import React from 'react';
import { AppView, UserRole } from '../types';

interface HeaderProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  userRole: UserRole;
  onLogout: () => void;
  onLogin: (role: UserRole) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onNavigate, userRole, onLogout, onLogin }) => {
  const isLoggedIn = userRole !== null;
  const isManagement = userRole === 'HR_MANAGER' || userRole === 'ADMIN';

  const handleScrollToLogin = () => {
    const element = document.getElementById('role-selection');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo Section */}
          <div className="flex items-center cursor-pointer gap-3" onClick={() => onNavigate(isLoggedIn ? (isManagement ? AppView.DASHBOARD : AppView.CANDIDATE_PORTAL) : AppView.LANDING)}>
            {/* Custom Logo */}
            <div className="h-12 w-12 bg-gradient-to-br from-indigo-900 to-indigo-700 rounded-lg flex items-center justify-center shadow-md text-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
            </div>
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-gray-900 tracking-tight">
                  <span className="text-indigo-900">Equatorial</span> <span className="text-emerald-600">Talent</span>
                </span>
              </div>
              <span className="text-[0.7rem] uppercase tracking-widest text-gray-500 font-semibold">
                Intelligence
              </span>
            </div>
          </div>

          {/* Navigation - MANAGEMENT (HR / ADMIN) */}
          {isManagement && (
            <nav className="hidden md:flex space-x-8">
              <button onClick={() => onNavigate(AppView.DASHBOARD)} className={`${currentView === AppView.DASHBOARD ? 'text-indigo-900 border-b-2 border-indigo-900' : 'text-gray-500 hover:text-gray-700'} px-1 py-6 text-base font-medium transition-colors`}>
                Dashboard
              </button>
              <button onClick={() => onNavigate(AppView.SCANNER)} className={`${currentView === AppView.SCANNER ? 'text-indigo-900 border-b-2 border-indigo-900' : 'text-gray-500 hover:text-gray-700'} px-1 py-6 text-base font-medium transition-colors`}>
                Compliance Scan
              </button>
              <button onClick={() => onNavigate(AppView.CANDIDATES)} className={`${currentView === AppView.CANDIDATES ? 'text-indigo-900 border-b-2 border-indigo-900' : 'text-gray-500 hover:text-gray-700'} px-1 py-6 text-base font-medium transition-colors`}>
                Records
              </button>
              <button onClick={() => onNavigate(AppView.JOBS)} className={`${currentView === AppView.JOBS ? 'text-indigo-900 border-b-2 border-indigo-900' : 'text-gray-500 hover:text-gray-700'} px-1 py-6 text-base font-medium transition-colors`}>
                Job Management
              </button>
              
              {/* Admin Specific Link */}
              {userRole === 'ADMIN' && (
                 <button onClick={() => onNavigate(AppView.ADMIN_PANEL)} className={`${currentView === AppView.ADMIN_PANEL ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-500 hover:text-gray-700'} px-1 py-6 text-base font-medium transition-colors`}>
                   System Admin
                 </button>
              )}
            </nav>
          )}

          {/* Navigation - CANDIDATE */}
          {userRole === 'CANDIDATE' && (
            <nav className="hidden md:flex space-x-8">
              <button onClick={() => onNavigate(AppView.CANDIDATE_PORTAL)} className={`${currentView === AppView.CANDIDATE_PORTAL ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-gray-500 hover:text-gray-700'} px-1 py-6 text-base font-medium transition-colors`}>
                My Profile
              </button>
              <button onClick={() => onNavigate(AppView.JOBS)} className={`${currentView === AppView.JOBS ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-gray-500 hover:text-gray-700'} px-1 py-6 text-base font-medium transition-colors`}>
                Find Jobs
              </button>
            </nav>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-5">
            {isLoggedIn && (
               <div className="text-sm text-right hidden sm:block leading-tight">
                  <p className="font-bold text-gray-700">
                    {userRole === 'ADMIN' ? 'System Admin' : userRole === 'HR_MANAGER' ? 'HR Admin' : 'Candidate'}
                  </p>
                  <p className="text-gray-400 text-xs">Logged In</p>
               </div>
            )}
            {isLoggedIn ? (
              <button
                onClick={onLogout}
                className="text-gray-500 hover:text-red-600 text-base font-medium border-l border-gray-200 pl-5"
              >
                Sign Out
              </button>
            ) : (
              <div className="flex items-center gap-4">
                 <button
                    onClick={() => onLogin('ADMIN')}
                    className="text-gray-500 hover:text-gray-900 text-sm font-bold uppercase tracking-wide hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"
                 >
                    System Admin
                 </button>
                 <button
                    onClick={handleScrollToLogin}
                    className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-bold shadow-sm hover:bg-indigo-500 transition-all"
                 >
                    Login
                 </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isLoggedIn && (
        <div className="md:hidden border-t border-gray-100 bg-gray-50 flex justify-around p-3 overflow-x-auto">
           {isManagement ? (
             <>
                <button onClick={() => onNavigate(AppView.DASHBOARD)} className="p-2 text-sm font-semibold text-gray-600 whitespace-nowrap">Dashboard</button>
                <button onClick={() => onNavigate(AppView.SCANNER)} className="p-2 text-sm font-semibold text-indigo-700 whitespace-nowrap">New Scan</button>
                <button onClick={() => onNavigate(AppView.JOBS)} className="p-2 text-sm font-semibold text-gray-600 whitespace-nowrap">Jobs</button>
                {userRole === 'ADMIN' && <button onClick={() => onNavigate(AppView.ADMIN_PANEL)} className="p-2 text-sm font-semibold text-red-600 whitespace-nowrap">Admin</button>}
             </>
           ) : (
             <>
                <button onClick={() => onNavigate(AppView.CANDIDATE_PORTAL)} className="p-2 text-sm font-semibold text-gray-600 whitespace-nowrap">Profile</button>
                <button onClick={() => onNavigate(AppView.JOBS)} className="p-2 text-sm font-semibold text-emerald-600 whitespace-nowrap">Jobs</button>
             </>
           )}
        </div>
      )}
    </header>
  );
};