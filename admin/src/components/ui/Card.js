import React from 'react';
import './Card.css';

export default function Card({ children, className = '', hoverable = false, ...props }) {
  return (
    <div className={`admin-card ${className} ${hoverable ? 'hoverable' : ''}`} {...props}>
      {children}
    </div>
  );
}

