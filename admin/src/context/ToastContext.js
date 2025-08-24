import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast from '../components/Toast';

const ToastContext = createContext();

export function ToastProvider({ children }) {
    const [toast, setToast] = useState({ message: '', type: 'info' });

    const showToast = useCallback((message, type = 'info') => {
        setToast({ message, type });
    }, []);

    const handleClose = useCallback(() => {
        setToast({ message: '', type: 'info' });
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <Toast message={toast.message} type={toast.type} onClose={handleClose} />
        </ToastContext.Provider>
    );
}

export function useToast() {
    return useContext(ToastContext);
}
