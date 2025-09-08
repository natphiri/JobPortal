import React from 'react';
import { Job } from '../types';
import BriefcaseIcon from './icons/BriefcaseIcon';
import LocationIcon from './icons/LocationIcon';
import BookmarkIcon from './icons/BookmarkIcon';

interface JobCardProps {
  job: Job;
  onApply?: (job: Job) => void;
  isApplied?: boolean;
  onSave?: (jobId: string) => void;
  isSaved?: boolean;
}

const JobCard: React.FC<JobCardProps> = ({ job, onApply, isApplied, onSave, isSaved }) => {
  return (
    <div className="bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50 group-hover:shadow-lg group-hover:border-blue-500 dark:group-hover:border-blue-500 transition-all duration-300 flex flex-col h-full group relative">
       {onSave && (
        <button 
          onClick={(e) => { e.stopPropagation(); onSave(job.id); }}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors z-10"
          aria-label={isSaved ? "Unsave job" : "Save job"}
        >
          <BookmarkIcon filled={isSaved} className={`w-5 h-5 ${isSaved ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400'}`} />
        </button>
      )}
      <div className="flex-grow pr-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{job.title}</h3>
        
        <div className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center">
                <BriefcaseIcon className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" />
                <span>{job.company}</span>
            </div>
            <div className="flex items-center">
                <LocationIcon className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" />
                <span>{job.location}</span>
            </div>
        </div>

        <p className="text-gray-600 dark:text-gray-400 mt-4 text-sm leading-relaxed line-clamp-3">
          {job.description}
        </p>
      </div>
      
      {onApply && (
        <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700/50">
          <button 
            onClick={() => onApply(job)}
            disabled={isApplied}
            className={`w-full px-4 py-2 rounded-lg font-semibold transition-colors text-sm ${
              isApplied
                ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:ring-offset-gray-900'
            }`}
          >
            {isApplied ? 'Applied' : 'Apply Now'}
          </button>
        </div>
      )}
    </div>
  );
};

export default JobCard;