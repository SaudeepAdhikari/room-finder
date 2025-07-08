import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch current user on mount
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
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, []);

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
    const register = useCallback(async (email, password, phone) => {
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email, password, phone })
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

    // Logout
    const logout = useCallback(async () => {
        await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include',
        });
        setUser(null);
    }, []);

    return (
        <UserContext.Provider value={{ user, loading, login, register, logout, setUser }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
} 