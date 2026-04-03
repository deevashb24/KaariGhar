import { t } from '../i18n';
import './Footer.css';

export default function Footer({ lang }) {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer__grid">
                    <div className="footer__brand">
                        <div className="footer__logo">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M3 12L12 3L21 12V21H3V12Z" stroke="var(--gold)" strokeWidth="2" strokeLinejoin="round" />
                                <path d="M9 21V15H15V21" stroke="var(--gold)" strokeWidth="2" strokeLinejoin="round" />
                            </svg>
                            <span>KaariGhar</span>
                        </div>
                        <p className="footer__tagline">{t('footer_tagline', lang)}</p>
                        <div className="footer__socials">
                            <a href="#" aria-label="Instagram">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
                            </a>
                            <a href="#" aria-label="YouTube">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.13C5.12 19.56 12 19.56 12 19.56s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.43z" /><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" /></svg>
                            </a>
                            <a href="#" aria-label="WhatsApp">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
                            </a>
                        </div>
                    </div>

                    <div className="footer__links-group">
                        <h4>{t('footer_company', lang)}</h4>
                        <a href="#">{t('footer_about', lang)}</a>
                        <a href="#">{t('footer_careers', lang)}</a>
                        <a href="#">{t('footer_blog', lang)}</a>
                    </div>

                    <div className="footer__links-group">
                        <h4>{t('footer_support', lang)}</h4>
                        <a href="#">{t('footer_help', lang)}</a>
                        <a href="#">{t('footer_contact', lang)}</a>
                        <a href="#">{t('footer_disputes', lang)}</a>
                    </div>

                    <div className="footer__links-group">
                        <h4>{t('footer_legal', lang)}</h4>
                        <a href="#">{t('footer_privacy', lang)}</a>
                        <a href="#">{t('footer_terms', lang)}</a>
                    </div>
                </div>

                <div className="footer__bottom">
                    <span>{t('footer_copyright', lang)}</span>
                    <span className="footer__made">Made with ❤️ in India</span>
                </div>
            </div>
        </footer>
    );
}
