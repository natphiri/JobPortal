import React from 'react';
import { Application, Job, CV } from '../types';
import CloseIcon from './icons/CloseIcon';
import UserAvatar from './UserAvatar';
import DocumentTextIcon from './icons/DocumentTextIcon';
import PaperClipIcon from './icons/PaperClipIcon';
import XCircleIcon from './icons/XCircleIcon';

interface ApplicantDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: Application | null;
  job: Job | undefined;
  cv: CV | undefined;
  onScheduleInterview: (application: Application) => void;
  onReject: (applicationId: string) => void;
}

const ApplicantDetailModal: React.FC<ApplicantDetailModalProps> = ({ isOpen, onClose, application, job, cv, onScheduleInterview, onReject }) => {
  if (!isOpen || !application) return null;

  const name = cv?.name || 'Unknown Candidate';
  const title = cv?.title || 'No profile available';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
      aria-labelledby="applicant-detail-title"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col m-4"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div>
            <h2 id="applicant-detail-title" className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {name}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Application for <span className="font-medium text-gray-700 dark:text-gray-300">{job?.title || 'Unknown Job'}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Close modal"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </header>

        <main className="flex-grow overflow-y-auto p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Candidate Info */}
          <aside className="lg:col-span-1 lg:border-r lg:pr-8 border-gray-200 dark:border-gray-700">
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
              <UserAvatar name={name} imageUrl={cv?.avatarUrl} className="w-24 h-24 rounded-full flex-shrink-0" />
              <h3 className="mt-4 text-2xl font-bold text-gray-900 dark:text-gray-100">{name}</h3>
              <p className="text-blue-600 dark:text-blue-400 font-medium">{title}</p>
            </div>
            {cv && (
                <div className="mt-6 space-y-6">
                    <div>
                        <h4 className="font-semibold text-gray-700 dark:text-gray-300 text-sm mb-2">Top Skills</h4>
                        <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                        {cv.skills.map(skill => (
                            <span key={skill} className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 text-xs font-medium px-2.5 py-1 rounded-full">{skill}</span>
                        ))}
                        </div>
                    </div>
                     <div>
                        <h4 className="font-semibold text-gray-700 dark:text-gray-300 text-sm mb-2">Experience</h4>
                        <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1 text-sm">
                            {cv.experience.map((exp, index) => <li key={index}>{exp}</li>)}
                        </ul>
                    </div>
                </div>
            )}
          </aside>
          
          {/* Right Column: Application Details */}
          <section className="lg:col-span-2 space-y-8">
            {application.coverLetter && (
                <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                        <DocumentTextIcon className="w-5 h-5 mr-2 text-gray-400" />
                        Cover Letter
                    </h4>
                    <div className="prose prose-sm max-w-none text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700 whitespace-pre-wrap">
                        <p>{application.coverLetter}</p>
                    </div>
                </div>
            )}

            {application.attachments && application.attachments.length > 0 && (
                 <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                        <PaperClipIcon className="w-5 h-5 mr-2 text-gray-400" />
                        Attachments
                    </h4>
                    <ul className="space-y-2">
                        {application.attachments.map((file, index) => (
                            <li key={index} className="flex items-center p-2.5 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700">
                                <span className="text-gray-800 dark:text-gray-200 text-sm font-medium">{file.name}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {!application.coverLetter && (!application.attachments || application.attachments.length === 0) && (
                <div className="text-center py-10">
                    <p className="text-gray-500 dark:text-gray-400">No cover letter or attachments were submitted.</p>
                </div>
            )}
          </section>
        </main>
        
        <footer className="flex justify-end space-x-4 p-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
            <button
              type="button"
              onClick={() => onReject(application.id)}
              className="flex items-center px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700/80 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 hover:border-red-300 dark:hover:border-red-500/50 transition-colors"
            >
               <XCircleIcon className="w-5 h-5 mr-2 text-red-500" />
               Reject
            </button>
            <button
              type="button"
              onClick={() => onScheduleInterview(application)}
              disabled={!cv}
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed shadow-sm"
              title={!cv ? "Candidate profile not available" : ""}
            >
              Schedule Interview
            </button>
          </footer>
      </div>
    </div>
  );
};

export default ApplicantDetailModal;
