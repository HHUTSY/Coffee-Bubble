/**
 * Generative illustrations for the "bean to cup" lens. Deterministic (seeded),
 * so beans keep their places between the green and the roasted stage.
 */
import { memo } from 'react'
import { Photo } from './Photo'

function rng(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

type Bean = { x: number; y: number; rx: number; rot: number; tone: number }

const BEANS: Bean[] = (() => {
  const r = rng(7)
  const out: Bean[] = []
  for (let i = 0; i < 26; i++) {
    const a = r() * Math.PI * 2
    const d = Math.sqrt(r()) * 170
    out.push({ x: 200 + Math.cos(a) * d, y: 200 + Math.sin(a) * d, rx: 20 + r() * 13, rot: r() * 360, tone: Math.floor(r() * 4) })
  }
  return out.sort((a, b) => a.y - b.y)
})()

const PALETTES = {
  green: { bg: '#3f482a', body: ['#9aa46b', '#8c975e', '#a9b07a', '#7f8a55'], crease: '#56603a', sheen: 0.18 },
  roast: { bg: '#24150c', body: ['#6b3a1e', '#5a2f17', '#7a4424', '#4a2612'], crease: '#1f1008', sheen: 0.32 },
}

export const BeansArt = memo(function BeansArt({ variant }: { variant: 'green' | 'roast' }) {
  const p = PALETTES[variant]
  const gid = `sheen-${variant}`
  return (
    <svg viewBox="0 0 400 400" className="size-full" aria-hidden>
      <defs>
        <radialGradient id={gid} cx="35%" cy="30%" r="70%">
          <stop offset="0" stopColor="#fff" stopOpacity={p.sheen} />
          <stop offset="0.6" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${gid}-v`} cx="50%" cy="50%" r="50%">
          <stop offset="0.65" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.55" />
        </radialGradient>
      </defs>
      <rect width="400" height="400" fill={p.bg} />
      {BEANS.map((b, i) => {
        const ry = b.rx * 1.36
        return (
          <g key={i} transform={`translate(${b.x.toFixed(1)} ${b.y.toFixed(1)}) rotate(${b.rot.toFixed(1)})`}>
            <ellipse rx={b.rx * 1.02} ry={ry * 1.02} cx={b.rx * 0.12} cy={ry * 0.14} fill="#000" opacity="0.32" />
            <ellipse rx={b.rx} ry={ry} fill={p.body[b.tone]} />
            <ellipse rx={b.rx} ry={ry} fill={`url(#${gid})`} />
            <path
              d={`M0 ${-ry * 0.82}C${b.rx * 0.5} ${-ry * 0.3} ${-b.rx * 0.5} ${ry * 0.3} 0 ${ry * 0.82}`}
              fill="none"
              stroke={p.crease}
              strokeWidth={b.rx * 0.17}
              strokeLinecap="round"
            />
          </g>
        )
      })}
      <rect width="400" height="400" fill={`url(#${gid}-v)`} />
    </svg>
  )
})

const GROUNDS = (() => {
  const r = rng(21)
  const colors = ['#2a180d', '#3a2213', '#5c3820', '#7d5130', '#9a6a40', '#1c110a']
  return Array.from({ length: 300 }, () => ({
    x: r() * 400,
    y: r() * 400,
    s: 2 + r() * 4.5,
    c: colors[Math.floor(r() * colors.length)],
  }))
})()

/** Freshly ground coffee: brown fractal noise for the fines, scattered chunks on top. */
export const GroundsArt = memo(function GroundsArt() {
  return (
    <svg viewBox="0 0 400 400" className="size-full" aria-hidden>
      <defs>
        <filter id="grounds-noise" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.62" numOctaves="3" seed="4" />
          <feColorMatrix type="matrix" values="0.62 0 0 0 0.04  0.38 0 0 0 0.02  0.2 0 0 0 0.01  0 0 0 0 1" />
          <feComponentTransfer>
            <feFuncR type="gamma" exponent="1.7" amplitude="1.25" />
            <feFuncG type="gamma" exponent="1.7" amplitude="1.25" />
            <feFuncB type="gamma" exponent="1.7" amplitude="1.25" />
          </feComponentTransfer>
        </filter>
        <radialGradient id="grounds-light" cx="38%" cy="32%" r="80%">
          <stop offset="0" stopColor="#e5793a" stopOpacity="0.28" />
          <stop offset="0.55" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.55" />
        </radialGradient>
      </defs>
      <rect width="400" height="400" filter="url(#grounds-noise)" />
      {GROUNDS.map((g, i) => (
        <rect key={i} x={g.x} y={g.y} width={g.s} height={g.s * 0.75} rx={g.s * 0.28} fill={g.c} transform={`rotate(${(i * 37) % 360} ${g.x} ${g.y})`} />
      ))}
      <rect width="400" height="400" fill="url(#grounds-light)" />
    </svg>
  )
})

/** Espresso crema seen from above, with the stream still pouring in. */
export function CremaArt() {
  return (
    <div className="relative size-full" aria-hidden>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_48%_46%,#efc48c_0%,#d29a5c_20%,#a8662e_44%,#6b3a1e_66%,#2a160b_92%)]" />
      <div className="absolute inset-0 bg-[repeating-conic-gradient(from_12deg_at_48%_46%,rgba(255,236,210,0.12)_0deg_3deg,transparent_3deg_9deg)] [mask-image:radial-gradient(circle_at_48%_46%,transparent_10%,#000_40%,transparent_75%)]" />
      <div className="absolute inset-[18%] rounded-full bg-[conic-gradient(from_200deg,rgba(255,244,228,0.0),rgba(255,244,228,0.28),rgba(255,244,228,0.0)_40%)] blur-md" />
      <div data-stream className="absolute left-[47%] top-0 h-[47%] w-[3.2%] origin-top rounded-b-full bg-[linear-gradient(180deg,#2a160b,#6b3a1e_60%,#a8662e)]" />
    </div>
  )
}

/** Final stage: a real cup seen from above (public/images/process-cup.jpg, square). */
export function CupArt({ image, alt }: { image: string; alt: string }) {
  return (
    <div className="relative size-full overflow-hidden bg-[#e9dcc6]">
      <Photo name={image} alt={alt} sizes="(min-width: 1024px) 40vw, 80vw" className="absolute inset-0" />
    </div>
  )
}
