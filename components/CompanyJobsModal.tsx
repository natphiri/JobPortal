import React, { useEffect, useRef } from 'react';
import { Job, Company } from '../types';
import CloseIcon from './icons/CloseIcon';
import CompanyLogoPlaceholder from './icons/CompanyLogoPlaceholder';
import BriefcaseIcon from './icons/BriefcaseIcon';
import LocationIcon from './icons/LocationIcon';

interface CompanyJobsModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: Company | null;
  jobs: Job[];
  onApply: (job: Job) => void;
  appliedJobIds: Set<string>;
}

const CompanyJobsModal: React.FC<CompanyJobsModalProps> = ({
  isOpen,
  onClose,
  company,
  jobs,
  onApply,
  appliedJobIds,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !company) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
      aria-labelledby="company-jobs-modal-title"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col m-4"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-start justify-between p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center space-x-4">
            <CompanyLogoPlaceholder companyName={company.name} className="w-16 h-16" />
            <div>
              <h2 id="company-jobs-modal-title" className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {company.name}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {company.jobCount} open position{company.jobCount !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="Close modal"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </header>

        <main className="flex-grow overflow-y-auto p-6 space-y-4">
          {jobs.length > 0 ? (
            jobs.map((job) => {
              const isApplied = appliedJobIds.has(job.id);
              return (
                <div key={job.id} className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30 flex items-center justify-between gap-4">
                  <div className="flex-grow min-w-0">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 truncate">{job.title}</h3>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                       <LocationIcon className="w-4 h-4 mr-1.5" />
                       <span>{job.location}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => onApply(job)}
                    disabled={isApplied}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors text-sm flex-shrink-0 ${
                      isApplied
                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:ring-offset-gray-900'
                    }`}
                  >
                    {isApplied ? 'Applied' : 'Apply Now'}
                  </button>
                </div>
              );
            })
          ) : (
            <div className="text-center py-10">
                <BriefcaseIcon className="w-12 h-12 mx-auto text-gray-400" />
                <p className="mt-4 text-gray-500 dark:text-gray-400">This company has no open positions at the moment.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CompanyJobsModal;
