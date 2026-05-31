import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import api from '../api';
import { toast } from 'react-hot-toast';
import { User, Mail, Phone, MapPin, FileText, Save, Store, Award, Clock, Truck, Layers, Star } from 'lucide-react';

export default function ProfileSettings() {
    const { user, updateUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        name: '', email: '', phone: '', city: '', bio: '', profileDetails: '',
        shopName: '', shopAddress: '', licenseNumber: '', yearsExperience: '',
        materials: '', workingHours: '', deliveryRadius: '', availability: 'AVAILABLE',
    });

    useEffect(() => {
        async function fetchProfile() {
            try {
                const res = await api.get('/profile');
                setForm({
                    name: res.data.name || '',
                    email: res.data.email || '',
                    phone: res.data.phone || '',
                    city: res.data.city || '',
                    bio: res.data.bio || '',
                    profileDetails: res.data.profileDetails || '',
                    shopName: res.data.shopName || '',
                    shopAddress: res.data.shopAddress || '',
                    licenseNumber: res.data.licenseNumber || '',
                    yearsExperience: res.data.yearsExperience || '',
                    materials: res.data.materials || '',
                    workingHours: res.data.workingHours || '',
                    deliveryRadius: res.data.deliveryRadius || '',
                    availability: res.data.availability || 'AVAILABLE',
                });
            } catch (err) {
                toast.error('Failed to load profile');
            } finally {
                setLoading(false);
            }
        }
        fetchProfile();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = {
                name: form.name,
                phone: form.phone,
                city: form.city,
                bio: form.bio,
                profileDetails: form.profileDetails,
            };
            if (user?.role === 'MAKER') {
                payload.shopName = form.shopName;
                payload.shopAddress = form.shopAddress;
                payload.licenseNumber = form.licenseNumber;
                payload.yearsExperience = form.yearsExperience;
                payload.materials = form.materials;
                payload.workingHours = form.workingHours;
                payload.deliveryRadius = form.deliveryRadius;
            }
            const res = await api.put('/profile', payload);
            updateUser(res.data);
            toast.success('Profile updated! ✓');
        } catch (err) {
            toast.error('Failed to save profile');
        } finally {
            setSaving(false);
        }
    };

    const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

    if (loading) return <div style={{ color: 'var(--text-muted)', padding: '2rem' }}>Loading profile...</div>;

    return (
        <div className="profile-settings">
            <div className="dashboard-header">
                <h2>Profile Settings</h2>
            </div>

            <form onSubmit={handleSave} className="profile-settings-form">
                <div className="profile-settings-avatar">
                    <div className="profile-settings-avatar-circle">
                        {form.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h3 style={{ color: 'var(--text-light)', margin: '0 0 4px' }}>{form.name}</h3>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{user?.role === 'MAKER' ? 'Craftsman' : 'Customer'} • Joined {new Date(user?.createdAt || Date.now()).toLocaleDateString()}</span>
                    </div>
                </div>

                {/* Basic Info */}
                <h3 style={{ color: 'var(--text-light)', marginBottom: '1rem', fontSize: '1.1rem' }}>Basic Information</h3>
                <div className="profile-settings-grid">
                    <div className="profile-settings-field">
                        <label><User size={14} /> Full Name</label>
                        <input type="text" value={form.name} onChange={e => update('name', e.target.value)} />
                    </div>
                    <div className="profile-settings-field">
                        <label><Mail size={14} /> Email</label>
                        <input type="email" value={form.email} readOnly style={{ opacity: 0.5, cursor: 'not-allowed' }} />
                    </div>
                    <div className="profile-settings-field">
                        <label><Phone size={14} /> Phone Number</label>
                        <input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="+91 98765 43210" />
                    </div>
                    <div className="profile-settings-field">
                        <label><MapPin size={14} /> City</label>
                        <input type="text" value={form.city} onChange={e => update('city', e.target.value)} placeholder="e.g. Kanpur" />
                    </div>
                </div>

                <div className="profile-settings-field" style={{ marginTop: '1rem' }}>
                    <label><FileText size={14} /> Bio</label>
                    <textarea value={form.bio} onChange={e => update('bio', e.target.value)} rows={3}
                        placeholder={user?.role === 'MAKER' ? 'Describe your craft and expertise...' : 'Tell us what kind of furniture you need...'} />
                </div>

                {user?.role === 'MAKER' && (
                    <div className="profile-settings-field" style={{ marginTop: '1rem' }}>
                        <label><Star size={14} /> Specialization Headline</label>
                        <input type="text" value={form.profileDetails} onChange={e => update('profileDetails', e.target.value)}
                            placeholder="e.g. Master Woodworker — 15 years in teak & sheesham" />
                    </div>
                )}

                {/* Maker-only: Shop & Professional Details */}
                {user?.role === 'MAKER' && (
                    <>
                        <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.06)', margin: '2rem 0' }} />
                        <h3 style={{ color: 'var(--text-light)', marginBottom: '1rem', fontSize: '1.1rem' }}>Shop & Professional Details</h3>

                        <div className="profile-settings-grid">
                            <div className="profile-settings-field">
                                <label><Store size={14} /> Shop Name</label>
                                <input type="text" value={form.shopName} onChange={e => update('shopName', e.target.value)} placeholder="e.g. Sahai & Sons Wood Craft" />
                            </div>
                            <div className="profile-settings-field">
                                <label><FileText size={14} /> License / GST Number</label>
                                <input type="text" value={form.licenseNumber} onChange={e => update('licenseNumber', e.target.value)} placeholder="e.g. GST: 07AABCS1234F1Z5" />
                            </div>
                        </div>

                        <div className="profile-settings-field" style={{ marginTop: '0.5rem' }}>
                            <label><MapPin size={14} /> Shop Address</label>
                            <input type="text" value={form.shopAddress} onChange={e => update('shopAddress', e.target.value)} placeholder="Full shop address" />
                        </div>

                        <div className="profile-settings-grid" style={{ marginTop: '0.5rem' }}>
                            <div className="profile-settings-field">
                                <label><Award size={14} /> Years of Experience</label>
                                <input type="number" value={form.yearsExperience} onChange={e => update('yearsExperience', e.target.value)} placeholder="e.g. 15" />
                            </div>
                            <div className="profile-settings-field">
                                <label><Clock size={14} /> Working Hours</label>
                                <input type="text" value={form.workingHours} onChange={e => update('workingHours', e.target.value)} placeholder="e.g. Mon–Sat, 9 AM – 7 PM" />
                            </div>
                        </div>

                        <div className="profile-settings-grid" style={{ marginTop: '0.5rem' }}>
                            <div className="profile-settings-field">
                                <label><Layers size={14} /> Materials (comma-separated)</label>
                                <input type="text" value={form.materials} onChange={e => update('materials', e.target.value)} placeholder="e.g. Teak,Sheesham,Walnut" />
                            </div>
                            <div className="profile-settings-field">
                                <label><Truck size={14} /> Delivery Radius</label>
                                <input type="text" value={form.deliveryRadius} onChange={e => update('deliveryRadius', e.target.value)} placeholder="e.g. 30 km" />
                            </div>
                        </div>

                        <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.06)', margin: '2rem 0' }} />
                        <h3 style={{ color: 'var(--text-light)', marginBottom: '1rem', fontSize: '1.1rem' }}>Availability Status</h3>
                        <div className="availability-toggle-row">
                            {['AVAILABLE', 'BUSY', 'ON_VACATION'].map(status => (
                                <button
                                    key={status}
                                    type="button"
                                    className={`availability-btn availability-btn--${status.toLowerCase()} ${form.availability === status ? 'active' : ''}`}
                                    onClick={async () => {
                                        update('availability', status);
                                        try {
                                            await api.put('/maker/availability', { availability: status });
                                            toast.success(`Status: ${status.replace('_', ' ')}`);
                                        } catch (err) { toast.error('Failed to update'); }
                                    }}
                                >
                                    {status === 'AVAILABLE' && '🟢 Available'}
                                    {status === 'BUSY' && '🟡 Busy'}
                                    {status === 'ON_VACATION' && '🔴 On Vacation'}
                                </button>
                            ))}
                        </div>
                    </>
                )}

                <button type="submit" className="gold-btn profile-settings-save" disabled={saving}>
                    <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </form>
        </div>
    );
}
