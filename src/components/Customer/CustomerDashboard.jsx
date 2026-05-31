import React, { useState, useEffect } from 'react';
import api from '../../api';
import RequestFlow from '../RequestFlow';
import MakerMap from './MakerMap';
import MakerProfileModal from './MakerProfileModal';
import ProfileSettings from '../ProfileSettings';
import OrderTimeline from '../OrderTimeline';
import { toast, Toaster } from 'react-hot-toast';
import { LayoutDashboard, MessageSquare, Settings, Plus, IndianRupee, MapPin, Star, MapPinned, List, Eye, Search, Filter, ClipboardList, ShoppingCart, FileText, Wallet, Heart } from 'lucide-react';
import '../Dashboard.css';

export default function CustomerDashboard() {
    const [activeTab, setActiveTab] = useState('requests');
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showRequestFlow, setShowRequestFlow] = useState(false);

    // Discover tab state
    const [allMakers, setAllMakers] = useState([]);
    const [filteredMakers, setFilteredMakers] = useState([]);
    const [highlightMakerId, setHighlightMakerId] = useState(null);
    const [discoverView, setDiscoverView] = useState('both');
    const [selectedMakerForProfile, setSelectedMakerForProfile] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [cityFilter, setCityFilter] = useState('');

    // Stats
    const [stats, setStats] = useState({ totalRequests: 0, activeOrders: 0, quotesReceived: 0, totalSpent: 0 });

    // Favorites
    const [favorites, setFavorites] = useState([]);
    const [favoriteIds, setFavoriteIds] = useState(new Set());

    // Request detail
    const [selectedRequest, setSelectedRequest] = useState(null);

    const fetchRequests = async () => {
        try {
            const res = await api.get('/customer/requests');
            setRequests(res.data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch requests.");
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const res = await api.get('/customer/stats');
            setStats(res.data);
        } catch (err) { /* silent */ }
    };

    const fetchFavorites = async () => {
        try {
            const res = await api.get('/favorites');
            setFavorites(res.data);
            setFavoriteIds(new Set(res.data.map(m => m.id)));
        } catch (err) { /* silent */ }
    };

    useEffect(() => {
        fetchRequests();
        fetchStats();
        fetchFavorites();
    }, []);

    // Filter makers when search/city changes
    useEffect(() => {
        let result = allMakers;
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(m =>
                m.name.toLowerCase().includes(q) ||
                (m.profileDetails || '').toLowerCase().includes(q) ||
                (m.materials || '').toLowerCase().includes(q) ||
                (m.shopName || '').toLowerCase().includes(q)
            );
        }
        if (cityFilter) {
            result = result.filter(m => m.city === cityFilter);
        }
        setFilteredMakers(result);
    }, [searchQuery, cityFilter, allMakers]);

    // Get unique cities from makers
    const cities = [...new Set(allMakers.filter(m => m.city).map(m => m.city))];

    const handleRequestSubmit = async (formData) => {
        try {
            const loadingToast = toast.loading('Submitting request...');
            await api.post('/customer/requests', {
                title: `Custom ${formData.spec.category}`,
                description: formData.description,
                specs: formData.spec,
                budget: parseFloat(formData.spec.budget.replace(/[^\d]/g, '')) || 25000,
                attachments: formData.attachments || [],
                aiInsights: formData.aiInsights || '',
            });
            toast.dismiss(loadingToast);
            toast.success('Request submitted successfully!');
            setShowRequestFlow(false);
            fetchRequests();
            fetchStats();
        } catch (err) {
            console.error(err);
            toast.error('Failed to submit request.');
        }
    };

    const handleAcceptQuote = async (quoteId) => {
        try {
            const loadingToast = toast.loading('Processing acceptance...');
            await api.post(`/customer/quotes/${quoteId}/accept`);
            toast.dismiss(loadingToast);
            toast.success("Quote accepted! Your order is now in progress.");
            fetchRequests();
            fetchStats();
        } catch (err) {
            console.error(err);
            toast.error("Error accepting quote.");
        }
    };

    const handleViewOnMap = (makerId) => {
        setHighlightMakerId(makerId);
        setTimeout(() => setHighlightMakerId(null), 3000);
    };

    const toggleFavorite = async (makerId, e) => {
        if (e) e.stopPropagation();
        try {
            const res = await api.post(`/favorites/${makerId}`);
            if (res.data.favorited) {
                toast.success('Added to favorites!');
            } else {
                toast.success('Removed from favorites');
            }
            fetchFavorites();
        } catch (err) {
            toast.error('Failed to update favorite');
        }
    };

    const availLabel = { AVAILABLE: '🟢', BUSY: '🟡', ON_VACATION: '🔴' };

    const renderMakerCard = (maker, showMapBtn = true) => (
        <div key={maker.id} className="maker-list-card" onClick={() => setSelectedMakerForProfile(maker.id)} style={{ cursor: 'pointer' }}>
            <div className="maker-list-card__avatar">
                {maker.name.charAt(0)}
                {maker.availability && <span className="maker-avail-dot" title={maker.availability}>{availLabel[maker.availability] || ''}</span>}
            </div>
            <div className="maker-list-card__info">
                <h4>{maker.name}</h4>
                <p className="maker-list-card__details">{maker.shopName || maker.profileDetails || 'Expert Artisan'}</p>
                <div className="maker-list-card__meta">
                    {maker.city && (
                        <span className="maker-list-card__badge">
                            <MapPin size={12} /> {maker.city}
                        </span>
                    )}
                    {maker.yearsExperience && (
                        <span className="maker-list-card__badge">
                            {maker.yearsExperience}+ yrs
                        </span>
                    )}
                    <span className="maker-list-card__verified">✓ Verified</span>
                </div>
            </div>
            <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                <button
                    className={`maker-list-card__action ${favoriteIds.has(maker.id) ? 'favorited' : ''}`}
                    onClick={(e) => toggleFavorite(maker.id, e)}
                    title={favoriteIds.has(maker.id) ? 'Remove from favorites' : 'Add to favorites'}
                >
                    <Heart size={16} fill={favoriteIds.has(maker.id) ? '#e74c3c' : 'none'} color={favoriteIds.has(maker.id) ? '#e74c3c' : 'currentColor'} />
                </button>
                <button
                    className="maker-list-card__action"
                    onClick={(e) => { e.stopPropagation(); setSelectedMakerForProfile(maker.id); }}
                    title="View profile"
                >
                    <Eye size={16} />
                </button>
                {showMapBtn && discoverView === 'both' && (
                    <button
                        className="maker-list-card__action"
                        onClick={(e) => { e.stopPropagation(); handleViewOnMap(maker.id); }}
                        title="View on map"
                    >
                        <MapPinned size={16} />
                    </button>
                )}
            </div>
        </div>
    );

    if (loading) return <div className="dashboard-container" style={{ alignItems: 'center', justifyContent: 'center', color: 'var(--gold)' }}>Loading Dashboard...</div>;

    return (
        <div className="dashboard-container">
            <Toaster position="top-right" />

            {/* Sidebar */}
            <div className="dashboard-sidebar">
                <button className={`sidebar-tab ${activeTab === 'requests' ? 'active' : ''}`} onClick={() => setActiveTab('requests')}>
                    <LayoutDashboard size={20} /> My Requests
                </button>
                <button className={`sidebar-tab ${activeTab === 'discover' ? 'active' : ''}`} onClick={() => setActiveTab('discover')}>
                    <MapPin size={20} /> Discover Makers
                </button>
                <button className={`sidebar-tab ${activeTab === 'favorites' ? 'active' : ''}`} onClick={() => { setActiveTab('favorites'); fetchFavorites(); }}>
                    <Heart size={20} /> Favorites {favorites.length > 0 && <span className="sidebar-tab-badge">{favorites.length}</span>}
                </button>
                <button className={`sidebar-tab ${activeTab === 'messages' ? 'active' : ''}`} onClick={() => setActiveTab('messages')}>
                    <MessageSquare size={20} /> Messages
                </button>
                <button className={`sidebar-tab ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
                    <Settings size={20} /> Settings
                </button>
            </div>

            {/* Main Content */}
            <div className="dashboard-main">
                {activeTab === 'requests' && !selectedRequest && (
                    <>
                        {/* Stats Cards */}
                        <div className="dashboard-stats-row">
                            <div className="dashboard-stat-card">
                                <div className="dashboard-stat-icon" style={{ background: 'rgba(212,175,55,0.15)', color: 'var(--gold)' }}><ClipboardList size={20} /></div>
                                <div><span className="dashboard-stat-value">{stats.totalRequests}</span><span className="dashboard-stat-label">Total Requests</span></div>
                            </div>
                            <div className="dashboard-stat-card">
                                <div className="dashboard-stat-icon" style={{ background: 'rgba(52,152,219,0.15)', color: '#3498db' }}><ShoppingCart size={20} /></div>
                                <div><span className="dashboard-stat-value">{stats.activeOrders}</span><span className="dashboard-stat-label">Active Orders</span></div>
                            </div>
                            <div className="dashboard-stat-card">
                                <div className="dashboard-stat-icon" style={{ background: 'rgba(46,204,113,0.15)', color: '#2ecc71' }}><FileText size={20} /></div>
                                <div><span className="dashboard-stat-value">{stats.quotesReceived}</span><span className="dashboard-stat-label">Quotes Received</span></div>
                            </div>
                            <div className="dashboard-stat-card">
                                <div className="dashboard-stat-icon" style={{ background: 'rgba(155,89,182,0.15)', color: '#9b59b6' }}><Wallet size={20} /></div>
                                <div><span className="dashboard-stat-value">₹{stats.totalSpent.toLocaleString('en-IN')}</span><span className="dashboard-stat-label">Total Spent</span></div>
                            </div>
                        </div>

                        <div className="dashboard-header">
                            <h2>My Furniture Requests</h2>
                            <button className="gold-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => setShowRequestFlow(true)}>
                                <Plus size={18} /> New Request
                            </button>
                        </div>

                        {requests.length === 0 ? (
                            <div className="empty-state">
                                <h3>No Requests Yet</h3>
                                <p>Start your custom furniture journey by creating a new request.</p>
                                <button className="gold-btn" style={{ marginTop: '1rem' }} onClick={() => setShowRequestFlow(true)}>Create Request</button>
                            </div>
                        ) : (
                            <div>
                                {requests.map(req => (
                                    <div key={req.id} className="dashboard-card" onClick={() => setSelectedRequest(req)} style={{ cursor: 'pointer' }}>
                                        <div className="card-header">
                                            <div>
                                                <h3 className="card-title">{req.title}</h3>
                                                <p className="card-subtitle">Budget: <IndianRupee size={12} />{req.budget || 'Not specified'}</p>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span className={`status-badge status-${req.status}`}>{req.status.replace('_', ' ')}</span>
                                                {req.quotes && req.quotes.length > 0 && (
                                                    <span className="quote-count-badge">{req.quotes.length} quote{req.quotes.length !== 1 ? 's' : ''}</span>
                                                )}
                                            </div>
                                        </div>
                                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.5', fontSize: '0.9rem' }}>{req.description?.substring(0, 120)}...</p>

                                        {/* Order Timeline for in-progress orders */}
                                        {(req.status === 'IN_PROGRESS' || req.status === 'COMPLETED') && (
                                            <OrderTimeline status={req.status} />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}

                {/* Request Detail View */}
                {activeTab === 'requests' && selectedRequest && (
                    <div className="request-detail-view">
                        <button className="back-btn" onClick={() => setSelectedRequest(null)}>← Back to Requests</button>
                        <div className="request-detail-header">
                            <div>
                                <h2>{selectedRequest.title}</h2>
                                <p className="card-subtitle">Budget: <IndianRupee size={12} />{selectedRequest.budget || 'Not specified'}</p>
                            </div>
                            <span className={`status-badge status-${selectedRequest.status}`}>{selectedRequest.status.replace('_', ' ')}</span>
                        </div>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '1.5rem' }}>{selectedRequest.description}</p>

                        {selectedRequest.attachments && (() => {
                            try {
                                const atts = typeof selectedRequest.attachments === 'string' ? JSON.parse(selectedRequest.attachments) : selectedRequest.attachments;
                                if (atts && atts.length > 0) {
                                    return (
                                        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', marginBottom: '1.5rem' }}>
                                            {atts.map((att, i) => {
                                                const isImage = att.startsWith('data:image') || att.match(/\.(jpeg|jpg|gif|png|webp)(\?|$)/i) || att.includes('unsplash.com') || att.includes('images');
                                                if (isImage) {
                                                    return <img key={i} src={att} alt="Reference" style={{ height: '80px', borderRadius: '4px', objectFit: 'cover' }} />;
                                                }
                                                return <a key={i} href={att} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', padding: '0 12px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', color: 'var(--gold)', textDecoration: 'none', height: '40px', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>📎 View Media {i + 1}</a>;
                                            })}
                                        </div>
                                    );
                                }
                            } catch (e) { return null; }
                        })()}

                        {selectedRequest.specs && (() => {
                            try {
                                const s = typeof selectedRequest.specs === 'string' ? JSON.parse(selectedRequest.specs) : selectedRequest.specs;
                                return (
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '1.5rem' }}>
                                        {Object.entries(s).filter(([k, v]) => v && k !== 'notes').map(([k, v]) => (
                                            <span key={k} style={{ background: 'rgba(212, 175, 55, 0.1)', color: 'var(--gold)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem', textTransform: 'capitalize' }}>
                                                {k}: {v}
                                            </span>
                                        ))}
                                    </div>
                                );
                            } catch (e) { return null; }
                        })()}

                        {(selectedRequest.status === 'IN_PROGRESS' || selectedRequest.status === 'COMPLETED') && (
                            <OrderTimeline status={selectedRequest.status} />
                        )}

                        {selectedRequest.quotes && selectedRequest.quotes.length > 0 ? (
                            <>
                                <h3 style={{ color: 'var(--gold)', marginBottom: '1rem' }}>📋 Quotes Comparison ({selectedRequest.quotes.length})</h3>
                                <div className="quotes-comparison-grid">
                                    {selectedRequest.quotes.map(quote => (
                                        <div key={quote.id} className={`quote-compare-card ${quote.status === 'ACCEPTED' ? 'accepted' : ''}`}>
                                            <div className="quote-compare-header">
                                                <div className="quote-compare-avatar">{quote.maker.name.charAt(0)}</div>
                                                <div>
                                                    <h4>{quote.maker.name}</h4>
                                                    <span className={`status-badge status-${quote.status}`} style={{ fontSize: '0.7rem', padding: '2px 8px' }}>{quote.status}</span>
                                                </div>
                                            </div>
                                            <div className="quote-compare-price">
                                                <IndianRupee size={18} />{quote.price.toLocaleString('en-IN')}
                                            </div>
                                            {quote.proposedTimeline && (
                                                <p className="quote-compare-timeline">⏱️ {quote.proposedTimeline}</p>
                                            )}
                                            <p className="quote-compare-message">"{quote.message}"</p>
                                            <div className="quote-compare-actions">
                                                {quote.status === 'PENDING' && selectedRequest.status !== 'IN_PROGRESS' && (
                                                    <button onClick={(e) => { e.stopPropagation(); handleAcceptQuote(quote.id); }} className="gold-btn" style={{ width: '100%', padding: '10px' }}>
                                                        Accept Quote
                                                    </button>
                                                )}
                                                {quote.status === 'ACCEPTED' && (
                                                    <div style={{ padding: '10px', background: 'rgba(46, 204, 113, 0.1)', color: '#2ecc71', borderRadius: '6px', textAlign: 'center', fontWeight: '500' }}>
                                                        ✓ Accepted
                                                    </div>
                                                )}
                                                <button className="outline-btn" onClick={(e) => { e.stopPropagation(); setSelectedMakerForProfile(quote.makerId); }}>
                                                    View Maker Profile
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="empty-state" style={{ marginTop: '1rem' }}>
                                <p>No quotes received yet. Makers will review your request soon.</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'discover' && (
                    <div style={{ width: '100%' }}>
                        <div className="dashboard-header" style={{ marginBottom: '1rem' }}>
                            <div>
                                <h2>Discover Makers</h2>
                                <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Find expert craftsmen near you. Hover over map markers for details.</p>
                            </div>
                            <div className="discover-view-toggle">
                                <button className={discoverView === 'both' ? 'active' : ''} onClick={() => setDiscoverView('both')} title="Map + List">
                                    <MapPinned size={16} /> Both
                                </button>
                                <button className={discoverView === 'map' ? 'active' : ''} onClick={() => setDiscoverView('map')} title="Map only">
                                    <MapPin size={16} /> Map
                                </button>
                                <button className={discoverView === 'list' ? 'active' : ''} onClick={() => setDiscoverView('list')} title="List only">
                                    <List size={16} /> List
                                </button>
                            </div>
                        </div>

                        {/* Search & Filter Bar */}
                        <div className="discover-search-bar">
                            <div className="discover-search-input-wrap">
                                <Search size={16} className="discover-search-icon" />
                                <input
                                    type="text"
                                    placeholder="Search by name, material, specialization..."
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    className="discover-search-input"
                                />
                            </div>
                            <div className="discover-filter-wrap">
                                <Filter size={16} />
                                <select value={cityFilter} onChange={e => setCityFilter(e.target.value)} className="discover-filter-select">
                                    <option value="">All Cities</option>
                                    {cities.map(city => <option key={city} value={city}>{city}</option>)}
                                </select>
                            </div>
                        </div>

                        {(discoverView === 'both' || discoverView === 'map') && (
                            <MakerMap
                                onMakersLoaded={(data) => setAllMakers(data)}
                                highlightMakerId={highlightMakerId}
                            />
                        )}

                        {(discoverView === 'both' || discoverView === 'list') && (
                            <div className="maker-list-section">
                                <h3 className="maker-list-title">
                                    <Star size={18} style={{ color: 'var(--gold)' }} />
                                    {searchQuery || cityFilter ? `Results (${filteredMakers.length})` : `All Craftsmen (${filteredMakers.length})`}
                                </h3>
                                <div className="maker-list-grid">
                                    {filteredMakers.map(maker => renderMakerCard(maker, true))}
                                    {filteredMakers.length === 0 && (
                                        <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
                                            <p>{searchQuery || cityFilter ? 'No makers matching your search.' : 'Loading craftsmen...'}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'favorites' && (
                    <div style={{ width: '100%' }}>
                        <div className="dashboard-header" style={{ marginBottom: '1.5rem' }}>
                            <div>
                                <h2>❤️ Favorite Makers</h2>
                                <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Your saved makers for quick access.</p>
                            </div>
                        </div>
                        {favorites.length === 0 ? (
                            <div className="empty-state">
                                <Heart size={40} style={{ opacity: 0.3, marginBottom: '12px', color: 'var(--gold)' }} />
                                <h3>No Favorites Yet</h3>
                                <p>Browse the Discover tab and tap the heart icon to save your favorite makers.</p>
                                <button className="gold-btn" style={{ marginTop: '1rem' }} onClick={() => setActiveTab('discover')}>Discover Makers</button>
                            </div>
                        ) : (
                            <div className="maker-list-grid">
                                {favorites.map(maker => renderMakerCard(maker, false))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'messages' && (
                    <div className="dashboard-header">
                        <h2>Messages</h2>
                        <p style={{ color: 'var(--text-muted)' }}>Message center coming soon.</p>
                    </div>
                )}

                {activeTab === 'settings' && (
                    <ProfileSettings />
                )}
            </div>

            {showRequestFlow && (
                <RequestFlow lang="en" onClose={() => setShowRequestFlow(false)} onSubmit={handleRequestSubmit} />
            )}

            {/* Maker Profile Modal */}
            {selectedMakerForProfile && (
                <MakerProfileModal
                    makerId={selectedMakerForProfile}
                    onClose={() => setSelectedMakerForProfile(null)}
                />
            )}
        </div>
    );
}
