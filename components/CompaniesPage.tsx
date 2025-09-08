import React, { useMemo } from 'react';
import { Job, Company } from '../types';
import CompanyCard from './CompanyCard';

interface CompaniesPageProps {
  jobs: Job[];
}

const CompaniesPage: React.FC<CompaniesPageProps> = ({ jobs }) => {
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
            <CompanyCard key={company.name} company={company} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompaniesPage;