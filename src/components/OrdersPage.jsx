import { t } from '../i18n';
import { MOCK_ORDERS, MOCK_QUOTES } from '../data';
import QuoteCard from './QuoteCard';
import EscrowTracker from './EscrowTracker';
import './OrdersPage.css';

export default function OrdersPage({ lang, onChat }) {
    return (
        <div className="orders-page">
            <div className="container">
                {/* Active Orders */}
                <div className="orders-section anim-fade-up">
                    <h2 className="orders-section__title">{t('nav_orders', lang)}</h2>
                    <p className="orders-section__subtitle">Track your furniture builds with milestone-based escrow payments</p>

                    <div className="orders-section__grid">
                        {MOCK_ORDERS.map((order) => (
                            <EscrowTracker key={order.id} order={order} lang={lang} />
                        ))}
                    </div>
                </div>

                {/* Quotes */}
                <div className="orders-section anim-fade-up" style={{ animationDelay: '0.2s' }}>
                    <h2 className="orders-section__title">Your Quotes</h2>
                    <p className="orders-section__subtitle">Transparent, all-inclusive pricing from verified makers</p>

                    <div className="orders-section__grid">
                        {MOCK_QUOTES.map((quote) => (
                            <QuoteCard key={quote.id} quote={quote} lang={lang} onChat={onChat} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
