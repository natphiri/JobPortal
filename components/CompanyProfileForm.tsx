import React, { useState, useEffect } from 'react';
import { CompanyProfile, Job } from '../types';
import Spinner from './Spinner';
import UploadImageIcon from './icons/UploadImageIcon';

interface CompanyProfileFormProps {
  profile: CompanyProfile;
  onSave: (profile: CompanyProfile) => void;
  jobs: Job[];
}

const CompanyProfileForm: React.FC<CompanyProfileFormProps> = ({ profile, onSave, jobs }) => {
    const [logoPreview, setLogoPreview] = useState<string | null>(profile.logoUrl || null);
    const [description, setDescription] = useState(profile.description || '');
    const [culture, setCulture] = useState(profile.culture || '');
    const [error, setError] = useState('');

    useEffect(() => {
        setLogoPreview(profile.logoUrl || null);
        setDescription(profile.description || '');
        setCulture(profile.culture || '');
    }, [profile]);
    
    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            ...profile,
            logoUrl: logoPreview || undefined,
            description,
            culture
        });
    };

    return (
        <div className="bg-white dark:bg-gray-800/50 p-8 rounded-lg shadow-md border border-gray-200 dark:border-gray-700/50">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Edit Company Profile</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">This information will be visible to candidates on your company page.</p>
            
            <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Company Logo</label>
                    <div className="flex items-center space-x-6">
                        <div className="w-24 h-24 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden border border-gray-200 dark:border-gray-600">
                            {logoPreview ? (
                                <img src={logoPreview} alt="Company logo preview" className="w-full h-full object-cover" />
                            ) : (
                                <UploadImageIcon className="w-10 h-10 text-gray-400" />
                            )}
                        </div>
                        <div>
                            <label htmlFor="logo-upload" className="cursor-pointer bg-white dark:bg-gray-700/80 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-lg font-semibold border border-blue-600 dark:border-blue-500 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors text-sm">
                                Upload Logo
                            </label>
                            <input id="logo-upload" type="file" accept="image/png, image/jpeg, image/svg+xml" className="hidden" onChange={handleLogoChange} />
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">PNG, JPG, or SVG. Square recommended.</p>
                        </div>
                    </div>
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Company Description</label>
                    <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={5} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent dark:text-gray-200" placeholder="Tell candidates about your company's mission, values, and what makes it a great place to work..."></textarea>
                </div>

                <div>
                    <label htmlFor="culture" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Company Culture</label>
                    <textarea id="culture" value={culture} onChange={(e) => setCulture(e.target.value)} rows={4} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent dark:text-gray-200" placeholder="Describe your work environment, team dynamics, and company culture..."></textarea>
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button type="submit" className="bg-blue-600 text-white px-8 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm">Save Changes</button>
                </div>
            </form>
        </div>
    );
};

export default CompanyProfileForm;