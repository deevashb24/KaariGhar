import { useState } from 'react';
import api from '../api';
import { toast } from 'react-hot-toast';
import { t } from '../i18n';
import { ShieldAlert, CheckCircle, Clock, AlertTriangle, Eye, Upload, Image, HelpCircle } from 'lucide-react';
import './EscrowTracker.css';

function formatINR(n) {
    return '₹' + (n || 0).toLocaleString('en-IN');
}

const STATUS_ICONS = {
    paid: <CheckCircle size={20} color="var(--success)" />,
    completed: <Clock size={20} color="var(--info)" />, // completed photo proof verification
    pending: <Clock size={20} color="var(--text-muted)" />
};

export default function EscrowTracker({ order, lang, role = 'CUSTOMER', onRefresh }) {
    const phaseDescKeys = ['escrow_phase1_desc', 'escrow_phase2_desc', 'escrow_phase3_desc'];
    const phaseLabelKeys = ['escrow_phase1', 'escrow_phase2', 'escrow_phase3'];

    const [lightboxImage, setLightboxImage] = useState(null);
    const [disputeReason, setDisputeReason] = useState('');
    const [activeDisputeMilestoneId, setActiveDisputeMilestoneId] = useState(null);
    const [mockUrl, setMockUrl] = useState('');
    const [activeUploadMilestoneId, setActiveUploadMilestoneId] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const milestones = order.milestones || [];
    const totalAmount = order.totalPrice || order.totalAmount || 0;

    const paidTotal = milestones
        .filter(m => m.status.toLowerCase() === 'paid')
        .reduce((sum, m) => sum + m.amount, 0);

    const disputedTotal = milestones
        .filter(m => m.isDisputed)
        .reduce((sum, m) => sum + m.amount, 0);

    const inEscrowTotal = totalAmount - paidTotal - disputedTotal;
    const progress = totalAmount > 0 ? (paidTotal / totalAmount) * 100 : 0;

    const handleVerify = async (milestoneId) => {
        try {
            setSubmitting(true);
            const loadingToast = toast.loading('Verifying progress proof...');
            await api.post(`/customer/orders/${order.id}/milestones/${milestoneId}/verify`);
            toast.dismiss(loadingToast);
            toast.success('Proof verified! The milestone is ready for payment.');
            if (onRefresh) onRefresh();
        } catch (err) {
            console.error(err);
            toast.error('Failed to verify proof.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleRelease = async (milestoneId) => {
        try {
            setSubmitting(true);
            const loadingToast = toast.loading('Releasing payment from escrow...');
            await api.post(`/customer/orders/${order.id}/milestones/${milestoneId}/release`);
            toast.dismiss(loadingToast);
            toast.success('Payment released to the maker successfully!');
            if (onRefresh) onRefresh();
        } catch (err) {
            console.error(err);
            toast.error('Failed to release payment.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDispute = async (milestoneId) => {
        if (!disputeReason.trim()) {
            toast.error('Please enter a reason for the dispute.');
            return;
        }
        try {
            setSubmitting(true);
            const loadingToast = toast.loading('Filing dispute...');
            await api.post(`/customer/orders/${order.id}/milestones/${milestoneId}/dispute`, { reason: disputeReason });
            toast.dismiss(loadingToast);
            toast.success('Dispute filed successfully. Payments for this milestone are on hold.');
            setDisputeReason('');
            setActiveDisputeMilestoneId(null);
            if (onRefresh) onRefresh();
        } catch (err) {
            console.error(err);
            toast.error('Failed to file dispute.');
        } finally {
            setSubmitting(false);
        }
    };

    const handlePhotoUpload = async (milestoneId, fileOrUrl) => {
        let photoUrl = fileOrUrl;
        if (typeof fileOrUrl !== 'string') {
            // Handle file reader
            const reader = new FileReader();
            reader.readAsDataURL(fileOrUrl);
            reader.onload = async () => {
                await uploadPhotoEndpoint(milestoneId, reader.result);
            };
            return;
        }
        await uploadPhotoEndpoint(milestoneId, photoUrl);
    };

    const uploadPhotoEndpoint = async (milestoneId, photoUrl) => {
        try {
            setSubmitting(true);
            const loadingToast = toast.loading('Uploading progress proof...');
            await api.post(`/maker/orders/${order.id}/milestones/${milestoneId}/upload`, { photoUrl });
            toast.dismiss(loadingToast);
            toast.success('Progress proof uploaded! Awaiting customer review.');
            setMockUrl('');
            setActiveUploadMilestoneId(null);
            if (onRefresh) onRefresh();
        } catch (err) {
            console.error(err);
            toast.error('Failed to upload proof photo.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="escrow glass-card anim-fade-up">
            {/* Header info */}
            <div className="escrow__header">
                <div>
                    <h3 className="escrow__order-id">Order ID: {order.id}</h3>
                    <p className="escrow__item">{order.quote?.request?.title || order.item || 'Custom Furniture'}</p>
                    <p className="escrow__maker-info" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {role === 'CUSTOMER' 
                            ? `Maker: ${order.quote?.maker?.name || 'Artisan'}` 
                            : `Customer: ${order.quote?.request?.customer?.name || 'Client'}`
                        }
                    </p>
                </div>
                <div className="escrow__total">
                    <span className="escrow__total-label">Contract Total</span>
                    <span className="escrow__total-value">{formatINR(totalAmount)}</span>
                </div>
            </div>

            {/* Escrow Ledger Summary Grid */}
            <div className="escrow-ledger">
                <div className="ledger-card total">
                    <span className="ledger-label">Total Value</span>
                    <span className="ledger-value">{formatINR(totalAmount)}</span>
                </div>
                <div className="ledger-card paid">
                    <span className="ledger-label">Released to Maker</span>
                    <span className="ledger-value">{formatINR(paidTotal)}</span>
                </div>
                <div className="ledger-card escrowed">
                    <span className="ledger-label">Held in Escrow</span>
                    <span className="ledger-value">{formatINR(inEscrowTotal)}</span>
                </div>
                {disputedTotal > 0 && (
                    <div className="ledger-card disputed">
                        <span className="ledger-label">Disputed (Locked)</span>
                        <span className="ledger-value">{formatINR(disputedTotal)}</span>
                    </div>
                )}
            </div>

            {/* Progress Bar */}
            <div className="escrow__progress-bar-wrapper">
                <div className="escrow__progress-bar">
                    <div className="escrow__progress-fill" style={{ width: `${progress}%` }} />
                </div>
                <span className="escrow__progress-text">
                    Progress: {formatINR(paidTotal)} / {formatINR(totalAmount)} ({Math.round(progress)}% paid)
                </span>
            </div>

            {/* Milestones Timeline */}
            <div className="escrow__milestones" style={{ marginTop: '1.5rem' }}>
                {milestones.map((ms, i) => {
                    const statusClass = ms.status.toLowerCase();
                    const isCompleted = statusClass === 'completed';
                    const isPaid = statusClass === 'paid';
                    const isPending = statusClass === 'pending';

                    return (
                        <div key={ms.id || i} className={`escrow__ms escrow__ms--${statusClass}`}>
                            {/* Line connector */}
                            {i < milestones.length - 1 && (
                                <div className={`escrow__connector ${isPaid ? 'escrow__connector--done' : ''}`} />
                            )}

                            <div className="escrow__ms-icon">
                                {isPaid ? <CheckCircle size={20} color="#2ecc71" /> : <Clock size={20} color={isCompleted ? 'var(--gold)' : 'var(--text-muted)'} />}
                            </div>

                            <div className="escrow__ms-content">
                                <div className="escrow__ms-top">
                                    <h4 style={{ color: isPaid ? '#2ecc71' : isCompleted ? 'var(--gold)' : 'white' }}>
                                        {ms.title}
                                    </h4>
                                    <span className={`status-badge status-${statusClass}`}>
                                        {isPaid ? 'Paid & Released' : isCompleted ? 'Verified Proof' : ms.photoUrl ? 'Awaiting Review' : 'Pending Proof'}
                                    </span>
                                </div>
                                <p className="escrow__ms-desc">{ms.description}</p>

                                {/* Dispute warning block */}
                                {ms.isDisputed && (
                                    <div className="dispute-alert">
                                        <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                                        <div>
                                            <strong>Disputed Milestone</strong>
                                            <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', opacity: 0.9 }}>Reason: {ms.disputeReason}</p>
                                        </div>
                                    </div>
                                )}

                                <div className="escrow__ms-bottom" style={{ marginTop: '10px' }}>
                                    <span className="escrow__ms-amount" style={{ fontWeight: '600' }}>
                                        {formatINR(ms.amount)}
                                    </span>

                                    {/* Proof display */}
                                    {ms.photoUrl ? (
                                        <div className="proof-thumbnail-container">
                                            <img src={ms.photoUrl} alt="Progress proof" className="proof-thumbnail" />
                                            <button className="proof-hover-btn" onClick={() => setLightboxImage(ms.photoUrl)}>
                                                <Eye size={12} /> View Proof
                                            </button>
                                        </div>
                                    ) : (
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                                            No photo proof uploaded
                                        </span>
                                    )}

                                    {/* Action Buttons for CUSTOMER */}
                                    {role === 'CUSTOMER' && !isPaid && (
                                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginLeft: 'auto' }}>
                                            {/* Approve/verify proof if photo exists */}
                                            {ms.photoUrl && !ms.photoVerified && (
                                                <button className="gold-btn" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => handleVerify(ms.id)} disabled={submitting}>
                                                    Approve Photo
                                                </button>
                                            )}

                                            {/* Release Payment */}
                                            {(ms.photoVerified || isCompleted) && (
                                                <button className="gold-btn" style={{ padding: '6px 12px', fontSize: '0.8rem', background: '#2ecc71', borderColor: '#2ecc71', color: 'black' }} onClick={() => handleRelease(ms.id)} disabled={submitting}>
                                                    Release Payment
                                                </button>
                                            )}

                                            {/* Raise Dispute */}
                                            {ms.photoUrl && !ms.isDisputed && (
                                                <button className="outline-btn" style={{ padding: '6px 12px', fontSize: '0.8rem', borderColor: '#e74c3c', color: '#e74c3c' }} onClick={() => setActiveDisputeMilestoneId(ms.id)} disabled={submitting}>
                                                    Raise Dispute
                                                </button>
                                            )}
                                        </div>
                                    )}

                                    {/* Action Buttons for MAKER */}
                                    {role === 'MAKER' && !isPaid && (
                                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginLeft: 'auto' }}>
                                            {(!ms.photoUrl || ms.isDisputed) && (
                                                <button className="gold-btn" style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }} onClick={() => setActiveUploadMilestoneId(ms.id)}>
                                                    <Upload size={14} /> {ms.isDisputed ? 'Re-upload Proof' : 'Upload Proof'}
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Dispute Dialog Input */}
                                {activeDisputeMilestoneId === ms.id && (
                                    <div className="dispute-form-panel" style={{ marginTop: '12px', padding: '12px', background: 'rgba(231,76,60,0.1)', border: '1px solid rgba(231,76,60,0.3)', borderRadius: '6px' }}>
                                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '6px', color: '#e74c3c' }}>Dispute Reason</label>
                                        <input 
                                            type="text" 
                                            placeholder="Explain why you are rejecting this proof (e.g. wood quality doesn't match specs, incorrect dimensions)..." 
                                            value={disputeReason} 
                                            onChange={e => setDisputeReason(e.target.value)}
                                            style={{ width: '100%', padding: '8px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', color: 'white', fontSize: '0.85rem', marginBottom: '8px' }}
                                        />
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button className="gold-btn" style={{ padding: '6px 12px', fontSize: '0.8rem', background: '#e74c3c', borderColor: '#e74c3c' }} onClick={() => handleDispute(ms.id)} disabled={submitting}>
                                                Submit Dispute
                                            </button>
                                            <button className="outline-btn" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => { setActiveDisputeMilestoneId(null); setDisputeReason(''); }}>
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Upload Dialog Input */}
                                {activeUploadMilestoneId === ms.id && (
                                    <div className="upload-form-panel" style={{ marginTop: '12px', padding: '12px', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '6px' }}>
                                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '6px', color: 'var(--gold)' }}>Provide Progress Photo Proof</label>
                                        
                                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
                                            <input 
                                                type="file" 
                                                accept="image/*" 
                                                onChange={e => e.target.files[0] && handlePhotoUpload(ms.id, e.target.files[0])}
                                                style={{ display: 'none' }}
                                                id={`file-upload-${ms.id}`}
                                            />
                                            <label htmlFor={`file-upload-${ms.id}`} className="gold-btn" style={{ padding: '8px 16px', fontSize: '0.8rem', cursor: 'pointer', margin: 0, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                                <Image size={14} /> Choose File
                                            </label>
                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>or paste image URL below:</span>
                                        </div>

                                        <input 
                                            type="text" 
                                            placeholder="Paste external image URL (e.g. from unsplash for testing)..." 
                                            value={mockUrl} 
                                            onChange={e => setMockUrl(e.target.value)}
                                            style={{ width: '100%', padding: '8px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', color: 'white', fontSize: '0.85rem', marginBottom: '8px' }}
                                        />

                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            {mockUrl.trim() && (
                                                <button className="gold-btn" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => handlePhotoUpload(ms.id, mockUrl)} disabled={submitting}>
                                                    Submit URL Proof
                                                </button>
                                            )}
                                            <button className="outline-btn" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => { setActiveUploadMilestoneId(null); setMockUrl(''); }}>
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Lightbox / Enlarged View */}
            {lightboxImage && (
                <div className="lightbox-overlay" onClick={() => setLightboxImage(null)}>
                    <div className="lightbox-content" onClick={e => e.stopPropagation()}>
                        <img src={lightboxImage} alt="Progress proof full size" />
                        <button className="lightbox-close" onClick={() => setLightboxImage(null)}>&times;</button>
                    </div>
                </div>
            )}
        </div>
    );
}
