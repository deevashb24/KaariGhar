import React, { useState, useContext } from 'react';
import { AuthContext } from '../../AuthContext';
import { useNavigate } from 'react-router-dom';
import './AuthTabs.css';

export default function AuthTabs() {
    const [tab, setTab] = useState('login'); // login or register
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState('CUSTOMER'); // CUSTOMER or MAKER
    const [error, setError] = useState('');

    const { login, register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (tab === 'login') {
                const user = await login(email, password);
                if (user.role === 'CUSTOMER') navigate('/customer');
                else if (user.role === 'MAKER') navigate('/maker');
            } else {
                const user = await register(email, password, name, role);
                if (user.role === 'CUSTOMER') navigate('/customer');
                else if (user.role === 'MAKER') navigate('/maker');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Authentication failed');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>KaariGhar Portal</h2>
                <div className="auth-tabs">
                    <button className={tab === 'login' ? 'active' : ''} onClick={() => setTab('login')}>Login</button>
                    <button className={tab === 'register' ? 'active' : ''} onClick={() => setTab('register')}>Register</button>
                </div>

                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    {tab === 'register' && (
                        <>
                            <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
                            <select value={role} onChange={(e) => setRole(e.target.value)}>
                                <option value="CUSTOMER">I want custom furniture (Customer)</option>
                                <option value="MAKER">I build custom furniture (Maker)</option>
                            </select>
                        </>
                    )}
                    <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />

                    <button type="submit" className="gold-btn">
                        {tab === 'login' ? 'Sign In' : 'Create Account'}
                    </button>
                </form>
            </div>
        </div>
    );
}
