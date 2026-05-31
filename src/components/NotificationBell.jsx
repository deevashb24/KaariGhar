import React, { useState, useEffect, useRef } from 'react';
import api from '../api';
import { Bell, Check, Star, ShoppingCart, MessageSquare, X } from 'lucide-react';

const ICON_MAP = {
    QUOTE_RECEIVED: ShoppingCart,
    ORDER_UPDATE: Check,
    MESSAGE: MessageSquare,
    REVIEW: Star,
};

export default function NotificationBell() {
    const [open, setOpen] = useState(false);
    const [data, setData] = useState({ notifications: [], unreadCount: 0 });
    const ref = useRef(null);

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/notifications');
            setData(res.data);
        } catch (e) { /* silent */ }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 15000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClick = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const markRead = async (id) => {
        await api.put(`/notifications/${id}/read`);
        fetchNotifications();
    };

    const markAllRead = async () => {
        await api.put('/notifications/read-all');
        fetchNotifications();
    };

    const timeAgo = (dateStr) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return 'Just now';
        if (mins < 60) return `${mins}m ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs}h ago`;
        return `${Math.floor(hrs / 24)}d ago`;
    };

    return (
        <div className="notif-bell-wrap" ref={ref}>
            <button className="notif-bell-btn" onClick={() => setOpen(!open)} aria-label="Notifications">
                <Bell size={20} />
                {data.unreadCount > 0 && <span className="notif-bell-badge">{data.unreadCount > 9 ? '9+' : data.unreadCount}</span>}
            </button>

            {open && (
                <div className="notif-dropdown">
                    <div className="notif-dropdown-header">
                        <h4>Notifications</h4>
                        {data.unreadCount > 0 && (
                            <button className="notif-mark-all" onClick={markAllRead}>Mark all read</button>
                        )}
                    </div>
                    <div className="notif-dropdown-list">
                        {data.notifications.length === 0 ? (
                            <div className="notif-empty">No notifications yet</div>
                        ) : (
                            data.notifications.map(n => {
                                const Icon = ICON_MAP[n.type] || Bell;
                                return (
                                    <div key={n.id} className={`notif-item ${!n.read ? 'unread' : ''}`} onClick={() => !n.read && markRead(n.id)}>
                                        <div className="notif-item-icon"><Icon size={16} /></div>
                                        <div className="notif-item-content">
                                            <span className="notif-item-title">{n.title}</span>
                                            <span className="notif-item-msg">{n.message}</span>
                                            <span className="notif-item-time">{timeAgo(n.createdAt)}</span>
                                        </div>
                                        {!n.read && <div className="notif-item-dot" />}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
