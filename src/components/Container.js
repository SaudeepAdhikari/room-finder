import React from 'react';

export default function Container({ children, style = {}, ...props }) {
    return (
        <div
            style={{
                width: '100%',
                maxWidth: 1200,
                margin: '0 auto',
                padding: 'var(--space-8) var(--space-4)',
                boxSizing: 'border-box',
                ...style,
            }}
            {...props}
        >
            {children}
        </div>
    );
} 