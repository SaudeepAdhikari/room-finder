import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminUserContext = createContext();

export function useAdminUser() {
    return useContext(AdminUserContext);
}

export function AdminUserProvider({ children }) {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load admin from localStorage (or session/cookie)
        const stored = localStorage.getItem('adminUser');
        if (stored) {
            setAdmin(JSON.parse(stored));
        }
        setLoading(false);
    }, []);

    const login = (adminData) => {
        setAdmin(adminData);
        localStorage.setItem('adminUser', JSON.stringify(adminData));
    };

    const logout = async () => {
        try {
            // Call admin logout endpoint
            await fetch('/api/admin/logout', {
                method: 'POST',
                credentials: 'include',
            });
        } catch (error) {
            console.error('Admin logout error:', error);
        } finally {
            setAdmin(null);
            localStorage.removeItem('adminUser');
        }
    };

    return (
        <AdminUserContext.Provider value={{ admin, loading, login, logout }}>
            {children}
        </AdminUserContext.Provider>
    );
} 