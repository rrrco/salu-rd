export type SanityProduct = {
  _id: string
  name: string
  slug?: { current: string }
  iconKey?: string
  imageUrl?: string
}

export const ICONS: Record<string, React.JSX.Element> = {
  antibiotics: (
    <svg width="56" height="56" viewBox="0 0 72 72" fill="none" stroke="#2AACB8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-label="Antibiotic capsule" role="img">
      <ellipse cx="36" cy="36" rx="28" ry="14" fill="none" />
      <path d="M8,36 A28,14 0 0,1 64,36" fill="rgba(42,172,184,0.15)" stroke="#2AACB8" strokeWidth="3" />
      <line x1="36" y1="22" x2="36" y2="50" />
      <path d="M8,36 A28,14 0 0,0 64,36 A28,14 0 0,0 8,36 Z" fill="none" />
      <line x1="22" y1="30" x2="22" y2="42" opacity="0.4" />
      <line x1="50" y1="30" x2="50" y2="42" opacity="0.4" />
    </svg>
  ),
  antiparasitic: (
    <svg width="56" height="56" viewBox="0 0 72 72" fill="none" stroke="#2AACB8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-label="Shield with checkmark" role="img">
      <path d="M36,8 L60,18 L60,36 C60,50 48,62 36,66 C24,62 12,50 12,36 L12,18 Z" />
      <polyline points="27,37 33,43 47,29" />
    </svg>
  ),
  vaccines: (
    <svg width="56" height="56" viewBox="0 0 72 72" fill="none" stroke="#2AACB8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-label="Syringe" role="img">
      <rect x="20" y="26" width="30" height="18" rx="0" />
      <line x1="14" y1="35" x2="20" y2="35" />
      <rect x="10" y="30" width="4" height="10" rx="0" strokeWidth="2.5" />
      <line x1="50" y1="35" x2="62" y2="35" />
      <line x1="28" y1="26" x2="28" y2="44" opacity="0.4" />
      <line x1="36" y1="26" x2="36" y2="44" opacity="0.4" />
      <line x1="44" y1="26" x2="44" y2="44" opacity="0.4" />
      <rect x="20" y="30" width="16" height="12" fill="rgba(42,172,184,0.2)" stroke="none" />
    </svg>
  ),
  supplements: (
    <svg width="56" height="56" viewBox="0 0 72 72" fill="none" stroke="#2AACB8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-label="Pill bottle" role="img">
      <rect x="22" y="26" width="28" height="36" rx="2" />
      <rect x="26" y="18" width="20" height="10" rx="2" />
      <line x1="36" y1="34" x2="36" y2="46" />
      <line x1="30" y1="40" x2="42" y2="40" />
      <line x1="26" y1="23" x2="46" y2="23" opacity="0.5" />
    </svg>
  ),
  wounds: (
    <svg width="56" height="56" viewBox="0 0 72 72" fill="none" stroke="#2AACB8" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-label="Medical cross" role="img">
      <rect x="28" y="14" width="16" height="44" rx="3" />
      <rect x="14" y="28" width="44" height="16" rx="3" />
    </svg>
  ),
  sedatives: (
    <svg width="56" height="56" viewBox="0 0 72 72" fill="none" stroke="#2AACB8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-label="IV drip bag" role="img">
      <rect x="22" y="10" width="28" height="36" rx="8" />
      <line x1="22" y1="32" x2="50" y2="32" opacity="0.5" />
      <rect x="22" y="32" width="28" height="14" rx="0" fill="rgba(42,172,184,0.15)" stroke="none" />
      <circle cx="36" cy="10" r="3" fill="none" />
      <line x1="36" y1="46" x2="36" y2="58" />
      <rect x="31" y="55" width="10" height="8" rx="2" />
    </svg>
  ),
  antiinflammatory: (
    <svg width="56" height="56" viewBox="0 0 72 72" fill="none" stroke="#2AACB8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-label="Leaf" role="img">
      <path d="M36,62 C36,62 12,48 12,28 C12,18 22,10 36,10 C50,10 60,18 60,28 C60,48 36,62 36,62 Z" />
      <line x1="36" y1="10" x2="36" y2="62" />
      <line x1="36" y1="26" x2="22" y2="38" opacity="0.5" />
      <line x1="36" y1="26" x2="50" y2="38" opacity="0.5" />
      <line x1="36" y1="38" x2="24" y2="48" opacity="0.35" />
      <line x1="36" y1="38" x2="48" y2="48" opacity="0.35" />
    </svg>
  ),
  ophthalmic: (
    <svg width="56" height="56" viewBox="0 0 72 72" fill="none" stroke="#2AACB8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-label="Eye" role="img">
      <path d="M10,36 C10,36 20,18 36,18 C52,18 62,36 62,36 C62,36 52,54 36,54 C20,54 10,36 10,36 Z" />
      <circle cx="36" cy="36" r="10" />
      <circle cx="36" cy="36" r="4" fill="rgba(42,172,184,0.2)" />
      <line x1="36" y1="18" x2="36" y2="14" opacity="0.5" />
      <line x1="28" y1="20" x2="26" y2="16" opacity="0.35" />
      <line x1="44" y1="20" x2="46" y2="16" opacity="0.35" />
    </svg>
  ),
}
