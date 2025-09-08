import React, { useState, useEffect } from 'react';
import { CV } from '../types';
import UserAvatar from './UserAvatar';
import TrashIcon from './icons/TrashIcon';

interface CvFormProps {
  initialCv?: CV | null;
  onSave: (cvData: Omit<CV, 'id' | 'userId'>) => void;
  onCancel: () => void;
}

const CvForm: React.FC<CvFormProps> = ({ initialCv, onSave, onCancel }) => {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [currentSkill, setCurrentSkill] = useState('');
  const [experience, setExperience] = useState<{ id: number; value: string }[]>([{ id: Date.now(), value: '' }]);
  const [contactEmail, setContactEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<{ name?: string; title?: string; email?: string; phone?: string }>({});

  // State for file uploads
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);


  useEffect(() => {
    if (initialCv) {
      setName(initialCv.name);
      setTitle(initialCv.title);
      setSkills(initialCv.skills);
       if (initialCv.experience && initialCv.experience.length > 0) {
        setExperience(initialCv.experience.map((exp, index) => ({ id: Date.now() + index, value: exp })));
      } else {
        setExperience([{ id: Date.now(), value: '' }]);
      }
      setAvatarPreview(initialCv.avatarUrl || null);
      setContactEmail(initialCv.contactEmail || '');
      setPhone(initialCv.phone || '');
      if(initialCv.cvFileName) {
         setCvFile({ name: initialCv.cvFileName } as File);
      }
    }
  }, [initialCv]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleCvFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCvFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { name?: string; title?: string; email?: string; phone?: string } = {};

    if (!name.trim()) {
        newErrors.name = 'Full name is required.';
    }
    if (!title.trim()) {
        newErrors.title = 'Professional title is required.';
    }

    // Basic email format validation
    if (contactEmail && !/\S+@\S+\.\S+/.test(contactEmail)) {
        newErrors.email = 'Please enter a valid email address.';
    }

    // Improved phone number validation
    if (phone && !/^(?=.*\d)[\d\s()+-]{7,20}$/.test(phone)) {
        newErrors.phone = 'Please enter a valid phone number.';
    }
    
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
        onSave({
          name,
          title,
          skills: skills.filter(Boolean),
          experience: experience.map(exp => exp.value).filter(Boolean),
          avatarUrl: avatarPreview || undefined,
          cvFileName: cvFile?.name,
          contactEmail,
          phone,
        });
    }
  };

  // --- Skills Handlers ---
  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newSkill = currentSkill.trim();
      if (newSkill && !skills.includes(newSkill)) {
        setSkills([...skills, newSkill]);
      }
      setCurrentSkill('');
    }
  };

  const handleRemoveSkill = (indexToRemove: number) => {
    setSkills(skills.filter((_, index) => index !== indexToRemove));
  };
  
  // --- Experience Handlers ---
  const handleExperienceChange = (id: number, value: string) => {
    setExperience(currentExperience => 
        currentExperience.map(exp => (exp.id === id ? { ...exp, value } : exp))
    );
  };

  const handleAddExperience = () => {
    setExperience(currentExperience => [...currentExperience, { id: Date.now(), value: '' }]);
  };

  const handleRemoveExperience = (idToRemove: number) => {
    if (experience.length > 1) {
      setExperience(currentExperience => currentExperience.filter(exp => exp.id !== idToRemove));
    }
  };
  
  const inputClasses = (hasError: boolean) => 
    `w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent ${
        hasError 
        ? 'border-red-500' 
        : 'border-gray-300 dark:border-gray-600'
    }`;


  return (
    <div className="bg-white dark:bg-gray-800/50 p-8 rounded-lg shadow-md border border-gray-200 dark:border-gray-700/50 mb-8">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">{initialCv ? 'Edit Your Profile' : 'Create Your Profile'}</h3>
      
      {/* --- Profile Picture Upload --- */}
      <div className="flex items-center space-x-6 mb-8">
        <UserAvatar name={name} imageUrl={avatarPreview} className="w-24 h-24 rounded-full" />
        <div>
          <label htmlFor="avatar-upload" className="cursor-pointer bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-lg font-semibold border border-blue-600 dark:border-blue-500 hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors text-sm">
            Upload Picture
          </label>
          <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">PNG, JPG, GIF up to 10MB.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <div className="mb-4">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Your Details</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className={inputClasses(!!errors.name)} placeholder="e.g., Jane Doe" />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Professional Title</label>
                <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className={inputClasses(!!errors.title)} placeholder="e.g., Senior Software Engineer" />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
              </div>
               <div>
                <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contact Email</label>
                <input type="email" id="contactEmail" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className={inputClasses(!!errors.email)} placeholder="e.g., jane.doe@email.com" />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
               <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                <input type="tel" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClasses(!!errors.phone)} placeholder="e.g., +260 977 123456" />
                 {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
            </div>
        </div>
        
        {/* --- Skills Input --- */}
        <div>
            <label htmlFor="skills-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Top Skills</label>
            <div className="flex flex-wrap items-center gap-2 p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
                {skills.map((skill, index) => (
                    <div key={index} className="flex items-center bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 text-sm font-medium pl-3 pr-2 py-1 rounded-full">
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(index)}
                          className="ml-1.5 flex-shrink-0 w-4 h-4 rounded-full inline-flex items-center justify-center text-blue-500 hover:bg-blue-200 hover:text-blue-700 focus:outline-none"
                          aria-label={`Remove ${skill}`}
                        >
                          <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                    </div>
                ))}
                <input
                    type="text"
                    id="skills-input"
                    value={currentSkill}
                    onChange={(e) => setCurrentSkill(e.target.value)}
                    onKeyDown={handleSkillKeyDown}
                    className="flex-grow p-1 border-none focus:ring-0 text-sm bg-transparent"
                    placeholder="Add a skill and press Enter..."
                />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Press Enter or comma to add a skill.</p>
        </div>
        
        {/* --- Experience Input --- */}
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Experience</label>
            <div className="space-y-4">
                {experience.map((exp, index) => (
                    <div key={exp.id} className="relative bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                         <label htmlFor={`experience-${exp.id}`} className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                            Responsibility #{index + 1}
                        </label>
                        {experience.length > 1 && (
                            <button
                                type="button"
                                onClick={() => handleRemoveExperience(exp.id)}
                                className="absolute top-2 right-2 text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                                aria-label={`Remove experience item ${index + 1}`}
                            >
                                <TrashIcon className="h-4 w-4" />
                            </button>
                        )}
                        <textarea
                            id={`experience-${exp.id}`}
                            value={exp.value}
                            onChange={(e) => handleExperienceChange(exp.id, e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700"
                            placeholder={`e.g., Led the frontend development for Project X, increasing user engagement by 20%...`}
                        />
                    </div>
                ))}
            </div>
            <button
                type="button"
                onClick={handleAddExperience}
                className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Another Experience
            </button>
        </div>

        {/* --- CV Document Upload --- */}
        <div className="relative pt-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-gray-700" /></div>
            <div className="relative flex justify-center text-sm"><span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">OR</span></div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Upload Your CV</label>
          {cvFile ? (
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                    <span className="text-gray-700 dark:text-gray-200 text-sm truncate">{cvFile.name}</span>
                </div>
                <button type="button" onClick={() => setCvFile(null)} className="text-sm font-medium text-red-500 hover:text-red-700">&times; Remove</button>
            </div>
          ) : (
            <label htmlFor="cv-upload" className="cursor-pointer flex justify-center w-full px-6 py-10 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg hover:border-blue-600 transition-colors">
              <div className="text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-semibold text-blue-600">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">PDF, DOCX, TXT (MAX. 5MB)</p>
              </div>
              <input id="cv-upload" name="cv-upload" type="file" accept=".pdf,.doc,.docx,.txt" className="hidden" onChange={handleCvFileChange}/>
            </label>
          )}
        </div>
        
        <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onCancel} className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-6 py-2 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">Cancel</button>
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm">Save Profile</button>
        </div>
      </form>
    </div>
  );
};

export default CvForm;