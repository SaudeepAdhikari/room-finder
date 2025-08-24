import React from 'react';

export default function Toast({ message, type = 'info', onClose }) {
  if (!message) return null;
  return (
    <div className={`admin-toast admin-toast-${type}`} role="status">
      <div className="admin-toast-message">{message}</div>
      <button className="admin-toast-close" onClick={onClose}>×</button>
    </div>
  );
}
