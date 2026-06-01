import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const COOKIE_TYPES = [
  {
    name: 'Strictly Necessary Cookies',
    required: true,
    description:
      'These cookies are essential for the Platform to function and cannot be switched off. They are usually only set in response to actions made by you such as setting your privacy preferences, logging in, or filling in forms.',
    examples: [
      { name: 'auth_token', purpose: 'Maintains your login session securely.' },
      { name: 'session_id', purpose: 'Identifies your active session on our servers.' },
      { name: 'csrf_token', purpose: 'Protects against cross-site request forgery attacks.' },
    ],
  },
  {
    name: 'Performance & Analytics Cookies',
    required: false,
    description:
      'These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our Platform. All information collected is aggregated and anonymised.',
    examples: [
      { name: '_ga', purpose: 'Google Analytics — tracks unique visitors and sessions.' },
      { name: '_gid', purpose: 'Google Analytics — distinguishes users.' },
      { name: 'perf_metrics', purpose: 'Internal performance monitoring (Core Web Vitals).' },
    ],
  },
  {
    name: 'Functional Cookies',
    required: false,
    description:
      'These cookies enable the Platform to provide enhanced functionality and personalisation. They may be set by us or third-party providers whose services we use.',
    examples: [
      { name: 'ui_preferences', purpose: 'Remembers your language and display preferences.' },
      { name: 'last_search', purpose: 'Restores your last search query for convenience.' },
    ],
  },
  {
    name: 'Targeting & Advertising Cookies',
    required: false,
    description:
      'We currently do not use targeting or advertising cookies. We do not serve third-party ads on the Platform. If this changes, we will update this policy and request your consent.',
    examples: [],
  },
];

const SECTIONS = [
  {
    title: 'What Are Cookies?',
    body: `Cookies are small text files that are placed on your device when you visit a website. They help the website remember information about your visit, such as your login status and preferences. Cookies are widely used to make websites work more efficiently and provide analytics to site owners.

Cookies can be:
• **Session cookies**: Deleted when you close your browser.
• **Persistent cookies**: Remain on your device for a set period.
• **First-party cookies**: Set by KaariGhar directly.
• **Third-party cookies**: Set by our trusted partners (e.g., analytics providers).`,
  },
  {
    title: 'How to Control Cookies',
    body: `You have the right to decide whether to accept or reject non-essential cookies. Here is how you can manage them:

**Browser Settings**
Most browsers allow you to refuse cookies or delete them after the fact. The method varies by browser:
• Chrome: Settings → Privacy and Security → Cookies
• Firefox: Options → Privacy & Security → Cookies
• Safari: Preferences → Privacy → Manage Website Data
• Edge: Settings → Privacy, Search, and Services → Cookies

**Impact of Disabling Cookies**
Disabling strictly necessary cookies will prevent you from logging in and using most Platform features. Disabling analytics or functional cookies will have minimal impact on your ability to use the Platform, though some features may behave differently.

**Do Not Track**
Some browsers support a "Do Not Track" (DNT) signal. We currently honour DNT signals by disabling analytics cookies when detected.`,
  },
  {
    title: 'Third-Party Cookies',
    body: `We use the following third-party services that may place cookies on your device:

• **Google Analytics**: Used for anonymised usage analytics. Google's privacy policy applies: https://policies.google.com/privacy
• **Hls.js / Mux**: Used to stream video content. No cookies are set by Mux.

We do not allow third-party advertisers to place cookies on our Platform.`,
  },
  {
    title: 'Updates to This Policy',
    body: `We may update this Cookie Policy from time to time to reflect changes in technology, legislation, or our practices. We will notify you of material changes by updating the "Last updated" date at the top of this page.

For more information, contact us at privacy@kaarighar.com.`,
  },
];

export default function CookiePolicy() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div
      style={{
        background: 'hsl(var(--bg))',
        color: 'hsl(var(--text))',
        minHeight: '100vh',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {/* Nav bar */}
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem 2rem',
          background: 'rgba(10,10,10,0.85)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <button
          onClick={() => navigate('/')}
          style={{
            fontFamily: 'Instrument Serif, serif',
            fontStyle: 'italic',
            fontSize: '1.2rem',
            color: 'hsl(var(--text))',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          KaariGhar
        </button>
        <button
          onClick={() => navigate(-1)}
          style={{
            fontSize: '0.72rem',
            fontWeight: 500,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'hsl(var(--muted))',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'hsl(var(--text))'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'hsl(var(--muted))'}
        >
          ← Back
        </button>
      </nav>

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{ maxWidth: '860px', margin: '0 auto', padding: '120px 2rem 4rem' }}
      >
        <p
          style={{
            fontSize: '0.65rem',
            fontWeight: 500,
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
            color: 'hsl(var(--muted))',
            marginBottom: '1.5rem',
          }}
        >
          Legal · Last updated: June 2024
        </p>
        <h1
          style={{
            fontFamily: 'Instrument Serif, serif',
            fontStyle: 'italic',
            fontSize: 'clamp(2.5rem, 6vw, 5rem)',
            lineHeight: 1,
            letterSpacing: '-0.02em',
            color: 'hsl(var(--text))',
            marginBottom: '2rem',
          }}
        >
          Cookie Policy
        </h1>
        <p
          style={{
            fontSize: '1.05rem',
            lineHeight: 1.8,
            color: 'hsl(var(--muted))',
            fontWeight: 300,
            maxWidth: '580px',
          }}
        >
          This Cookie Policy explains what cookies are, how KaariGhar uses them, and how you can control them. We believe in transparency — here is exactly what we place on your device and why.
        </p>
      </motion.div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'hsl(var(--stroke))', margin: '0 2rem' }} />

      {/* Cookie types table */}
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '4rem 2rem 2rem' }}>
        <h2
          style={{
            fontSize: '0.65rem',
            fontWeight: 500,
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
            color: 'hsl(var(--muted))',
            marginBottom: '2rem',
          }}
        >
          Cookie Categories
        </h2>

        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {COOKIE_TYPES.map((ct, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '12px',
                padding: '2rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <h3
                  style={{
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    color: 'hsl(var(--text))',
                    flex: 1,
                  }}
                >
                  {ct.name}
                </h3>
                <span
                  style={{
                    fontSize: '0.6rem',
                    fontWeight: 600,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    background: ct.required
                      ? 'rgba(52,211,153,0.12)'
                      : 'rgba(138,175,212,0.1)',
                    color: ct.required ? '#34D399' : '#8AAFD4',
                    border: ct.required
                      ? '1px solid rgba(52,211,153,0.2)'
                      : '1px solid rgba(138,175,212,0.2)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {ct.required ? 'Required' : 'Optional'}
                </span>
              </div>

              <p
                style={{
                  fontSize: '0.88rem',
                  lineHeight: 1.75,
                  color: 'hsl(var(--muted))',
                  fontWeight: 300,
                  marginBottom: ct.examples.length ? '1.25rem' : 0,
                }}
              >
                {ct.description}
              </p>

              {ct.examples.length > 0 && (
                <div
                  style={{
                    background: 'rgba(0,0,0,0.3)',
                    borderRadius: '8px',
                    padding: '1rem 1.25rem',
                    display: 'grid',
                    gap: '0.5rem',
                  }}
                >
                  {ct.examples.map((ex, j) => (
                    <div key={j} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                      <code
                        style={{
                          fontSize: '0.75rem',
                          fontFamily: 'monospace',
                          color: '#8AAFD4',
                          minWidth: '120px',
                          paddingTop: '0.05rem',
                        }}
                      >
                        {ex.name}
                      </code>
                      <span
                        style={{
                          fontSize: '0.82rem',
                          color: 'hsl(var(--muted))',
                          fontWeight: 300,
                          lineHeight: 1.5,
                        }}
                      >
                        {ex.purpose}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Additional sections */}
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '2rem 2rem 8rem' }}>
        {SECTIONS.map((section, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 + i * 0.06 }}
            style={{ marginBottom: '3.5rem' }}
          >
            <div style={{ height: '1px', background: 'hsl(var(--stroke))', marginBottom: '3.5rem' }} />
            <h2
              style={{
                fontSize: '1rem',
                fontWeight: 600,
                letterSpacing: '0.02em',
                color: 'hsl(var(--text))',
                marginBottom: '1rem',
              }}
            >
              {section.title}
            </h2>
            <div
              style={{
                fontSize: '0.95rem',
                lineHeight: 1.85,
                color: 'hsl(var(--muted))',
                fontWeight: 300,
                whiteSpace: 'pre-line',
              }}
            >
              {section.body}
            </div>
          </motion.div>
        ))}

        {/* Back to home */}
        <div style={{ marginTop: '4rem', textAlign: 'center' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'linear-gradient(135deg, #8AAFD4, #4E85BF)',
              color: '#fff',
              border: 'none',
              borderRadius: '9999px',
              padding: '1rem 2.5rem',
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'box-shadow 0.3s, transform 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 40px rgba(138,175,212,0.4)';
              e.currentTarget.style.transform = 'scale(1.04)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            Back to KaariGhar ↗
          </button>
        </div>
      </div>
    </div>
  );
}
