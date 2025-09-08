import React, { useState, useEffect, useRef } from 'react';
import { Application, Job, CV, Interview, InterviewType } from '../types';
import { generateIcsFile } from '../utils/calendar';
import CloseIcon from './icons/CloseIcon';
import Spinner from './Spinner';

interface InterviewSchedulerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (interviewData: Omit<Interview, 'id'>) => void;
  application: Application | null;
  job: Job | undefined;
  cv: CV | undefined;
}

const InterviewSchedulerModal: React.FC<InterviewSchedulerModalProps> = ({ isOpen, onClose, onSchedule, application, job, cv }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('09:00');
  const [type, setType] = useState<InterviewType>(InterviewType.Virtual);
  const [locationOrLink, setLocationOrLink] = useState('');
  const [notes, setNotes] = useState('');
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledInterview, setScheduledInterview] = useState<Interview | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reset form when modal opens
    if (isOpen) {
      const today = new Date();
      today.setDate(today.getDate() + 1); // Default to tomorrow
      setDate(today.toISOString().split('T')[0]);
      setTime('09:00');
      setType(InterviewType.Virtual);
      setLocationOrLink('');
      setNotes('');
      setIsScheduled(false);
      setScheduledInterview(null);
    }
  }, [isOpen]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!application || !job || !cv) return;

    const interviewData = {
      applicationId: application.id,
      jobId: job.id,
      userId: cv.userId,
      dateTime: new Date(`${date}T${time}`).toISOString(),
      type,
      locationOrLink,
      notes,
    };
    onSchedule(interviewData);
    setScheduledInterview({ ...interviewData, id: `int-temp-${Date.now()}`});
    setIsScheduled(true);
  };

  const handleAddToCalendar = () => {
    if (scheduledInterview && job && cv) {
      generateIcsFile(scheduledInterview, job, cv);
    }
  };

  if (!isOpen || !application || !job || !cv) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col m-4"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {isScheduled ? 'Interview Scheduled' : `Schedule Interview with ${cv.name}`}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">for {job.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Close modal"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </header>

        {isScheduled ? (
            <div className="p-8 text-center">
                <svg className="w-16 h-16 mx-auto text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Success!</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">An interview with {cv.name} has been confirmed and their status has been updated to 'Interviewing'.</p>
                <button
                    onClick={handleAddToCalendar}
                    className="mt-6 inline-flex items-center px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md font-semibold text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition"
                >
                    <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M5.25 12.223V8.887a.75.75 0 011.5 0v3.336l2.404 1.603a.75.75 0 01-.707 1.296l-2.75-1.833A.75.75 0 015.25 12.223z" /><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM2 10a8 8 0 1116 0 8 8 0 01-16 0z" clipRule="evenodd" /></svg>
                    Add to Calendar
                </button>
                 <button
                    type="button"
                    onClick={onClose}
                    className="mt-4 w-full px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600/50"
                >
                    Close
                </button>
            </div>
        ) : (
            <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto">
            <div className="p-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="interview-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                    <input type="date" id="interview-date" value={date} onChange={e => setDate(e.target.value)} required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent" />
                </div>
                <div>
                    <label htmlFor="interview-time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Time</label>
                    <input type="time" id="interview-time" value={time} onChange={e => setTime(e.target.value)} required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent" />
                </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Interview Type</label>
                    <div className="flex space-x-2 rounded-lg bg-gray-100 dark:bg-gray-700 p-1">
                        <button type="button" onClick={() => setType(InterviewType.Virtual)} className={`w-full py-2 text-sm font-medium rounded-md transition-colors ${type === InterviewType.Virtual ? 'bg-white dark:bg-gray-800 text-blue-600 shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:bg-white/50'}`}>Virtual</button>
                        <button type="button" onClick={() => setType(InterviewType.InPerson)} className={`w-full py-2 text-sm font-medium rounded-md transition-colors ${type === InterviewType.InPerson ? 'bg-white dark:bg-gray-800 text-blue-600 shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:bg-white/50'}`}>In-Person</button>
                    </div>
                </div>

                <div>
                    <label htmlFor="location-link" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{type === InterviewType.Virtual ? 'Meeting Link' : 'Location'}</label>
                    <input type="text" id="location-link" value={locationOrLink} onChange={e => setLocationOrLink(e.target.value)} required
                    placeholder={type === InterviewType.Virtual ? 'e.g., https://meet.google.com/xyz-abc' : 'e.g., 123 Main St, Lusaka'}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent" />
                </div>

                 <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Internal Notes (Optional)</label>
                    <textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent"
                    placeholder="e.g., Focus on portfolio projects, ask about team collaboration..." />
                </div>
            </div>
            <footer className="flex justify-end space-x-4 p-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 rounded-b-xl">
                <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600">Cancel</button>
                <button type="submit" className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-sm">Schedule Interview</button>
            </footer>
            </form>
        )}
      </div>
    </div>
  );
};

export default InterviewSchedulerModal;
