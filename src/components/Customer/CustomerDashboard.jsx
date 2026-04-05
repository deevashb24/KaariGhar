import React, { useState, useEffect } from 'react';
import api from '../../api';
import RequestFlow from '../RequestFlow';

export default function CustomerDashboard() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showRequestFlow, setShowRequestFlow] = useState(false);

    const fetchRequests = async () => {
        try {
            const res = await api.get('/customer/requests');
            setRequests(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleRequestSubmit = async (formData) => {
        try {
            setLoading(true);
            await api.post('/customer/requests', {
                title: `Custom ${formData.spec.category}`,
                description: formData.description + ` | Specs: ${JSON.stringify(formData.spec)}`,
                budget: parseFloat(formData.spec.budget.replace(/[^\d]/g, '')) || 25000,
                images: []
            });
            setShowRequestFlow(false);
            fetchRequests();
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleAcceptQuote = async (quoteId) => {
        try {
            await api.post(`/customer/quotes/${quoteId}/accept`);
            alert("Quote accepted! An order has been placed.");
            fetchRequests();
        } catch (err) {
            console.error(err);
            alert("Error accepting quote.");
        }
    };

    if (loading) return <div style={{ color: 'white', padding: '2rem' }}>Loading dashboard...</div>;

    return (
        <div style={{ padding: '2rem', color: 'var(--text-light)', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>My Furniture Requests</h2>
                <button className="gold-btn" onClick={() => setShowRequestFlow(true)}>
                    + New Request
                </button>
            </div>

            {requests.length === 0 ? (
                <div style={{ padding: '3rem', textAlign: 'center', backgroundColor: 'var(--card-bg)', borderRadius: '12px' }}>
                    <p>You haven't posted any requests yet.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {requests.map(req => (
                        <div key={req.id} style={{ backgroundColor: 'var(--card-bg)', padding: '1.5rem', borderRadius: '8px', border: `1px solid var(--border)` }}>
                            <h3>{req.title}</h3>
                            <p style={{ color: 'var(--text-muted)' }}>{req.description}</p>
                            <p style={{ marginTop: '0.5rem' }}>Status: <strong style={{ color: 'var(--gold)' }}>{req.status}</strong></p>
                            <p>Budget: ₹{req.budget || 'Not specified'}</p>

                            {/* Show Quotes */}
                            {req.quotes && req.quotes.length > 0 && (
                                <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                                    <h4>Quotes from Makers:</h4>
                                    {req.quotes.map(quote => (
                                        <div key={quote.id} style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', marginTop: '0.5rem' }}>
                                            <p><strong>{quote.maker.name}</strong> offers to build this for <strong>₹{quote.price}</strong></p>
                                            <p>Message: <em>"{quote.message}"</em></p>
                                            {quote.status === 'PENDING' && req.status !== 'IN_PROGRESS' && (
                                                <button onClick={() => handleAcceptQuote(quote.id)} className="gold-btn" style={{ padding: '5px 15px', fontSize: '0.8rem', marginTop: '10px' }}>
                                                    Accept Quote
                                                </button>
                                            )}
                                            {quote.status === 'ACCEPTED' && (
                                                <p style={{ color: '#4CAF50', fontWeight: 'bold', marginTop: '10px' }}>Accepted!</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {showRequestFlow && (
                <RequestFlow
                    lang="en"
                    onClose={() => setShowRequestFlow(false)}
                    onSubmit={handleRequestSubmit}
                />
            )}
        </div>
    );
}
