import React, { useState, useEffect } from 'react';
import api from '../../api';
import { toast, Toaster } from 'react-hot-toast';
import { Shield, CheckCircle, XCircle, AlertTriangle, Users, FileText, ArrowRight, ShieldCheck } from 'lucide-react';
import './AdminDashboard.css';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('verification');
    const [makers, setMakers] = useState([]);
    const [disputes, setDisputes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [makersRes, disputesRes] = await Promise.all([
                api.get('/admin/makers'),
                api.get('/admin/disputes')
            ]);
            setMakers(makersRes.data);
            setDisputes(disputesRes.data);
        } catch (err) {
            console.error(err);
            toast.error('Failed to fetch admin data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleVerifyBadge = async (makerId, field, value) => {
        try {
            setSubmitting(true);
            const updatePayload = { [field]: value };
            await api.post(`/admin/makers/${makerId}/verify`, updatePayload);
            toast.success('Verification status updated!');
            // Refresh local list
            setMakers(prev => prev.map(m => m.id === makerId ? { ...m, [field]: value } : m));
        } catch (err) {
            console.error(err);
            toast.error('Failed to update verification badge.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleVerifyLevel = async (makerId, level) => {
        try {
            setSubmitting(true);
            await api.post(`/admin/makers/${makerId}/verify`, { verificationLevel: level });
            toast.success(`Verification level updated to ${level}!`);
            setMakers(prev => prev.map(m => m.id === makerId ? { ...m, verificationLevel: level } : m));
        } catch (err) {
            console.error(err);
            toast.error('Failed to update level.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleResolveDispute = async (milestoneId, resolution) => {
        try {
            setSubmitting(true);
            const loadingToast = toast.loading(`Resolving dispute in favor of ${resolution.toLowerCase()}...`);
            await api.post(`/admin/disputes/${milestoneId}/resolve`, { resolution });
            toast.dismiss(loadingToast);
            toast.success(`Dispute resolved in favor of the ${resolution.toLowerCase()}!`);
            fetchData();
        } catch (err) {
            console.error(err);
            toast.error('Failed to resolve dispute.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="dashboard-container" style={{ alignItems: 'center', justifyContent: 'center', color: 'var(--gold)' }}>Loading Admin Portal...</div>;

    const unverifiedMakersCount = makers.filter(m => !m.isGstVerified || !m.isIdVerified || !m.isShopVerified).length;

    return (
        <div className="dashboard-container admin-portal">
            <Toaster position="top-right" />

            {/* Sidebar */}
            <div className="dashboard-sidebar">
                <div className="sidebar-brand">
                    <Shield size={20} color="var(--gold)" />
                    <span>Control Panel</span>
                </div>
                <button className={`sidebar-tab ${activeTab === 'verification' ? 'active' : ''}`} onClick={() => setActiveTab('verification')}>
                    <Users size={20} /> Maker Verifications
                </button>
                <button className={`sidebar-tab ${activeTab === 'disputes' ? 'active' : ''}`} onClick={() => setActiveTab('disputes')}>
                    <AlertTriangle size={20} /> Disputes Queue {disputes.length > 0 && <span className="sidebar-tab-badge badge-alert">{disputes.length}</span>}
                </button>
            </div>

            {/* Main Admin Section */}
            <div className="dashboard-main">
                {/* Stats Row */}
                <div className="dashboard-stats-row anim-fade-up">
                    <div className="dashboard-stat-card">
                        <div className="dashboard-stat-icon" style={{ background: 'rgba(212,175,55,0.15)', color: 'var(--gold)' }}><Users size={20} /></div>
                        <div><span className="dashboard-stat-value">{makers.length}</span><span className="dashboard-stat-label">Registered Makers</span></div>
                    </div>
                    <div className="dashboard-stat-card">
                        <div className="dashboard-stat-icon" style={{ background: 'rgba(231,76,60,0.15)', color: '#e74c3c' }}><AlertTriangle size={20} /></div>
                        <div><span className="dashboard-stat-value">{disputes.length}</span><span className="dashboard-stat-label">Active Disputes</span></div>
                    </div>
                    <div className="dashboard-stat-card">
                        <div className="dashboard-stat-icon" style={{ background: 'rgba(52,152,219,0.15)', color: '#3498db' }}><ShieldCheck size={20} /></div>
                        <div><span className="dashboard-stat-value">{unverifiedMakersCount}</span><span className="dashboard-stat-label">Awaiting Full KYC</span></div>
                    </div>
                </div>

                {/* Tab: Verifications */}
                {activeTab === 'verification' && (
                    <div className="admin-content-section anim-fade-up">
                        <div className="dashboard-header" style={{ marginBottom: '1.5rem' }}>
                            <div>
                                <h2>🛠️ Craftsman KYC & Badge Approvals</h2>
                                <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Review and verify business registrations, shop locations, and profile badges.</p>
                            </div>
                        </div>

                        <div className="admin-table-container glass-card">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Artisan</th>
                                        <th>Location</th>
                                        <th>GST Status</th>
                                        <th>ID Status</th>
                                        <th>Shop Visit</th>
                                        <th>Reputation Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {makers.map(maker => (
                                        <tr key={maker.id}>
                                            <td>
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <strong>{maker.name}</strong>
                                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{maker.email}</span>
                                                </div>
                                            </td>
                                            <td>{maker.city || 'Not Provided'}</td>
                                            <td>
                                                <button 
                                                    className={`badge-toggle-btn ${maker.isGstVerified ? 'active' : ''}`}
                                                    onClick={() => handleVerifyBadge(maker.id, 'isGstVerified', !maker.isGstVerified)}
                                                    disabled={submitting}
                                                >
                                                    {maker.isGstVerified ? '✓ GST Verified' : '✗ Unverified'}
                                                </button>
                                            </td>
                                            <td>
                                                <button 
                                                    className={`badge-toggle-btn ${maker.isIdVerified ? 'active' : ''}`}
                                                    onClick={() => handleVerifyBadge(maker.id, 'isIdVerified', !maker.isIdVerified)}
                                                    disabled={submitting}
                                                >
                                                    {maker.isIdVerified ? '✓ ID Verified' : '✗ Unverified'}
                                                </button>
                                            </td>
                                            <td>
                                                <button 
                                                    className={`badge-toggle-btn ${maker.isShopVerified ? 'active' : ''}`}
                                                    onClick={() => handleVerifyBadge(maker.id, 'isShopVerified', !maker.isShopVerified)}
                                                    disabled={submitting}
                                                >
                                                    {maker.isShopVerified ? '✓ Shop Verified' : '✗ Unverified'}
                                                </button>
                                            </td>
                                            <td>
                                                <select 
                                                    value={maker.verificationLevel}
                                                    onChange={e => handleVerifyLevel(maker.id, e.target.value)}
                                                    className="admin-level-select"
                                                    disabled={submitting}
                                                >
                                                    <option value="UNVERIFIED">Unverified</option>
                                                    <option value="VERIFIED">Verified</option>
                                                    <option value="PREFERRED">Preferred</option>
                                                    <option value="TOP_RATED">Top Rated</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                    {makers.length === 0 && (
                                        <tr>
                                            <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>No craftsmen registered on the platform yet.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Tab: Disputes */}
                {activeTab === 'disputes' && (
                    <div className="admin-content-section anim-fade-up">
                        <div className="dashboard-header" style={{ marginBottom: '1.5rem' }}>
                            <div>
                                <h2>⚖️ Active Milestone Escrow Disputes</h2>
                                <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Arbitrate conflicts when customers request payout pauses on work quality issues.</p>
                            </div>
                        </div>

                        {disputes.length === 0 ? (
                            <div className="empty-state">
                                <ShieldCheck size={40} style={{ opacity: 0.3, marginBottom: '12px', color: '#2ecc71' }} />
                                <h3>Clear Escrow Ledger</h3>
                                <p>There are no active disputes or payment pauses in the marketplace right now.</p>
                            </div>
                        ) : (
                            <div className="disputes-list">
                                {disputes.map(disp => (
                                    <div key={disp.id} className="dispute-panel glass-card anim-fade-up">
                                        <div className="dispute-panel-header">
                                            <div>
                                                <span className="dispute-order-id">ORDER: {disp.orderId}</span>
                                                <h3 className="dispute-milestone-title">{disp.title}</h3>
                                                <span className="dispute-amount">Value: ₹{disp.amount.toLocaleString('en-IN')}</span>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <span className="dispute-warn-badge">⚠️ Active Dispute</span>
                                            </div>
                                        </div>

                                        {disp.photoUrl && (
                                            <div className="dispute-image-container" style={{ margin: '15px 0' }}>
                                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Uploaded Progress Proof:</span>
                                                <img src={disp.photoUrl} alt="Disputed progress proof" style={{ maxHeight: '150px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)' }} />
                                            </div>
                                        )}

                                        <div className="dispute-parties">
                                            <div className="party-block">
                                                <span className="party-role">Customer</span>
                                                <strong>{disp.order?.quote?.request?.customer?.name}</strong>
                                                <span className="party-email">{disp.order?.quote?.request?.customer?.email}</span>
                                            </div>
                                            <ArrowRight size={20} color="rgba(255,255,255,0.15)" />
                                            <div className="party-block">
                                                <span className="party-role">Artisan / Maker</span>
                                                <strong>{disp.order?.quote?.maker?.name}</strong>
                                                <span className="party-email">{disp.order?.quote?.maker?.email}</span>
                                            </div>
                                        </div>

                                        <div className="dispute-reason-box">
                                            <strong>Customer Dispute Claim:</strong>
                                            <p>"{disp.disputeReason || 'No reason specified.'}"</p>
                                        </div>

                                        <div className="dispute-actions">
                                            <button 
                                                className="gold-btn dispute-resolve-btn maker-fav"
                                                onClick={() => handleResolveDispute(disp.id, 'MAKER')}
                                                disabled={submitting}
                                                style={{ background: '#2ecc71', borderColor: '#2ecc71', color: 'black' }}
                                            >
                                                Settle for Maker (Release Payment)
                                            </button>
                                            <button 
                                                className="outline-btn dispute-resolve-btn customer-fav"
                                                onClick={() => handleResolveDispute(disp.id, 'CUSTOMER')}
                                                disabled={submitting}
                                                style={{ borderColor: '#e74c3c', color: '#e74c3c' }}
                                            >
                                                Settle for Customer (Reset & Refund)
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
