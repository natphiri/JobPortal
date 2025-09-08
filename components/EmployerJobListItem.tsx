import React from 'react';
import { Job } from '../types';
import BriefcaseIcon from './icons/BriefcaseIcon';

interface EmployerJobListItemProps {
  job: Job;
  applicantCount: number;
  isSelected: boolean;
  onClick: () => void;
}

const EmployerJobListItem: React.FC<EmployerJobListItemProps> = ({ job, applicantCount, isSelected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-lg border transition-colors duration-200 ${
        isSelected
          ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500 dark:border-blue-700 shadow-sm'
          : 'bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-800'
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-grow min-w-0">
          <h3 className={`font-semibold truncate ${isSelected ? 'text-blue-700 dark:text-blue-300' : 'text-gray-800 dark:text-gray-200'}`}>{job.title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{job.location}</p>
        </div>
        <div className={`flex-shrink-0 ml-4 px-2.5 py-1 text-xs font-bold rounded-full ${isSelected ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
          {applicantCount}
        </div>
      </div>
    </button>
  );
};

export default EmployerJobListItem;
