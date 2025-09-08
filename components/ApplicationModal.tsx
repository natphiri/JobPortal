import React, { useState, useEffect, useRef } from 'react';
import { Job } from '../types';
import CloseIcon from './icons/CloseIcon';
import FileUpload from './FileUpload';
import BriefcaseIcon from './icons/BriefcaseIcon';
import LocationIcon from './icons/LocationIcon';

interface ApplicationModalProps {
  isOpen: boolean;
  job: Job | null;
  onClose: () => void;
  onSubmit: (applicationData: {
    coverLetter: string;
    cvFile: File | null;
    otherFiles: File[];
  }) => void;
}

const ApplicationModal: React.FC<ApplicationModalProps> = ({ isOpen, job, onClose, onSubmit }) => {
  const [step, setStep] = useState(1);
  const [coverLetter, setCoverLetter] = useState('');
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [otherFiles, setOtherFiles] = useState<File[]>([]);
  
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reset form and step when modal opens for a new job
    if (isOpen) {
      setStep(1);
      setCoverLetter('');
      setCvFile(null);
      setOtherFiles([]);
    }
  }, [isOpen]);

  // Scroll to top when step changes
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [step]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ coverLetter, cvFile, otherFiles });
  };

  if (!isOpen || !job) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
      aria-labelledby="application-modal-title"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col m-4"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div>
            <h2 id="application-modal-title" className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Apply to {job.title}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Step {step} of 2: {step === 1 ? 'Job Overview' : 'Your Application'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="Close application modal"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </header>

        {step === 1 && (
          <>
            <div ref={contentRef} className="flex-grow overflow-y-auto p-8 space-y-6">
              <div className="space-y-2 text-gray-600 dark:text-gray-400">
                <div className="flex items-center">
                  <BriefcaseIcon className="w-5 h-5 mr-2.5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                  <span className="font-medium text-gray-800 dark:text-gray-200">{job.company}</span>
                </div>
                <div className="flex items-center">
                  <LocationIcon className="w-5 h-5 mr-2.5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                  <span>{job.location}</span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Job Description</h3>
                <div className="prose prose-sm max-w-none text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700 whitespace-pre-wrap">
                  <p>{job.description}</p>
                </div>
              </div>
            </div>
            <footer className="flex justify-end space-x-4 p-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 rounded-b-xl flex-shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
              >
                Next: Apply
              </button>
            </footer>
          </>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit} className="flex-grow flex flex-col overflow-hidden">
            <div ref={contentRef} className="flex-grow overflow-y-auto p-8 space-y-6">
              <div>
                <label htmlFor="cover-letter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cover Letter (Optional)
                </label>
                <textarea
                  id="cover-letter"
                  rows={8}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder="Write a brief message to the hiring manager..."
                />
              </div>
              <FileUpload 
                  label="Upload Your CV"
                  onFilesSelected={(files) => setCvFile(files[0] || null)}
                  acceptedFileTypes=".pdf,.doc,.docx"
              />
              <FileUpload 
                  label="Upload Additional Files (Optional)"
                  onFilesSelected={setOtherFiles}
                  multiple
              />
            </div>
            <footer className="flex justify-between items-center space-x-4 p-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 rounded-b-xl flex-shrink-0">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                Back
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
              >
                Submit Application
              </button>
            </footer>
          </form>
        )}
      </div>
    </div>
  );
};

export default ApplicationModal;