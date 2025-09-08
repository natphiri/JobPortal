
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import AuthLayout from './AuthLayout';
import Spinner from './Spinner';
import GoogleIcon from './icons/GoogleIcon';

interface LoginPageProps {
    onSwitchToSignUp: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onSwitchToSignUp }) => {
    const [email, setEmail] = useState('employee@demo.com');
    const [password, setPassword] = useState('password123');
    const [error, setError] = useState('');
    const { login, loginWithGoogle, loading } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!email || !password) {
            setError('Please fill in all fields.');
            return;
        }
        try {
            await login(email, password);
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
        <AuthLayout title="Log In to Your Account">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent dark:text-gray-200" placeholder="you@example.com" required />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                    <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent dark:text-gray-200" placeholder="••••••••" required />
                </div>

                {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                <div>
                    <button type="submit" disabled={loading} className="w-full mt-2 flex justify-center bg-blue-600 text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm disabled:bg-blue-400 disabled:cursor-not-allowed">
                        {loading ? <Spinner small /> : 'Log In'}
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
                Don't have an account?{' '}
                <button type="button" onClick={onSwitchToSignUp} className="font-medium text-blue-600 hover:underline">
                    Sign Up
                </button>
            </p>
        </AuthLayout>
    );
};

export default LoginPage;
