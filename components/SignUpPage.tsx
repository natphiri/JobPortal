import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import AuthLayout from './AuthLayout';
import { UserRole } from '../types';
import Spinner from './Spinner';
import GoogleIcon from './icons/GoogleIcon';
import UserIcon from './icons/UserIcon';
import BriefcaseIcon from './icons/BriefcaseIcon';

interface SignUpPageProps {
    onSwitchToLogin: () => void;
}

const SignUpPage: React.FC<SignUpPageProps> = ({ onSwitchToLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<UserRole>(UserRole.Employee);
    const [error, setError] = useState('');
    const { signup, loginWithGoogle, loading } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!email || !password) {
            setError('Please fill in all fields.');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }
        try {
            await signup(email, password, role);
        } catch (err: any) {
            setError(err.message || 'An unknown error occurred.');
        }
    };

     const handleGoogleSignIn = async () => {
        setError('');
        try {
            await loginWithGoogle();
        } catch (err: any) {
            setError(err.message || 'An unknown error occurred during Google Sign-In.');
        }
    };

    return (
        <AuthLayout title="Create Your Account">
            <form onSubmit={handleSubmit} className="space-y-6">
                 <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent dark:text-gray-200" placeholder="you@example.com" required />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                    <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent dark:text-gray-200" placeholder="•••••••• (min. 6 characters)" required />
                </div>
                
                <div>
                    <fieldset>
                        <legend className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">I am an...</legend>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Job Seeker Option */}
                        <label className={`relative flex flex-col p-4 border rounded-lg cursor-pointer transition-all ${role === UserRole.Employee ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-500 shadow-sm' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800/20 hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}>
                            <input 
                            type="radio" 
                            name="role" 
                            value={UserRole.Employee} 
                            checked={role === UserRole.Employee} 
                            onChange={() => setRole(UserRole.Employee)} 
                            className="sr-only"
                            aria-labelledby="employee-label"
                            />
                            <div className="flex items-center">
                                <UserIcon className={`w-6 h-6 mr-3 transition-colors ${role === UserRole.Employee ? 'text-blue-600' : 'text-gray-500 dark:text-gray-400'}`} />
                                <span id="employee-label" className="font-semibold text-gray-900 dark:text-gray-100">Job Seeker</span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 pl-9">Find jobs, build your profile, and get hired.</p>
                            {role === UserRole.Employee && (
                                <div className="absolute top-2 right-2 text-blue-600 dark:text-blue-400">
                                    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            )}
                        </label>

                        {/* Employer Option */}
                        <label className={`relative flex flex-col p-4 border rounded-lg cursor-pointer transition-all ${role === UserRole.Employer ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-500 shadow-sm' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800/20 hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}>
                            <input 
                            type="radio" 
                            name="role" 
                            value={UserRole.Employer} 
                            checked={role === UserRole.Employer} 
                            onChange={() => setRole(UserRole.Employer)} 
                            className="sr-only"
                            aria-labelledby="employer-label"
                            />
                            <div className="flex items-center">
                                <BriefcaseIcon className={`w-6 h-6 mr-3 transition-colors ${role === UserRole.Employer ? 'text-blue-600' : 'text-gray-500 dark:text-gray-400'}`} />
                                <span id="employer-label" className="font-semibold text-gray-900 dark:text-gray-100">Employer</span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 pl-9">Post jobs, manage applicants, and find talent.</p>
                            {role === UserRole.Employer && (
                                <div className="absolute top-2 right-2 text-blue-600 dark:text-blue-400">
                                    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            )}
                        </label>
                        </div>
                    </fieldset>
                </div>

                {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                <div>
                    <button type="submit" disabled={loading} className="w-full mt-2 flex justify-center bg-blue-600 text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm disabled:bg-blue-400 disabled:cursor-not-allowed">
                        {loading ? <Spinner small /> : 'Create Account'}
                    </button>
                </div>
            </form>

            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200 dark:border-gray-700" />
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">OR</span>
                </div>
            </div>

            <div>
                <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="w-full flex justify-center items-center space-x-2 bg-white dark:bg-gray-700/80 text-gray-600 dark:text-gray-200 px-4 py-2.5 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-gray-300 dark:border-gray-600 disabled:opacity-50"
                >
                    <GoogleIcon className="w-5 h-5" />
                    <span>Sign in with Google</span>
                </button>
            </div>
            
            <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-6">
                Already have an account?{' '}
                <button type="button" onClick={onSwitchToLogin} className="font-medium text-blue-600 hover:underline">
                    Log In
                </button>
            </p>
        </AuthLayout>
    );
};

export default SignUpPage;