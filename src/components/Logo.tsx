/** Circular badge with a dotted ring and a coffee bean, a nod to the café's round logo. */
export function LogoMark({ className = '' }: { className?: string }) {
  const dots = Array.from({ length: 22 }, (_, i) => {
    const a = (i / 22) * Math.PI * 2
    return [24 + Math.cos(a) * 19.5, 24 + Math.sin(a) * 19.5]
  })
  return (
    <svg viewBox="0 0 48 48" aria-hidden className={className}>
      <circle cx="24" cy="24" r="23" fill="none" stroke="currentColor" strokeWidth="1.4" />
      {dots.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.05" fill="currentColor" />
      ))}
      <g transform="rotate(-28 24 24)">
        <ellipse cx="24" cy="24" rx="7.4" ry="10.4" fill="currentColor" />
        <path d="M24 14.2c3 3.6-3 7.6 0 9.8s3 6.2 0 9.8" fill="none" stroke="var(--logo-cut, #15100c)" strokeWidth="1.5" strokeLinecap="round" />
      </g>
    </svg>
  )
}

export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`font-display text-[1.45rem] leading-none tracking-[-0.03em] ${className}`}>
      Coffee <em className="font-display-italic">Bubble</em>
    </span>
  )
}
