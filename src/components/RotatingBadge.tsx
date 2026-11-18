import { useId } from 'react'
import { LogoMark } from './Logo'

/** Circular text badge (echo of the café's round logo). Spins via the parent's scroll timeline or CSS. */
export function RotatingBadge({ text, className = '', spinClass = '' }: { text: string; className?: string; spinClass?: string }) {
  const id = useId().replace(/:/g, '')
  return (
    <div className={`relative grid size-[clamp(120px,13vw,180px)] place-items-center ${className}`} aria-hidden>
      <svg viewBox="0 0 200 200" className={`absolute inset-0 size-full ${spinClass}`} data-badge-ring>
        <defs>
          <path id={`c-${id}`} d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <text className="label" style={{ fontSize: '13px', letterSpacing: '0.2em' }} fill="currentColor">
          {/* circumference 2π·78 ≈ 490 → stretch the spacing so the text closes the circle exactly */}
          <textPath href={`#c-${id}`} textLength={488} lengthAdjust="spacing">
            {text.toUpperCase()}
          </textPath>
        </text>
      </svg>
      <LogoMark className="size-[36%]" />
    </div>
  )
}
