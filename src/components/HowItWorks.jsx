import { t } from '../i18n';
import './HowItWorks.css';

const STEPS = [
    {
        icon: (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
            </svg>
        ),
        titleKey: 'hiw_step1_title',
        descKey: 'hiw_step1_desc',
        color: '#D4A855',
    },
    {
        icon: (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
        ),
        titleKey: 'hiw_step2_title',
        descKey: 'hiw_step2_desc',
        color: '#4CAF50',
    },
    {
        icon: (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M9 12l2 2 4-4" />
            </svg>
        ),
        titleKey: 'hiw_step3_title',
        descKey: 'hiw_step3_desc',
        color: '#42A5F5',
    },
    {
        icon: (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
                <path d="M16 11l2 2 4-4" />
            </svg>
        ),
        titleKey: 'hiw_step4_title',
        descKey: 'hiw_step4_desc',
        color: '#FF9800',
    },
];

export default function HowItWorks({ lang }) {
    return (
        <section className="hiw" id="how-it-works">
            <div className="container">
                <div className="hiw__header anim-fade-up">
                    <h2 className="hiw__title">{t('hiw_title', lang)}</h2>
                    <p className="hiw__subtitle">{t('hiw_subtitle', lang)}</p>
                </div>

                <div className="hiw__steps stagger">
                    {STEPS.map((step, i) => (
                        <div key={i} className="hiw__step glass-card">
                            <div className="hiw__step-number">{String(i + 1).padStart(2, '0')}</div>
                            <div className="hiw__step-icon" style={{ color: step.color, borderColor: step.color + '30', background: step.color + '10' }}>
                                {step.icon}
                            </div>
                            <h3 className="hiw__step-title">{t(step.titleKey, lang)}</h3>
                            <p className="hiw__step-desc">{t(step.descKey, lang)}</p>
                            {i < STEPS.length - 1 && (
                                <div className="hiw__connector">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round">
                                        <path d="M12 5v14M19 12l-7 7-7-7" />
                                    </svg>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
