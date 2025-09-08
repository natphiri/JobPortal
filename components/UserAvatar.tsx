import React from 'react';

interface UserAvatarProps {
    name: string;
    imageUrl?: string | null;
    className?: string;
}

// Hashing functions to generate consistent colors from a string.
const getHslColor = (str: string): string => {
    let hash = 0;
    if (str.length === 0) return 'hsl(0, 50%, 75%)';
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const h = hash % 360;
    return `hsl(${h}, 50%, 75%)`; // A pleasant, not too saturated color
}

const getTextColor = (str: string): string => {
    let hash = 0;
     if (str.length === 0) return 'hsl(0, 70%, 20%)';
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const h = hash % 360;
    return `hsl(${h}, 70%, 20%)`; // A dark, readable text color from the same hue
}

const UserAvatar: React.FC<UserAvatarProps> = ({ name, imageUrl, className = '' }) => {
    if (imageUrl) {
        return (
            <img 
                src={imageUrl} 
                alt={name || 'User avatar'}
                className={`object-cover ${className}`}
            />
        );
    }

    const initial = name ? name.charAt(0).toUpperCase() : '?';
    const bgColor = getHslColor(name || 'default');
    const textColor = getTextColor(name || 'default');

    return (
        <div
            className={`flex items-center justify-center font-bold ${className}`}
            style={{ backgroundColor: bgColor, color: textColor }}
            aria-label={name}
        >
            {initial}
        </div>
    );
};

export default UserAvatar;
