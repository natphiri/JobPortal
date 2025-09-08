import React from 'react';

interface CompanyLogoPlaceholderProps {
    companyName: string;
    className?: string;
}

// Simple hash function to get a color from a string
const stringToColor = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xFF;
        color += ('00' + value.toString(16)).substr(-2);
    }
    return color;
}

const getHslColor = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const h = hash % 360;
    return `hsl(${h}, 60%, 85%)`; // Using HSL for more pleasant, pastel-like colors
}

const getTextColor = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const h = hash % 360;
    return `hsl(${h}, 80%, 25%)`; // Darker text color from the same hue
}

const CompanyLogoPlaceholder: React.FC<CompanyLogoPlaceholderProps> = ({ companyName, className = '' }) => {
    const initial = companyName ? companyName.charAt(0).toUpperCase() : '?';
    const bgColor = getHslColor(companyName);
    const textColor = getTextColor(companyName);

    return (
        <div
            className={`w-12 h-12 rounded-md flex items-center justify-center font-bold text-xl flex-shrink-0 ${className}`}
            style={{ backgroundColor: bgColor, color: textColor }}
        >
            {initial}
        </div>
    );
};

export default CompanyLogoPlaceholder;