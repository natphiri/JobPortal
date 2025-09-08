import React, { useState, useRef, useEffect } from 'react';
import { JobAlert } from '../types';
import CloseIcon from './icons/CloseIcon';
import TrashIcon from './icons/TrashIcon';
import BellPlusIcon from './icons/BellPlusIcon';

interface JobAlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAlerts: JobAlert[];
  onAddAlert: (alert: Omit<JobAlert, 'id'>) => void;
  onRemoveAlert: (alertId: string) => void;
  availableCategories: string[];
}

const JobAlertsModal: React.FC<JobAlertsModalProps> = ({
  isOpen,
  onClose,
  currentAlerts,
  onAddAlert,
  onRemoveAlert,
  availableCategories,
}) => {
  const [activeTab, setActiveTab] = useState<'keyword' | 'category'>('keyword');
  const [keyword, setKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(availableCategories[0] || '');
  
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setKeyword('');
      setSelectedCategory(availableCategories[0] || '');
    }
  }, [isOpen, availableCategories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'keyword' && keyword.trim()) {
      onAddAlert({ type: 'keyword', value: keyword.trim() });
      setKeyword('');
    } else if (activeTab === 'category' && selectedCategory) {
      onAddAlert({ type: 'category', value: selectedCategory });
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col m-4"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <BellPlusIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Manage Job Alerts</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700" aria-label="Close modal">
            <CloseIcon className="w-5 h-5" />
          </button>
        </header>

        <div className="flex-grow overflow-y-auto p-8 space-y-8">
          {/* Create Alert Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Create a New Alert</h3>
            <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex space-x-2 rounded-lg bg-gray-200 dark:bg-gray-800 p-1 mb-4">
                <button onClick={() => setActiveTab('keyword')} className={`w-full py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'keyword' ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:bg-white/50'}`}>By Keyword</button>
                <button onClick={() => setActiveTab('category')} className={`w-full py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'category' ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:bg-white/50'}`}>By Category</button>
              </div>

              <form onSubmit={handleSubmit} className="flex items-end space-x-3">
                <div className="flex-grow">
                  {activeTab === 'keyword' ? (
                    <>
                      <label htmlFor="keyword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Job title, skill, or company</label>
                      <input type="text" id="keyword" value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="e.g., 'React Developer' or 'Sales'"
                             className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent" />
                    </>
                  ) : (
                    <>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Job Category</label>
                      <select id="category" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent">
                        {availableCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                    </>
                  )}
                </div>
                <button type="submit" className="px-5 py-2 h-[42px] rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm">Add Alert</button>
              </form>
            </div>
          </div>

          {/* Current Alerts Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Your Active Alerts</h3>
            {currentAlerts.length > 0 ? (
              <ul className="space-y-3">
                {currentAlerts.map(alert => (
                  <li key={alert.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div>
                      <span className="font-semibold text-gray-900 dark:text-gray-100">{alert.value}</span>
                      <span className="ml-2 text-xs bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full capitalize">{alert.type}</span>
                    </div>
                    <button onClick={() => onRemoveAlert(alert.id)} className="p-2 rounded-full text-gray-400 hover:bg-red-100 dark:hover:bg-red-900/40 hover:text-red-600 dark:hover:text-red-400" aria-label={`Remove alert for ${alert.value}`}>
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400 py-6">You have not created any job alerts yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobAlertsModal;
