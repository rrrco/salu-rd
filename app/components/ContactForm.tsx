'use client'

import { useState } from 'react'

export default function ContactForm() {
  const [checked, setChecked] = useState(false)

  const toggle = () => setChecked(c => !c)

  return (
    <div className="contact-form-card" style={{ background: '#fff', boxShadow: '0 4px 40px rgba(0,0,0,0.10)', padding: '46px 40px 48px' }}>
      <h3 style={{ fontSize: '26px', fontWeight: 700, color: '#222222', marginBottom: '28px' }}>
        Mantengámonos en contacto
      </h3>
      <form action="#" method="post" noValidate>

        <div className="form-row">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#222222', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              Nombre completo
            </label>
            <input type="text" name="name" placeholder="Tu nombre" autoComplete="name" className="form-input" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#222222', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              Correo electrónico *
            </label>
            <input type="email" name="email" placeholder="tu@correo.com" required autoComplete="email" className="form-input" />
          </div>
        </div>

        <div className="form-row">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#222222', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              Teléfono / WhatsApp *
            </label>
            <input type="tel" name="phone" placeholder="+54 11 ..." required autoComplete="tel" className="form-input" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#222222', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              Organización *
            </label>
            <input type="text" name="organisation" placeholder="Clínica / Hospital / Distribuidor" required className="form-input" />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
          <label style={{ fontSize: '12px', fontWeight: 600, color: '#222222', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
            Mensaje *
          </label>
          <textarea
            name="message"
            placeholder="Cuéntanos cómo podemos ayudar a tu práctica..."
            required
            className="form-input"
            style={{ resize: 'vertical', minHeight: '110px' }}
          />
        </div>

        {/* Fake reCAPTCHA */}
        <div
          role="group"
          aria-label="Verificación reCAPTCHA"
          style={{ display: 'flex', alignItems: 'center', gap: '14px', border: '1px solid #d3d3d3', padding: '16px 18px', marginBottom: '20px', background: '#f9f9f9' }}
        >
          <div
            role="checkbox"
            aria-checked={checked}
            tabIndex={0}
            aria-label="No soy un robot"
            onClick={toggle}
            onKeyDown={e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggle() } }}
            style={{
              width: '24px', height: '24px',
              border: checked ? '2px solid #2AACB8' : '2px solid #c1c1c1',
              borderRadius: '3px',
              flexShrink: 0,
              cursor: 'pointer',
              background: checked ? '#2AACB8' : '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.12s ease',
            }}
          >
            {checked && (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="2,7 5.5,10.5 12,3.5" />
              </svg>
            )}
          </div>
          <span style={{ fontSize: '14px', color: '#555', flex: 1 }}>No soy un robot</span>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
            <svg width="32" height="32" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <circle cx="32" cy="32" r="30" fill="#4A90D9" opacity="0.15" />
              <path d="M32 10 C20 10 11 19 11 31 C11 40 16 48 24 52 L24 42 C20 40 18 36 18 31 C18 23 24 17 32 17 C40 17 46 23 46 31 C46 36 44 40 40 42 L40 52 C48 48 53 40 53 31 C53 19 44 10 32 10 Z" fill="#4A90D9" opacity="0.7" />
              <path d="M32 22 C26 22 22 26 22 32 C22 36 24 39 28 41 L28 34 L36 34 L36 41 C40 39 42 36 42 32 C42 26 38 22 32 22 Z" fill="#4A90D9" />
            </svg>
            <span style={{ fontSize: '8px', color: '#555', letterSpacing: '0.2px', textAlign: 'center', lineHeight: '1.4' }}>
              reCAPTCHA<br />Privacy · Terms
            </span>
          </div>
        </div>

        <button type="submit" className="btn btn-lg" style={{ width: '100%' }}>
          ENVIAR MENSAJE
        </button>
      </form>
    </div>
  )
}
