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
        // Development convenience: auto-set a stub admin user only when explicitly
        // enabled by the REACT_APP_DEV_ADMIN environment variable. This avoids
        // showing the dashboard by default and keeps behavior consistent with
        // production.
        if (!stored && process.env.REACT_APP_DEV_ADMIN === 'true') {
            const devAdmin = { id: 'dev-admin', name: 'Dev Admin', email: 'admin@example.com' };
            setAdmin(devAdmin);
            localStorage.setItem('adminUser', JSON.stringify(devAdmin));
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