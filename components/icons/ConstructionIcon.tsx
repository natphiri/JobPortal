import React from 'react';

const ConstructionIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.83-5.83M11.42 15.17l-4.95-4.95a2.652 2.652 0 010-3.749l5.25-5.25a2.652 2.652 0 013.749 0l4.95 4.95M11.42 15.17L5.83 21M16.5 11.42L21 6.92" />
    </svg>
);

export default ConstructionIcon;