import React from 'react';
import { CV } from '../types';
import CvForm from './CvForm';

interface EmployeeProfilePageProps {
  cv: CV;
  onSave: (cvData: Omit<CV, 'id' | 'userId'>) => void;
  onCancel: () => void;
}

const EmployeeProfilePage: React.FC<EmployeeProfilePageProps> = ({ cv, onSave, onCancel }) => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto">
        <CvForm initialCv={cv} onSave={onSave} onCancel={onCancel} />
      </div>
    </div>
  );
};

export default EmployeeProfilePage;
