'use client'

import { useState, useEffect, useRef } from 'react'

const testimonials = [
  {
    name: 'Dr. Valentina Ruiz',
    location: 'República Dominicana',
    avatar: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=160&q=80',
    quote: '"SALU ha sido nuestro proveedor de cabecera durante más de tres años. Su gama de productos es completa, los precios son competitivos y el equipo técnico siempre nos ayuda a tomar las mejores decisiones para nuestros pacientes. La entrega es rápida y confiable — exactamente lo que una clínica ocupada necesita."',
  },
  {
    name: 'Carlos Medina',
    location: 'República Dominicana',
    avatar: 'https://images.unsplash.com/photo-1558788353-f76d92427f16?w=160&q=80',
    quote: '"Como distribuidor veterinario, la disponibilidad de productos y la consistencia de calidad lo son todo. SALU cumple en ambos aspectos cada vez. Su línea antiparasitaria y catálogo de vacunas son los mejores del mercado latinoamericano. Una operación verdaderamente profesional."',
  },
  {
    name: 'Dra. Ana Lima',
    location: 'República Dominicana',
    avatar: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=160&q=80',
    quote: '"Cambiamos nuestro hospital a la línea de antibióticos y cuidado de heridas de SALU el año pasado y los resultados clínicos han sido excelentes. La relación calidad-precio es sobresaliente y su equipo de atención al cliente responde en menos de una hora. Altamente recomendable para cualquier práctica veterinaria."',
  },
]

export default function TestimonialsCarousel() {
  const [current, setCurrent] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const touchStartX = useRef(0)

  const goTo = (idx: number) => {
    let next = idx
    if (next < 0) next = testimonials.length - 1
    if (next >= testimonials.length) next = 0
    setCurrent(next)
  }

  const stopAuto = () => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null }
  }

  const startAuto = () => {
    stopAuto()
    timerRef.current = setInterval(() => setCurrent(c => (c + 1) % testimonials.length), 5000)
  }

  useEffect(() => {
    startAuto()
    return stopAuto
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <div
        className="car-outer"
        onMouseEnter={stopAuto}
        onMouseLeave={startAuto}
        onTouchStart={e => { touchStartX.current = e.changedTouches[0].screenX }}
        onTouchEnd={e => {
          const diff = touchStartX.current - e.changedTouches[0].screenX
          if (Math.abs(diff) > 40) { stopAuto(); goTo(current + (diff > 0 ? 1 : -1)); startAuto() }
        }}
      >
        <div
          className="car-track"
          style={{ transform: `translateX(-${current * 100}%)`, transition: 'transform 0.42s cubic-bezier(0.455, 0.03, 0.515, 0.955)' }}
        >
          {testimonials.map((t, i) => (
            <div key={i} className="car-slide" role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${testimonials.length}`}>
              <div className="tcard">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="tcard-avatar" src={t.avatar} alt={t.name} width={80} height={80} loading="lazy" />
                <div className="tcard-name">{t.name}</div>
                <div className="tcard-loc">{t.location}</div>
                <div className="tcard-stars" aria-label="5 stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
                <p className="tcard-quote">{t.quote}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 mt-9" role="group" aria-label="Controles del carrusel">
        <button
          className="car-btn"
          onClick={() => { stopAuto(); goTo(current - 1); startAuto() }}
          aria-label="Testimonio anterior"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="15,18 9,12 15,6" />
          </svg>
        </button>

        <div className="flex gap-2 items-center" role="tablist">
          {testimonials.map((_, i) => (
            <button
              key={i}
              className={`car-dot${i === current ? ' active' : ''}`}
              onClick={() => { stopAuto(); goTo(i); startAuto() }}
              aria-label={`Ir a diapositiva ${i + 1}`}
              aria-selected={i === current}
              role="tab"
            />
          ))}
        </div>

        <button
          className="car-btn"
          onClick={() => { stopAuto(); goTo(current + 1); startAuto() }}
          aria-label="Testimonio siguiente"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="9,18 15,12 9,6" />
          </svg>
        </button>
      </div>
    </>
  )
}
