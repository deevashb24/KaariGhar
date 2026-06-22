import { useState } from 'react';
import { t } from '../i18n';
import './RequestFlow.css';

const CATEGORIES = ['Bed', 'Wardrobe', 'Dining Table', 'Sofa Set', 'TV Unit', 'Bookshelf', 'Office Desk', 'Modular Kitchen', 'Shoe Rack', 'Other'];
const ROOM_TYPES = ['Bedroom', 'Living Room', 'Dining Room', 'Kitchen', 'Home Office', 'Outdoor', 'Other'];
const STYLE_MOODS = ['Modern Minimalist', 'Scandinavian', 'Luxury / Glam', 'Rustic / Farmhouse', 'Industrial', 'Traditional / Classic', 'Mid-Century Modern'];
const WOOD_GRADES = ['Sheesham Grade-A', 'Sheesham Grade-B', 'Teak Premium', 'Teak Standard', 'Mango Wood Select', 'Mango Wood Standard', 'Pine', 'Rubber Wood', 'Commercial Plywood', 'Marine Plywood', 'MDF / HDF'];
const FINISHES = ['Matte PU', 'Gloss PU', 'Natural Oil', 'Melamine', 'Lacquer', 'Laminate', 'Veneer', 'Raw / Unfinished'];
const STORAGE_TYPES = ['None', 'Under-bed drawers', 'Hydraulic lift', 'Side shelves', 'Built-in drawers', 'Open shelves'];
const BUDGETS = ['Under ₹10,000', '₹10,000 – ₹20,000', '₹20,000 – ₹30,000', '₹30,000 – ₹50,000', '₹50,000 – ₹1,00,000', 'Above ₹1,00,000'];

const STEP_KEYS = ['rf_step_upload', 'rf_step_ai', 'rf_step_spec', 'rf_step_review'];

export default function RequestFlow({ lang, onClose, onSubmit }) {
    const [step, setStep] = useState(0);
    const [dragOver, setDragOver] = useState(false);
    const [attachments, setAttachments] = useState([]);
    const [links, setLinks] = useState('');
    const [description, setDescription] = useState('');
    const [submitted, setSubmitted] = useState(false);

    // New Fields for better clarity
    const [roomType, setRoomType] = useState('Bedroom');
    const [styleMood, setStyleMood] = useState('Modern Minimalist');
    const [spaceSize, setSpaceSize] = useState('');
    const [budgetRange, setBudgetRange] = useState('₹20,000 – ₹30,000');
    const [category, setCategory] = useState('Bed');

    const [spec, setSpec] = useState({
        length: '78',
        width: '60',
        height: '36',
        wood: 'Sheesham Grade-A',
        finish: 'Matte PU',
        storage: 'Hydraulic lift',
        headboard: '42',
        notes: '',
    });

    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // Simulated AI analysis based on selections
    const aiAnalysis = {
        wood: 'Premium Wood Matching Reference',
        finish: 'Finish Matching Reference',
        dims: `${spec.length}" × ${spec.width}" × ${spec.height}" (est.)`,
        style: styleMood,
        confidence: 94,
        recommendation: `For a ${styleMood} ${category} in your ${roomType}, we recommend focusing on high-quality materials and ${spec.finish} finish. A budget of ${budgetRange} is realistic for a premium build.`
    };

    const isAntiWaste = category === 'Shoe Rack' || category === 'Other';

    const handleImageDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const files = Array.from(e.dataTransfer?.files || e.target?.files || []);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (ev) => setAttachments(prev => [...prev, ev.target.result]);
            reader.readAsDataURL(file);
        });
    };

    const runAIAnalysis = () => {
        setIsAnalyzing(true);
        setTimeout(() => {
            setIsAnalyzing(false);
            setStep(step + 1);
        }, 1500); // Simulate API delay
    };

    const handleNext = () => {
        if (step === 0) {
            runAIAnalysis();
        } else {
            setStep(step + 1);
        }
    };

    const handleSubmit = () => {
        setSubmitted(true);
        const finalAttachments = [...attachments, ...links.split(/[\n,]+/).map(s => s.trim()).filter(Boolean)];
        const aiMessage = `**AI Insights for Craftsman:**\n- **Project Focus:** High-quality ${category} for a ${roomType} using ${spec.wood}.\n- **Style Direction:** ${styleMood}.\n- **Customer Priority:** Durability and exact dimensions (${spaceSize ? spaceSize + ' space available' : 'TBD'}).\n- **Storage Requirement:** ${spec.storage}.\n- **Budget Expectation:** ${budgetRange}.\n- **References Provided:** ${finalAttachments.length > 0 ? finalAttachments.length + ' references attached.' : 'No references.'}\nPlease review all attachments and submit an itemized quote.`;
        
        onSubmit?.({ 
            spec, 
            description, 
            attachments: finalAttachments, 
            aiInsights: aiMessage,
            category,
            roomType,
            styleMood,
            spaceSize,
            budgetRange
        });
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
                        <h2 className="rf__title">Start Your Custom Piece</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div
                                className={`rf__dropzone ${dragOver ? 'rf__dropzone--hover' : ''}`}
                                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                                onDragLeave={() => setDragOver(false)}
                                onDrop={handleImageDrop}
                                onClick={() => document.getElementById('rf-file-input').click()}
                            >
                                {attachments.length > 0 ? (
                                    <div className="rf__preview-grid" style={{ display: 'flex', gap: '10px', overflowX: 'auto', padding: '10px' }}>
                                        {attachments.map((src, idx) => (
                                            <img key={idx} src={src} alt="Preview" style={{ height: '80px', borderRadius: '4px' }} />
                                        ))}
                                    </div>
                                ) : (
                                    <>
                                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                            <circle cx="8.5" cy="8.5" r="1.5" />
                                            <polyline points="21 15 16 10 5 21" />
                                        </svg>
                                        <h3>{t('rf_upload_title', lang)}</h3>
                                        <p>Drag & drop reference images or click to browse</p>
                                    </>
                                )}
                                <input type="file" id="rf-file-input" accept="image/*" multiple onChange={handleImageDrop} hidden />
                            </div>

                            <div className="rf__field-row">
                                <div className="rf__field">
                                    <label>Category</label>
                                    <select value={category} onChange={(e) => setCategory(e.target.value)}>
                                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="rf__field">
                                    <label>Room Type</label>
                                    <select value={roomType} onChange={(e) => setRoomType(e.target.value)}>
                                        {ROOM_TYPES.map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="rf__field-row">
                                <div className="rf__field">
                                    <label>Style Mood</label>
                                    <select value={styleMood} onChange={(e) => setStyleMood(e.target.value)}>
                                        {STYLE_MOODS.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div className="rf__field">
                                    <label>Budget Range</label>
                                    <select value={budgetRange} onChange={(e) => setBudgetRange(e.target.value)}>
                                        {BUDGETS.map(b => <option key={b} value={b}>{b}</option>)}
                                    </select>
                                </div>
                            </div>

                            <textarea
                                className="rf__textarea"
                                placeholder="Describe any specific details, functionality, or constraints..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={2}
                            />
                        </div>
                    </div>
                )}

                {/* Step 2: AI Analysis */}
                {step === 1 && (
                    <div className="rf__step anim-fade-up">
                        {isAnalyzing ? (
                            <div className="rf__ai-loading">
                                <div className="spinner"></div>
                                <p>KaariGhar AI is analyzing your request...</p>
                            </div>
                        ) : (
                            <>
                                <h2 className="rf__title">AI Smart Analysis</h2>
                                <p className="rf__subtitle">We analyzed your request to help craftsmen give precise quotes.</p>

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
                                            <span className="rf__ai-label">Suggested Style</span>
                                            <span className="rf__ai-value">{aiAnalysis.style}</span>
                                        </div>
                                        <div className="rf__ai-row">
                                            <span className="rf__ai-label">Recommended Finish</span>
                                            <span className="rf__ai-value">{aiAnalysis.finish}</span>
                                        </div>
                                        <div className="rf__ai-row">
                                            <span className="rf__ai-label">Estimated Dims</span>
                                            <span className="rf__ai-value">{aiAnalysis.dims}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="rf__ai-recommendation mt-4 text-sm text-gray-400">
                                    <p>💡 {aiAnalysis.recommendation}</p>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* Step 3: Spec Template */}
                {step === 2 && (
                    <div className="rf__step anim-fade-up">
                        <h2 className="rf__title">Refine Technical Specs</h2>

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
                            <div className="rf__field-row">
                                <div className="rf__field">
                                    <label>Estimated Length (inches)</label>
                                    <input type="number" value={spec.length} onChange={(e) => setSpec({ ...spec, length: e.target.value })} />
                                </div>
                                <div className="rf__field">
                                    <label>Estimated Width (inches)</label>
                                    <input type="number" value={spec.width} onChange={(e) => setSpec({ ...spec, width: e.target.value })} />
                                </div>
                                <div className="rf__field">
                                    <label>Estimated Height (inches)</label>
                                    <input type="number" value={spec.height} onChange={(e) => setSpec({ ...spec, height: e.target.value })} />
                                </div>
                            </div>
                            <div className="rf__field-row">
                                <div className="rf__field">
                                    <label>Preferred Material/Wood</label>
                                    <select value={spec.wood} onChange={(e) => setSpec({ ...spec, wood: e.target.value })}>
                                        {WOOD_GRADES.map(w => <option key={w} value={w}>{w}</option>)}
                                    </select>
                                </div>
                                <div className="rf__field">
                                    <label>Finish Type</label>
                                    <select value={spec.finish} onChange={(e) => setSpec({ ...spec, finish: e.target.value })}>
                                        {FINISHES.map(f => <option key={f} value={f}>{f}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="rf__field-row">
                                <div className="rf__field">
                                    <label>Storage Requirements</label>
                                    <select value={spec.storage} onChange={(e) => setSpec({ ...spec, storage: e.target.value })}>
                                        {STORAGE_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div className="rf__field">
                                    <label>Available Space Size (Optional)</label>
                                    <input type="text" placeholder="e.g. 10x12 ft room" value={spaceSize} onChange={(e) => setSpaceSize(e.target.value)} />
                                </div>
                            </div>
                            <div className="rf__field">
                                <label>Additional Maker Notes</label>
                                <textarea value={spec.notes} placeholder="Any specific hardware brands, edge banding, or structural requirements?" onChange={(e) => setSpec({ ...spec, notes: e.target.value })} rows={2} />
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 4: Review */}
                {step === 3 && (
                    <div className="rf__step anim-fade-up">
                        <h2 className="rf__title">Review & Broadcast</h2>
                        <div className="rf__review glass-card">
                            <table className="rf__review-table">
                                <tbody>
                                    <tr><td>Project</td><td>{styleMood} {category} for {roomType}</td></tr>
                                    <tr><td>Dimensions</td><td>{spec.length}" × {spec.width}" × {spec.height}"</td></tr>
                                    <tr><td>Material</td><td>{spec.wood} with {spec.finish} Finish</td></tr>
                                    <tr><td>Storage</td><td>{spec.storage}</td></tr>
                                    <tr><td>Budget Range</td><td>{budgetRange}</td></tr>
                                    {spec.notes && <tr><td>Notes</td><td>{spec.notes}</td></tr>}
                                </tbody>
                            </table>
                        </div>
                        <p className="mt-4 text-center text-sm text-gray-400">
                            Your request will be sent to verified makers matching your criteria. Expect itemized, transparent quotes within 24 hours.
                        </p>
                    </div>
                )}

                {/* Navigation */}
                <div className="rf__nav">
                    {step > 0 && !isAnalyzing && (
                        <button className="outline-btn" onClick={() => setStep(step - 1)}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
                            Back
                        </button>
                    )}
                    <div style={{ flex: 1 }} />
                    {step < 3 && !isAnalyzing && (
                        <button className="gold-btn" onClick={handleNext}>
                            Next
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                        </button>
                    )}
                    {step === 3 && (
                        <button className="gold-btn" onClick={handleSubmit}>
                            Submit to Makers
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
