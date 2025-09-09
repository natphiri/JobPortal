import React from 'react';
import { Company } from '../types';
import CompanyLogoPlaceholder from './icons/CompanyLogoPlaceholder';
import BriefcaseIcon from './icons/BriefcaseIcon';
import LocationIcon from './icons/LocationIcon';

interface CompanyCardProps {
    company: Company;
    onViewJobs: (company: Company) => void;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company, onViewJobs }) => {
    return (
        <div className="bg-white dark:bg-gray-800/50 p-6 rounded-lg border border-gray-200 dark:border-gray-700/50 group-hover:shadow-md group-hover:border-blue-500 dark:group-hover:border-blue-400 transition-all duration-300 flex flex-col h-full group">
            <div className="flex items-center space-x-4 mb-4">
                <CompanyLogoPlaceholder companyName={company.name} />
                <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{company.name}</h3>
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">{company.jobCount} Open Position{company.jobCount !== 1 ? 's' : ''}</p>
                </div>
            </div>

            <div className="flex-grow space-y-3 text-sm text-gray-600 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-4">
                <div className="flex items-start">
                    <LocationIcon className="w-4 h-4 mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
                    <span className="line-clamp-2">{company.locations.join(', ')}</span>
                </div>
                <div className="flex items-start">
                    <BriefcaseIcon className="w-4 h-4 mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
                    <div>
                        <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">Roles:</p>
                        <ul className="space-y-1 list-disc list-inside">
                            {company.jobTitles.slice(0, 3).map((title, index) => (
                                <li key={index} className="truncate">{title}</li>
                            ))}
                            {company.jobTitles.length > 3 && (
                                <li className="text-gray-500 dark:text-gray-400 font-medium">and {company.jobTitles.length - 3} more...</li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                <button
                    onClick={() => onViewJobs(company)}
                    className="w-full px-4 py-2 rounded-lg font-semibold transition-colors text-sm bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600"
                >
                    View Jobs
                </button>
            </div>
        </div>
    );
};

export default CompanyCard;