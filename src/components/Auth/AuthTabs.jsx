import React, { useState, useContext, useRef, useEffect } from 'react';
import { AuthContext } from '../../AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import { Mail, Lock, User, Briefcase, ChevronLeft, Phone, MapPin, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../supabaseClient';

import walnutBg from '../../assets/walnut-bg.png';

export default function AuthTabs() {
    const [tab, setTab] = useState('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState('CUSTOMER');
    const [phone, setPhone] = useState('');
    const [city, setCity] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formVisible, setFormVisible] = useState(true);

    const { user, login, register } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            const target = user.role === 'ADMIN' ? '/admin' : user.role === 'MAKER' ? '/maker' : '/customer';
            navigate(target);
        }
    }, [user, navigate]);

    const switchTab = (newTab) => {
        if (newTab === tab) return;
        setFormVisible(false);
        setTimeout(() => {
            setTab(newTab);
            setFormVisible(true);
        }, 280);
    };

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        try {
            await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth`
                }
            });
        } catch (error) {
            toast.error(error.message || 'Failed to start Google login');
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (tab === 'login') {
                await login(email, password);
                toast.success('Login successful! Syncing profile...');
            } else {
                await register(email, password, name, role, phone, city);
                toast.success('Account created! Syncing profile...');
            }
            // Navigation is handled by the useEffect when 'user' state updates from AuthContext
        } catch (err) {
            toast.error(err.message || 'Authentication failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            <Toaster position="top-center" toastOptions={{
                style: { background: '#1a1a1a', color: '#e8d5b0', border: '1px solid rgba(196,160,90,0.3)', borderRadius: '12px' }
            }} />

            {/* ── Left Panel: Walnut Texture ── */}
            <div style={styles.leftPanel}>
                <div
                    style={{
                        ...styles.leftBg,
                        backgroundImage: `url(${walnutBg})`,
                    }}
                />
                {/* Dark gradient overlay */}
                <div style={styles.leftOverlay} />

                {/* Back button */}
                <button style={styles.backBtn} onClick={() => navigate('/')}>
                    <ChevronLeft size={16} style={{ marginRight: 4 }} />
                    Back to Home
                </button>

                {/* Shakespeare / brand sidebar text */}
                <div style={styles.sidebarText}>
                    <div style={styles.sidebarLine} />
                    <p style={styles.sidebarQuote}>
                        "What a piece of work is a man, how noble in reason, how infinite in faculties,
                        in form and moving how express and admirable."
                    </p>
                    <span style={styles.sidebarAttr}>— Shakespeare, Hamlet</span>
                </div>

                {/* Bottom caption */}
                <div style={styles.leftCaption}>
                    <span style={styles.captionText}>CARVED WALNUT SIDEBOARD, KASHMIR 2024</span>
                    <div style={styles.captionLine} />
                </div>
            </div>

            {/* ── Right Panel: Form ── */}
            <div style={styles.rightPanel}>
                {/* Top logo mark */}
                <div style={styles.logoMark}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                        <path d="M3 12L12 3L21 12V21H3V12Z" stroke="#c4a05a" strokeWidth="1.5" strokeLinejoin="round" />
                        <path d="M9 21V15H15V21" stroke="#c4a05a" strokeWidth="1.5" strokeLinejoin="round" />
                    </svg>
                    <span style={styles.logoText}>KaariGhar</span>
                </div>

                {/* Form Container */}
                <div style={styles.formContainer}>
                    {/* Header */}
                    <div style={styles.formHeader}>
                        <h1 style={styles.welcomeText}>
                            {tab === 'login' ? 'Welcome Back' : 'Join KaariGhar'}
                        </h1>
                        <p style={styles.subText}>
                            {tab === 'login'
                                ? 'Sign in to continue to your dashboard.'
                                : 'Create your account to get started.'}
                        </p>
                    </div>

                    {/* Tab Toggle — prominent gold pill buttons */}
                    <div style={styles.tabToggle}>
                        <button
                            type="button"
                            style={tab === 'login' ? styles.tabBtnActive : styles.tabBtnInactive}
                            onClick={() => switchTab('login')}
                        >
                            Login
                        </button>
                        <button
                            type="button"
                            style={tab === 'register' ? styles.tabBtnActive : styles.tabBtnInactive}
                            onClick={() => switchTab('register')}
                        >
                            Register
                        </button>
                    </div>
                    
                    {/* Google OAuth Button */}
                    <button 
                        type="button" 
                        style={styles.googleBtn} 
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ marginRight: 10 }}>
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        Continue with Google
                    </button>
                    
                    <div style={styles.divider}>
                        <span style={styles.dividerLine} />
                        <span style={styles.dividerText}>OR</span>
                        <span style={styles.dividerLine} />
                    </div>

                    {/* Form */}
                    <form
                        onSubmit={handleSubmit}
                        style={{
                            ...styles.form,
                            opacity: formVisible ? 1 : 0,
                            transform: formVisible ? 'translateY(0)' : 'translateY(12px)',
                            transition: 'opacity 0.28s ease, transform 0.28s ease',
                        }}
                    >
                        {tab === 'register' && (
                            <>
                                <InputField
                                    icon={<User size={17} />}
                                    placeholder="Full Name"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    required
                                />
                                <div style={styles.selectWrapper}>
                                    <Briefcase size={17} style={styles.selectIcon} />
                                    <select
                                        style={styles.select}
                                        value={role}
                                        onChange={e => setRole(e.target.value)}
                                    >
                                        <option value="CUSTOMER">I want custom furniture (Customer)</option>
                                        <option value="MAKER">I build custom furniture (Maker)</option>
                                    </select>
                                </div>
                                <div style={styles.rowFields}>
                                    <InputField
                                        icon={<Phone size={17} />}
                                        placeholder="Phone Number"
                                        type="tel"
                                        value={phone}
                                        onChange={e => setPhone(e.target.value)}
                                    />
                                    <InputField
                                        icon={<MapPin size={17} />}
                                        placeholder="City (e.g. Kanpur)"
                                        value={city}
                                        onChange={e => setCity(e.target.value)}
                                    />
                                </div>
                            </>
                        )}

                        <InputField
                            icon={<Mail size={17} />}
                            placeholder="Email Address"
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />

                        {/* Password with eye toggle */}
                        <div style={styles.inputWrapper}>
                            <span style={styles.inputIcon}><Lock size={17} /></span>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                style={styles.input}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(v => !v)}
                                style={styles.eyeBtn}
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>

                        {/* Primary CTA */}
                        <button type="submit" style={styles.submitBtn} disabled={isLoading}>
                            {isLoading ? (
                                <span style={styles.loadingDots}>
                                    <span style={styles.dot} />
                                    <span style={{ ...styles.dot, animationDelay: '0.15s' }} />
                                    <span style={{ ...styles.dot, animationDelay: '0.3s' }} />
                                </span>
                            ) : (
                                tab === 'login' ? 'Sign In ↗' : 'Create Account ↗'
                            )}
                        </button>
                    </form>

                    {/* Switch link */}
                    <p style={styles.switchText}>
                        {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
                        <button
                            type="button"
                            style={styles.switchLink}
                            onClick={() => switchTab(tab === 'login' ? 'register' : 'login')}
                        >
                            {tab === 'login' ? 'Register now' : 'Sign in'}
                        </button>
                    </p>
                </div>

                {/* Bottom ticker */}
                <div style={styles.bottomTicker}>
                    <span style={styles.tickerText}>
                        ARCHITECTURE+ &nbsp;|&nbsp; INTERIOR ARCHITECTURE+ &nbsp;|&nbsp; MATERIAL TRUTH+ &nbsp;|&nbsp;
                        BESPOKE CRAFTSMANSHIP+ &nbsp;|&nbsp; HANDMADE OBJECTS+ &nbsp;|&nbsp; SLOW DESIGN+ &nbsp;|&nbsp;
                        HERITAGE & CRAFT+
                    </span>
                </div>
            </div>

            <style>{`
                @keyframes pulse-dot {
                    0%, 80%, 100% { transform: scale(0); opacity: 0.3; }
                    40% { transform: scale(1); opacity: 1; }
                }
                input::placeholder { color: rgba(196,160,90,0.35); }
                select option { background: #141414; color: #e8d5b0; }
                button:disabled { opacity: 0.65; cursor: not-allowed; }
            `}</style>
        </div>
    );
}

/* ── Reusable input field ── */
function InputField({ icon, placeholder, type = 'text', value, onChange, required = false }) {
    const [focused, setFocused] = useState(false);
    return (
        <div style={{
            ...styles.inputWrapper,
            borderColor: focused ? 'rgba(196,160,90,0.8)' : 'rgba(196,160,90,0.2)',
            boxShadow: focused ? '0 0 0 3px rgba(196,160,90,0.08)' : 'none',
        }}>
            <span style={styles.inputIcon}>{icon}</span>
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                style={styles.input}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
            />
        </div>
    );
}

/* ── Styles ── */
const styles = {
    page: {
        display: 'flex',
        minHeight: '100vh',
        background: '#0d0d0d',
        fontFamily: "'Inter', sans-serif",
        overflow: 'hidden',
    },

    /* Left */
    leftPanel: {
        flex: '0 0 50%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
    },
    leftBg: {
        position: 'absolute',
        inset: 0,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transform: 'scale(1.04)',
        transition: 'transform 8s ease',
    },
    leftOverlay: {
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to right, rgba(5,5,5,0.25) 0%, rgba(5,5,5,0.55) 100%), linear-gradient(to top, rgba(5,5,5,0.85) 0%, transparent 55%)',
    },
    backBtn: {
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        margin: '28px 32px',
        padding: '10px 20px',
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '99px',
        color: 'rgba(255,255,255,0.55)',
        fontSize: '11px',
        fontWeight: 500,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        backdropFilter: 'blur(12px)',
        transition: 'all 0.2s ease',
        alignSelf: 'flex-start',
    },
    sidebarText: {
        position: 'absolute',
        bottom: '120px',
        left: '36px',
        right: '60px',
        zIndex: 10,
    },
    sidebarLine: {
        width: '32px',
        height: '1px',
        background: 'rgba(196,160,90,0.5)',
        marginBottom: '16px',
    },
    sidebarQuote: {
        fontSize: '13px',
        lineHeight: 1.75,
        color: 'rgba(232,213,176,0.65)',
        fontStyle: 'italic',
        fontFamily: "'Instrument Serif', serif",
        margin: '0 0 10px 0',
    },
    sidebarAttr: {
        fontSize: '10px',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: 'rgba(196,160,90,0.45)',
    },
    leftCaption: {
        position: 'absolute',
        bottom: '32px',
        left: '36px',
        right: '36px',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
    },
    captionText: {
        fontSize: '9px',
        letterSpacing: '0.25em',
        textTransform: 'uppercase',
        color: 'rgba(196,160,90,0.5)',
        whiteSpace: 'nowrap',
    },
    captionLine: {
        flex: 1,
        height: '1px',
        background: 'rgba(196,160,90,0.15)',
    },

    /* Right */
    rightPanel: {
        flex: '0 0 50%',
        display: 'flex',
        flexDirection: 'column',
        background: '#0d0d0d',
        position: 'relative',
        borderLeft: '1px solid rgba(196,160,90,0.08)',
    },
    logoMark: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '30px 48px',
    },
    logoText: {
        fontSize: '14px',
        fontWeight: 500,
        letterSpacing: '0.1em',
        color: 'rgba(232,213,176,0.7)',
        textTransform: 'uppercase',
    },
    formContainer: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 64px',
        maxWidth: '480px',
        width: '100%',
        alignSelf: 'center',
    },
    formHeader: {
        marginBottom: '36px',
    },
    welcomeText: {
        fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
        fontFamily: "'Instrument Serif', serif",
        fontStyle: 'italic',
        color: '#e8d5b0',
        margin: '0 0 10px 0',
        lineHeight: 1.15,
        fontWeight: 400,
    },
    subText: {
        fontSize: '13px',
        color: 'rgba(232,213,176,0.4)',
        letterSpacing: '0.02em',
        margin: 0,
    },

    /* Tab Toggle */
    tabToggle: {
        display: 'flex',
        gap: '10px',
        marginBottom: '32px',
    },
    tabBtnActive: {
        flex: 1,
        padding: '14px 24px',
        background: 'linear-gradient(135deg, #c4a05a 0%, #e8c97a 50%, #c4a05a 100%)',
        border: 'none',
        borderRadius: '12px',
        color: '#0d0d0d',
        fontSize: '13px',
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        transition: 'all 0.25s ease',
        boxShadow: '0 8px 32px rgba(196,160,90,0.3)',
    },
    tabBtnInactive: {
        flex: 1,
        padding: '14px 24px',
        background: 'rgba(196,160,90,0.05)',
        border: '1px solid rgba(196,160,90,0.2)',
        borderRadius: '12px',
        color: 'rgba(196,160,90,0.55)',
        fontSize: '13px',
        fontWeight: 600,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        transition: 'all 0.25s ease',
    },
    
    googleBtn: {
        width: '100%',
        padding: '14px',
        background: '#ffffff',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '12px',
        color: '#000000',
        fontSize: '14px',
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        marginBottom: '20px',
    },
    divider: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '20px',
    },
    dividerLine: {
        flex: 1,
        height: '1px',
        background: 'rgba(196,160,90,0.15)',
    },
    dividerText: {
        color: 'rgba(196,160,90,0.4)',
        fontSize: '11px',
        padding: '0 12px',
        letterSpacing: '0.1em',
    },

    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
    },
    inputWrapper: {
        display: 'flex',
        alignItems: 'center',
        background: 'rgba(196,160,90,0.04)',
        border: '1px solid rgba(196,160,90,0.2)',
        borderRadius: '12px',
        padding: '0 16px',
        gap: '12px',
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
        height: '52px',
    },
    inputIcon: {
        color: 'rgba(196,160,90,0.5)',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        background: 'none',
        border: 'none',
        outline: 'none',
        color: '#e8d5b0',
        fontSize: '14px',
        letterSpacing: '0.02em',
        height: '100%',
    },
    eyeBtn: {
        background: 'none',
        border: 'none',
        color: 'rgba(196,160,90,0.4)',
        cursor: 'pointer',
        padding: '4px',
        display: 'flex',
        alignItems: 'center',
        flexShrink: 0,
    },
    selectWrapper: {
        display: 'flex',
        alignItems: 'center',
        background: 'rgba(196,160,90,0.04)',
        border: '1px solid rgba(196,160,90,0.2)',
        borderRadius: '12px',
        padding: '0 16px',
        gap: '12px',
        height: '52px',
    },
    selectIcon: {
        color: 'rgba(196,160,90,0.5)',
        flexShrink: 0,
    },
    select: {
        flex: 1,
        background: 'none',
        border: 'none',
        outline: 'none',
        color: '#e8d5b0',
        fontSize: '14px',
        cursor: 'pointer',
        appearance: 'none',
    },
    rowFields: {
        display: 'flex',
        gap: '12px',
    },
    submitBtn: {
        marginTop: '8px',
        width: '100%',
        padding: '18px',
        background: 'linear-gradient(135deg, #b8923a 0%, #e8c97a 40%, #c4a05a 70%, #a07830 100%)',
        border: 'none',
        borderRadius: '12px',
        color: '#0d0d0d',
        fontSize: '14px',
        fontWeight: 700,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 12px 40px rgba(196,160,90,0.35), 0 4px 12px rgba(196,160,90,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
    },

    loadingDots: {
        display: 'flex',
        gap: '5px',
        alignItems: 'center',
    },
    dot: {
        width: '7px',
        height: '7px',
        borderRadius: '50%',
        background: '#0d0d0d',
        animation: 'pulse-dot 1.2s infinite ease-in-out',
    },

    switchText: {
        marginTop: '24px',
        fontSize: '12.5px',
        color: 'rgba(196,160,90,0.4)',
        textAlign: 'center',
        letterSpacing: '0.02em',
    },
    switchLink: {
        background: 'none',
        border: 'none',
        color: '#c4a05a',
        fontSize: '12.5px',
        cursor: 'pointer',
        padding: 0,
        textDecoration: 'underline',
        textDecorationColor: 'rgba(196,160,90,0.35)',
    },

    /* Ticker */
    bottomTicker: {
        borderTop: '1px solid rgba(196,160,90,0.08)',
        padding: '16px 32px',
        overflow: 'hidden',
    },
    tickerText: {
        fontSize: '9px',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: 'rgba(196,160,90,0.25)',
        whiteSpace: 'nowrap',
    },
};
