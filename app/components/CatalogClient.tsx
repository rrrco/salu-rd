'use client'

import { useState } from 'react'
import { ICONS, SanityProduct } from '../lib/icons'

export default function CatalogClient({ products }: { products: SanityProduct[] }) {
  const [query, setQuery] = useState('')

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <>
      <div className="search-bar">
        <span className="search-bar-icon" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>
        <input
          type="search"
          placeholder="Buscar producto..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Buscar productos"
        />
      </div>

      <p style={{ color: 'rgba(255,255,255,0.70)', fontSize: '13px', marginBottom: '24px', textAlign: 'center' }}>
        Mostrando {filtered.length} producto{filtered.length !== 1 ? 's' : ''}
      </p>

      {filtered.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.60)', fontSize: '15px', padding: '48px 0' }}>
          No se encontraron productos para &ldquo;{query}&rdquo;
        </p>
      ) : (
        <div className="prod-grid">
          {filtered.map((p) => (
            <article key={p._id} className="prod-card">
              <div className="prod-img-area">
                {p.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.imageUrl} alt={p.name} />
                ) : (
                  ICONS[p.iconKey ?? ''] ?? ICONS['antibiotics']
                )}
              </div>
              <div className="prod-body">
                <div className="prod-name">{p.name}</div>
                <a href="/#contact" className="btn">COTIZACIÓN GRATIS</a>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  )
}
