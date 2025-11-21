import React, { useState, useMemo } from 'react';
import { Job, UserRole } from '../types';

interface JobListingsProps {
  userRole: UserRole;
  jobs: Job[];
  onAddJob: (job: Job) => void;
}

export const JobListings: React.FC<JobListingsProps> = ({ userRole, jobs, onAddJob }) => {
  const [showForm, setShowForm] = useState(false);
  const [newJob, setNewJob] = useState<Partial<Job>>({
    title: '',
    company: '',
    location: 'Kampala, Uganda',
    type: 'Full-time',
    description: ''
  });

  // Filter States
  const [filterType, setFilterType] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterCompany, setFilterCompany] = useState('');
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest', 'oldest', 'relevance'

  // Derived Lists for Dropdowns
  const uniqueLocations = Array.from(new Set(jobs.map(j => j.location)));
  const uniqueCompanies = Array.from(new Set(jobs.map(j => j.company)));
  const uniqueTypes = Array.from(new Set(jobs.map(j => j.type)));

  const filteredJobs = useMemo(() => {
    let result = jobs.filter(job => {
      const matchType = filterType ? job.type === filterType : true;
      const matchLocation = filterLocation ? job.location === filterLocation : true;
      const matchCompany = filterCompany ? job.company === filterCompany : true;
      return matchType && matchLocation && matchCompany;
    });

    // Sorting
    result.sort((a, b) => {
        if (sortOrder === 'newest') {
            return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
        } else if (sortOrder === 'oldest') {
            return new Date(a.postedDate).getTime() - new Date(b.postedDate).getTime();
        }
        // For 'relevance', effectively no-op in this view as relevance is calculated in CandidatePortal
        // but we can sort alphabetically as fallback or keep default
        return 0;
    });

    return result;
  }, [jobs, filterType, filterLocation, filterCompany, sortOrder]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newJob.title && newJob.description) {
      onAddJob({
        id: Math.random().toString(36).substr(2, 9),
        title: newJob.title,
        company: newJob.company || 'Unknown',
        location: newJob.location || 'Uganda',
        type: newJob.type as any,
        description: newJob.description,
        requiredSkills: [],
        postedDate: new Date().toISOString()
      });
      setShowForm(false);
      setNewJob({ title: '', company: '', location: 'Kampala, Uganda', type: 'Full-time', description: '' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Job Opportunities</h1>
          <p className="text-gray-500 text-lg mt-1">
            {userRole === 'HR_MANAGER' ? 'Manage recruitment for partner organizations.' : 'Available positions in Uganda.'}
          </p>
        </div>
        {userRole === 'HR_MANAGER' && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-indigo-900 text-white px-6 py-3 rounded-lg text-base font-bold hover:bg-indigo-800 shadow-md hover:shadow-lg transition-all"
          >
            {showForm ? 'Cancel Listing' : '+ Post New Job'}
          </button>
        )}
      </div>

      {/* Job Posting Form (HR Only) */}
      {showForm && userRole === 'HR_MANAGER' && (
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-indigo-100 mb-10 ring-1 ring-indigo-50 animate-fade-in-down">
          <h3 className="font-bold text-xl mb-6 text-indigo-900">Create Job Listing</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                 <input
                    placeholder="e.g. Rig Welder"
                    className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    value={newJob.title}
                    onChange={e => setNewJob({ ...newJob, title: e.target.value })}
                    required
                 />
              </div>
              <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                 <input
                    placeholder="Company Name"
                    className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    value={newJob.company}
                    onChange={e => setNewJob({ ...newJob, company: e.target.value })}
                 />
              </div>
              <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                 <input
                    placeholder="Location"
                    className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    value={newJob.location}
                    onChange={e => setNewJob({ ...newJob, location: e.target.value })}
                 />
              </div>
              <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                 <select
                    className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
                    value={newJob.type}
                    onChange={e => setNewJob({ ...newJob, type: e.target.value as any })}
                 >
                    <option>Full-time</option>
                    <option>Contract</option>
                    <option>Casual</option>
                 </select>
              </div>
            </div>
            <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Description & Requirements</label>
                 <textarea
                    placeholder="Job Description & Requirements"
                    className="border border-gray-300 p-3 rounded-lg w-full h-32 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    value={newJob.description}
                    onChange={e => setNewJob({ ...newJob, description: e.target.value })}
                    required
                 />
            </div>
            <button type="submit" className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-emerald-700 shadow-md transition-all">
              Publish Listing
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
         {/* Sidebar Filters */}
         <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
               <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                  Filters
               </h3>
               
               {/* Job Type Filter */}
               <div className="mb-5">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Job Type</label>
                  <select 
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                     <option value="">All Types</option>
                     {uniqueTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
               </div>

               {/* Location Filter */}
               <div className="mb-5">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Location</label>
                  <select 
                    value={filterLocation}
                    onChange={(e) => setFilterLocation(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                     <option value="">All Locations</option>
                     {uniqueLocations.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
               </div>

               {/* Company Filter */}
               <div className="mb-5">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Company</label>
                  <select 
                    value={filterCompany}
                    onChange={(e) => setFilterCompany(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                     <option value="">All Companies</option>
                     {uniqueCompanies.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
               </div>

               <button 
                  onClick={() => { setFilterType(''); setFilterLocation(''); setFilterCompany(''); }}
                  className="w-full text-sm text-indigo-600 font-semibold hover:underline"
               >
                  Reset Filters
               </button>
            </div>
         </div>

         {/* Listings Column */}
         <div className="lg:col-span-3">
            {/* Sorting Bar */}
            <div className="flex justify-between items-center mb-6">
               <span className="text-sm text-gray-500 font-medium">{filteredJobs.length} Jobs Found</span>
               <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Sort by:</span>
                  <select 
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="border border-gray-300 rounded-lg p-1.5 text-sm focus:ring-indigo-500 outline-none"
                  >
                     <option value="newest">Date (Newest)</option>
                     <option value="oldest">Date (Oldest)</option>
                     <option value="relevance">Relevance Score</option>
                  </select>
               </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 gap-6">
              {filteredJobs.length === 0 ? (
                 <div className="bg-gray-50 rounded-2xl p-10 text-center border border-dashed border-gray-300">
                    <p className="text-gray-500">No jobs match your selected filters.</p>
                 </div>
              ) : (
                 filteredJobs.map(job => (
                    <div key={job.id} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:border-indigo-300 transition-all group">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-900 transition-colors">{job.title}</h3>
                          <div className="flex flex-wrap items-center gap-4 text-base text-gray-500 mt-2">
                            <span className="flex items-center gap-1 font-medium text-gray-700">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-400">
                                <path fillRule="evenodd" d="M4 10a6 6 0 1012 0 6 6 0 00-12 0zm8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 6a1 1 0 00 .867.5zM7.175 16.48a6 6 0 01-2.35-2.35l1.767-.645a4 4 0 001.57 1.57l-1 1.425zM16 7a1 1 0 11-2 0 1 1 0 012 0zM6.8 13.113A5.99 5.99 0 0013.07 14.9l-.8-1.6a4 4 0 01-4.185 1.19l-1.287 1.624z" clipRule="evenodd" />
                              </svg>
                              {job.company}
                            </span>
                            <span className="hidden sm:inline text-gray-300">•</span>
                            <span>{job.location}</span>
                            <span className="hidden sm:inline text-gray-300">•</span>
                            <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">{job.type}</span>
                          </div>
                        </div>
                        {userRole === 'CANDIDATE' && (
                          <button className="bg-white border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-6 py-2 rounded-lg text-sm font-bold transition-colors">
                            Apply Now
                          </button>
                        )}
                      </div>
                      <p className="mt-4 text-gray-600 text-base line-clamp-2 leading-relaxed">{job.description}</p>
                      <div className="mt-6 flex justify-between items-center text-sm text-gray-400 font-medium">
                        <span>Posted: {new Date(job.postedDate).toLocaleDateString()}</span>
                        {sortOrder === 'relevance' && userRole === 'CANDIDATE' && (
                           <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Scan Profile to see Score</span>
                        )}
                      </div>
                    </div>
                 ))
              )}
            </div>
         </div>
      </div>
    </div>
  );
};