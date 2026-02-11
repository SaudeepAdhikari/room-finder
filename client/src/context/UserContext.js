import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';


const UserContext = createContext();

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // On mount, validate session with backend and load current user if authenticated
    useEffect(() => {
        fetch('/api/auth/me', { credentials: 'include' })
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                if (data) {
                    setUser({ ...data, avatar: data.avatar });
                } else {
                    setUser(null);
                }
            })
            .catch(() => {
                setUser(null);
            })
            .finally(() => setLoading(false));
    }, []);

    // Handle session expiration
    const handleSessionExpiration = () => {
        // Dispatch event for soft redirect instead of hard reload
        // Note: We intentionally DO NOT setUser(null) here to avoid unmounting 
        // the Profile page (and its error messages) too early.
        try {
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('unauthorized-api-call', {
                    detail: { message: 'Session expired. Please login again.' }
                }));
            }
        } catch (e) {
            console.warn('handleSessionExpiration redirect failed', e);
        }
    };

    // Login
    const login = useCallback(async (email, password) => {
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email, password })
            });
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({ error: 'Login failed' }));
                throw new Error(errorData.error || 'Login failed');
            }
            const data = await res.json();
            setUser(data);
            return data;
        } catch (error) {
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error('Network error: Please check if the server is running');
            }
            throw error;
        }
    }, []);

    // Register
    const register = useCallback(async (email, password, phone, firstName, lastName) => {
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email, password, phone, firstName, lastName })
            });
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({ error: 'Registration failed' }));
                throw new Error(errorData.error || 'Registration failed');
            }
            const data = await res.json();
            setUser(data);
            return data;
        } catch (error) {
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error('Network error: Please check if the server is running');
            }
            throw error;
        }
    }, []);

    // Profile update
    const updateProfile = useCallback(async (profile) => {
        const res = await fetch('/api/auth/me', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(profile)
        });
        if (res.status === 401) {
            // Dispatch event for soft redirect
            try {
                if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('unauthorized-api-call', {
                        detail: { message: 'Session expired. Please login again.' }
                    }));
                }
            } catch (e) { /* ignore */ }
            throw new Error('Session expired. Please login again.');
        }
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({ error: 'Profile update failed' }));
            throw new Error(errorData.error || 'Profile update failed');
        }
        const data = await res.json();
        setUser(data);
        return data;
    }, []);

    // Logout
    const logout = useCallback(async () => {
        await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include',
        });
        setUser(null);
    }, []);

    return (
        <UserContext.Provider value={{ user, loading, login, register, logout, setUser, updateProfile, handleSessionExpiration }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
} 