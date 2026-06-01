import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const SECTIONS = [
  {
    title: '1. Information We Collect',
    body: `We collect information you provide directly to us, including when you create an account, place an order, or communicate with us. This includes:

• **Account Information**: Name, email address, phone number, city, and password when you register.
• **Profile Data**: Profile images, preferences, and portfolio details you voluntarily add.
• **Transaction Data**: Order details, payment records, and communications between customers and makers.
• **Usage Data**: Pages visited, features used, device information, and approximate location derived from IP address.
• **Communications**: Messages sent through our platform, emails to our support team, and feedback you provide.`,
  },
  {
    title: '2. How We Use Your Information',
    body: `We use the information we collect to:

• Provide, operate, and improve the KaariGhar platform and services.
• Match customers with suitable artisans and facilitate transactions.
• Process payments and send order-related notifications.
• Communicate with you about products, services, promotions, and updates.
• Personalise your experience and surface relevant content.
• Detect, investigate, and prevent fraudulent transactions and other illegal activities.
• Comply with legal obligations and enforce our Terms of Service.`,
  },
  {
    title: '3. Sharing Your Information',
    body: `We do not sell, trade, or rent your personal information to third parties. We may share information in the following limited circumstances:

• **With Artisans / Customers**: When you initiate a transaction, relevant contact and order details are shared between the parties.
• **Service Providers**: Trusted third-party vendors who assist in operating our platform (payment processors, cloud hosting, analytics), bound by confidentiality obligations.
• **Legal Requirements**: When required by law, court order, or government authority.
• **Business Transfers**: In connection with a merger, acquisition, or sale of assets, your data may be transferred to the acquiring entity.`,
  },
  {
    title: '4. Data Security',
    body: `We implement industry-standard security measures to protect your personal information from unauthorised access, disclosure, alteration, or destruction. These include:

• TLS/HTTPS encryption for all data in transit.
• Bcrypt hashing for password storage — we never store plaintext passwords.
• Regular security audits and vulnerability assessments.
• Strict internal access controls and role-based permissions.

No method of transmission over the internet is 100% secure. While we strive to use commercially acceptable means to protect your data, we cannot guarantee absolute security.`,
  },
  {
    title: '5. Cookies & Tracking',
    body: `We use cookies and similar tracking technologies to enhance your experience. See our Cookie Policy for full details. In brief:

• **Essential Cookies**: Required for authentication and platform functionality.
• **Analytics Cookies**: Help us understand how users interact with the platform (e.g., page views, session duration).
• **Preference Cookies**: Remember your settings and preferences.

You can control cookies through your browser settings, though disabling certain cookies may affect platform functionality.`,
  },
  {
    title: '6. Your Rights',
    body: `Depending on your location, you may have the following rights regarding your personal data:

• **Access**: Request a copy of the personal data we hold about you.
• **Correction**: Request corrections to inaccurate or incomplete data.
• **Deletion**: Request deletion of your personal data, subject to certain exceptions.
• **Portability**: Receive your data in a structured, commonly used format.
• **Objection**: Object to certain processing activities.
• **Withdrawal of Consent**: Where processing is based on consent, withdraw it at any time.

To exercise any of these rights, contact us at privacy@kaarighar.com.`,
  },
  {
    title: '7. Data Retention',
    body: `We retain personal information for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law. Generally:

• Account data is retained for the duration of your account and for up to 3 years after closure.
• Transaction records are retained for 7 years to comply with financial regulations.
• Anonymised analytics data may be retained indefinitely.`,
  },
  {
    title: '8. Children\'s Privacy',
    body: `KaariGhar is not directed to individuals under the age of 18. We do not knowingly collect personal information from minors. If you believe a minor has provided us with personal information, please contact us immediately at privacy@kaarighar.com and we will take steps to delete such information.`,
  },
  {
    title: '9. Changes to This Policy',
    body: `We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy on this page with an updated effective date. Continued use of the platform after changes constitutes your acceptance of the updated policy.`,
  },
  {
    title: '10. Contact Us',
    body: `If you have any questions about this Privacy Policy or our data practices, please contact us:

• **Email**: privacy@kaarighar.com
• **Address**: KaariGhar, New Delhi, India
• **Response Time**: We aim to respond within 72 hours.`,
  },
];

export default function PrivacyPolicy() {
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
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 border-b"
        style={{
          background: 'rgba(10,10,10,0.85)',
          backdropFilter: 'blur(20px)',
          borderColor: 'rgba(255,255,255,0.06)',
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
        style={{
          paddingTop: '120px',
          paddingBottom: '4rem',
          maxWidth: '800px',
          margin: '0 auto',
          padding: '120px 2rem 4rem',
        }}
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
          Privacy Policy
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
          At KaariGhar, we respect your privacy and are committed to protecting your personal data. This policy explains how we collect, use, and safeguard your information when you use our platform.
        </p>
      </motion.div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'hsl(var(--stroke))', margin: '0 2rem' }} />

      {/* Content */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 2rem 8rem' }}>
        {SECTIONS.map((section, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.06, ease: 'easeOut' }}
            style={{ marginBottom: '3.5rem' }}
          >
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
            {i < SECTIONS.length - 1 && (
              <div style={{ height: '1px', background: 'hsl(var(--stroke))', marginTop: '3.5rem' }} />
            )}
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
