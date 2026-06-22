import React, { useState, useEffect } from 'react';
import api from '../../api';
import { toast } from 'react-hot-toast';
import { Wallet, Landmark, Award, TrendingUp, BarChart3, CheckCircle2 } from 'lucide-react';
import './MakerAnalytics.css';

export default function MakerAnalytics() {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchAnalytics = async () => {
        try {
            const res = await api.get('/maker/analytics');
            setAnalytics(res.data);
        } catch (err) {
            console.error(err);
            toast.error('Failed to load analytics.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, []);

    if (loading) return <div style={{ color: 'var(--gold)', textAlign: 'center', padding: '40px' }}>Calculating earnings data...</div>;
    if (!analytics) return <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>No analytics available.</div>;

    const conversionRate = analytics.quotesSent > 0 
        ? Math.round((analytics.quotesAccepted / analytics.quotesSent) * 100) 
        : 0;

    // SVG Bar Chart dimensions
    const chartHeight = 160;
    const barWidth = 40;
    const barGap = 24;
    const data = [
        { label: 'Sent', value: analytics.quotesSent, color: 'var(--text-muted)' },
        { label: 'Accepted', value: analytics.quotesAccepted, color: '#2ecc71' },
        { label: 'Pending', value: analytics.quotesPending, color: 'var(--gold)' },
        { label: 'Rejected', value: analytics.quotesRejected, color: '#e74c3c' }
    ];
    const maxVal = Math.max(...data.map(d => d.value), 1);

    return (
        <div className="maker-analytics anim-fade-up">
            <div className="dashboard-header" style={{ marginBottom: '1.5rem' }}>
                <div>
                    <h2>📊 Business Performance & Earnings</h2>
                    <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Track your proposals, active income pipelines, and platform conversion rates.</p>
                </div>
            </div>

            {/* Earnings Grid */}
            <div className="analytics-grid">
                <div className="analytics-card primary">
                    <div className="analytics-card-header">
                        <Wallet size={20} color="#2ecc71" />
                        <span className="analytics-card-title">Net Payouts Cleared</span>
                    </div>
                    <span className="analytics-card-value" style={{ color: '#2ecc71' }}>
                        ₹{analytics.totalEarnings.toLocaleString('en-IN')}
                    </span>
                    <p className="analytics-card-desc">Funds fully released from escrow to your bank account.</p>
                </div>

                <div className="analytics-card secondary">
                    <div className="analytics-card-header">
                        <Landmark size={20} color="var(--gold)" />
                        <span className="analytics-card-title">Locked in Escrow</span>
                    </div>
                    <span className="analytics-card-value" style={{ color: 'var(--gold)' }}>
                        ₹{analytics.escrowPipeline.toLocaleString('en-IN')}
                    </span>
                    <p className="analytics-card-desc">Upcoming milestone payments held securely by the platform.</p>
                </div>

                <div className="analytics-card">
                    <div className="analytics-card-header">
                        <Award size={20} color="var(--info)" />
                        <span className="analytics-card-title">Completed Orders</span>
                    </div>
                    <span className="analytics-card-value">
                        {analytics.completedOrders}
                    </span>
                    <p className="analytics-card-desc">Finished bespoke pieces fully delivered and closed.</p>
                </div>
            </div>

            {/* Visual Charts section */}
            <div className="analytics-charts-row" style={{ marginTop: '24px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                {/* Proposal Funnel */}
                <div className="chart-box glass-card" style={{ flex: '1 1 400px', padding: '24px' }}>
                    <h3 className="chart-box-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', fontSize: '1rem', color: 'white' }}>
                        <BarChart3 size={18} color="var(--gold)" />
                        Proposal Funnel Breakdown
                    </h3>
                    
                    <div className="bar-chart-container" style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', height: chartHeight, paddingBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                        {data.map((item, idx) => {
                            const barHeight = (item.value / maxVal) * (chartHeight - 40) + 10;
                            return (
                                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: barWidth }}>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: item.color, marginBottom: '6px' }}>{item.value}</span>
                                    <div style={{ width: '100%', height: barHeight, background: item.color, borderRadius: '4px 4px 0 0', opacity: 0.8 }} />
                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '8px', whiteSpace: 'nowrap' }}>{item.label}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Conversion gauge */}
                <div className="chart-box glass-card" style={{ flex: '1 1 280px', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <h3 className="chart-box-title" style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', fontSize: '1rem', color: 'white' }}>
                        <TrendingUp size={18} color="#2ecc71" />
                        Proposal Win Rate
                    </h3>

                    <div style={{ position: 'relative', width: '140px', height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {/* Circular SVG Gauge */}
                        <svg width="100%" height="100%" viewBox="0 0 42 42">
                            <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="rgba(255,255,255,0.04)" strokeWidth="3" />
                            <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#2ecc71" strokeWidth="3"
                                strokeDasharray={`${conversionRate} ${100 - conversionRate}`}
                                strokeDashoffset="25"
                                strokeLinecap="round"
                                style={{ transition: 'stroke-dasharray 1s ease-in-out' }}
                            />
                        </svg>
                        <div style={{ position: 'absolute', textAlign: 'center' }}>
                            <span style={{ fontSize: '1.6rem', fontWeight: 'bold', color: 'white' }}>{conversionRate}%</span>
                            <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Conversions</span>
                        </div>
                    </div>
                    
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '15px', lineHeight: '1.4' }}>
                        {conversionRate >= 40 
                            ? 'Excellent conversion efficiency! Your bids are highly competitive.' 
                            : 'Bids sent are waiting customer decisions. Consider detailing your spec list to stand out.'}
                    </p>
                </div>
            </div>
        </div>
    );
}
