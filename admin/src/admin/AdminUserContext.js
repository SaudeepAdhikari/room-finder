import React, { createContext, useContext, useState, useEffect } from 'react';


const AdminUserContext = createContext();

export function useAdminUser() {
    return useContext(AdminUserContext);
}

export function AdminUserProvider({ children }) {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // On mount verify admin session with backend and load current admin if authenticated
        (async () => {
            try {
                const res = await fetch('/api/admin/me', { credentials: 'include' });
                if (res.ok) {
                    const data = await res.json();
                    setAdmin(data);
                } else {
                    setAdmin(null);
                }
            } catch (err) {
                setAdmin(null);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    // Call this after successful backend login to sync admin state in the UI.
    const login = (adminData) => {
        setAdmin(adminData);
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
        }
    };

    return (
        <AdminUserContext.Provider value={{ admin, loading, login, logout }}>
            {children}
        </AdminUserContext.Provider>
    );
} 