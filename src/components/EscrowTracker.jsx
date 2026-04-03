import { t } from '../i18n';
import './EscrowTracker.css';

function formatINR(n) {
    return '₹' + n.toLocaleString('en-IN');
}

const STATUS_ICONS = {
    paid: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--success)"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>
    ),
    verified: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--info)"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" /></svg>
    ),
    pending: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--text-muted)"><circle cx="12" cy="12" r="10" fill="none" stroke="var(--text-muted)" strokeWidth="2" /><polyline points="12 6 12 12 16 14" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" /></svg>
    ),
};

export default function EscrowTracker({ order, lang }) {
    const phaseDescKeys = ['escrow_phase1_desc', 'escrow_phase2_desc', 'escrow_phase3_desc'];
    const phaseLabelKeys = ['escrow_phase1', 'escrow_phase2', 'escrow_phase3'];

    const paidTotal = order.milestones.filter(m => m.status === 'paid').reduce((s, m) => s + m.amount, 0);
    const progress = (paidTotal / order.totalAmount) * 100;

    return (
        <div className="escrow glass-card">
            <div className="escrow__header">
                <div>
                    <h3 className="escrow__order-id">{order.id}</h3>
                    <p className="escrow__item">{order.item}</p>
                </div>
                <div className="escrow__total">
                    <span className="escrow__total-label">Total</span>
                    <span className="escrow__total-value">{formatINR(order.totalAmount)}</span>
                </div>
            </div>

            {/* Progress bar */}
            <div className="escrow__progress-bar">
                <div className="escrow__progress-fill" style={{ width: `${progress}%` }} />
                <span className="escrow__progress-text">{formatINR(paidTotal)} / {formatINR(order.totalAmount)}</span>
            </div>

            {/* Milestones */}
            <div className="escrow__milestones">
                {order.milestones.map((ms, i) => (
                    <div key={i} className={`escrow__ms escrow__ms--${ms.status}`}>
                        {/* Connector line */}
                        {i < order.milestones.length - 1 && (
                            <div className={`escrow__connector ${ms.status === 'paid' ? 'escrow__connector--done' : ''}`} />
                        )}

                        <div className="escrow__ms-icon">
                            {STATUS_ICONS[ms.status]}
                        </div>

                        <div className="escrow__ms-content">
                            <div className="escrow__ms-top">
                                <h4>{t(phaseLabelKeys[i], lang)}</h4>
                                <span className={`badge badge--${ms.status === 'paid' ? 'success' : ms.status === 'verified' ? 'gold' : 'warning'}`}>
                                    {ms.status === 'paid' ? t('escrow_paid', lang) : ms.status === 'verified' ? t('escrow_verified', lang) : t('escrow_pending', lang)}
                                </span>
                            </div>
                            <p className="escrow__ms-desc">{t(phaseDescKeys[i], lang)}</p>

                            <div className="escrow__ms-bottom">
                                <span className="escrow__ms-amount">{formatINR(ms.amount)}</span>

                                {ms.photoVerified && (
                                    <span className="escrow__ms-photo-badge">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                                        Photo Verified
                                    </span>
                                )}

                                {ms.status === 'verified' && (
                                    <button className="gold-btn" style={{ padding: '6px 16px', fontSize: '0.8rem' }}>
                                        {t('escrow_pay', lang)}
                                    </button>
                                )}

                                {ms.status === 'pending' && !ms.photoVerified && (
                                    <button className="outline-btn" style={{ padding: '6px 16px', fontSize: '0.8rem' }}>
                                        {t('escrow_verify', lang)}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
