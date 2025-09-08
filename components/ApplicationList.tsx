import React, { useMemo } from 'react';
import { Application, Job, ApplicationStatus } from '../types';

interface ApplicationListProps {
  applications: Application[];
  jobs: Job[];
}

const statusOrder: ApplicationStatus[] = [
  ApplicationStatus.Applied,
  ApplicationStatus.UnderReview,
  ApplicationStatus.Interviewing,
  ApplicationStatus.Offered,
  ApplicationStatus.Rejected,
];

const statusStyles: Record<ApplicationStatus, { dot: string; }> = {
  [ApplicationStatus.Applied]: { dot: 'bg-blue-500' },
  [ApplicationStatus.UnderReview]: { dot: 'bg-yellow-500' },
  [ApplicationStatus.Interviewing]: { dot: 'bg-purple-500' },
  [ApplicationStatus.Offered]: { dot: 'bg-green-500' },
  [ApplicationStatus.Rejected]: { dot: 'bg-red-500' },
};


const ApplicationList: React.FC<ApplicationListProps> = ({ applications, jobs }) => {

  const applicationsByStatus = useMemo(() => {
    // Initialize with all possible statuses to maintain column order
    const grouped: { [key in ApplicationStatus]?: Application[] } = {};
    for (const status of statusOrder) {
        grouped[status] = [];
    }
    
    // Group and sort applications
    applications.forEach(app => {
      if (grouped[app.status]) {
        grouped[app.status]!.push(app);
      }
    });

    // Sort applications within each group by date
    for (const status in grouped) {
        grouped[status as ApplicationStatus]!.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    return grouped;
  }, [applications]);

  if (applications.length === 0) {
    return (
      <div className="text-center py-16">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">No Applications Yet</h3>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          When you apply for a job, your progress will be tracked here.
        </p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="flex space-x-4 overflow-x-auto pb-4 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8" style={{ scrollbarWidth: 'thin' }}>
      {statusOrder.map(status => {
        const appsInStatus = applicationsByStatus[status] || [];
        const isRejectedColumn = status === ApplicationStatus.Rejected;
        
        return (
          <div key={status} className={`flex-shrink-0 w-80 ${isRejectedColumn ? 'opacity-75' : ''}`}>
            <div className="flex flex-col h-full bg-gray-100 dark:bg-gray-800/60 rounded-xl">
              <div className="flex items-center justify-between p-3 border-b-2 border-gray-200 dark:border-gray-700/60">
                <div className="flex items-center space-x-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${statusStyles[status].dot}`}></span>
                    <h3 className="font-semibold text-sm text-gray-800 dark:text-gray-200">{status}</h3>
                </div>
                <span className="text-xs font-bold bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full">
                    {appsInStatus.length}
                </span>
              </div>
              
              <div className="flex-grow p-3 space-y-3 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 300px)' }}>
                {appsInStatus.length > 0 ? (
                  appsInStatus.map(app => {
                    const job = jobs.find(j => j.id === app.jobId);
                    if (!job) return null;
                    return (
                      <div key={app.id} className="bg-white dark:bg-gray-700/80 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600/80 hover:shadow-md hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-200">
                        <h4 className="font-bold text-sm text-gray-900 dark:text-gray-100 truncate">{job.title}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{job.company}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 pt-2 border-t border-gray-100 dark:border-gray-600">
                          Applied: {formatDate(app.date)}
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-8 px-4">
                    <p>No applications in this stage.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ApplicationList;
