
import React from 'react';
import { UserRole } from '../types';

interface LandingPageProps {
  onLogin: (role: UserRole) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  return (
    <div className="bg-white min-h-[calc(100vh-80px)] flex flex-col font-sans">
      {/* Hero Section - Reduced Padding */}
      <div className="relative isolate overflow-hidden bg-gray-900 flex-grow">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.100),white)] opacity-20" />
        <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-white shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center" />
        
        <div className="mx-auto max-w-7xl px-6 lg:px-8 pt-10 pb-16 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:py-16">
          <div className="px-6 lg:px-0 lg:pt-4">
            <div className="mx-auto max-w-2xl">
              <div className="max-w-lg">
                <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold text-indigo-400 ring-1 ring-inset ring-indigo-400/30 bg-indigo-400/10 mb-6">
                  Operated by HR Beyond Limits
                </div>
                <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl leading-tight">
                  Intelligent Compliance <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">Workforce & Solutions</span>
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-300">
                  The definitive platform for Manpower Outsourcing, Regulatory Compliance, and Talent Development. We bridge the gap between talent and industry requirements in Uganda's Oil & Gas, Banking, Telecom, and Agriculture sectors.
                </p>
                
                {/* Login Buttons with ID for scrolling */}
                <div id="role-selection" className="mt-8 flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => onLogin('HR_MANAGER')}
                    className="rounded-lg bg-indigo-600 px-8 py-3 text-base font-bold text-white shadow-lg hover:bg-indigo-50 transition-all"
                  >
                    Corporate HR Login
                  </button>
                  <button
                    onClick={() => onLogin('CANDIDATE')}
                    className="rounded-lg bg-emerald-600 px-8 py-3 text-base font-bold text-white shadow-lg hover:bg-emerald-50 transition-all"
                  >
                    Candidate Portal
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-12 sm:mt-16 md:mx-auto md:max-w-2xl lg:mx-0 lg:mt-0 w-full">
            <div className="bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 p-8 shadow-2xl">
               <h3 className="text-white font-semibold text-xl mb-6">The ETI Advantage</h3>
               <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-indigo-900 rounded-lg text-indigo-200 shadow-inner shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-base">Risk Assurance</h4>
                      <p className="text-gray-400 text-sm">Comprehensive due diligence, background checks, and digital footprint analysis ensuring 100% regulatory compliance.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-emerald-900 rounded-lg text-emerald-200 shadow-inner shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-base">Strategic Outsourcing</h4>
                      <p className="text-gray-400 text-sm">Seamless manpower outsourcing, payroll management, and strategic talent development.</p>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* About HRBL Section */}
      <div className="bg-indigo-50 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
             <div className="lg:col-span-5">
                <h2 className="text-indigo-900 font-bold text-3xl mb-4">Operated by <br/>HR Beyond Limits</h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                   Equatorial Talent Intelligence (ETI) is the specialized digital platform of <strong>HR Beyond Limits (HRBL)</strong>.
                </p>
                <p className="text-gray-600 mt-4 leading-relaxed">
                   We are a premier human resource consultancy firm committed to delivering comprehensive 360-degree HR solutions. With a focus on professionalism and excellence, we empower businesses in Uganda to optimize their human capital while navigating complex regulatory landscapes.
                </p>
             </div>
             <div className="lg:col-span-7 mt-8 lg:mt-0 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-indigo-100">
                   <h4 className="font-bold text-indigo-900 text-lg mb-2">HR Consultancy</h4>
                   <p className="text-gray-600 text-sm">Strategic advisory to align your workforce with business goals, ensuring organizational efficiency.</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-indigo-100">
                   <h4 className="font-bold text-indigo-900 text-lg mb-2">Psychometric Assessments</h4>
                   <p className="text-gray-600 text-sm">Data-backed behavioral testing to ensure cultural and role fit for every candidate.</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-indigo-100">
                   <h4 className="font-bold text-indigo-900 text-lg mb-2">Recruitment</h4>
                   <p className="text-gray-600 text-sm">End-to-end talent acquisition, from headhunting executives to mass recruitment.</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-indigo-100">
                   <h4 className="font-bold text-indigo-900 text-lg mb-2">Training</h4>
                   <p className="text-gray-600 text-sm">Tailored training programs to upskill staff in technical and soft skills.</p>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Services Grid - Expanded */}
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600 tracking-wider uppercase">Our Practice Areas</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Beyond Limits, With Integrity.
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Integrating advanced risk management with operational excellence.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              
              {/* Service 1 */}
              <div className="flex flex-col bg-gray-50 p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <dt className="flex items-center gap-x-3 text-lg font-bold leading-7 text-gray-900">
                  <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-200">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                    </svg>
                  </div>
                  Manpower Outsourcing
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">We handle recruitment, contracts, and day-to-day HR administration, reducing your liability and operational overhead.</p>
                </dd>
              </div>

              {/* Service 2 */}
              <div className="flex flex-col bg-gray-50 p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <dt className="flex items-center gap-x-3 text-lg font-bold leading-7 text-gray-900">
                  <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-emerald-600 shadow-lg shadow-emerald-200">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                    </svg>
                  </div>
                  Talent Development
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">Data-driven analysis of skill gaps leading to targeted training programs. From QHSE induction for Oil & Gas to Soft Skills for Banking.</p>
                </dd>
              </div>

              {/* Service 3 */}
              <div className="flex flex-col bg-gray-50 p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <dt className="flex items-center gap-x-3 text-lg font-bold leading-7 text-gray-900">
                  <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-purple-600 shadow-lg shadow-purple-200">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  Compliance & Payroll
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">Advanced compliance with PAU, BOU, and URA regulations. We ensure every staff member is vetted, tax-compliant, and cleared.</p>
                </dd>
              </div>

            </dl>
          </div>
        </div>
      </div>

      {/* Industries Section */}
      <div className="bg-gray-900 py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <h2 className="text-white text-3xl font-bold mb-10 text-center">Sectors We Serve</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                  <div className="p-6 border border-gray-700 rounded-xl hover:bg-gray-800 transition-colors">
                      <div className="text-4xl mb-3">🛢️</div>
                      <h3 className="text-white font-bold">Oil & Gas</h3>
                  </div>
                  <div className="p-6 border border-gray-700 rounded-xl hover:bg-gray-800 transition-colors">
                      <div className="text-4xl mb-3">🏦</div>
                      <h3 className="text-white font-bold">Banking</h3>
                  </div>
                  <div className="p-6 border border-gray-700 rounded-xl hover:bg-gray-800 transition-colors">
                      <div className="text-4xl mb-3">📡</div>
                      <h3 className="text-white font-bold">Telecom</h3>
                  </div>
                  <div className="p-6 border border-gray-700 rounded-xl hover:bg-gray-800 transition-colors">
                      <div className="text-4xl mb-3">🌾</div>
                      <h3 className="text-white font-bold">Agriculture</h3>
                  </div>
              </div>
          </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-950 py-12 border-t border-gray-800">
         <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="text-gray-400 text-sm">
               <p className="font-bold text-white text-lg mb-2">Equatorial Talent Intelligence</p>
               <p>&copy; {new Date().getFullYear()} HR Beyond Limits. All rights reserved.</p>
               <p className="mt-2 text-gray-500">Head Office: Kampala, Uganda</p>
            </div>
            <div className="text-gray-500 text-xs">
               Powered by Gemini AI and Salus International
            </div>
         </div>
      </footer>
    </div>
  );
};
