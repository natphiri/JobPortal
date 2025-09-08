

import React from 'react';
import { Job, Application, CV, ApplicationStatus } from '../types';
import ApplicantCard from './ApplicantCard';

interface ApplicantListProps {
  job: Job | undefined;
  applicants: Application[];
  allCvs: CV[];
  updateStatus: (applicationId: string, status: ApplicationStatus) => void;
  onScheduleInterview: (application: Application) => void;
  onReviewApplicant: (application: Application) => void;
  activeFilter: ApplicationStatus | 'all';
  onFilterChange: (status: ApplicationStatus | 'all') => void;
  applicantCounts: { [key in ApplicationStatus | 'all']?: number };
}

const ApplicantList: React.FC<ApplicantListProps> = ({ job, applicants, allCvs, updateStatus, onScheduleInterview, onReviewApplicant, activeFilter, onFilterChange, applicantCounts }) => {
  if (!job) {
    return (
      <div className="h-full flex items-center justify-center bg-white dark:bg-gray-800/50 rounded-lg p-8 border border-gray-200 dark:border-gray-700/50 min-h-[400px]">
        <p className="text-gray-500 dark:text-gray-400">Select a job to view applicants.</p>
      </div>
    );
  }

  const applicantDetails = applicants.map(app => {
    const cv = allCvs.find(cv => cv.userId === app.userId);
    return { ...app, cv };
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const statusFilters: (ApplicationStatus | 'all')[] = [
    'all',
    ApplicationStatus.Applied,
    ApplicationStatus.UnderReview,
    ApplicationStatus.Interviewing,
    ApplicationStatus.Offered,
    ApplicationStatus.Rejected,
  ];

  const renderEmptyState = () => {
    if ((applicantCounts.all ?? 0) === 0) {
      return (
        <div className="text-center py-16">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
          <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-gray-100">No applicants yet</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">When candidates apply for this job, they will appear here.</p>
        </div>
      );
    }
    if (applicants.length === 0) {
      return (
         <div className="text-center py-16">
           <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" >
            <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
           </svg>
           <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-gray-100">No applicants match filter</h3>
           <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Try selecting a different status to see more candidates.</p>
         </div>
      );
    }
    return null;
  };


  return (
    <div className="bg-white dark:bg-gray-800/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700/50">
      <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Applicants for {job.title}</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{applicantCounts.all || 0} candidate{applicantCounts.all !== 1 ? 's' : ''} found.</p>
      </div>

      {(applicantCounts.all ?? 0) > 0 && (
          <div className="flex flex-wrap items-center gap-2 py-4">
              {statusFilters.map(status => {
                  const count = applicantCounts[status];
                  if (!count && status !== 'all') return null; // Don't show filter if count is 0, except for 'All'
                  const displayCount = count || 0;

                  const isActive = activeFilter === status;
                  const statusLabel = status === 'all' ? 'All' : status;

                  return (
                      <button
                          key={status}
                          onClick={() => onFilterChange(status)}
                          className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors flex items-center gap-2 ${
                              isActive
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600/50'
                          }`}
                      >
                          {statusLabel}
                          <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${
                              isActive ? 'bg-white/20' : 'bg-gray-200 dark:bg-gray-600'
                          }`}>
                              {displayCount}
                          </span>
                      </button>
                  );
              })}
          </div>
      )}
      
      {applicantDetails.length > 0 ? (
        <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          {applicantDetails.map(app => (
            <ApplicantCard 
                key={app.id} 
                application={app} 
                cv={app.cv}
                updateStatus={updateStatus}
                onScheduleInterview={onScheduleInterview}
                onReview={onReviewApplicant}
            />
          ))}
        </div>
      ) : (
        renderEmptyState()
      )}
    </div>
  );
};

export default ApplicantList;