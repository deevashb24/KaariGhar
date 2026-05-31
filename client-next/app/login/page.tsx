"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast, Toaster } from 'react-hot-toast';
import { Mail, Lock, User, Briefcase, ChevronLeft, Phone, MapPin } from 'lucide-react';
import './AuthTabs.css';

export default function LoginPage() {
    const [tab, setTab] = useState('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState('CUSTOMER');
    const [phone, setPhone] = useState('');
    const [city, setCity] = useState('');
    const [isAnimating, setIsAnimating] = useState(false);

    const router = useRouter();

    const switchTab = (newTab: string) => {
        setIsAnimating(true);
        setTimeout(() => {
            setTab(newTab);
            setIsAnimating(false);
        }, 300);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (tab === 'login') {
                toast.success(`Welcome back! MOCK LOGIN SUCCESS`);
                setTimeout(() => router.push('/'), 1000); // Redirects to home since mock
            } else {
                toast.success(`Account created successfully!`);
                setTimeout(() => router.push('/'), 1000);
            }
        } catch (err) {
            toast.error('Authentication failed');
        }
    };

    return (
        <div className="auth-split-container">
            <Toaster position="top-center" toastOptions={{
                style: {
                    background: '#333',
                    color: '#fff',
                }
            }} />

            {/* Left Panel */}
            <div className="auth-left-panel" style={{ backgroundImage: `url('/auth-bg.png')` }}>
                <div className="auth-overlay">
                    <button className="back-button" onClick={() => router.push('/')}>
                        <ChevronLeft size={20} /> Back to Home
                    </button>
                    <div className="auth-brand-content">
                        <h1>KaariGhar</h1>
                        <p>Crafting trust in every grain. Connect with master artisans or find your next masterpiece.</p>
                    </div>
                </div>
            </div>

            {/* Right Panel */}
            <div className="auth-right-panel">
                <div className="auth-form-card">
                    <div className="auth-header">
                        <h2>{tab === 'login' ? 'Welcome Back' : 'Join KaariGhar'}</h2>
                        <p>{tab === 'login' ? 'Sign in to continue to your dashboard.' : 'Create an account to get started.'}</p>
                    </div>

                    <div className="auth-tabs-toggle">
                        <button className={tab === 'login' ? 'active' : ''} type="button" onClick={() => switchTab('login')}>Login</button>
                        <button className={tab === 'register' ? 'active' : ''} type="button" onClick={() => switchTab('register')}>Register</button>
                    </div>

                    <form onSubmit={handleSubmit} className={`auth-form ${isAnimating ? 'fade-out' : 'fade-in'}`}>
                        {tab === 'register' && (
                            <>
                                <div className="input-group">
                                    <User size={18} className="input-icon" />
                                    <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
                                </div>
                                <div className="input-group">
                                    <Briefcase size={18} className="input-icon" />
                                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                                        <option value="CUSTOMER">I want custom furniture (Customer)</option>
                                        <option value="MAKER">I build custom furniture (Maker)</option>
                                    </select>
                                </div>
                                <div className="auth-row">
                                    <div className="input-group">
                                        <Phone size={18} className="input-icon" />
                                        <input type="tel" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
                                    </div>
                                    <div className="input-group">
                                        <MapPin size={18} className="input-icon" />
                                        <input type="text" placeholder="City (e.g. Kanpur)" value={city} onChange={(e) => setCity(e.target.value)} />
                                    </div>
                                </div>
                            </>
                        )}
                        <div className="input-group">
                            <Mail size={18} className="input-icon" />
                            <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="input-group">
                            <Lock size={18} className="input-icon" />
                            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>

                        <button type="submit" className="gold-btn auth-submit">
                            {tab === 'login' ? 'Sign In' : 'Create Account'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
