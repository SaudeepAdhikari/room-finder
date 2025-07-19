import React, { useState, useEffect } from 'react';
import { useUser } from './context/UserContext';
import Container from './components/Container';
import { useNavigate } from 'react-router-dom';

function AuthPage({ onNavigate }) {
    const [mode, setMode] = useState('login'); // 'login' or 'register'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const { user, login, register } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);
        try {
            if (mode === 'login') {
                await login(email, password);
                setSuccess('Login successful!');
            } else {
                await register(email, password, phone);
                setSuccess('Registration successful!');
            }
            setEmail('');
            setPassword('');
            setPhone('');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleModeChange = (newMode) => {
        setMode(newMode);
        setError('');
        setSuccess('');
        setEmail('');
        setPassword('');
        setPhone('');
    };

    return (
        <Container style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="card" style={{ maxWidth: 400, width: '100%', padding: 32, boxShadow: 'var(--card-shadow)', borderRadius: 'var(--card-radius)', background: 'var(--card-bg)', border: 'var(--card-border, none)' }}>
                <h2 className="card-title" style={{ textAlign: 'center', marginBottom: 24 }}>
                    {mode === 'login' ? 'Login to Your Account' : 'Create an Account'}
                </h2>
                <form onSubmit={handleSubmit} style={{ width: '100%' }} autoComplete="on">
                    <div style={{ marginBottom: 20 }}>
                        <label htmlFor="email" style={{ display: 'block', marginBottom: 8, color: 'var(--text-primary)', fontWeight: 600 }}>Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            autoComplete="email"
                            style={{ width: '100%', height: 'var(--input-height)', padding: 'var(--input-padding)', borderRadius: 'var(--input-radius)', border: 'var(--input-border)', fontSize: 16, background: 'var(--surface)', color: 'var(--text-primary)', outline: 'none', transition: 'border var(--transition)' }}
                            onFocus={e => e.target.style.border = 'var(--input-border-focus)'}
                            onBlur={e => e.target.style.border = 'var(--input-border)'}
                        />
                    </div>
                    {mode === 'register' && (
                        <div style={{ marginBottom: 20 }}>
                            <label htmlFor="phone" style={{ display: 'block', marginBottom: 8, color: 'var(--text-primary)', fontWeight: 600 }}>Phone Number</label>
                            <input
                                id="phone"
                                type="tel"
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                                required
                                autoComplete="tel"
                                placeholder="Enter your phone number"
                                style={{ width: '100%', height: 'var(--input-height)', padding: 'var(--input-padding)', borderRadius: 'var(--input-radius)', border: 'var(--input-border)', fontSize: 16, background: 'var(--surface)', color: 'var(--text-primary)', outline: 'none', transition: 'border var(--transition)' }}
                                onFocus={e => e.target.style.border = 'var(--input-border-focus)'}
                                onBlur={e => e.target.style.border = 'var(--input-border)'}
                            />
                        </div>
                    )}
                    <div style={{ marginBottom: 20 }}>
                        <label htmlFor="password" style={{ display: 'block', marginBottom: 8, color: 'var(--text-primary)', fontWeight: 600 }}>Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                            style={{ width: '100%', height: 'var(--input-height)', padding: 'var(--input-padding)', borderRadius: 'var(--input-radius)', border: 'var(--input-border)', fontSize: 16, background: 'var(--surface)', color: 'var(--text-primary)', outline: 'none', transition: 'border var(--transition)' }}
                            onFocus={e => e.target.style.border = 'var(--input-border-focus)'}
                            onBlur={e => e.target.style.border = 'var(--input-border)'}
                        />
                    </div>
                    {error && <div className="card-error" style={{ marginBottom: 16, color: 'var(--danger)', background: 'rgba(239,68,68,0.08)', borderRadius: 8, padding: '8px 12px', fontWeight: 600 }}>{error}</div>}
                    {success && <div style={{ color: 'var(--success)', background: 'rgba(16,185,129,0.08)', marginBottom: 16, fontWeight: 600, borderRadius: 8, padding: '8px 12px' }}>{success}</div>}
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            height: 'var(--btn-height)',
                            padding: 'var(--btn-padding)',
                            borderRadius: 'var(--btn-radius)',
                            background: 'var(--primary-gradient)',
                            color: 'var(--text-inverse)',
                            fontWeight: 'var(--btn-font-weight)',
                            fontSize: 18,
                            border: 'none',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            marginBottom: 12,
                            transition: 'all var(--transition)',
                            boxShadow: loading ? 'none' : 'var(--shadow-sm)',
                            opacity: loading ? 0.7 : 1,
                        }}
                    >
                        {loading ? (mode === 'login' ? 'Logging in...' : 'Registering...') : (mode === 'login' ? 'Login' : 'Register')}
                    </button>
                </form>
                <div style={{ textAlign: 'center', marginTop: 12 }}>
                    {mode === 'login' ? (
                        <>
                            Don&apos;t have an account?{' '}
                            <button onClick={() => handleModeChange('register')} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600, textDecoration: 'underline', fontSize: 15 }}>Register</button>
                        </>
                    ) : (
                        <>
                            Already have an account?{' '}
                            <button onClick={() => handleModeChange('login')} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600, textDecoration: 'underline', fontSize: 15 }}>Login</button>
                        </>
                    )}
                </div>
            </div>
        </Container>
    );
}

export default AuthPage; 