import React, { useState } from 'react';
import { Job } from '../types';

interface JobPostFormProps {
  // FIX: Changed onJobPosted to expect a job object without 'id' and 'employerId', as employerId is handled by the parent component.
  onJobPosted: (job: Omit<Job, 'id' | 'employerId'>) => void;
  companyName: string;
}

const JobPostForm: React.FC<JobPostFormProps> = ({ onJobPosted, companyName }) => {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !companyName || !location || !description) {
        setError('All fields are required.');
        return;
    }
    onJobPosted({ title, company: companyName, location, description });
    setTitle('');
    setLocation('');
    setDescription('');
    setError('');
  };

  return (
    <div className="bg-white dark:bg-gray-800/50 p-8 rounded-lg shadow-md border border-gray-200 dark:border-gray-700/50 mb-8">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Create a New Job Posting</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Job Title</label>
                <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent" placeholder="e.g., Senior React Developer" />
            </div>
            <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company</label>
                <input type="text" id="company" value={companyName} readOnly className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none bg-gray-100 dark:bg-gray-700/50" />
            </div>
            <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
                <input type="text" id="location" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent" placeholder="e.g., San Francisco, CA" />
            </div>
        </div>
        
        <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Job Description</label>
            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={6} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent" placeholder="Describe the role, responsibilities, and qualifications..."></textarea>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        
        <div className="text-right">
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm">Post Job</button>
        </div>
      </form>
    </div>
  );
};

export default JobPostForm;