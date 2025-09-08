import React from 'react';
import { Interview, Job, CV } from '../types';

interface UpcomingInterviewsProps {
    interviews: Interview[];
    jobs: Job[];
    cvs: CV[];
}

const UpcomingInterviews: React.FC<UpcomingInterviewsProps> = ({ interviews, jobs, cvs }) => {
    const interviewDetails = interviews.map(interview => {
        const job = jobs.find(j => j.id === interview.jobId);
        const candidate = cvs.find(c => c.userId === interview.userId);
        return { ...interview, job, candidate };
    });

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    };

    return (
        <div className="bg-white dark:bg-gray-800/50 p-6 rounded-lg border border-gray-200 dark:border-gray-700/50">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Upcoming Interviews</h3>
            {interviewDetails.length > 0 ? (
                <ul className="space-y-4 max-h-96 overflow-y-auto pr-2">
                    {interviewDetails.map(({ id, dateTime, candidate, job, type, locationOrLink }) => (
                        <li key={id} className="p-3 bg-gray-50 dark:bg-gray-900/30 rounded-md border-l-4 border-blue-500">
                            <p className="font-semibold text-gray-800 dark:text-gray-200">{candidate?.name || 'Unknown Candidate'}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">for {job?.title || 'Unknown Job'}</p>
                            <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mt-2">{formatDate(dateTime)}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 truncate" title={`${type}: ${locationOrLink}`}>{type}: {locationOrLink}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No upcoming interviews scheduled.</p>
            )}
        </div>
    );
};

export default UpcomingInterviews;
