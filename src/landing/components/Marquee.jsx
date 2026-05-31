/**
 * Infinite horizontal marquee ticker strip.
 * direction: 'left' (default) | 'right'
 */
export default function Marquee({ items, direction = 'left', className = '' }) {
  const duplicated = [...items, ...items, ...items, ...items];

  return (
    <div
      className={`relative overflow-hidden py-5 border-y ${className}`}
      style={{ borderColor: 'hsl(var(--stroke))' }}
    >
      <div
        className="ticker-track"
        style={{
          animationDirection: direction === 'right' ? 'reverse' : 'normal',
        }}
      >
        {duplicated.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-6 px-6 shrink-0"
          >
            {/* Diamond separator */}
            <span
              className="w-1 h-1 rotate-45 shrink-0"
              style={{ background: 'hsl(var(--faint))', display: 'inline-block' }}
            />
            {typeof item === 'string' ? (
              <span
                className="text-xs uppercase tracking-[0.3em] font-medium whitespace-nowrap"
                style={{ color: 'hsl(var(--muted))' }}
              >
                {item}
              </span>
            ) : (
              item
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
