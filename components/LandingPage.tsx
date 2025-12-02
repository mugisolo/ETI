import React from 'react';
import { UserRole } from '../types';

interface LandingPageProps {
  onLogin: (role: UserRole) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  return (
    <div className="bg-ivory-50 min-h-[calc(100vh-80px)] flex flex-col font-sans">
      {/* Hero Section - Premium Black & Gold */}
      <div className="relative isolate overflow-hidden bg-stone-900 flex-grow">
        {/* Subtle texture or gradient overlay */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-stone-800 via-stone-900 to-black opacity-80" />
        
        {/* Gold Accent Line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold-400 via-gold-600 to-gold-400"></div>

        <div className="mx-auto max-w-7xl px-6 lg:px-8 pt-16 pb-24 lg:grid lg:grid-cols-2 lg:gap-x-16 lg:py-24">
          <div className="px-6 lg:px-0 lg:pt-4">
            <div className="mx-auto max-w-2xl">
              <div className="max-w-lg">
                <div className="inline-flex items-center border border-gold-500/30 px-4 py-1 text-xs font-bold uppercase tracking-widest text-gold-400 mb-8 bg-gold-900/10 backdrop-blur-sm">
                  Powered by Salus Int
                </div>
                <h1 className="text-4xl font-serif font-bold tracking-tight text-white sm:text-6xl leading-tight">
                  Intelligent <span className="text-gold-500">Compliance</span> <br/>
                  <span className="text-stone-300">Workforce & Solutions</span>
                </h1>
                <p className="mt-8 text-lg leading-relaxed text-stone-400 font-light">
                  The definitive platform for Manpower Outsourcing, Regulatory Compliance, and Talent Development. Bridging the gap between elite talent and industry requirements in Uganda's <span className="text-white font-medium">Oil & Gas, Banking, Telecom, and Agriculture</span> sectors.
                </p>
                
                {/* Login Buttons with ID for scrolling */}
                <div id="role-selection" className="mt-10 flex flex-col sm:flex-row gap-6">
                  <button
                    onClick={() => onLogin('HR_MANAGER')}
                    className="rounded-none bg-gold-600 px-8 py-4 text-sm font-bold uppercase tracking-widest text-white hover:bg-gold-500 transition-all border border-gold-600 shadow-[0_0_15px_rgba(197,160,89,0.3)]"
                  >
                    Corporate HR Login
                  </button>
                  <button
                    onClick={() => onLogin('CANDIDATE')}
                    className="rounded-none border border-stone-600 bg-transparent px-8 py-4 text-sm font-bold uppercase tracking-widest text-white hover:bg-stone-800 hover:border-gold-500 transition-all"
                  >
                    Candidate Portal
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-16 sm:mt-20 md:mx-auto md:max-w-2xl lg:mx-0 lg:mt-0 w-full">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-10 shadow-2xl relative">
               {/* Decorative corner */}
               <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-gold-500/50"></div>
               <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-gold-500/50"></div>

               <h3 className="text-white font-serif font-semibold text-2xl mb-8 border-b border-white/10 pb-4">The ETI Advantage</h3>
               <div className="space-y-8">
                  <div className="flex items-start gap-6">
                    <div className="p-3 bg-stone-800 rounded-none border border-gold-500/30 text-gold-400 shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-white font-serif font-bold text-lg">Risk Assurance</h4>
                      <p className="text-stone-400 text-sm mt-1 leading-relaxed">Comprehensive due diligence, background checks, and digital footprint analysis ensuring 100% regulatory compliance.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-6">
                    <div className="p-3 bg-stone-800 rounded-none border border-gold-500/30 text-gold-400 shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-white font-serif font-bold text-lg">Strategic Outsourcing</h4>
                      <p className="text-stone-400 text-sm mt-1 leading-relaxed">Seamless manpower outsourcing, payroll management, and strategic talent development.</p>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* About HRBL Section */}
      <div className="bg-white py-24 border-b border-stone-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
             <div className="lg:col-span-5">
                <h2 className="text-stone-900 font-serif font-bold text-4xl mb-6">Operated by <br/><span className="text-gold-600">Human Resource Solutions</span></h2>
                <p className="text-stone-700 text-lg leading-relaxed mb-6 font-light">
                   Equatorial Talent Intelligence (ETI) is the specialized digital platform of <strong>Human Resource Solutions (HRBL)</strong>.
                </p>
                <div className="h-1 w-20 bg-gold-500 mb-6"></div>
                <p className="text-stone-600 leading-relaxed">
                   We are a premier human resource consultancy firm committed to delivering comprehensive 360-degree HR solutions. With a focus on professionalism and excellence, we empower businesses in Uganda to optimize their human capital.
                </p>
             </div>
             <div className="lg:col-span-7 mt-12 lg:mt-0 grid grid-cols-1 sm:grid-cols-2 gap-8">
                {[
                  { title: "HR Consultancy", desc: "Strategic advisory to align your workforce with business goals." },
                  { title: "Psychometric Assessments", desc: "Data-backed behavioral testing to ensure cultural and role fit." },
                  { title: "Recruitment", desc: "End-to-end talent acquisition, from headhunting to mass recruitment." },
                  { title: "Training", desc: "Tailored training programs to upskill staff in technical and soft skills." }
                ].map((item, i) => (
                  <div key={i} className="bg-ivory-50 p-8 border border-stone-200 shadow-sm hover:border-gold-400 transition-colors group">
                    <h4 className="font-serif font-bold text-stone-900 text-xl mb-3 group-hover:text-gold-700 transition-colors">{item.title}</h4>
                    <p className="text-stone-600 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="bg-ivory-100 py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-xs font-bold leading-7 text-gold-600 tracking-[0.2em] uppercase">Our Practice Areas</h2>
            <p className="mt-4 text-4xl font-serif font-bold tracking-tight text-stone-900 sm:text-5xl">
              Beyond Limits, With Integrity.
            </p>
            <p className="mt-6 text-lg leading-8 text-stone-600 font-light">
              Integrating advanced risk management with operational excellence.
            </p>
          </div>
          <div className="mx-auto mt-20 max-w-2xl sm:mt-24 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-12 gap-y-16 lg:max-w-none lg:grid-cols-3">
              
              {/* Service 1 */}
              <div className="flex flex-col bg-white p-10 shadow-lg border-t-4 border-gold-500 hover:-translate-y-2 transition-transform duration-300">
                <dt className="flex items-center gap-x-3 text-xl font-serif font-bold leading-7 text-stone-900">
                  <div className="h-12 w-12 flex items-center justify-center bg-stone-900 text-gold-500">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                    </svg>
                  </div>
                  Manpower Outsourcing
                </dt>
                <dd className="mt-6 flex flex-auto flex-col text-base leading-7 text-stone-600">
                  <p className="flex-auto">We handle recruitment, contracts, and day-to-day HR administration, reducing your liability and operational overhead.</p>
                </dd>
              </div>

              {/* Service 2 */}
              <div className="flex flex-col bg-white p-10 shadow-lg border-t-4 border-gold-500 hover:-translate-y-2 transition-transform duration-300">
                <dt className="flex items-center gap-x-3 text-xl font-serif font-bold leading-7 text-stone-900">
                  <div className="h-12 w-12 flex items-center justify-center bg-stone-900 text-gold-500">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                    </svg>
                  </div>
                  Talent Development
                </dt>
                <dd className="mt-6 flex flex-auto flex-col text-base leading-7 text-stone-600">
                  <p className="flex-auto">Data-driven analysis of skill gaps leading to targeted training programs. From QHSE induction for Oil & Gas to Soft Skills for Banking.</p>
                </dd>
              </div>

              {/* Service 3 */}
              <div className="flex flex-col bg-white p-10 shadow-lg border-t-4 border-gold-500 hover:-translate-y-2 transition-transform duration-300">
                <dt className="flex items-center gap-x-3 text-xl font-serif font-bold leading-7 text-stone-900">
                  <div className="h-12 w-12 flex items-center justify-center bg-stone-900 text-gold-500">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  Compliance & Payroll
                </dt>
                <dd className="mt-6 flex flex-auto flex-col text-base leading-7 text-stone-600">
                  <p className="flex-auto">Advanced compliance with PAU, BOU, and URA regulations. We ensure every staff member is vetted, tax-compliant, and cleared.</p>
                </dd>
              </div>

            </dl>
          </div>
        </div>
      </div>

      {/* Industries Section */}
      <div className="bg-stone-900 py-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <h2 className="text-white text-3xl font-serif font-bold mb-16 text-center border-b border-stone-800 pb-8">Sectors We Serve</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                  {[
                    { icon: "🛢️", name: "Oil & Gas" },
                    { icon: "🏦", name: "Banking" },
                    { icon: "📡", name: "Telecom" },
                    { icon: "🌾", name: "Agriculture" }
                  ].map((sector, i) => (
                    <div key={i} className="p-8 border border-stone-700 hover:border-gold-500 transition-colors bg-stone-800/50 group">
                        <div className="text-4xl mb-6 grayscale group-hover:grayscale-0 transition-all">{sector.icon}</div>
                        <h3 className="text-stone-300 group-hover:text-gold-400 font-serif font-bold text-xl transition-colors">{sector.name}</h3>
                    </div>
                  ))}
              </div>
          </div>
      </div>

      {/* Footer */}
      <footer className="bg-stone-950 py-16 border-t border-gold-900">
         <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="text-stone-500 text-sm">
               <p className="font-serif font-bold text-white text-xl mb-3 tracking-wide">Equatorial Talent Intelligence</p>
               <p>&copy; {new Date().getFullYear()} Human Resource Solutions. All rights reserved.</p>
               <p className="mt-2 text-stone-600">Head Office: Kampala, Uganda</p>
            </div>
            <div className="text-gold-700 text-xs font-bold uppercase tracking-widest border border-gold-900 px-4 py-2">
               Powered by Gemini AI and Salus International
            </div>
         </div>
      </footer>
    </div>
  );
};