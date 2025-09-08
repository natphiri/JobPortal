import React from 'react';
import { ApplicationStatus } from '../types';

interface ApplicationStatusBadgeProps {
  status: ApplicationStatus;
}

const statusStyles: Record<ApplicationStatus, string> = {
  [ApplicationStatus.Applied]: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
  [ApplicationStatus.UnderReview]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
  [ApplicationStatus.Interviewing]: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
  [ApplicationStatus.Offered]: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  [ApplicationStatus.Rejected]: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
};

const ApplicationStatusBadge: React.FC<ApplicationStatusBadgeProps> = ({ status }) => {
  return (
    <span className={`px-2.5 py-1 text-xs font-medium rounded-full inline-block ${statusStyles[status]}`}>
      {status}
    </span>
  );
};

export default ApplicationStatusBadge;
