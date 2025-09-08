import React, { useState, useEffect, useCallback } from 'react';
import { User, UserRole, Job, CV, Notification, NotificationType, Application, ApplicationStatus, Interview, CompanyProfile, JobAlert } from './types';
import Header from './components/Header';
import EmployeeDashboard from './components/EmployeeDashboard';
import EmployerDashboard from './components/EmployerDashboard';
import Spinner from './components/Spinner';
import { generateInitialData } from './services/geminiService';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import CompaniesPage from './components/CompaniesPage';
import { ThemeProvider } from './contexts/ThemeContext';
import EmployeeProfilePage from './components/EmployeeProfilePage';

type ActiveView = 'jobs' | 'companies' | 'profile';

// Categories are defined here to be accessible by the job alert logic
const categories = [
  { name: 'Business Development', keywords: ['business', 'sales', 'account manager'] },
  { name: 'Construction', keywords: ['construction', 'civil', 'architect'] },
  { name: 'Customer Service', keywords: ['customer', 'support', 'service'] },
  { name: 'Finance', keywords: ['finance', 'financial', 'analyst', 'accountant'] },
  { name: 'Healthcare', keywords: ['health', 'medical', 'doctor', 'nurse', 'healthcare'] },
  { name: 'Human Resources', keywords: ['hr', 'human resources', 'recruiter'] },
];

const JobPortal: React.FC<{ user: User }> = ({ user }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [cvs, setCvs] = useState<CV[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<ActiveView>('jobs');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [jobAlerts, setJobAlerts] = useState<JobAlert[]>([]);
  
  const addNotification = useCallback((message: string, type: NotificationType) => {
    const newNotification: Notification = {
      id: Date.now(),
      message,
      type,
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  const markNotificationsAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  useEffect(() => {
    if (user.role === UserRole.Employer && !companyProfile) {
      setCompanyProfile({
        userId: user.id,
        companyName: 'StriveTech', // Mock company name
        description: 'StriveTech is at the forefront of digital innovation, creating solutions that empower businesses and individuals. We are a team of passionate creators, thinkers, and builders dedicated to pushing the boundaries of technology.',
        culture: 'Our culture is built on collaboration, continuous learning, and a shared drive for excellence. We believe in empowering our team members, fostering a supportive environment, and celebrating our collective successes.',
        logoUrl: '' // No initial logo
      });
    }
  }, [user, companyProfile]);

  const handleUpdateCompanyProfile = (profileData: CompanyProfile) => {
    setCompanyProfile(profileData);
    addNotification('Company profile updated successfully!', NotificationType.Success);
  };
  
  useEffect(() => {
    const loadInitialData = async () => {
      // Prevent re-fetching data
      if (dataLoaded) return;

      setIsLoading(true);
      setError(null);
      try {
        const { jobs, cvs } = await generateInitialData();
        setJobs(jobs);
        setCvs(cvs); 
        
        // Create a richer set of mock applications to demonstrate the dashboard's functionality
        if (jobs.length > 5 && cvs.length > 8) {
            const mockApps: Application[] = [
              // Multiple applicants for the first job to showcase the workflow
              { id: `app-${Date.now()}-1`, jobId: jobs[0].id, userId: cvs[1].userId, date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), status: ApplicationStatus.Applied, coverLetter: "I'm very excited about this opportunity. My experience with modern frontend frameworks and building scalable UI components aligns perfectly with your job description. I am confident I can contribute significantly to your team.", attachments: [{ name: 'Bwalya_Chisanga_CV.pdf', type: 'pdf'}, { name: 'portfolio_highlights.pdf', type: 'pdf'}] },
              { id: `app-${Date.now()}-2`, jobId: jobs[0].id, userId: cvs[2].userId, date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), status: ApplicationStatus.Applied, coverLetter: "Dear Hiring Manager, I am writing to express my keen interest in the Product Manager role. I have a proven track record of launching successful products from ideation to market and would love to bring my expertise to your company.", attachments: [{ name: 'Temwani_Phiri_Resume.pdf', type: 'pdf'}] },
              { id: `app-${Date.now()}-3`, jobId: jobs[0].id, userId: cvs[3].userId, date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), status: ApplicationStatus.UnderReview },
              { id: `app-${Date.now()}-4`, jobId: jobs[0].id, userId: cvs[4].userId, date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), status: ApplicationStatus.Interviewing },
              { id: `app-${Date.now()}-5`, jobId: jobs[0].id, userId: cvs[5].userId, date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), status: ApplicationStatus.Rejected },
              
              // Applicant for a different job
              { id: `app-${Date.now()}-6`, jobId: jobs[1].id, userId: cvs[6].userId, date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), status: ApplicationStatus.Applied, attachments: [{ name: 'cv_latest.pdf', type: 'pdf'}] },

              // Another applicant for a different job
              { id: `app-${Date.now()}-7`, jobId: jobs[2].id, userId: cvs[7].userId, date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), status: ApplicationStatus.Offered },
            ];
            setApplications(mockApps);
        }
        setDataLoaded(true);
      } catch (err) {
        console.error('Failed to load initial data:', err);
        setError('Could not connect to the AI service. Please check your API key and try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadInitialData();
  }, [dataLoaded]);
  
  // Find or create CV for the logged-in employee
  useEffect(() => {
    if (user.role === UserRole.Employee && dataLoaded) {
      const userCv = cvs.find(cv => cv.userId === user.id);
      if (!userCv) {
        // Create a blank CV if one doesn't exist
        const newCv: CV = {
          id: `cv-${user.id}`,
          userId: user.id,
          name: user.email.split('@')[0], // Default name
          title: '',
          skills: [],
          experience: [],
          contactEmail: user.email,
          phone: '',
        };
        setCvs(prev => [...prev, newCv]);
      }
    }
  }, [user, cvs, dataLoaded, setCvs]);
  
  const handleUpdateCv = (cvData: Omit<CV, 'id' | 'userId'>) => {
      setCvs(prevCvs => {
          const updatedCvs = prevCvs.map(cv => {
              if (cv.userId === user.id) {
                  return { ...cv, ...cvData };
              }
              return cv;
          });
          return updatedCvs;
      });
      addNotification('Profile updated successfully!', NotificationType.Success);
      setActiveView('jobs'); // Go back to job list after saving
  };
  
  const addApplication = (jobId: string) => {
    const newApplication: Application = {
      id: `app-${Date.now()}`,
      jobId,
      userId: user.id,
      date: new Date().toISOString(),
      status: ApplicationStatus.Applied,
    };
    setApplications(prev => [newApplication, ...prev]);
  };
  
  const updateApplicationStatus = (applicationId: string, status: ApplicationStatus) => {
    setApplications(prev => 
      prev.map(app => 
        app.id === applicationId ? { ...app, status } : app
      )
    );
    // Optionally, trigger a notification for the employee
    const app = applications.find(a => a.id === applicationId);
    if(app) {
        const job = jobs.find(j => j.id === app.jobId);
        if(job) {
             // This is a simplified notification system. In a real app, this would be more robust.
            console.log(`Status for job "${job.title}" updated to ${status}. A notification would be sent.`);
        }
    }
  };

  const addInterview = (interviewData: Omit<Interview, 'id'>) => {
    const newInterview: Interview = {
      ...interviewData,
      id: `int-${Date.now()}`,
    };
    setInterviews(prev => [...prev, newInterview].sort((a,b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()));
    updateApplicationStatus(interviewData.applicationId, ApplicationStatus.Interviewing);
    // In a real app, send notification to candidate
    console.log(`Interview scheduled for application ${interviewData.applicationId}. A notification would be sent.`);
  };

  const addJobAlert = useCallback((alert: Omit<JobAlert, 'id'>) => {
    const newAlert = { ...alert, id: `alert-${Date.now()}` };
    if (jobAlerts.some(a => a.type === newAlert.type && a.value.toLowerCase() === newAlert.value.toLowerCase())) {
        addNotification(`You already have an alert for "${alert.value}".`, NotificationType.Info);
        return;
    }
    setJobAlerts(prev => [...prev, newAlert]);
    addNotification(`Job alert for "${alert.value}" created successfully!`, NotificationType.Success);
  }, [addNotification, jobAlerts]);

  const removeJobAlert = useCallback((alertId: string) => {
    const alertToRemove = jobAlerts.find(a => a.id === alertId);
    setJobAlerts(prev => prev.filter(a => a.id !== alertId));
    if (alertToRemove) {
        addNotification(`Job alert for "${alertToRemove.value}" removed.`, NotificationType.Info);
    }
  }, [addNotification, jobAlerts]);

  const addJob = (newJobData: Omit<Job, 'id'>) => {
    const jobWithId = { ...newJobData, id: `job-${Date.now()}` };
    setJobs(prevJobs => [jobWithId, ...prevJobs]);
    addNotification(`New job "${jobWithId.title}" has been posted!`, NotificationType.Success);

    // This simulates a backend process that would notify users of new jobs.
    if (user.role === UserRole.Employee && jobAlerts.length > 0) {
      setTimeout(() => { // Use a timeout to make the notification feel more "real"
        jobAlerts.forEach(alert => {
            let isMatch = false;
            const jobTitleLower = jobWithId.title.toLowerCase();
            const jobDescLower = jobWithId.description.toLowerCase();

            if (alert.type === 'keyword') {
                if (jobTitleLower.includes(alert.value.toLowerCase()) || jobDescLower.includes(alert.value.toLowerCase())) {
                    isMatch = true;
                }
            } else if (alert.type === 'category') {
                const category = categories.find(c => c.name === alert.value);
                if (category) {
                    if (category.keywords.some(keyword => jobTitleLower.includes(keyword) || jobDescLower.includes(keyword))) {
                        isMatch = true;
                    }
                }
            }

            if (isMatch) {
                addNotification(
                    `New Job Alert: "${jobWithId.title}" matches your "${alert.value}" alert.`,
                    NotificationType.Alert
                );
            }
        });
      }, 2000);
    }
  };
  
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-screen text-gray-600 dark:text-gray-400">
            <Spinner />
            <p className="mt-4 text-lg">Generating initial job and candidate data...</p>
        </div>
      );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen p-4">
                <div className="bg-red-100 text-red-800 p-4 rounded-lg border border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-500/30 text-center" role="alert">
                    <strong className="font-bold">An error occurred!</strong>
                    <span className="block sm:inline ml-2">{error}</span>
                </div>
            </div>
        );
    }

    if (user.role === UserRole.Employee) {
      if (activeView === 'companies') {
        return <CompaniesPage jobs={jobs} />;
      }
      if (activeView === 'profile') {
        const currentUserCv = cvs.find(cv => cv.userId === user.id);
        if (!currentUserCv) {
            return (
                <div className="flex items-center justify-center h-screen"><Spinner /></div>
            );
        }
        return (
          <EmployeeProfilePage
            cv={currentUserCv}
            onSave={handleUpdateCv}
            onCancel={() => setActiveView('jobs')}
          />
        );
      }
      return (
        <EmployeeDashboard 
            jobs={jobs} 
            applications={applications}
            addApplication={addApplication}
            addNotification={addNotification} 
            jobAlerts={jobAlerts}
            addJobAlert={addJobAlert}
            removeJobAlert={removeJobAlert}
        />
      );
    } else {
      return (
        <EmployerDashboard 
          user={user}
          jobs={jobs} 
          cvs={cvs} 
          applications={applications}
          interviews={interviews}
          addJob={addJob}
          updateApplicationStatus={updateApplicationStatus}
          addInterview={addInterview}
          companyProfile={companyProfile}
          onUpdateProfile={handleUpdateCompanyProfile}
        />
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans text-gray-800 dark:text-gray-200">
      <Header 
        user={user} 
        activeView={activeView} 
        setActiveView={setActiveView}
        notifications={notifications}
        onNotificationsRead={markNotificationsAsRead}
      />
      {renderContent()}
    </div>
  );
};

// --- Main Application Component with Authentication Flow ---
const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [isSigningUp, setIsSigningUp] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <Spinner />
      </div>
    );
  }

  if (!user) {
    if (isSigningUp) {
      return <SignUpPage onSwitchToLogin={() => setIsSigningUp(false)} />;
    }
    return <LoginPage onSwitchToSignUp={() => setIsSigningUp(true)} />;
  }

  return <JobPortal user={user} />;
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;