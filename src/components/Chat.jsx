import { useState, useRef, useEffect } from 'react';
import { t } from '../i18n';
import { MOCK_MESSAGES } from '../data';
import './Chat.css';

export default function Chat({ lang, maker }) {
    const [messages, setMessages] = useState(MOCK_MESSAGES);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showTranslated, setShowTranslated] = useState(false);
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const handleSend = () => {
        if (!input.trim()) return;
        const newMsg = {
            id: messages.length + 1,
            from: 'user',
            text: input,
            textHi: input,
            time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
            type: 'text',
        };
        setMessages([...messages, newMsg]);
        setInput('');

        // Simulate maker typing
        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
            setMessages(prev => [...prev, {
                id: prev.length + 1,
                from: 'maker',
                text: 'Thank you! I will prepare the quote and share the material photos by tomorrow.',
                textHi: 'धन्यवाद! मैं कोट तैयार करूंगा और कल तक सामग्री की फोटो शेयर करूंगा।',
                time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
                type: 'text',
            }]);
        }, 2000);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="chat">
            {/* Chat header */}
            <div className="chat__header">
                <div className="chat__header-info">
                    <div className="chat__header-avatar">
                        {maker ? maker.name.split(' ').map(n => n[0]).slice(0, 2).join('') : 'RK'}
                    </div>
                    <div>
                        <h3>{maker?.name || 'Rajesh Kumar Vishwakarma'}</h3>
                        <span className="chat__header-status">
                            <span className="chat__status-dot" /> Online
                        </span>
                    </div>
                </div>
                <button
                    className={`chat__translate-btn ${showTranslated ? 'active' : ''}`}
                    onClick={() => setShowTranslated(!showTranslated)}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M5 8l6 6M4 14l6-6 2-3M2 5h12M7 2h1" />
                        <path d="M22 22l-5-10-5 10M14 18h6" />
                    </svg>
                    {t('chat_translate', lang)}
                </button>
            </div>

            {/* Messages */}
            <div className="chat__messages">
                {messages.map((msg) => (
                    <div key={msg.id} className={`chat__bubble chat__bubble--${msg.from}`}>
                        {msg.type === 'text' && (
                            <p>{showTranslated && msg.textHi ? msg.textHi : msg.text}</p>
                        )}
                        {msg.type === 'photo' && (
                            <div className="chat__photo">
                                <div className="chat__photo-placeholder">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5">
                                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                        <circle cx="8.5" cy="8.5" r="1.5" />
                                        <polyline points="21 15 16 10 5 21" />
                                    </svg>
                                    <span>Wood Sample Photo</span>
                                </div>
                            </div>
                        )}
                        {msg.type === 'voice' && (
                            <div className="chat__voice">
                                <button className="chat__voice-play">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                                </button>
                                <div className="chat__voice-wave">
                                    {[...Array(20)].map((_, i) => (
                                        <div
                                            key={i}
                                            className="chat__voice-bar"
                                            style={{ height: `${Math.random() * 20 + 4}px`, animationDelay: `${i * 0.05}s` }}
                                        />
                                    ))}
                                </div>
                                <span className="chat__voice-duration">{msg.duration}</span>
                            </div>
                        )}
                        <span className="chat__time">{msg.time}</span>
                    </div>
                ))}

                {isTyping && (
                    <div className="chat__bubble chat__bubble--maker">
                        <div className="chat__typing">
                            <span /><span /><span />
                        </div>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="chat__input-bar">
                <button className="chat__input-action" title={t('chat_photo', lang)}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                    </svg>
                </button>
                <input
                    className="chat__input"
                    placeholder={t('chat_placeholder', lang)}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button className="chat__input-action" title={t('chat_voice', lang)}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                        <line x1="12" y1="19" x2="12" y2="23" />
                    </svg>
                </button>
                <button className="chat__send-btn" onClick={handleSend} disabled={!input.trim()}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
                </button>
            </div>
        </div>
    );
}
