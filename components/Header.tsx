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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* Logo Section */}
          <div className="flex items-center cursor-pointer gap-4" onClick={() => onNavigate(isLoggedIn ? (isManagement ? AppView.DASHBOARD : AppView.CANDIDATE_PORTAL) : AppView.LANDING)}>
            {/* Custom Logo - Gold & Black Theme */}
            <div className="h-14 w-14 bg-stone-900 rounded-none flex items-center justify-center shadow-lg text-gold-500 border border-gold-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
                </svg>
            </div>
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-serif font-bold text-stone-900 tracking-tight">
                  <span className="text-stone-900">Equatorial</span> <span className="text-gold-600">Talent</span>
                </span>
              </div>
              <span className="text-[0.65rem] uppercase tracking-[0.2em] text-stone-500 font-bold">
                Intelligence
              </span>
            </div>
          </div>

          {/* Navigation - MANAGEMENT (HR / ADMIN) */}
          {isManagement && (
            <nav className="hidden md:flex space-x-10">
              <button onClick={() => onNavigate(AppView.DASHBOARD)} className={`${currentView === AppView.DASHBOARD ? 'text-gold-600 border-b-2 border-gold-600' : 'text-stone-500 hover:text-gold-600'} py-2 text-sm font-bold uppercase tracking-wide transition-colors`}>
                Dashboard
              </button>
              <button onClick={() => onNavigate(AppView.SCANNER)} className={`${currentView === AppView.SCANNER ? 'text-gold-600 border-b-2 border-gold-600' : 'text-stone-500 hover:text-gold-600'} py-2 text-sm font-bold uppercase tracking-wide transition-colors`}>
                Compliance
              </button>
              <button onClick={() => onNavigate(AppView.CANDIDATES)} className={`${currentView === AppView.CANDIDATES ? 'text-gold-600 border-b-2 border-gold-600' : 'text-stone-500 hover:text-gold-600'} py-2 text-sm font-bold uppercase tracking-wide transition-colors`}>
                Records
              </button>
              <button onClick={() => onNavigate(AppView.JOBS)} className={`${currentView === AppView.JOBS ? 'text-gold-600 border-b-2 border-gold-600' : 'text-stone-500 hover:text-gold-600'} py-2 text-sm font-bold uppercase tracking-wide transition-colors`}>
                Jobs
              </button>
              
              {/* Admin Specific Link */}
              {userRole === 'ADMIN' && (
                 <button onClick={() => onNavigate(AppView.ADMIN_PANEL)} className={`${currentView === AppView.ADMIN_PANEL ? 'text-red-700 border-b-2 border-red-700' : 'text-stone-500 hover:text-red-700'} py-2 text-sm font-bold uppercase tracking-wide transition-colors`}>
                   Admin
                 </button>
              )}
            </nav>
          )}

          {/* Navigation - CANDIDATE */}
          {userRole === 'CANDIDATE' && (
            <nav className="hidden md:flex space-x-10">
              <button onClick={() => onNavigate(AppView.CANDIDATE_PORTAL)} className={`${currentView === AppView.CANDIDATE_PORTAL ? 'text-gold-600 border-b-2 border-gold-600' : 'text-stone-500 hover:text-gold-600'} py-2 text-sm font-bold uppercase tracking-wide transition-colors`}>
                My Profile
              </button>
              <button onClick={() => onNavigate(AppView.JOBS)} className={`${currentView === AppView.JOBS ? 'text-gold-600 border-b-2 border-gold-600' : 'text-stone-500 hover:text-gold-600'} py-2 text-sm font-bold uppercase tracking-wide transition-colors`}>
                Find Jobs
              </button>
            </nav>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-6">
            {isLoggedIn && (
               <div className="text-right hidden sm:block leading-tight">
                  <p className="font-serif font-bold text-stone-900 text-lg">
                    {userRole === 'ADMIN' ? 'System Admin' : userRole === 'HR_MANAGER' ? 'HR Director' : 'Candidate'}
                  </p>
                  <p className="text-gold-600 text-xs font-bold uppercase tracking-widest">Logged In</p>
               </div>
            )}
            {isLoggedIn ? (
              <button
                onClick={onLogout}
                className="text-stone-500 hover:text-red-600 text-sm font-bold uppercase tracking-wider border-l border-stone-200 pl-6"
              >
                Sign Out
              </button>
            ) : (
              <div className="flex items-center gap-4">
                 <button
                    onClick={() => onLogin('ADMIN')}
                    className="text-stone-500 hover:text-gold-600 text-xs font-bold uppercase tracking-widest hover:bg-stone-50 px-4 py-2 rounded transition-colors"
                 >
                    System Admin
                 </button>
                 <button
                    onClick={handleScrollToLogin}
                    className="bg-gold-500 text-white px-6 py-3 rounded-none font-bold uppercase tracking-widest text-xs shadow-md hover:bg-gold-600 hover:shadow-lg transition-all"
                 >
                    Client Login
                 </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isLoggedIn && (
        <div className="md:hidden border-t border-stone-200 bg-ivory-50 flex justify-around p-3 overflow-x-auto">
           {isManagement ? (
             <>
                <button onClick={() => onNavigate(AppView.DASHBOARD)} className="p-2 text-xs font-bold uppercase text-stone-600 whitespace-nowrap">Dashboard</button>
                <button onClick={() => onNavigate(AppView.SCANNER)} className="p-2 text-xs font-bold uppercase text-gold-600 whitespace-nowrap">Scan</button>
                <button onClick={() => onNavigate(AppView.JOBS)} className="p-2 text-xs font-bold uppercase text-stone-600 whitespace-nowrap">Jobs</button>
                {userRole === 'ADMIN' && <button onClick={() => onNavigate(AppView.ADMIN_PANEL)} className="p-2 text-xs font-bold uppercase text-red-600 whitespace-nowrap">Admin</button>}
             </>
           ) : (
             <>
                <button onClick={() => onNavigate(AppView.CANDIDATE_PORTAL)} className="p-2 text-xs font-bold uppercase text-stone-600 whitespace-nowrap">Profile</button>
                <button onClick={() => onNavigate(AppView.JOBS)} className="p-2 text-xs font-bold uppercase text-gold-600 whitespace-nowrap">Jobs</button>
             </>
           )}
        </div>
      )}
    </header>
  );
};