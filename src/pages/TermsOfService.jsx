import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const SECTIONS = [
  {
    title: '1. Acceptance of Terms',
    body: `By accessing or using the KaariGhar platform ("Platform"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not use the Platform.

These Terms apply to all users of the Platform, including customers seeking bespoke interior design and furniture, and artisans ("Makers") offering their craft and services.

KaariGhar reserves the right to update these Terms at any time. Your continued use of the Platform after any changes constitutes acceptance of the updated Terms.`,
  },
  {
    title: '2. Description of Service',
    body: `KaariGhar is a curated marketplace that connects customers seeking bespoke interior design, custom furniture, and artisan craftsmanship with skilled Makers across India.

The Platform facilitates:
• Discovery of artisans and their portfolio work.
• Commission requests and quote submissions.
• Secure in-platform messaging between customers and Makers.
• Escrow-style payment management and milestone tracking.
• Order management and delivery coordination.

KaariGhar does not manufacture or physically deliver any products — we are a facilitating marketplace only.`,
  },
  {
    title: '3. Account Registration',
    body: `To use most features of the Platform, you must create an account. You agree to:

• Provide accurate, current, and complete information during registration.
• Maintain and promptly update your account information.
• Keep your password confidential and not share it with others.
• Accept responsibility for all activities that occur under your account.
• Notify us immediately of any unauthorised use of your account.

You must be at least 18 years of age to create an account. KaariGhar reserves the right to terminate accounts that violate these Terms or our community guidelines.`,
  },
  {
    title: '4. Customer Terms',
    body: `As a Customer on KaariGhar, you agree to:

• Submit accurate project briefs and requirements when requesting quotes.
• Respond to Maker communications in a timely manner.
• Make payments as agreed upon in accepted quotes.
• Provide honest and constructive feedback about completed work.
• Not attempt to circumvent the Platform to transact directly with Makers outside of KaariGhar.
• Respect intellectual property rights of Makers and third parties.

Customers acknowledge that all commissions are custom-made and may not be identical to portfolio images, as each piece is handcrafted individually.`,
  },
  {
    title: '5. Maker Terms',
    body: `As a Maker on KaariGhar, you agree to:

• Represent your skills, experience, and portfolio honestly and accurately.
• Respond to customer enquiries within a reasonable timeframe.
• Provide accurate quotes and adhere to agreed timelines.
• Deliver work that meets the quality and specifications agreed upon.
• Maintain professional conduct in all customer interactions.
• Not solicit customers to transact outside the Platform.
• Comply with all applicable laws regarding craftsmanship, materials, and labour.

KaariGhar charges a platform commission on completed transactions. Commission rates are communicated separately in the Maker Agreement.`,
  },
  {
    title: '6. Payments & Escrow',
    body: `KaariGhar uses an escrow-style payment system to protect both parties:

• Customers fund escrow when a quote is accepted.
• Funds are held securely until project milestones are met.
• Makers receive payment upon customer confirmation of milestone completion.
• Disputed payments are subject to KaariGhar's dispute resolution process.

All payments are processed in Indian Rupees (INR) through our third-party payment processor. KaariGhar is not responsible for any banking fees or currency conversion charges.

Refunds are subject to our Refund Policy and the specific terms of each commission agreement.`,
  },
  {
    title: '7. Intellectual Property',
    body: `Ownership of completed custom work is transferred to the Customer upon full payment. However:

• Makers retain the right to display completed work in their portfolio unless the Customer requests confidentiality in writing.
• KaariGhar may feature completed projects in its marketing materials with prior consent.
• All content on the Platform (including logos, text, graphics, and software) is owned by KaariGhar and protected by intellectual property laws.
• You may not reproduce, modify, or distribute Platform content without prior written permission.`,
  },
  {
    title: '8. Prohibited Conduct',
    body: `You agree not to:

• Use the Platform for any unlawful purpose.
• Harass, threaten, or intimidate other users.
• Post false, misleading, or fraudulent content.
• Attempt to circumvent the Platform's security or payment systems.
• Scrape, crawl, or data-mine the Platform.
• Upload viruses or malicious code.
• Impersonate any person or entity.
• Engage in any activity that disrupts or interferes with the Platform's operation.

Violations may result in immediate account suspension or termination, and may be reported to relevant authorities.`,
  },
  {
    title: '9. Dispute Resolution',
    body: `In the event of a dispute between a Customer and Maker:

1. Parties are encouraged to resolve disputes amicably through direct communication.
2. If unresolved within 7 days, either party may escalate to KaariGhar's mediation team at disputes@kaarighar.com.
3. KaariGhar will review evidence from both parties and issue a non-binding recommendation within 14 business days.
4. If mediation fails, disputes shall be resolved by arbitration in New Delhi, India, in accordance with the Arbitration and Conciliation Act, 1996.

These Terms are governed by the laws of India. Jurisdiction for any legal proceedings lies exclusively with the courts of New Delhi.`,
  },
  {
    title: '10. Limitation of Liability',
    body: `To the maximum extent permitted by applicable law:

• KaariGhar is not liable for the quality, safety, or legality of listed services or goods.
• KaariGhar's total liability for any claim shall not exceed the amount of the relevant transaction.
• KaariGhar is not liable for indirect, incidental, special, or consequential damages.
• KaariGhar does not warrant that the Platform will be uninterrupted, error-free, or free of viruses.

Nothing in these Terms limits liability for fraud, death, or personal injury caused by negligence.`,
  },
  {
    title: '11. Termination',
    body: `KaariGhar reserves the right to suspend or terminate your account at any time, with or without notice, for:

• Violation of these Terms.
• Fraudulent, abusive, or illegal activity.
• Extended inactivity.
• Any other reason at KaariGhar's discretion.

You may delete your account at any time by contacting us at support@kaarighar.com. Termination does not affect any rights or obligations that arose prior to termination.`,
  },
  {
    title: '12. Contact',
    body: `For questions about these Terms of Service:

• **Email**: legal@kaarighar.com
• **Address**: KaariGhar, New Delhi, India
• **Response Time**: We aim to respond within 5 business days.`,
  },
];

export default function TermsOfService() {
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
        style={{ maxWidth: '800px', margin: '0 auto', padding: '120px 2rem 4rem' }}
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
          Terms of Service
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
          Please read these Terms of Service carefully before using KaariGhar. They govern your use of our platform and the relationship between customers, makers, and KaariGhar.
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
            transition={{ duration: 0.6, delay: i * 0.05, ease: 'easeOut' }}
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
