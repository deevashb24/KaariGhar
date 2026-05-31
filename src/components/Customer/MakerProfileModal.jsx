import React, { useState, useEffect } from 'react';
import api from '../../api';
import ReviewCard from './ReviewCard';
import { X, MapPin, Calendar, Shield, Star, Phone, Store, FileText, Clock, Truck, Award, MessageCircle, Image, Heart } from 'lucide-react';

export default function MakerProfileModal({ makerId, onClose }) {
    const [maker, setMaker] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [reviews, setReviews] = useState({ reviews: [], averageRating: 0, totalReviews: 0 });
    const [portfolio, setPortfolio] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        async function fetchMaker() {
            try {
                const res = await api.get(`/makers/${makerId}`);
                setMaker(res.data);
            } catch (err) {
                console.error('Failed to fetch maker', err);
            } finally {
                setLoading(false);
            }
        }
        if (makerId) fetchMaker();
    }, [makerId]);

    useEffect(() => {
        if (!makerId) return;
        api.get(`/makers/${makerId}/reviews`).then(r => setReviews(r.data)).catch(() => { });
        api.get(`/makers/${makerId}/portfolio`).then(r => setPortfolio(r.data)).catch(() => { });
    }, [makerId]);

    if (!makerId) return null;

    const maskPhone = (phone) => {
        if (!phone) return null;
        const digits = phone.replace(/\D/g, '');
        if (digits.length < 4) return phone;
        return phone.slice(0, -4) + '••••';
    };

    const getWhatsAppUrl = (phone, name) => {
        if (!phone) return null;
        const digits = phone.replace(/\D/g, '');
        const num = digits.startsWith('91') ? digits : '91' + digits;
        return `https://wa.me/${num}?text=${encodeURIComponent(`Hi ${name}, I found you on KaariGhar. I'd like to discuss a custom furniture project.`)}`;
    };

    const materialTags = maker?.materials ? maker.materials.split(',').map(m => m.trim()) : [];

    const availLabel = { AVAILABLE: '🟢 Available', BUSY: '🟡 Busy', ON_VACATION: '🔴 On Vacation' };

    return (
        <div className="maker-modal-overlay" onClick={onClose}>
            <div className="maker-modal maker-modal--rich" onClick={e => e.stopPropagation()}>
                <button className="maker-modal-close" onClick={onClose}>
                    <X size={20} />
                </button>

                {loading ? (
                    <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>
                ) : !maker ? (
                    <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Maker not found</div>
                ) : (
                    <>
                        {/* Header */}
                        <div className="maker-modal-header">
                            <div className="maker-modal-avatar">
                                {maker.name.charAt(0)}
                            </div>
                            <div style={{ flex: 1 }}>
                                <h2 style={{ margin: '0 0 4px', color: 'var(--gold)', fontFamily: "'Playfair Display', serif" }}>{maker.name}</h2>
                                {maker.shopName && <p style={{ margin: '0 0 8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{maker.shopName}</p>}
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    {maker.city && <span className="maker-modal-tag"><MapPin size={12} /> {maker.city}</span>}
                                    <span className="maker-modal-tag"><Calendar size={12} /> Joined {new Date(maker.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span>
                                    <span className="maker-modal-tag maker-modal-tag--green"><Shield size={12} /> Trust Verified</span>
                                    {maker.yearsExperience && <span className="maker-modal-tag"><Award size={12} /> {maker.yearsExperience}+ yrs</span>}
                                    {maker.availability && <span className="maker-modal-tag">{availLabel[maker.availability] || maker.availability}</span>}
                                </div>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="maker-modal-tabs">
                            <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>Overview</button>
                            <button className={activeTab === 'portfolio' ? 'active' : ''} onClick={() => setActiveTab('portfolio')}>Work ({portfolio.length})</button>
                            <button className={activeTab === 'reviews' ? 'active' : ''} onClick={() => setActiveTab('reviews')}>Reviews ({reviews.totalReviews})</button>
                            <button className={activeTab === 'shop' ? 'active' : ''} onClick={() => setActiveTab('shop')}>Shop</button>
                            <button className={activeTab === 'contact' ? 'active' : ''} onClick={() => setActiveTab('contact')}>Contact</button>
                        </div>

                        {/* Tab Content */}
                        <div className="maker-modal-body">
                            {activeTab === 'overview' && (
                                <>
                                    {maker.profileDetails && (
                                        <div className="maker-modal-section">
                                            <h4><Star size={16} style={{ color: 'var(--gold)' }} /> Specialization</h4>
                                            <p>{maker.profileDetails}</p>
                                        </div>
                                    )}

                                    {maker.bio && (
                                        <div className="maker-modal-section">
                                            <h4>About</h4>
                                            <p>{maker.bio}</p>
                                        </div>
                                    )}

                                    {materialTags.length > 0 && (
                                        <div className="maker-modal-section">
                                            <h4>Materials</h4>
                                            <div className="maker-modal-material-tags">
                                                {materialTags.map((mat, i) => (
                                                    <span key={i} className="maker-modal-material-tag">{mat}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="maker-modal-stats">
                                        <div className="maker-modal-stat">
                                            <span className="maker-modal-stat-value">{reviews.averageRating > 0 ? reviews.averageRating + '★' : '—'}</span>
                                            <span className="maker-modal-stat-label">Rating</span>
                                        </div>
                                        <div className="maker-modal-stat">
                                            <span className="maker-modal-stat-value">{reviews.totalReviews}</span>
                                            <span className="maker-modal-stat-label">Reviews</span>
                                        </div>
                                        <div className="maker-modal-stat">
                                            <span className="maker-modal-stat-value">{portfolio.length}</span>
                                            <span className="maker-modal-stat-label">Works</span>
                                        </div>
                                    </div>
                                </>
                            )}

                            {activeTab === 'portfolio' && (
                                <>
                                    {portfolio.length === 0 ? (
                                        <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)' }}>
                                            <Image size={40} style={{ opacity: 0.3, marginBottom: '8px' }} />
                                            <p>No portfolio items yet</p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="portfolio-grid">
                                                {portfolio.map(item => (
                                                    <div key={item.id} className="portfolio-item" onClick={() => setSelectedImage(item)}>
                                                        <img src={item.imageUrl} alt={item.caption || 'Portfolio'} />
                                                        {item.caption && <div className="portfolio-item-caption">{item.caption}</div>}
                                                        {item.category && <span className="portfolio-item-cat">{item.category}</span>}
                                                    </div>
                                                ))}
                                            </div>
                                            {selectedImage && (
                                                <div className="portfolio-lightbox" onClick={() => setSelectedImage(null)}>
                                                    <img src={selectedImage.imageUrl} alt={selectedImage.caption || ''} />
                                                    {selectedImage.caption && <p>{selectedImage.caption}</p>}
                                                </div>
                                            )}
                                        </>
                                    )}
                                </>
                            )}

                            {activeTab === 'reviews' && (
                                <>
                                    {reviews.totalReviews > 0 && (
                                        <div className="reviews-summary">
                                            <div className="reviews-summary-big">{reviews.averageRating}</div>
                                            <div>
                                                <div className="reviews-summary-stars">
                                                    {Array.from({ length: 5 }, (_, i) => (
                                                        <Star key={i} size={16} fill={i < Math.round(reviews.averageRating) ? '#d4af37' : 'none'} color={i < Math.round(reviews.averageRating) ? '#d4af37' : 'rgba(255,255,255,0.2)'} />
                                                    ))}
                                                </div>
                                                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{reviews.totalReviews} review{reviews.totalReviews !== 1 ? 's' : ''}</span>
                                            </div>
                                        </div>
                                    )}
                                    {reviews.reviews.length === 0 ? (
                                        <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>No reviews yet</p>
                                    ) : (
                                        <div className="reviews-list">
                                            {reviews.reviews.map(r => <ReviewCard key={r.id} review={r} />)}
                                        </div>
                                    )}
                                </>
                            )}

                            {activeTab === 'shop' && (
                                <>
                                    <div className="maker-modal-shop-grid">
                                        {maker.shopName && (
                                            <div className="maker-modal-shop-item">
                                                <div className="maker-modal-shop-icon"><Store size={16} /></div>
                                                <div>
                                                    <span className="maker-modal-shop-label">Shop Name</span>
                                                    <span className="maker-modal-shop-value">{maker.shopName}</span>
                                                </div>
                                            </div>
                                        )}
                                        {maker.shopAddress && (
                                            <div className="maker-modal-shop-item">
                                                <div className="maker-modal-shop-icon"><MapPin size={16} /></div>
                                                <div>
                                                    <span className="maker-modal-shop-label">Address</span>
                                                    <span className="maker-modal-shop-value">{maker.shopAddress}</span>
                                                </div>
                                            </div>
                                        )}
                                        {maker.licenseNumber && (
                                            <div className="maker-modal-shop-item">
                                                <div className="maker-modal-shop-icon"><FileText size={16} /></div>
                                                <div>
                                                    <span className="maker-modal-shop-label">License / GST</span>
                                                    <span className="maker-modal-shop-value">{maker.licenseNumber}</span>
                                                </div>
                                            </div>
                                        )}
                                        {maker.workingHours && (
                                            <div className="maker-modal-shop-item">
                                                <div className="maker-modal-shop-icon"><Clock size={16} /></div>
                                                <div>
                                                    <span className="maker-modal-shop-label">Working Hours</span>
                                                    <span className="maker-modal-shop-value">{maker.workingHours}</span>
                                                </div>
                                            </div>
                                        )}
                                        {maker.deliveryRadius && (
                                            <div className="maker-modal-shop-item">
                                                <div className="maker-modal-shop-icon"><Truck size={16} /></div>
                                                <div>
                                                    <span className="maker-modal-shop-label">Delivery Radius</span>
                                                    <span className="maker-modal-shop-value">{maker.deliveryRadius}</span>
                                                </div>
                                            </div>
                                        )}
                                        {maker.yearsExperience && (
                                            <div className="maker-modal-shop-item">
                                                <div className="maker-modal-shop-icon"><Award size={16} /></div>
                                                <div>
                                                    <span className="maker-modal-shop-label">Experience</span>
                                                    <span className="maker-modal-shop-value">{maker.yearsExperience} years</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {!maker.shopName && !maker.licenseNumber && (
                                        <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', textAlign: 'center', padding: '2rem 0' }}>
                                            This craftsman hasn't added shop details yet.
                                        </p>
                                    )}
                                </>
                            )}

                            {activeTab === 'contact' && (
                                <div className="maker-modal-contact">
                                    {maker.phone && (
                                        <div className="maker-modal-contact-row">
                                            <Phone size={16} style={{ color: 'var(--gold)' }} />
                                            <span>{maskPhone(maker.phone)}</span>
                                        </div>
                                    )}
                                    {maker.email && (
                                        <div className="maker-modal-contact-row">
                                            <MessageCircle size={16} style={{ color: 'var(--gold)' }} />
                                            <span>{maker.email}</span>
                                        </div>
                                    )}
                                    {maker.city && (
                                        <div className="maker-modal-contact-row">
                                            <MapPin size={16} style={{ color: 'var(--gold)' }} />
                                            <span>{maker.city}</span>
                                        </div>
                                    )}

                                    {maker.phone && (
                                        <a
                                            href={getWhatsAppUrl(maker.phone, maker.name)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="maker-modal-whatsapp-btn"
                                        >
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                            </svg>
                                            Chat on WhatsApp
                                        </a>
                                    )}

                                    {!maker.phone && (
                                        <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', textAlign: 'center', padding: '1rem 0' }}>
                                            Contact details not available yet. Submit a request to connect.
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
