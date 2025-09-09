import React, { useMemo, useState } from 'react';
import { Job, Company, Application, NotificationType } from '../types';
import CompanyCard from './CompanyCard';
import CompanyJobsModal from './CompanyJobsModal';

interface CompaniesPageProps {
  jobs: Job[];
  applications: Application[];
  openApplicationModal: (job: Job) => void;
}

const CompaniesPage: React.FC<CompaniesPageProps> = ({ jobs, applications, openApplicationModal }) => {
  const [viewingCompany, setViewingCompany] = useState<Company | null>(null);

  const companies = useMemo<Company[]>(() => {
    const companyMap = new Map<string, { jobTitles: string[]; locations: Set<string> }>();

    jobs.forEach(job => {
      if (!companyMap.has(job.company)) {
        companyMap.set(job.company, { jobTitles: [], locations: new Set() });
      }
      const companyData = companyMap.get(job.company)!;
      companyData.jobTitles.push(job.title);
      companyData.locations.add(job.location);
    });

    return Array.from(companyMap.entries()).map(([name, data]) => ({
      name,
      jobCount: data.jobTitles.length,
      jobTitles: data.jobTitles,
      locations: Array.from(data.locations),
    })).sort((a, b) => b.jobCount - a.jobCount); // Sort by most jobs
  }, [jobs]);

  const appliedJobIds = useMemo(() => new Set(applications.map(app => app.jobId)), [applications]);
  
  const jobsForCompany = useMemo(() => {
    if (!viewingCompany) return [];
    return jobs.filter(job => job.company === viewingCompany.name);
  }, [viewingCompany, jobs]);

  const handleViewJobs = (company: Company) => {
    setViewingCompany(company);
  };

  const handleCloseModal = () => {
    setViewingCompany(null);
  };

  const handleApplyFromModal = (job: Job) => {
    // First, close the company jobs modal
    handleCloseModal();
    // Then, open the application modal. A short timeout allows for a smoother UI transition.
    setTimeout(() => {
        openApplicationModal(job);
    }, 150);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight sm:text-5xl">
                Discover Top Companies
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
                Explore companies with open positions on our platform.
            </p>
        </div>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {companies.map(company => (
            <CompanyCard key={company.name} company={company} onViewJobs={handleViewJobs} />
          ))}
        </div>
      </div>
      
      <CompanyJobsModal
        isOpen={!!viewingCompany}
        onClose={handleCloseModal}
        company={viewingCompany}
        jobs={jobsForCompany}
        onApply={handleApplyFromModal}
        appliedJobIds={appliedJobIds}
      />
    </div>
  );
};

export default CompaniesPage;
