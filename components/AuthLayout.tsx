import React from 'react';
import JobPortalLogo from './icons/JobPortalLogo';

interface AuthLayoutProps {
    title: string;
    children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ title, children }) => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center items-center p-4 font-sans">
            <div className="flex items-center space-x-3 mb-8">
                <JobPortalLogo className="w-10 h-10 text-blue-600" />
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Job Portal</h1>
            </div>
            <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100 mb-6">{title}</h2>
                {children}
            </div>
        </div>
    );
};

export default AuthLayout;