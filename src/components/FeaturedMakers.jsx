import { t } from '../i18n';
import { MOCK_MAKERS } from '../data';
import './FeaturedMakers.css';

function StarRating({ rating }) {
    return (
        <span className="star-rating">
            {'★'.repeat(Math.floor(rating))}
            {rating % 1 >= 0.5 ? '½' : ''}
            <span className="star-rating__value">{rating}</span>
        </span>
    );
}

export default function FeaturedMakers({ lang, onViewMaker }) {
    return (
        <section className="feat" id="makers">
            <div className="container">
                <div className="feat__header anim-fade-up">
                    <h2 className="feat__title">{t('feat_title', lang)}</h2>
                    <p className="feat__subtitle">{t('feat_subtitle', lang)}</p>
                </div>

                <div className="feat__grid stagger">
                    {MOCK_MAKERS.map((maker) => (
                        <div
                            key={maker.id}
                            className="feat__card glass-card"
                            onClick={() => onViewMaker?.(maker)}
                        >
                            <div className="feat__card-header">
                                <div className="feat__avatar">
                                    <span>{maker.name.split(' ').map(n => n[0]).slice(0, 2).join('')}</span>
                                </div>
                                <div className="feat__card-info">
                                    <h3 className="feat__card-name">{maker.name}</h3>
                                    <span className="feat__card-city">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" /></svg>
                                        {maker.city}
                                    </span>
                                </div>
                                {maker.verified.siteVisit && maker.verified.gst && maker.verified.id && (
                                    <span className="badge badge--gold" style={{ fontSize: '0.65rem' }}>
                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>
                                        {t('quote_verified', lang)}
                                    </span>
                                )}
                            </div>

                            <div className="feat__card-meta">
                                <div className="feat__meta-item">
                                    <StarRating rating={maker.rating} />
                                    <span className="feat__meta-sub">({maker.reviews})</span>
                                </div>
                                <div className="feat__meta-item">
                                    <span className="feat__meta-value">{maker.years}</span>
                                    <span className="feat__meta-sub">{t('maker_years', lang)}</span>
                                </div>
                            </div>

                            <div className="feat__specialties">
                                {maker.specialties.map((s, i) => (
                                    <span key={i} className="feat__specialty">{s}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
