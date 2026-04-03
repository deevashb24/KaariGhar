import { t } from '../i18n';
import { MOCK_MAKERS, MOCK_INCOMING_REQUESTS, MOCK_ORDERS } from '../data';
import './MakerDashboard.css';

function formatINR(n) {
    return '₹' + n.toLocaleString('en-IN');
}

export default function MakerDashboard({ lang }) {
    const maker = MOCK_MAKERS[0]; // Current logged-in maker

    return (
        <div className="dash">
            <div className="container">
                {/* Header stats */}
                <div className="dash__header anim-fade-up">
                    <div className="dash__welcome">
                        <h2>Welcome back, {maker.name.split(' ')[0]} 👋</h2>
                        <p>Here's your workshop overview</p>
                    </div>
                </div>

                <div className="dash__stats stagger">
                    <div className="dash__stat-card glass-card">
                        <div className="dash__stat-icon dash__stat-icon--gold">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                        </div>
                        <div className="dash__stat-info">
                            <span className="dash__stat-value">{formatINR(maker.monthEarnings)}</span>
                            <span className="dash__stat-label">{t('dash_earnings', lang)}</span>
                        </div>
                    </div>
                    <div className="dash__stat-card glass-card">
                        <div className="dash__stat-icon dash__stat-icon--blue">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
                        </div>
                        <div className="dash__stat-info">
                            <span className="dash__stat-value">{maker.totalOrders}</span>
                            <span className="dash__stat-label">{t('dash_total_orders', lang)}</span>
                        </div>
                    </div>
                    <div className="dash__stat-card glass-card">
                        <div className="dash__stat-icon dash__stat-icon--green">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                        </div>
                        <div className="dash__stat-info">
                            <span className="dash__stat-value">{maker.completionRate}%</span>
                            <span className="dash__stat-label">{t('dash_completion', lang)}</span>
                        </div>
                    </div>
                    <div className="dash__stat-card glass-card">
                        <div className="dash__stat-icon dash__stat-icon--orange">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                        </div>
                        <div className="dash__stat-info">
                            <span className="dash__stat-value">★ {maker.rating}</span>
                            <span className="dash__stat-label">{maker.reviews} {t('maker_reviews', lang)}</span>
                        </div>
                    </div>
                </div>

                {/* Active Orders */}
                <div className="dash__section anim-fade-up" style={{ animationDelay: '0.2s' }}>
                    <h3 className="dash__section-title">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                        {t('dash_active', lang)}
                        <span className="dash__count">{MOCK_ORDERS.length}</span>
                    </h3>
                    <div className="dash__orders">
                        {MOCK_ORDERS.map((order) => (
                            <div key={order.id} className="dash__order glass-card">
                                <div className="dash__order-header">
                                    <div>
                                        <span className="dash__order-id">{order.id}</span>
                                        <h4>{order.item}</h4>
                                    </div>
                                    <span className={`badge badge--${order.status === 'in_progress' ? 'gold' : 'success'}`}>
                                        {order.status === 'in_progress' ? 'In Progress' : 'Completed'}
                                    </span>
                                </div>
                                <div className="dash__order-progress">
                                    {order.milestones.map((ms, i) => (
                                        <div key={i} className={`dash__order-ms dash__order-ms--${ms.status}`}>
                                            <div className="dash__order-ms-dot" />
                                            <span>{ms.label}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="dash__order-footer">
                                    <span className="dash__order-amount">{formatINR(order.totalAmount)}</span>
                                    <span className="dash__order-date">Expected: {order.expectedDate}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Incoming Requests */}
                <div className="dash__section anim-fade-up" style={{ animationDelay: '0.3s' }}>
                    <h3 className="dash__section-title">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--warning)" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
                        {t('dash_incoming', lang)}
                        <span className="dash__count">{MOCK_INCOMING_REQUESTS.length}</span>
                    </h3>
                    <div className="dash__requests">
                        {MOCK_INCOMING_REQUESTS.map((req) => (
                            <div key={req.id} className="dash__request glass-card">
                                <div className="dash__request-header">
                                    <div>
                                        <span className="dash__request-id">{req.id}</span>
                                        <h4>{req.item}</h4>
                                        <p className="dash__request-customer">{req.customer} · {req.city}</p>
                                    </div>
                                    <span className="dash__request-date">{req.date}</span>
                                </div>
                                <div className="dash__request-specs">
                                    <span><strong>Wood:</strong> {req.wood}</span>
                                    <span><strong>Finish:</strong> {req.finish}</span>
                                    <span><strong>Dims:</strong> {req.dims}</span>
                                    <span><strong>Budget:</strong> {req.budget}</span>
                                </div>
                                <button className="gold-btn" style={{ padding: '8px 20px', fontSize: '0.85rem', width: '100%', justifyContent: 'center' }}>
                                    {t('dash_submit_quote', lang)}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
