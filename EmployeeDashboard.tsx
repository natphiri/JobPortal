import React, { useState, useMemo, useEffect } from 'react';
import { Job, Application, ApplicationStatus, NotificationType, JobAlert } from '../types';
import JobCard from './JobCard';
import CategorySearch from './CategorySearch';
import SearchHero from './SearchHero';
import BusinessDevelopmentIcon from './icons/BusinessDevelopmentIcon';
import ConstructionIcon from './icons/ConstructionIcon';
import CustomerServiceIcon from './icons/CustomerServiceIcon';
import FinanceIcon from './icons/FinanceIcon';
import HealthcareIcon from './icons/HealthcareIcon';
import HumanResourcesIcon from './icons/HumanResourcesIcon';
import ApplicationList from './ApplicationList';
import SearchIcon from './icons/SearchIcon';
import BellPlusIcon from './icons/BellPlusIcon';
import JobAlertsModal from './JobAlertsModal';

interface Category {
  name: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  keywords: string[];
}

const categories: Category[] = [
  { name: 'Business Development', icon: BusinessDevelopmentIcon, keywords: ['business', 'sales', 'account manager'] },
  { name: 'Construction', icon: ConstructionIcon, keywords: ['construction', 'civil', 'architect'] },
  { name: 'Customer Service', icon: CustomerServiceIcon, keywords: ['customer', 'support', 'service'] },
  { name: 'Finance', icon: FinanceIcon, keywords: ['finance', 'financial', 'analyst', 'accountant'] },
  { name: 'Healthcare', icon: HealthcareIcon, keywords: ['health', 'medical', 'doctor', 'nurse', 'healthcare'] },
  { name: 'Human Resources', icon: HumanResourcesIcon, keywords: ['hr', 'human resources', 'recruiter'] },
];

const getJobCountForCategory = (jobs: Job[], keywords: string[]): number => {
  if (!jobs) return 0;
  return jobs.filter(job => {
    const titleLower = job.title.toLowerCase();
    const descriptionLower = job.description.toLowerCase();
    return keywords.some(keyword => titleLower.includes(keyword) || descriptionLower.includes(keyword));
  }).length;
};

interface EmployeeDashboardProps {
  jobs: Job[];
  applications: Application[];
  addNotification: (message: string, type: NotificationType) => void;
  jobAlerts: JobAlert[];
  addJobAlert: (alert: Omit<JobAlert, 'id'>) => void;
  removeJobAlert: (alertId: string) => void;
  openApplicationModal: (job: Job) => void;
}

const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({ jobs, applications, addNotification, jobAlerts, addJobAlert, removeJobAlert, openApplicationModal }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [locationTerm, setLocationTerm] = useState('');
    const [savedJobIds, setSavedJobIds] = useState<Set<string>>(new Set());
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'all' | 'saved' | 'applications'>('all');
    const [isAlertsModalOpen, setIsAlertsModalOpen] = useState(false);

    // Create some mock notifications for demonstration purposes
    useEffect(() => {
        const hasNotified = sessionStorage.getItem('notified');
        if (jobs.length > 0 && !hasNotified) {
            setTimeout(() => {
                addNotification(`A new "Frontend Developer" role was posted that matches your profile.`, NotificationType.Alert);
                 sessionStorage.setItem('notified', 'true');
            }, 5000);
        }
    }, [jobs, addNotification]);

    const appliedJobIds = useMemo(() => new Set(applications.map(app => app.jobId)), [applications]);

    const handleSaveJob = (jobId: string) => {
        setSavedJobIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(jobId)) {
                newSet.delete(jobId);
            } else {
                newSet.add(jobId);
            }
            return newSet;
        });
    };

    const handleSearch = (search: string, location: string) => {
        setSearchTerm(search);
        setLocationTerm(location);
        setActiveTab('all');
    };

    const handleCategorySelect = (categoryName: string | null) => {
        setSelectedCategory(prev => (prev === categoryName ? null : categoryName));
        setActiveTab('all');
    };

    const jobsToDisplay = activeTab === 'saved' 
        ? jobs.filter(job => savedJobIds.has(job.id)) 
        : jobs;

    const filteredJobs = jobsToDisplay.filter(job => {
        const searchMatch = searchTerm === '' ||
            job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.description.toLowerCase().includes(searchTerm.toLowerCase());
        
        const locationMatch = locationTerm === '' ||
            job.location.toLowerCase().includes(locationTerm.toLowerCase());

        const categoryMatch = !selectedCategory || 
            (() => {
                const category = categories.find(c => c.name === selectedCategory);
                if (!category) return true;
                const titleLower = job.title.toLowerCase();
                const descriptionLower = job.description.toLowerCase();
                return category.keywords.some(keyword => titleLower.includes(keyword) || descriptionLower.includes(keyword));
            })();

        return searchMatch && locationMatch && categoryMatch;
    });

    const renderJobGrid = () => (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredJobs.map(job => (
                    <JobCard
                        key={job.id}
                        job={job}
                        onApply={openApplicationModal}
                        isApplied={appliedJobIds.has(job.id)}
                        onSave={handleSaveJob}
                        isSaved={savedJobIds.has(job.id)}
                    />
                ))}
            </div>
            {filteredJobs.length === 0 && (
                <div className="text-center py-16">
                    <SearchIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                    <h3 className="mt-4 text-xl font-semibold text-gray-800 dark:text-gray-200">No jobs found</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md mx-auto">
                        {activeTab === 'saved' ? "You haven't saved any jobs yet." : "Try adjusting your search or category filters to find what you're looking for."}
                    </p>
                </div>
            )}
        </>
    );

    return (
        <div>
            <SearchHero onSearch={handleSearch} jobs={jobs} />

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {activeTab !== 'applications' && (
                    <CategorySearch 
                        jobs={jobs}
                        categories={categories}
                        getJobCountForCategory={getJobCountForCategory}
                        selectedCategory={selectedCategory}
                        onSelectCategory={handleCategorySelect}
                    />
                )}
            
                <div className={activeTab !== 'applications' ? "mt-16" : ""}>
                    <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
                        <div className="flex justify-between items-center">
                            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                                <button
                                    onClick={() => setActiveTab('all')}
                                    className={`${
                                        activeTab === 'all'
                                            ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
                                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                                >
                                    All Jobs
                                </button>
                                <button
                                    onClick={() => setActiveTab('saved')}
                                    className={`${
                                        activeTab === 'saved'
                                            ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
                                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                                >
                                    Saved Jobs 
                                    {savedJobIds.size > 0 && (
                                        <span className="ml-2 bg-blue-100 text-blue-600 text-xs font-bold px-2 py-0.5 rounded-full dark:bg-blue-900/50 dark:text-blue-300">
                                            {savedJobIds.size}
                                        </span>
                                    )}
                                </button>
                                <button
                                    onClick={() => setActiveTab('applications')}
                                    className={`${
                                        activeTab === 'applications'
                                            ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
                                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                                >
                                    My Applications
                                    {applications.length > 0 && (
                                        <span className="ml-2 bg-blue-100 text-blue-600 text-xs font-bold px-2 py-0.5 rounded-full dark:bg-blue-900/50 dark:text-blue-300">
                                            {applications.length}
                                        </span>
                                    )}
                                </button>
                            </nav>
                             <button
                                onClick={() => setIsAlertsModalOpen(true)}
                                className="flex items-center space-x-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors bg-white dark:bg-gray-800/50 text-blue-600 dark:text-blue-400 border border-gray-200 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-800"
                            >
                                <BellPlusIcon className="w-5 h-5" />
                                <span>Manage Alerts</span>
                                {jobAlerts.length > 0 && (
                                     <span className="ml-2 bg-blue-100 text-blue-600 text-xs font-bold px-2 py-0.5 rounded-full dark:bg-blue-900/50 dark:text-blue-300">
                                        {jobAlerts.length}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>

                    {activeTab === 'all' && renderJobGrid()}
                    {activeTab === 'saved' && renderJobGrid()}
                    {activeTab === 'applications' && <ApplicationList applications={applications} jobs={jobs} />}

                </div>
            </main>
            
            <JobAlertsModal 
                isOpen={isAlertsModalOpen}
                onClose={() => setIsAlertsModalOpen(false)}
                currentAlerts={jobAlerts}
                onAddAlert={addJobAlert}
                onRemoveAlert={removeJobAlert}
                availableCategories={categories.map(c => c.name)}
            />
        </div>
    );
};

export default EmployeeDashboard;
