import type { CSSProperties } from 'react'

/** Must match IMAGE_WIDTHS in vite.config.ts */
const WIDTHS = [480, 960, 1600]

type PhotoProps = {
  /** file name in /public/images without extension, e.g. "pastry-choux" */
  name: string
  alt: string
  sizes?: string
  className?: string
  imgClassName?: string
  imgStyle?: CSSProperties
  priority?: boolean
}

/**
 * One canonical JPG per photo (public/images/<name>.jpg).
 * In production the build adds WebP variants (<name>-480/960/1600.webp) for srcset.
 */
export function Photo({ name, alt, sizes = '100vw', className = '', imgClassName = '', imgStyle, priority = false }: PhotoProps) {
  const base = `${import.meta.env.BASE_URL}images/${name}`
  return (
    <picture className={`block bg-[radial-gradient(120%_90%_at_60%_35%,#c98a4b_0%,#5e3219_55%,#24170f_100%)] ${className}`}>
      {import.meta.env.PROD && (
        <source type="image/webp" srcSet={WIDTHS.map((w) => `${base}-${w}.webp ${w}w`).join(', ')} sizes={sizes} />
      )}
      <img
        src={`${base}.jpg`}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
        draggable={false}
        className={`h-full w-full object-cover ${imgClassName}`}
        style={imgStyle}
      />
    </picture>
  )
}
