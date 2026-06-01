import React, { useState, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import api from '../api';
import { toast } from 'react-hot-toast';
import { User, Phone, MapPin, FileText, ChevronRight, Check } from 'lucide-react';

const STEPS = [
    { label: 'Personal Details', icon: User },
    { label: 'About You', icon: FileText },
    { label: 'All Set!', icon: Check },
];

export default function ProfileSetup({ onComplete }) {
    const { user, updateUser } = useContext(AuthContext);
    const [step, setStep] = useState(0);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: '',
        city: '',
        bio: '',
    });

    const update = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

    const handleFinish = async () => {
        setSaving(true);
        try {
            const res = await api.put('/profile', {
                name: formData.name,
                phone: formData.phone,
                city: formData.city,
                bio: formData.bio,
            });
            updateUser(res.data);
            toast.success('Profile completed! 🎉');
            onComplete();
        } catch {
            toast.error('Failed to save profile');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="profile-setup-overlay">
            <div className="profile-setup-modal">
                {/* Progress */}
                <div className="profile-setup-progress">
                    {STEPS.map((s, i) => {
                        const Icon = s.icon;
                        return (
                            <div key={i} className={`profile-setup-step ${i <= step ? 'active' : ''} ${i < step ? 'done' : ''}`}>
                                <div className="profile-setup-dot">
                                    {i < step ? <Check size={14} /> : <Icon size={14} />}
                                </div>
                                <span>{s.label}</span>
                            </div>
                        );
                    })}
                </div>

                {/* Step 1: Personal */}
                {step === 0 && (
                    <div className="profile-setup-content">
                        <h2>Let's complete your profile</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                            Help us personalize your KaariGhar experience.
                        </p>
                        <div className="profile-setup-field">
                            <label><User size={14} /> Full Name</label>
                            <input type="text" value={formData.name} onChange={e => update('name', e.target.value)} placeholder="Your full name" />
                        </div>
                        <div className="profile-setup-row">
                            <div className="profile-setup-field">
                                <label><Phone size={14} /> Phone</label>
                                <input type="tel" value={formData.phone} onChange={e => update('phone', e.target.value)} placeholder="+91 98765 43210" />
                            </div>
                            <div className="profile-setup-field">
                                <label><MapPin size={14} /> City</label>
                                <input type="text" value={formData.city} onChange={e => update('city', e.target.value)} placeholder="e.g. Kanpur" />
                            </div>
                        </div>
                        <button className="gold-btn profile-setup-next" onClick={() => setStep(1)}>
                            Continue <ChevronRight size={18} />
                        </button>
                        <button className="outline-btn" onClick={handleFinish} style={{ marginTop: '8px', padding: '10px', width: '100%', fontSize: '0.85rem', opacity: 0.7 }}>
                            Skip for now
                        </button>
                    </div>
                )}

                {/* Step 2: Bio */}
                {step === 1 && (
                    <div className="profile-setup-content">
                        <h2>{user?.role === 'MAKER' ? 'Tell us about your craft' : 'What are you looking for?'}</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                            {user?.role === 'MAKER'
                                ? 'Describe your expertise, specialties, and years of experience.'
                                : 'Let craftsmen know what kind of furniture you need.'}
                        </p>
                        <div className="profile-setup-field">
                            <label><FileText size={14} /> {user?.role === 'MAKER' ? 'Your Craft Bio' : 'Your Needs'}</label>
                            <textarea
                                value={formData.bio}
                                onChange={e => update('bio', e.target.value)}
                                placeholder={user?.role === 'MAKER'
                                    ? 'e.g. I specialize in solid wood furniture with 10+ years of experience in teak and sheesham...'
                                    : 'e.g. Looking for custom bedroom furniture, modern style with storage solutions...'}
                                rows={5}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button className="outline-btn" onClick={() => setStep(0)} style={{ padding: '12px 24px' }}>Back</button>
                            <button className="gold-btn profile-setup-next" style={{ flex: 1 }} onClick={() => setStep(2)}>
                                Continue <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Confirmation */}
                {step === 2 && (
                    <div className="profile-setup-content" style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
                        <h2>You're all set!</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', maxWidth: '380px', margin: '0 auto 1.5rem' }}>
                            Your profile is ready. {user?.role === 'MAKER' ? 'Start browsing open jobs and craft proposals.' : 'Start creating furniture requests and discover makers near you.'}
                        </p>
                        <div className="profile-setup-summary">
                            <div className="profile-setup-summary-row"><span>Name</span><span>{formData.name || '—'}</span></div>
                            <div className="profile-setup-summary-row"><span>Phone</span><span>{formData.phone || '—'}</span></div>
                            <div className="profile-setup-summary-row"><span>City</span><span>{formData.city || '—'}</span></div>
                            <div className="profile-setup-summary-row"><span>Bio</span><span>{formData.bio ? formData.bio.substring(0, 60) + '...' : '—'}</span></div>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', marginTop: '1.5rem' }}>
                            <button className="outline-btn" onClick={() => setStep(1)} style={{ padding: '12px 24px' }}>Edit</button>
                            <button className="gold-btn profile-setup-next" style={{ flex: 1 }} onClick={handleFinish} disabled={saving}>
                                {saving ? 'Saving...' : 'Go to Dashboard'} <Check size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
