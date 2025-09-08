
import React from 'react';
import { Job, Application } from '../types';

interface AnalyticsDashboardProps {
  jobs: Job[];
  applications: Application[];
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ jobs, applications }) => {
  const getApplicationCount = (jobId: string) => {
    return applications.filter(app => app.jobId === jobId).length;
  };

  return (
    <div className="bg-white dark:bg-gray-800/50 p-6 rounded-lg border border-gray-200 dark:border-gray-700/50">
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">Job Posting Performance</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Track key metrics for your active job postings.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3 rounded-l-lg">Job Title</th>
              <th scope="col" className="px-6 py-3 text-center">Views</th>
              <th scope="col" className="px-6 py-3 text-center">Clicks</th>
              <th scope="col" className="px-6 py-3 text-center">Applications</th>
              <th scope="col" className="px-6 py-3 text-center">Click-Through</th>
              <th scope="col" className="px-6 py-3 text-center rounded-r-lg">Conversion</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map(job => {
              const applicationCount = getApplicationCount(job.id);
              const views = job.views ?? 0;
              const clicks = job.clicks ?? 0;
              const clickThroughRate = views > 0 ? ((clicks / views) * 100).toFixed(1) + '%' : 'N/A';
              const conversionRate = clicks > 0 ? ((applicationCount / clicks) * 100).toFixed(1) + '%' : 'N/A';
              
              return (
                <tr key={job.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600/30">
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                    {job.title}
                    <span className="block text-xs text-gray-500 font-normal">{job.location}</span>
                  </th>
                  <td className="px-6 py-4 text-center">{views.toLocaleString()}</td>
                  <td className="px-6 py-4 text-center">{clicks.toLocaleString()}</td>
                  <td className="px-6 py-4 text-center font-semibold text-gray-700 dark:text-gray-300">{applicationCount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-center">{clickThroughRate}</td>
                  <td className="px-6 py-4 text-center font-semibold text-gray-700 dark:text-gray-300">{conversionRate}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {jobs.length === 0 && (
        <div className="text-center py-12 border-t border-gray-200 dark:border-gray-700 mt-4">
            <p className="text-gray-500 dark:text-gray-400">You have no active job postings to analyze.</p>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
