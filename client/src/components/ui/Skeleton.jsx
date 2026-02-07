import React from 'react';

const Skeleton = ({ width, height, borderRadius = '12px', className = '' }) => {
    return (
        <div
            className={`skeleton-shimmer ${className}`}
            style={{
                width: width || '100%',
                height: height || '20px',
                borderRadius,
                background: 'linear-gradient(90deg, var(--gray-200) 25%, var(--gray-100) 50%, var(--gray-200) 75%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s infinite linear'
            }}
        />
    );
};

export default Skeleton;
