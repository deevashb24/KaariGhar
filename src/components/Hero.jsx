import { t } from '../i18n';
import './Hero.css';

export default function Hero({ lang, onStartOrder, onViewMakers }) {
    return (
        <section className="hero" id="hero">
            {/* Animated grain overlay */}
            <div className="hero__grain" />

            {/* Floating wood particles */}
            <div className="hero__particles">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className={`hero__particle hero__particle--${i + 1}`} />
                ))}
            </div>

            <div className="hero__content container">
                <div className="hero__text anim-fade-up">
                    <div className="hero__trust-badges stagger">
                        <span className="badge badge--gold">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" /></svg>
                            {t('trust_escrow', lang)}
                        </span>
                        <span className="badge badge--gold">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>
                            {t('trust_verified', lang)}
                        </span>
                        <span className="badge badge--gold">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z" /></svg>
                            {t('trust_gst', lang)}
                        </span>
                    </div>

                    <h1 className="hero__title">
                        <span className="hero__title-line">{t('hero_title_1', lang)}</span>
                        <span className="hero__title-line hero__title-line--gold">{t('hero_title_2', lang)}</span>
                    </h1>

                    <p className="hero__subtitle">{t('hero_subtitle', lang)}</p>

                    <div className="hero__ctas">
                        <button className="gold-btn hero__cta-primary" onClick={onStartOrder}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                            {t('hero_cta', lang)}
                        </button>
                        <button className="outline-btn" onClick={onViewMakers}>
                            {t('hero_cta2', lang)}
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                        </button>
                    </div>
                </div>

                <div className="hero__visual anim-fade-up" style={{ animationDelay: '0.3s' }}>
                    <div className="hero__furniture-card glass-card">
                        <div className="hero__furniture-img">
                            <svg viewBox="0 0 200 160" fill="none">
                                {/* Stylized bed illustration */}
                                <rect x="20" y="60" width="160" height="80" rx="8" fill="#2C2218" stroke="#D4A855" strokeWidth="1.5" />
                                <rect x="20" y="40" width="160" height="30" rx="6" fill="#3A2E1F" stroke="#D4A855" strokeWidth="1" />
                                <rect x="30" y="48" width="30" height="14" rx="3" fill="none" stroke="#D4A85580" strokeWidth="1" />
                                <rect x="70" y="48" width="30" height="14" rx="3" fill="none" stroke="#D4A85580" strokeWidth="1" />
                                <rect x="110" y="48" width="30" height="14" rx="3" fill="none" stroke="#D4A85580" strokeWidth="1" />
                                <rect x="30" y="70" width="60" height="40" rx="4" fill="#352A1D" stroke="#D4A85540" strokeWidth="1" />
                                <rect x="100" y="70" width="60" height="40" rx="4" fill="#352A1D" stroke="#D4A85540" strokeWidth="1" />
                                <rect x="20" y="130" width="8" height="10" rx="2" fill="#D4A855" />
                                <rect x="172" y="130" width="8" height="10" rx="2" fill="#D4A855" />
                                {/* Storage drawers indicator */}
                                <rect x="30" y="115" width="140" height="18" rx="3" fill="#2A1F14" stroke="#D4A85530" strokeWidth="1" />
                                <circle cx="100" cy="124" r="3" fill="#D4A85580" />
                            </svg>
                        </div>
                        <div className="hero__furniture-info">
                            <span className="hero__furniture-label">King Size Bed — Sheesham</span>
                            <span className="hero__furniture-price">₹23,576 <span className="hero__furniture-transparent">all-inclusive</span></span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats ribbon */}
            <div className="hero__stats">
                <div className="hero__stats-inner container stagger">
                    <div className="hero__stat">
                        <span className="hero__stat-number">500+</span>
                        <span className="hero__stat-label">{t('hero_stat_makers', lang)}</span>
                    </div>
                    <div className="hero__stat-divider" />
                    <div className="hero__stat">
                        <span className="hero__stat-number hero__stat-number--green">₹0</span>
                        <span className="hero__stat-label">{t('hero_stat_shock', lang)}</span>
                    </div>
                    <div className="hero__stat-divider" />
                    <div className="hero__stat">
                        <span className="hero__stat-number">4.8★</span>
                        <span className="hero__stat-label">{t('hero_stat_rating', lang)}</span>
                    </div>
                    <div className="hero__stat-divider" />
                    <div className="hero__stat">
                        <span className="hero__stat-number">12+</span>
                        <span className="hero__stat-label">{t('hero_stat_cities', lang)}</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
