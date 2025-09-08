import React from 'react';

interface SpinnerProps {
    small?: boolean;
}

const Spinner: React.FC<SpinnerProps> = ({ small = false }) => {
    const sizeClasses = small ? 'h-5 w-5' : 'h-8 w-8';
    const borderClasses = small ? 'border-2' : 'border-4';

    return (
        <div className={`animate-spin rounded-full ${sizeClasses} ${borderClasses} border-blue-500 border-t-transparent`}></div>
    );
};

export default Spinner;