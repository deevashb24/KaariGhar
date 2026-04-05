import React, { useState, useEffect } from 'react';
import api from '../../api';

export default function MakerDashboard() {
    const [openRequests, setOpenRequests] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [quotingFor, setQuotingFor] = useState(null);

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
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleQuoteSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/maker/quotes', {
                requestId: quotingFor.id,
                price: parseFloat(price),
                message,
                proposedTimeline: timeline
            });
            setQuotingFor(null);
            setPrice('');
            setMessage('');
            setTimeline('');
            alert("Quote submitted!");
            fetchData();
        } catch (err) {
            console.error(err);
            alert("Error submitting quote");
        }
    };

    if (loading) return <div style={{ padding: '2rem', color: 'white' }}>Loading Maker Dashboard...</div>;

    return (
        <div style={{ padding: '2rem', color: 'var(--text-light)', maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '2rem' }}>

            {/* LEFT COLUMN: Open Requests Feed */}
            <div style={{ flex: 2 }}>
                <h2 style={{ marginBottom: '1.5rem', color: 'var(--gold)' }}>Available Jobs Near You</h2>
                {openRequests.length === 0 ? (
                    <p>No open requests currently.</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {openRequests.map(req => (
                            <div key={req.id} style={{ background: 'var(--card-bg)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                                <h3>{req.title}</h3>
                                <p style={{ color: 'var(--text-muted)' }}>Posted by: {req.customer?.name}</p>
                                <p style={{ marginTop: '0.5rem' }}>{req.description}</p>
                                <p>Budget: <strong>₹{req.budget}</strong></p>

                                {quotingFor?.id === req.id ? (
                                    <form onSubmit={handleQuoteSubmit} style={{ marginTop: '1rem', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '8px' }}>
                                        <h4>Submit Your Quote</h4>
                                        <input type="number" placeholder="Your Price (₹)" value={price} onChange={e => setPrice(e.target.value)} required style={{ display: 'block', width: '100%', padding: '8px', marginBottom: '10px' }} />
                                        <input type="text" placeholder="Estimated Timeline (e.g. 2 weeks)" value={timeline} onChange={e => setTimeline(e.target.value)} required style={{ display: 'block', width: '100%', padding: '8px', marginBottom: '10px' }} />
                                        <textarea placeholder="Message to customer" value={message} onChange={e => setMessage(e.target.value)} required rows="3" style={{ display: 'block', width: '100%', padding: '8px', marginBottom: '10px' }} />
                                        <button type="submit" className="gold-btn">Send Quote</button>
                                        <button type="button" onClick={() => setQuotingFor(null)} className="outline-btn" style={{ marginLeft: '10px' }}>Cancel</button>
                                    </form>
                                ) : (
                                    <button onClick={() => setQuotingFor(req)} className="gold-btn" style={{ marginTop: '1rem' }}>
                                        Submit Quote
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* RIGHT COLUMN: Active Orders */}
            <div style={{ flex: 1 }}>
                <h2 style={{ marginBottom: '1.5rem', color: 'var(--gold)' }}>Active Orders</h2>
                {orders.length === 0 ? (
                    <p>You have no active orders.</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {orders.map(order => (
                            <div key={order.id} style={{ background: 'var(--card-bg)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--gold)' }}>
                                <h4>{order.quote.request.title}</h4>
                                <p>Total: ₹{order.totalPrice}</p>
                                <p>Status: <span style={{ color: '#4CAF50' }}>{order.status}</span></p>
                                <button className="outline-btn" style={{ marginTop: '10px', width: '100%' }}>Update Order Status</button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
}
