import { t } from '../i18n';
import { MOCK_MAKERS } from '../data';
import './QuoteCard.css';

function formatINR(n) {
    return '₹' + n.toLocaleString('en-IN');
}

export default function QuoteCard({ quote, lang, onAccept, onChat }) {
    const maker = MOCK_MAKERS.find(m => m.id === quote.makerId);
    if (!maker) return null;

    const subtotal = quote.material.cost + quote.labor.cost + quote.delivery;
    const commission = Math.round(subtotal * quote.commissionRate);
    const preTax = subtotal + commission;
    const gst = Math.round(preTax * quote.gstRate);
    const total = preTax + gst;

    return (
        <div className="qc glass-card anim-fade-up">
            <div className="qc__header">
                <div className="qc__maker">
                    <div className="qc__avatar">
                        {maker.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                    </div>
                    <div>
                        <h3 className="qc__name">{maker.name}</h3>
                        <div className="qc__meta">
                            <span className="qc__rating">★ {maker.rating}</span>
                            <span className="qc__city">{maker.city}</span>
                            <span>{maker.years} {t('quote_exp', lang)}</span>
                        </div>
                    </div>
                </div>
                {maker.verified.siteVisit && maker.verified.gst && (
                    <span className="badge badge--gold">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>
                        {t('quote_verified', lang)}
                    </span>
                )}
            </div>

            <div className="qc__timeline">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                <span>Est. {quote.estimatedDays} days</span>
            </div>

            <table className="qc__table">
                <thead>
                    <tr>
                        <th>Line Item</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{t('quote_material', lang)} ({quote.material.name})</td>
                        <td>{formatINR(quote.material.cost)}</td>
                    </tr>
                    <tr>
                        <td>{t('quote_labor', lang)} (est. {quote.labor.days} days)</td>
                        <td>{formatINR(quote.labor.cost)}</td>
                    </tr>
                    <tr>
                        <td>{t('quote_delivery', lang)}</td>
                        <td>{formatINR(quote.delivery)}</td>
                    </tr>
                    <tr className="qc__table-sub">
                        <td>{t('quote_commission', lang)} ({(quote.commissionRate * 100).toFixed(0)}%)</td>
                        <td>{formatINR(commission)}</td>
                    </tr>
                    <tr className="qc__table-sub">
                        <td>{t('quote_gst', lang)}</td>
                        <td>{formatINR(gst)}</td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td>{t('quote_total', lang)}</td>
                        <td>{formatINR(total)}</td>
                    </tr>
                </tfoot>
            </table>

            <div className="qc__actions">
                <button className="gold-btn" onClick={() => onAccept?.(quote)}>
                    {t('quote_accept', lang)}
                </button>
                <button className="outline-btn" onClick={() => onChat?.(maker)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                    {t('quote_chat', lang)}
                </button>
            </div>
        </div>
    );
}
