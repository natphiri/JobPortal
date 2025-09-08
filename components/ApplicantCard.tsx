import React from 'react';
import { Application, CV, ApplicationStatus } from '../types';
import ApplicationStatusBadge from './ApplicationStatusBadge';
import UserAvatar from './UserAvatar';
import EyeIcon from './icons/EyeIcon';
import XCircleIcon from './icons/XCircleIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';


interface ApplicantCardProps {
  application: Application;
  cv?: CV; // CV is optional as it might not be found in the mock data
  updateStatus: (applicationId: string, status: ApplicationStatus) => void;
  onScheduleInterview: (application: Application) => void;
  onReview: (application: Application) => void;
}

const ApplicantCard: React.FC<ApplicantCardProps> = ({ application, cv, updateStatus, onScheduleInterview, onReview }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  const name = cv?.name || 'Unknown Candidate';
  const title = cv?.title || 'No profile available';

  const renderActions = () => {
    const rejectButton = (
        <button
          onClick={() => updateStatus(application.id, ApplicationStatus.Rejected)}
          className="flex items-center px-3 py-1.5 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700/80 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-red-50 dark:hover:bg-red-900/30 hover:border-red-300 dark:hover:border-red-500/50 transition-colors whitespace-nowrap"
        >
           <XCircleIcon className="w-4 h-4 mr-1.5 text-red-500" />
           Reject
        </button>
    );

    switch (application.status) {
      case ApplicationStatus.Applied:
        return (
          <>
            <button
              onClick={() => {
                updateStatus(application.id, ApplicationStatus.UnderReview);
                onReview(application);
              }}
              className="flex items-center px-3 py-1.5 text-sm font-semibold text-blue-900 bg-[#b0ceff] rounded-md hover:bg-[#9ac0f2] transition-colors whitespace-nowrap"
            >
              <EyeIcon className="w-4 h-4 mr-1.5" />
              Review
            </button>
            {rejectButton}
          </>
        );
      case ApplicationStatus.UnderReview:
        return (
          <>
            <button
              onClick={() => onScheduleInterview(application)}
              disabled={!cv}
              className="px-3 py-1.5 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed whitespace-nowrap"
              title={!cv ? "Candidate profile not available" : ""}
            >
              Schedule Interview
            </button>
            {rejectButton}
          </>
        );
      case ApplicationStatus.Interviewing:
        return (
           <>
            <button
              onClick={() => updateStatus(application.id, ApplicationStatus.Offered)}
              className="flex items-center px-3 py-1.5 text-sm font-semibold text-white bg-[#5294ff] rounded-md hover:bg-[#4385f5] transition-colors whitespace-nowrap"
            >
               <CheckCircleIcon className="w-4 h-4 mr-1.5" />
               Make Offer
            </button>
            {rejectButton}
          </>
        );
      case ApplicationStatus.Offered:
      case ApplicationStatus.Rejected:
      default:
        return null; // No actions for final states
    }
  };

  return (
    <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-center gap-4 flex-grow min-w-0">
        <UserAvatar
            name={name}
            imageUrl={cv?.avatarUrl}
            className="w-12 h-12 rounded-full flex-shrink-0"
        />
        <div className="min-w-0">
          <h3 className="font-bold text-gray-900 dark:text-gray-100 truncate">{name}</h3>
          <p className="text-sm text-blue-600 dark:text-blue-400 font-medium truncate">{title}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Applied: {formatDate(application.date)}</p>
        </div>
      </div>
      <div className="flex flex-col items-stretch sm:items-end w-full sm:w-auto flex-shrink-0 pt-4 sm:pt-0 mt-4 sm:mt-0 border-t sm:border-none border-gray-200 dark:border-gray-700">
        <ApplicationStatusBadge status={application.status} />
        <div className="flex items-center justify-end sm:justify-start space-x-2 mt-2 w-full sm:w-auto">
            {renderActions()}
        </div>
      </div>
    </div>
  );
};

export default ApplicantCard;