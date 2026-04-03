import { useState } from 'react';
import { t } from '../i18n';
import './RequestFlow.css';

const CATEGORIES = ['Bed', 'Wardrobe', 'Dining Table', 'Sofa Set', 'TV Unit', 'Bookshelf', 'Office Desk', 'Temple / Mandir', 'Shoe Rack', 'Other'];
const WOOD_GRADES = ['Sheesham Grade-A', 'Sheesham Grade-B', 'Teak Premium', 'Teak Standard', 'Mango Wood Select', 'Mango Wood Standard', 'Pine', 'Rubber Wood'];
const FINISHES = ['Matte PU', 'Gloss PU', 'Natural Oil', 'Melamine', 'Lacquer', 'Raw / Unfinished'];
const STORAGE_TYPES = ['None', 'Under-bed drawers', 'Hydraulic lift', 'Side shelves', 'Built-in drawers', 'Open shelves'];
const BUDGETS = ['Under ₹10,000', '₹10,000 – ₹20,000', '₹20,000 – ₹30,000', '₹30,000 – ₹50,000', '₹50,000 – ₹1,00,000', 'Above ₹1,00,000'];

const STEP_KEYS = ['rf_step_upload', 'rf_step_ai', 'rf_step_spec', 'rf_step_review'];

export default function RequestFlow({ lang, onClose, onSubmit }) {
    const [step, setStep] = useState(0);
    const [dragOver, setDragOver] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [description, setDescription] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [spec, setSpec] = useState({
        category: 'Bed',
        length: '78',
        width: '60',
        height: '36',
        wood: 'Sheesham Grade-A',
        finish: 'Matte PU',
        storage: 'Hydraulic lift',
        budget: '₹20,000 – ₹30,000',
        headboard: '42',
        notes: '',
    });

    // Simulated AI analysis
    const aiAnalysis = {
        wood: 'Sheesham (Rosewood)',
        finish: 'Matte PU Coating',
        dims: '78" × 60" × 36" (est.)',
        style: 'Modern Minimalist with Storage',
        confidence: 87,
    };

    const isAntiWaste = spec.category === 'Shoe Rack' || spec.category === 'Other';

    const handleImageDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer?.files?.[0] || e.target?.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => setImagePreview(ev.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = () => {
        setSubmitted(true);
        onSubmit?.({ spec, description });
    };

    if (submitted) {
        return (
            <div className="modal-overlay" onClick={onClose}>
                <div className="modal-content rf__submitted" onClick={(e) => e.stopPropagation()}>
                    <div className="rf__submitted-icon">🎉</div>
                    <h2>{t('rf_submitted_title', lang)}</h2>
                    <p>{t('rf_submitted_msg', lang)}</p>
                    <button className="gold-btn" onClick={onClose} style={{ marginTop: '24px' }}>
                        {t('nav_home', lang)}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content rf" onClick={(e) => e.stopPropagation()}>
                {/* Progress bar */}
                <div className="rf__progress">
                    {STEP_KEYS.map((key, i) => (
                        <div key={i} className={`rf__progress-step ${i <= step ? 'rf__progress-step--active' : ''} ${i < step ? 'rf__progress-step--done' : ''}`}>
                            <div className="rf__progress-dot">
                                {i < step ? (
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>
                                ) : (
                                    i + 1
                                )}
                            </div>
                            <span className="rf__progress-label">{t(key, lang)}</span>
                        </div>
                    ))}
                    <div className="rf__progress-bar">
                        <div className="rf__progress-fill" style={{ width: `${(step / (STEP_KEYS.length - 1)) * 100}%` }} />
                    </div>
                </div>

                {/* Step 1: Upload & Describe */}
                {step === 0 && (
                    <div className="rf__step anim-fade-up">
                        <h2 className="rf__title">{t('rf_title', lang)}</h2>

                        <div
                            className={`rf__dropzone ${dragOver ? 'rf__dropzone--hover' : ''} ${imagePreview ? 'rf__dropzone--has-image' : ''}`}
                            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={handleImageDrop}
                            onClick={() => document.getElementById('rf-file-input').click()}
                        >
                            {imagePreview ? (
                                <img src={imagePreview} alt="Preview" className="rf__preview-img" />
                            ) : (
                                <>
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                        <circle cx="8.5" cy="8.5" r="1.5" />
                                        <polyline points="21 15 16 10 5 21" />
                                    </svg>
                                    <h3>{t('rf_upload_title', lang)}</h3>
                                    <p>{t('rf_upload_desc', lang)}</p>
                                </>
                            )}
                            <input type="file" id="rf-file-input" accept="image/*" onChange={handleImageDrop} hidden />
                        </div>

                        <textarea
                            className="rf__textarea"
                            placeholder={t('rf_describe', lang)}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                        />
                    </div>
                )}

                {/* Step 2: AI Analysis */}
                {step === 1 && (
                    <div className="rf__step anim-fade-up">
                        <h2 className="rf__title">{t('rf_ai_title', lang)}</h2>
                        <p className="rf__subtitle">{t('rf_ai_subtitle', lang)}</p>

                        <div className="rf__ai-card glass-card">
                            <div className="rf__ai-confidence">
                                <div className="rf__ai-ring">
                                    <svg viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r="42" fill="none" stroke="var(--border)" strokeWidth="6" />
                                        <circle cx="50" cy="50" r="42" fill="none" stroke="var(--gold)" strokeWidth="6"
                                            strokeDasharray={`${aiAnalysis.confidence * 2.64} ${264 - aiAnalysis.confidence * 2.64}`}
                                            strokeDashoffset="66" strokeLinecap="round" />
                                    </svg>
                                    <span>{aiAnalysis.confidence}%</span>
                                </div>
                                <span className="rf__ai-conf-label">Confidence</span>
                            </div>

                            <div className="rf__ai-results">
                                <div className="rf__ai-row">
                                    <span className="rf__ai-label">{t('rf_ai_wood', lang)}</span>
                                    <span className="rf__ai-value">{aiAnalysis.wood}</span>
                                </div>
                                <div className="rf__ai-row">
                                    <span className="rf__ai-label">{t('rf_ai_finish', lang)}</span>
                                    <span className="rf__ai-value">{aiAnalysis.finish}</span>
                                </div>
                                <div className="rf__ai-row">
                                    <span className="rf__ai-label">{t('rf_ai_dims', lang)}</span>
                                    <span className="rf__ai-value">{aiAnalysis.dims}</span>
                                </div>
                                <div className="rf__ai-row">
                                    <span className="rf__ai-label">{t('rf_ai_style', lang)}</span>
                                    <span className="rf__ai-value">{aiAnalysis.style}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3: Spec Template */}
                {step === 2 && (
                    <div className="rf__step anim-fade-up">
                        <h2 className="rf__title">{t('rf_spec_title', lang)}</h2>

                        {isAntiWaste && (
                            <div className="rf__antiwaste">
                                <h4>{t('rf_antiwaste_title', lang)}</h4>
                                <p>{t('rf_antiwaste_msg', lang)}</p>
                                <button className="outline-btn" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
                                    {t('rf_antiwaste_btn', lang)}
                                </button>
                            </div>
                        )}

                        <div className="rf__form">
                            <div className="rf__field">
                                <label>{t('rf_spec_category', lang)}</label>
                                <select value={spec.category} onChange={(e) => setSpec({ ...spec, category: e.target.value })}>
                                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div className="rf__field-row">
                                <div className="rf__field">
                                    <label>{t('rf_spec_length', lang)}</label>
                                    <input type="number" value={spec.length} onChange={(e) => setSpec({ ...spec, length: e.target.value })} />
                                </div>
                                <div className="rf__field">
                                    <label>{t('rf_spec_width', lang)}</label>
                                    <input type="number" value={spec.width} onChange={(e) => setSpec({ ...spec, width: e.target.value })} />
                                </div>
                                <div className="rf__field">
                                    <label>{t('rf_spec_height', lang)}</label>
                                    <input type="number" value={spec.height} onChange={(e) => setSpec({ ...spec, height: e.target.value })} />
                                </div>
                            </div>
                            <div className="rf__field-row">
                                <div className="rf__field">
                                    <label>{t('rf_spec_wood', lang)}</label>
                                    <select value={spec.wood} onChange={(e) => setSpec({ ...spec, wood: e.target.value })}>
                                        {WOOD_GRADES.map(w => <option key={w} value={w}>{w}</option>)}
                                    </select>
                                </div>
                                <div className="rf__field">
                                    <label>{t('rf_spec_finish', lang)}</label>
                                    <select value={spec.finish} onChange={(e) => setSpec({ ...spec, finish: e.target.value })}>
                                        {FINISHES.map(f => <option key={f} value={f}>{f}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="rf__field-row">
                                <div className="rf__field">
                                    <label>{t('rf_spec_storage', lang)}</label>
                                    <select value={spec.storage} onChange={(e) => setSpec({ ...spec, storage: e.target.value })}>
                                        {STORAGE_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div className="rf__field">
                                    <label>{t('rf_spec_budget', lang)}</label>
                                    <select value={spec.budget} onChange={(e) => setSpec({ ...spec, budget: e.target.value })}>
                                        {BUDGETS.map(b => <option key={b} value={b}>{b}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="rf__field">
                                <label>{t('rf_spec_headboard', lang)}</label>
                                <input type="number" value={spec.headboard} onChange={(e) => setSpec({ ...spec, headboard: e.target.value })} />
                            </div>
                            <div className="rf__field">
                                <label>{t('rf_spec_notes', lang)}</label>
                                <textarea value={spec.notes} onChange={(e) => setSpec({ ...spec, notes: e.target.value })} rows={2} />
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 4: Review */}
                {step === 3 && (
                    <div className="rf__step anim-fade-up">
                        <h2 className="rf__title">{t('rf_review_title', lang)}</h2>
                        <div className="rf__review glass-card">
                            <table className="rf__review-table">
                                <tbody>
                                    <tr><td>{t('rf_spec_category', lang)}</td><td>{spec.category}</td></tr>
                                    <tr><td>Dimensions</td><td>{spec.length}" × {spec.width}" × {spec.height}"</td></tr>
                                    <tr><td>{t('rf_spec_wood', lang)}</td><td>{spec.wood}</td></tr>
                                    <tr><td>{t('rf_spec_finish', lang)}</td><td>{spec.finish}</td></tr>
                                    <tr><td>{t('rf_spec_storage', lang)}</td><td>{spec.storage}</td></tr>
                                    <tr><td>{t('rf_spec_budget', lang)}</td><td>{spec.budget}</td></tr>
                                    <tr><td>{t('rf_spec_headboard', lang)}</td><td>{spec.headboard}"</td></tr>
                                    {spec.notes && <tr><td>{t('rf_spec_notes', lang)}</td><td>{spec.notes}</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Navigation */}
                <div className="rf__nav">
                    {step > 0 && (
                        <button className="outline-btn" onClick={() => setStep(step - 1)}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
                            {t('rf_back', lang)}
                        </button>
                    )}
                    <div style={{ flex: 1 }} />
                    {step < 3 ? (
                        <button className="gold-btn" onClick={() => setStep(step + 1)}>
                            {t('rf_next', lang)}
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                        </button>
                    ) : (
                        <button className="gold-btn" onClick={handleSubmit}>
                            {t('rf_submit', lang)}
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
