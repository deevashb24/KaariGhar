import React, { useState, useEffect } from 'react';
import api from '../../api';
import ProfileSettings from '../ProfileSettings';
import { toast, Toaster } from 'react-hot-toast';
import { LayoutDashboard, CheckSquare, MessageSquare, Settings, IndianRupee, Image, Plus, Trash2 } from 'lucide-react';
import '../Dashboard.css';

export default function MakerDashboard() {
    const [activeTab, setActiveTab] = useState('jobs');
    const [openRequests, setOpenRequests] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [quotingFor, setQuotingFor] = useState(null);
    const [activeAiPopup, setActiveAiPopup] = useState(null);

    // Portfolio
    const [portfolio, setPortfolio] = useState([]);
    const [portfolioForm, setPortfolioForm] = useState({ imageUrl: '', caption: '', category: '' });

    // Quote form state
    const [price, setPrice] = useState('');
    const [message, setMessage] = useState('');
    const [timeline, setTimeline] = useState('');

    const fetchData = async () => {
        try {
            const [reqRes, ordRes] = await Promise.all([
                api.get('/maker/requests'),
                api.get('/maker/orders')
            ]);
            setOpenRequests(reqRes.data);
            setOrders(ordRes.data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load dashboard data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        fetchPortfolio();
    }, []);

    const fetchPortfolio = async () => {
        try {
            const profile = await api.get('/profile');
            const res = await api.get(`/makers/${profile.data.id}/portfolio`);
            setPortfolio(res.data);
        } catch (err) { /* silent */ }
    };

    const addPortfolioItem = async () => {
        if (!portfolioForm.imageUrl) { toast.error('Image URL required'); return; }
        try {
            await api.post('/portfolio', portfolioForm);
            toast.success('Portfolio item added!');
            setPortfolioForm({ imageUrl: '', caption: '', category: '' });
            fetchPortfolio();
        } catch (err) { toast.error('Failed to add item'); }
    };

    const deletePortfolioItem = async (id) => {
        try {
            await api.delete(`/portfolio/${id}`);
            toast.success('Item removed');
            fetchPortfolio();
        } catch (err) { toast.error('Failed to delete'); }
    };

    const handleQuoteSubmit = async (e) => {
        e.preventDefault();
        try {
            const loadingToast = toast.loading('Submitting proposal...');
            await api.post('/maker/quotes', {
                requestId: quotingFor.id,
                price: parseFloat(price),
                message,
                proposedTimeline: timeline
            });
            toast.dismiss(loadingToast);
            toast.success("Quote submitted successfully!");
            setQuotingFor(null);
            setPrice('');
            setMessage('');
            setTimeline('');
            fetchData();
        } catch (err) {
            console.error(err);
            toast.error("Error submitting quote");
        }
    };

    if (loading) return <div className="dashboard-container" style={{ alignItems: 'center', justifyContent: 'center', color: 'var(--gold)' }}>Loading Maker Dashboard...</div>;

    return (
        <div className="dashboard-container">
            <Toaster position="top-right" />

            {activeAiPopup && (
                <div onClick={() => setActiveAiPopup(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div onClick={e => e.stopPropagation()} style={{ background: '#1a1a1a', border: '1px solid #ce93d8', borderRadius: '8px', padding: '25px', maxWidth: '500px', width: '100%', boxShadow: '0 10px 30px rgba(155, 89, 182, 0.2)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                            <h3 style={{ color: '#ce93d8', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>✨ AI Crafting Insights</h3>
                            <button onClick={() => setActiveAiPopup(null)} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
                        </div>
                        <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                            {activeAiPopup.replace(/\*\*/g, '').split('\n').filter(line => line.trim()).map((line, idx) => {
                                if (line.startsWith('-')) {
                                    return <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}><span style={{ color: '#ce93d8' }}>•</span><span>{line.replace(/^- /, '').trim()}</span></div>;
                                }
                                return <p key={idx} style={{ marginBottom: '12px', fontWeight: idx === 0 ? '500' : 'normal', color: idx === 0 ? '#ce93d8' : 'inherit' }}>{line}</p>;
                            })}
                        </div>
                        <button onClick={() => setActiveAiPopup(null)} className="gold-btn" style={{ width: '100%', marginTop: '15px', background: 'rgba(155, 89, 182, 0.2)', color: '#ce93d8', border: '1px solid #9b59b6' }}>Got It</button>
                    </div>
                </div>
            )}

            {/* Sidebar */}
            <div className="dashboard-sidebar">
                <button className={`sidebar-tab ${activeTab === 'jobs' ? 'active' : ''}`} onClick={() => setActiveTab('jobs')}>
                    <LayoutDashboard size={20} /> Available Jobs
                </button>
                <button className={`sidebar-tab ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
                    <CheckSquare size={20} /> Active Orders
                </button>
                <button className={`sidebar-tab ${activeTab === 'portfolio' ? 'active' : ''}`} onClick={() => setActiveTab('portfolio')}>
                    <Image size={20} /> Portfolio
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
                {activeTab === 'jobs' && (
                    <>
                        <div className="dashboard-header">
                            <h2>Available Jobs Near You</h2>
                        </div>

                        {openRequests.length === 0 ? (
                            <div className="empty-state">
                                <h3>No Open Requests</h3>
                                <p>There are no open jobs available right now. Check back later.</p>
                            </div>
                        ) : (
                            <div>
                                {openRequests.map(req => (
                                    <div key={req.id} className="dashboard-card">
                                        <div className="card-header">
                                            <div>
                                                <h3 className="card-title">{req.title}</h3>
                                                <p className="card-subtitle">Customer: {req.customer?.name} &bull; Budget: <IndianRupee size={12} />{req.budget}</p>
                                            </div>
                                            <span className={`status-badge status-${req.status}`}>{req.status.replace('_', ' ')}</span>
                                        </div>

                                        {req.attachments && (() => {
                                            try {
                                                const atts = typeof req.attachments === 'string' ? JSON.parse(req.attachments) : req.attachments;
                                                if (atts && atts.length > 0) {
                                                    return (
                                                        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', margin: '15px 0' }}>
                                                            {atts.map((att, i) => {
                                                                const isImage = att.startsWith('data:image') || att.match(/\.(jpeg|jpg|gif|png|webp)(\?|$)/i) || att.includes('unsplash.com') || att.includes('images');
                                                                return isImage ?
                                                                    <img key={i} src={att} alt="Reference" style={{ height: '100px', borderRadius: '4px', objectFit: 'cover' }} /> :
                                                                    <a key={i} href={att} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', padding: '0 12px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', color: 'var(--gold)', textDecoration: 'none', height: '40px', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>📎 View Media {i + 1}</a>
                                                            })}
                                                        </div>
                                                    );
                                                }
                                            } catch (e) { return null; }
                                        })()}

                                        <p style={{ color: 'var(--text-light)', lineHeight: '1.5', marginTop: '10px', marginBottom: '10px' }}>{req.description}</p>

                                        {req.specs && (() => {
                                            try {
                                                const s = typeof req.specs === 'string' ? JSON.parse(req.specs) : req.specs;
                                                return (
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '15px' }}>
                                                        {Object.entries(s).filter(([k, v]) => v && k !== 'notes').map(([k, v]) => (
                                                            <span key={k} style={{ background: 'rgba(212, 175, 55, 0.1)', color: 'var(--gold)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem', textTransform: 'capitalize' }}>
                                                                {k}: {v}
                                                            </span>
                                                        ))}
                                                        {s.notes && <p style={{ width: '100%', fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', marginTop: '4px' }}>Notes: {s.notes}</p>}
                                                    </div>
                                                );
                                            } catch (e) { return null; }
                                        })()}

                                        {req.aiInsights && (
                                            <div style={{ marginBottom: '15px' }}>
                                                <button onClick={() => setActiveAiPopup(req.aiInsights)} style={{ background: 'rgba(155, 89, 182, 0.1)', border: '1px solid #9b59b6', padding: '6px 12px', borderRadius: '4px', color: '#ce93d8', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', transition: 'all 0.2s' }}>
                                                    ✨ GET AI HELP
                                                </button>
                                            </div>
                                        )}

                                        {quotingFor?.id === req.id ? (
                                            <form onSubmit={handleQuoteSubmit} className="nested-card" style={{ marginTop: '1.5rem' }}>
                                                <h4 style={{ color: 'var(--gold)', marginBottom: '15px' }}>Craft Your Proposal</h4>
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                                                    <div>
                                                        <label style={{ display: 'block', marginBottom: '5px', color: 'var(--text-muted)' }}>Price (₹)</label>
                                                        <input type="number" placeholder="e.g. 15000" value={price} onChange={e => setPrice(e.target.value)} required
                                                            style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'white' }} />
                                                    </div>
                                                    <div>
                                                        <label style={{ display: 'block', marginBottom: '5px', color: 'var(--text-muted)' }}>Estimated Timeline</label>
                                                        <input type="text" placeholder="e.g. 2 weeks" value={timeline} onChange={e => setTimeline(e.target.value)} required
                                                            style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'white' }} />
                                                    </div>
                                                </div>
                                                <div style={{ marginBottom: '15px' }}>
                                                    <label style={{ display: 'block', marginBottom: '5px', color: 'var(--text-muted)' }}>Message to Customer</label>
                                                    <textarea placeholder="Describe how you will build this, materials you plan to use, etc." value={message} onChange={e => setMessage(e.target.value)} required rows="3"
                                                        style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'white', resize: 'vertical' }} />
                                                </div>
                                                <div style={{ display: 'flex', gap: '10px' }}>
                                                    <button type="submit" className="gold-btn" style={{ padding: '8px 20px' }}>Submit Proposal</button>
                                                    <button type="button" onClick={() => setQuotingFor(null)} style={{ padding: '8px 20px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white', cursor: 'pointer', borderRadius: '6px' }}>Cancel</button>
                                                </div>
                                            </form>
                                        ) : (
                                            <button onClick={() => setQuotingFor(req)} className="gold-btn" style={{ marginTop: '1.5rem', padding: '8px 20px' }}>
                                                Create Proposal
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}

                {activeTab === 'orders' && (
                    <>
                        <div className="dashboard-header">
                            <h2>Active Orders</h2>
                        </div>

                        {orders.length === 0 ? (
                            <div className="empty-state">
                                <h3>No Active Orders</h3>
                                <p>When a customer accepts your proposal, it will appear here.</p>
                            </div>
                        ) : (
                            <div>
                                {orders.map(order => (
                                    <div key={order.id} className="dashboard-card" style={{ borderColor: 'rgba(46, 204, 113, 0.3)' }}>
                                        <div className="card-header">
                                            <div>
                                                <h3 className="card-title">{order.quote.request.title}</h3>
                                                <p className="card-subtitle">Total: <IndianRupee size={12} />{order.totalPrice}</p>
                                            </div>
                                            <span className={`status-badge status-${order.status}`}>{order.status.replace('_', ' ')}</span>
                                        </div>
                                        <div style={{ marginTop: '15px' }}>
                                            <button style={{ padding: '8px 16px', background: 'transparent', border: '1px solid var(--gold)', color: 'var(--gold)', borderRadius: '6px', cursor: 'pointer' }}>
                                                Update Status
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}

                {activeTab === 'messages' && (
                    <div className="dashboard-header">
                        <h2>Messages</h2>
                        <p style={{ color: 'var(--text-muted)' }}>Message center coming soon.</p>
                    </div>
                )}

                {activeTab === 'portfolio' && (
                    <>
                        <div className="dashboard-header">
                            <h2>📸 My Portfolio</h2>
                            <p style={{ color: 'var(--text-muted)' }}>Showcase your best work to attract customers.</p>
                        </div>

                        <div className="portfolio-add-form">
                            <h4 style={{ color: 'var(--gold)', marginBottom: '12px' }}>Add New Work</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                                <input type="text" placeholder="Image URL" value={portfolioForm.imageUrl}
                                    onChange={e => setPortfolioForm(p => ({ ...p, imageUrl: e.target.value }))}
                                    style={{ padding: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'white' }} />
                                <input type="text" placeholder="Caption (optional)" value={portfolioForm.caption}
                                    onChange={e => setPortfolioForm(p => ({ ...p, caption: e.target.value }))}
                                    style={{ padding: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'white' }} />
                                <select value={portfolioForm.category}
                                    onChange={e => setPortfolioForm(p => ({ ...p, category: e.target.value }))}
                                    style={{ padding: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'white' }}>
                                    <option value="">Category</option>
                                    <option value="Bedroom">Bedroom</option>
                                    <option value="Living Room">Living Room</option>
                                    <option value="Office">Office</option>
                                    <option value="Kitchen">Kitchen</option>
                                    <option value="Outdoor">Outdoor</option>
                                    <option value="Custom">Custom</option>
                                </select>
                            </div>
                            <button className="gold-btn" onClick={addPortfolioItem} style={{ padding: '8px 20px' }}>
                                <Plus size={16} /> Add to Portfolio
                            </button>
                        </div>

                        {portfolio.length === 0 ? (
                            <div className="empty-state">
                                <Image size={40} style={{ opacity: 0.3, marginBottom: '12px' }} />
                                <h3>No Portfolio Items</h3>
                                <p>Add images of your past work to build trust with customers.</p>
                            </div>
                        ) : (
                            <div className="portfolio-grid portfolio-grid--manage">
                                {portfolio.map(item => (
                                    <div key={item.id} className="portfolio-item">
                                        <img src={item.imageUrl} alt={item.caption || 'Portfolio'} />
                                        {item.caption && <div className="portfolio-item-caption">{item.caption}</div>}
                                        {item.category && <span className="portfolio-item-cat">{item.category}</span>}
                                        <button className="portfolio-delete-btn" onClick={() => deletePortfolioItem(item.id)} title="Remove">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}

                {activeTab === 'settings' && (
                    <ProfileSettings />
                )}
            </div>
        </div>
    );
}
