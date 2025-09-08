import React from 'react';
import { CV } from '../types';
import UserAvatar from './UserAvatar';

interface CvCardProps {
  cv: CV;
}

const CvCard: React.FC<CvCardProps> = ({ cv }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-200 h-full flex flex-col">
      <div className="flex items-center space-x-4 mb-4">
        <UserAvatar name={cv.name} imageUrl={cv.avatarUrl} className="w-16 h-16 rounded-full" />
        <div>
          <h3 className="text-xl font-bold text-gray-900">{cv.name}</h3>
          <p className="text-blue-600 font-medium">{cv.title}</p>
        </div>
      </div>

      <div className="flex-grow">
        <h4 className="font-semibold text-gray-700 text-sm mb-2">Top Skills</h4>
        <div className="flex flex-wrap gap-2 mb-4">
          {cv.skills.map(skill => (
            <span key={skill} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">{skill}</span>
          ))}
        </div>
      
        <h4 className="font-semibold text-gray-700 text-sm mb-2">Experience</h4>
        <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm mb-4">
            {cv.experience.map((exp, index) => <li key={index}>{exp}</li>)}
        </ul>

        {cv.cvFileName && (
          <div>
            <h4 className="font-semibold text-gray-700 text-sm mb-2">Uploaded CV</h4>
            <div className="flex items-center p-2 rounded-md bg-gray-100 border border-gray-200">
              <svg className="w-5 h-5 text-gray-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              <span className="text-gray-700 text-sm truncate">{cv.cvFileName}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CvCard;