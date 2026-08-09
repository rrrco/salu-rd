import fs from 'node:fs'
import path from 'node:path'
import Image from 'next/image'
import { Camera } from '@phosphor-icons/react/ssr'

/**
 * Module-level cache for the existence check.
 *
 * `fs.existsSync` is static I/O: the contents of `public/` cannot change while
 * the server is running. Without this it ran on every render of every slot, on
 * every request. Hoisting it means one stat call per file for the process
 * lifetime. Adding a photo requires a restart, which a deploy does anyway.
 */
const photoExists = new Map<string, boolean>()

function hasPhoto(src: string) {
  const cached = photoExists.get(src)
  if (cached !== undefined) return cached
  const exists = fs.existsSync(path.join(process.cwd(), 'public', src))
  photoExists.set(src, exists)
  return exists
}

/**
 * Tier 1 editorial imagery slot. See DESIGN.md section 7.
 *
 * The photography is not in the repo yet. Rather than shipping a broken image
 * or hotlinking someone else's asset (which the previous build did), this slot
 * checks for the file at build time and renders a designed placeholder when it
 * is missing.
 *
 * The aspect ratio is reserved either way, so dropping the real file into
 * `public/photos/` changes the picture and nothing else. CLS stays at zero.
 *
 * `.photo-editorial` applies the shared tint and desaturation that makes photos
 * from mixed sources and mixed lighting read as one set. Backgrounds are a
 * feature here, so none of these need cutting out.
 */
export function PhotoSlot({
  src,
  alt,
  ratio,
  sizes,
  priority = false,
  note,
  className,
  scrim = false,
  children,
}: {
  /** Path under `public/`, e.g. `/photos/hero.jpg` */
  src: string
  alt: string
  /** Tailwind aspect class, e.g. `aspect-[4/5]` */
  ratio: string
  sizes: string
  priority?: boolean
  /** Shown in the placeholder so whoever supplies the photo knows what to shoot. */
  note: string
  className?: string
  /** Darkens the image so overlaid copy stays legible. */
  scrim?: boolean
  children?: React.ReactNode
}) {
  const exists = hasPhoto(src)

  return (
    <div
      className={[
        'photo-editorial',
        scrim ? 'photo-scrim' : '',
        ratio,
        'rounded-lg',
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {exists ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 z-[3] flex flex-col items-center justify-center gap-3 p-8 text-center text-accent-deep">
          <Camera size={40} aria-hidden="true" />
          <p className="max-w-[34ch] font-semibold text-xs uppercase leading-relaxed tracking-[0.08em]">
            {note}
          </p>
        </div>
      )}
      {children}
    </div>
  )
}
