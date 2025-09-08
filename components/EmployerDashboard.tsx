import React, { useState, useMemo, useEffect } from 'react';
import { Job, CV, Application, User, ApplicationStatus, Interview, CompanyProfile } from '../types';
import CvCard from './CvCard';
import JobPostForm from './JobPostForm';
import EmployerJobListItem from './EmployerJobListItem';
import ApplicantList from './ApplicantList';
import AnalyticsDashboard from './AnalyticsDashboard';
import InterviewSchedulerModal from './InterviewSchedulerModal';
import UpcomingInterviews from './UpcomingInterviews';
import CompanyProfileForm from './CompanyProfileForm';
import ApplicantDetailModal from './ApplicantDetailModal';

interface EmployerDashboardProps {
  user: User;
  jobs: Job[];
  cvs: CV[];
  applications: Application[];
  interviews: Interview[];
  companyProfile: CompanyProfile | null;
  addJob: (newJob: Omit<Job, 'id'>) => void;
  updateApplicationStatus: (applicationId: string, status: ApplicationStatus) => void;
  addInterview: (interviewData: Omit<Interview, 'id'>) => void;
  onUpdateProfile: (profile: CompanyProfile) => void;
}

type ActiveTab = 'dashboard' | 'post_job' | 'candidate_pool' | 'profile' | 'analytics';

const EmployerDashboard: React.FC<EmployerDashboardProps> = ({ user, jobs, cvs, applications, interviews, companyProfile, addJob, updateApplicationStatus, addInterview, onUpdateProfile }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [schedulingApplication, setSchedulingApplication] = useState<Application | null>(null);
  const [reviewingApplication, setReviewingApplication] = useState<Application | null>(null);
  const [filterStatus, setFilterStatus] = useState<ApplicationStatus | 'all'>('all');
  
  const employerJobs = useMemo(() => {
    return jobs.filter(job => job.employerId === user.id);
  }, [jobs, user.id]);

  // Effect to manage selected job ID
  useEffect(() => {
    const isSelectedJobVisible = employerJobs.some(job => job.id === selectedJobId);
    
    if (employerJobs.length > 0 && (!selectedJobId || !isSelectedJobVisible)) {
      // If no job is selected, or the selected one is not in the list, select the first one.
      setSelectedJobId(employerJobs[0].id);
    } else if (employerJobs.length === 0) {
      // If there are no jobs, clear selection.
      setSelectedJobId(null);
    }
  }, [employerJobs, selectedJobId]);

  const selectedJob = useMemo(() => {
    return employerJobs.find(job => job.id === selectedJobId);
  }, [selectedJobId, employerJobs]);
  
  const schedulingCv = useMemo(() => {
    if (!schedulingApplication) return undefined;
    return cvs.find(cv => cv.userId === schedulingApplication.userId);
  }, [schedulingApplication, cvs]);

  const schedulingJob = useMemo(() => {
    if (!schedulingApplication) return undefined;
    return jobs.find(j => j.id === schedulingApplication.jobId);
  }, [schedulingApplication, jobs]);

  const reviewingCv = useMemo(() => {
    if (!reviewingApplication) return undefined;
    return cvs.find(cv => cv.userId === reviewingApplication.userId);
  }, [reviewingApplication, cvs]);

  const reviewingJob = useMemo(() => {
    if (!reviewingApplication) return undefined;
    return jobs.find(j => j.id === reviewingApplication.jobId);
  }, [reviewingApplication, jobs]);

  const allApplicantsForSelectedJob = useMemo(() => {
    if (!selectedJobId) return [];
    return applications.filter(app => app.jobId === selectedJobId);
  }, [selectedJobId, applications]);

  const filteredApplicantsForSelectedJob = useMemo(() => {
    if (filterStatus === 'all') {
      return allApplicantsForSelectedJob;
    }
    return allApplicantsForSelectedJob.filter(app => app.status === filterStatus);
  }, [allApplicantsForSelectedJob, filterStatus]);
  
  const applicantCounts = useMemo(() => {
      const counts: { [key in ApplicationStatus | 'all']?: number } = { all: allApplicantsForSelectedJob.length };
      for (const app of allApplicantsForSelectedJob) {
          counts[app.status] = (counts[app.status] || 0) + 1;
      }
      return counts;
  }, [allApplicantsForSelectedJob]);


  const getApplicantsForJob = (jobId: string) => {
    return applications.filter(app => app.jobId === jobId).length;
  };

  const handleScheduleInterview = (interviewData: Omit<Interview, 'id'>) => {
    addInterview(interviewData);
  };
  
  const handleSelectJob = (jobId: string) => {
    setSelectedJobId(jobId);
    setFilterStatus('all'); // Reset filter when changing jobs
  };

  const handleReviewApplicant = (application: Application) => {
    setReviewingApplication(application);
  };

  const handleRejectFromModal = (applicationId: string) => {
    updateApplicationStatus(applicationId, ApplicationStatus.Rejected);
    setReviewingApplication(null); // Close modal after action
  };

  const handleScheduleFromModal = (application: Application) => {
    setReviewingApplication(null); // Close review modal
    setSchedulingApplication(application); // Open schedule modal
  };
  
  const tabButtonClasses = (tab: ActiveTab) => 
    `px-4 py-2 text-sm font-medium rounded-md transition-colors ${
      activeTab === tab 
        ? 'bg-blue-600 text-white' 
        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
    }`;

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-grow space-y-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    <aside className="lg:w-1/3 xl:w-1/4 flex-shrink-0">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 px-2">Your Job Postings ({employerJobs.length})</h2>
                    <div className="space-y-2">
                        {employerJobs.map(job => (
                        <EmployerJobListItem
                            key={job.id}
                            job={job}
                            applicantCount={getApplicantsForJob(job.id)}
                            isSelected={job.id === selectedJobId}
                            onClick={() => handleSelectJob(job.id)}
                        />
                        ))}
                    </div>
                    </aside>
                    <main className="flex-grow">
                    <ApplicantList
                        job={selectedJob}
                        applicants={filteredApplicantsForSelectedJob}
                        allCvs={cvs}
                        updateStatus={updateApplicationStatus}
                        onScheduleInterview={setSchedulingApplication}
                        onReviewApplicant={handleReviewApplicant}
                        activeFilter={filterStatus}
                        onFilterChange={setFilterStatus}
                        applicantCounts={applicantCounts}
                        />
                    </main>
                </div>
            </div>
            <aside className="lg:w-1/3 xl:w-1/4 flex-shrink-0">
                 <UpcomingInterviews interviews={interviews} jobs={jobs} cvs={cvs} />
            </aside>
          </div>
        );
      case 'post_job':
        return <JobPostForm 
                    onJobPosted={(job) => { 
                        addJob({ ...job, employerId: user.id }); 
                        setActiveTab('dashboard'); 
                    }} 
                    companyName={companyProfile?.companyName || 'Your Company'} 
                />;
      case 'candidate_pool':
         return <CandidatePool cvs={cvs} />;
      case 'analytics':
        return <AnalyticsDashboard jobs={employerJobs} applications={applications} />;
      case 'profile':
        if (!companyProfile) return <div>Loading profile...</div>;
        return <CompanyProfileForm profile={companyProfile} onSave={onUpdateProfile} jobs={jobs} />;
      default:
        return null;
    }
  };

  return (
    <>
        <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
            <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Employer Dashboard</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your job postings and view candidates.</p>
            </div>
            <div className="flex items-center space-x-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <button onClick={() => setActiveTab('dashboard')} className={tabButtonClasses('dashboard')}>Dashboard</button>
                <button onClick={() => setActiveTab('post_job')} className={tabButtonClasses('post_job')}>Post a Job</button>
                <button onClick={() => setActiveTab('candidate_pool')} className={tabButtonClasses('candidate_pool')}>Candidate Pool</button>
                <button onClick={() => setActiveTab('analytics')} className={tabButtonClasses('analytics')}>Analytics</button>
                <button onClick={() => setActiveTab('profile')} className={tabButtonClasses('profile')}>Company Profile</button>
            </div>
        </div>
        
        <div className="mt-8">{renderContent()}</div>

        </div>
        <InterviewSchedulerModal
            isOpen={!!schedulingApplication}
            onClose={() => setSchedulingApplication(null)}
            onSchedule={handleScheduleInterview}
            application={schedulingApplication}
            job={schedulingJob}
            cv={schedulingCv}
        />
        <ApplicantDetailModal
            isOpen={!!reviewingApplication}
            onClose={() => setReviewingApplication(null)}
            application={reviewingApplication}
            job={reviewingJob}
            cv={reviewingCv}
            onScheduleInterview={handleScheduleFromModal}
            onReject={handleRejectFromModal}
        />
    </>
  );
};

const CandidatePool: React.FC<{ cvs: CV[] }> = ({ cvs }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const filteredCvs = cvs.filter(cv => 
        cv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cv.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div>
            <div className="mb-6 max-w-2xl">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search candidates by name, title, or skills..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-3 pr-10 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700"
                    />
                    <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCvs.length > 0 ? (
                    filteredCvs.map(cv => (
                    <CvCard key={cv.id} cv={cv} />
                    ))
                ) : (
                    <div className="col-span-full text-center py-12">
                        <p className="text-gray-500 dark:text-gray-400">No candidates found matching your search.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default EmployerDashboard;