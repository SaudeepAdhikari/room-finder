import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load user from localStorage on mount, then validate with backend
    useEffect(() => {
        const stored = localStorage.getItem('userSession');
        if (stored) {
            setUser(JSON.parse(stored));
        }
        fetch('/api/auth/me', { credentials: 'include' })
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                if (data) {
                    setUser({ ...data, avatar: data.avatar });
                    localStorage.setItem('userSession', JSON.stringify({ ...data, avatar: data.avatar }));
                } else {
                    setUser(null);
                    localStorage.removeItem('userSession');
                }
            })
            .catch(() => {
                setUser(null);
                localStorage.removeItem('userSession');
            })
            .finally(() => setLoading(false));
    }, []);

    // Handle session expiration
    const handleSessionExpiration = () => {
        setUser(null);
        localStorage.removeItem('userSession');
        // Redirect to login page
        window.location.href = '/auth';
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
            localStorage.setItem('userSession', JSON.stringify(data));
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
            localStorage.setItem('userSession', JSON.stringify(data));
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
            handleSessionExpiration();
            throw new Error('Session expired. Please login again.');
        }
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({ error: 'Profile update failed' }));
            throw new Error(errorData.error || 'Profile update failed');
        }
        const data = await res.json();
        setUser(data);
        localStorage.setItem('userSession', JSON.stringify(data));
        return data;
    }, []);

    // Logout
    const logout = useCallback(async () => {
        await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include',
        });
        setUser(null);
        localStorage.removeItem('userSession');
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