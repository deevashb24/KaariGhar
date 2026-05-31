import HlsVideo from './HlsVideo';

const SOCIALS = [
  { label: 'Instagram', href: 'https://instagram.com/kaarighar' },
  { label: 'Pinterest', href: 'https://pinterest.com/kaarighar' },
  { label: 'LinkedIn', href: 'https://linkedin.com/company/kaarighar' },
];

export default function ContactFooter() {
  return (
    <footer
      id="contact"
      className="relative bg-[hsl(var(--bg))] pt-24 pb-12 overflow-hidden border-t border-[hsl(var(--stroke))]"
    >
      {/* Background video — flipped vertically */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <HlsVideo
          className="w-full h-full object-cover"
          flipped={true}
        />
        <div className="absolute inset-0 bg-black/75" />
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--bg))] via-transparent to-[hsl(var(--bg))]" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6">
        {/* CTA heading */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <p className="text-xs text-[hsl(var(--muted))] uppercase tracking-[0.35em] mb-6">
            Begin Something Enduring
          </p>
          <h2 className="font-display italic text-5xl md:text-7xl lg:text-8xl text-[hsl(var(--text))] leading-[0.95] mb-10">
            Begin your<br />
            <span style={{ color: '#8AAFD4' }}>journey.</span>
          </h2>
          <p className="text-sm text-[hsl(var(--muted))] max-w-sm mx-auto mb-10 leading-relaxed">
            Every extraordinary space begins with a single conversation.
            Tell us about your vision and we will answer with possibility.
          </p>

          {/* Email button */}
          <a
            href="mailto:contact@kaarighar.com"
            className="group relative inline-flex items-center gap-3 px-10 py-5 rounded-full
              text-sm font-medium uppercase tracking-[0.15em] text-[hsl(var(--text))]
              border border-white/15 hover:border-transparent
              transition-all duration-400 hover:shadow-[0_0_40px_rgba(138,175,212,0.25)]"
          >
            {/* Gradient border on hover */}
            <span
              className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
              style={{
                background: 'linear-gradient(90deg, #8AAFD4, #4E85BF)',
                padding: '1px',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
              }}
            />
            <span>contact@kaarighar.com</span>
            <span className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-base">
              ↗
            </span>
          </a>
        </div>

        {/* Divider */}
        <div className="h-px bg-[hsl(var(--stroke))] mb-10" />

        {/* Footer bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <span className="font-display italic text-lg text-[hsl(var(--text))]">KaariGhar</span>
            <span className="text-[hsl(var(--stroke))]">·</span>
            <span className="text-xs text-[hsl(var(--muted))]">© 2024</span>
          </div>

          {/* Commission status */}
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-dot" />
            <span className="text-xs text-[hsl(var(--muted))] uppercase tracking-[0.2em]">
              Currently accepting commissions
            </span>
          </div>

          {/* Social links */}
          <div className="flex items-center gap-6">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[hsl(var(--muted))] uppercase tracking-[0.15em]
                  hover:text-[hsl(var(--text))] transition-colors duration-200"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
