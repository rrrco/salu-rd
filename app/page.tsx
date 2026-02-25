import TestimonialsCarousel from './components/TestimonialsCarousel'
import ContactForm from './components/ContactForm'
import { client } from './lib/sanity'
import { productsQuery } from './lib/queries'

type SanityProduct = {
  _id: string
  name: string
  slug?: { current: string }
  iconKey?: string
  imageUrl?: string
}

const ICONS: Record<string, React.JSX.Element> = {
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

const purposes = [
  {
    title: 'Satisfacción del Cliente',
    description: 'La satisfacción de cada cliente es nuestra prioridad número uno. Trabajamos de cerca con clínicas, hospitales y distribuidores para entender sus necesidades y superar sus expectativas en cada interacción.',
    icon: (
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polygon points="28,6 48,22 42,50 14,50 8,22" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.90)" strokeWidth="2.2" strokeLinejoin="round" />
        <line x1="8" y1="22" x2="48" y2="22" stroke="rgba(255,255,255,0.60)" strokeWidth="1.5" />
        <polyline points="18,22 28,6 38,22" stroke="rgba(255,255,255,0.60)" strokeWidth="1.5" fill="none" />
        <polyline points="14,50 28,22 42,50" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" fill="none" />
      </svg>
    ),
  },
  {
    title: 'Entregas Rápidas y Confiables',
    description: 'Ofrecemos el mejor servicio del mercado gracias a entregas rápidas y puntuales. Nuestra cadena logística garantiza que los productos lleguen cuando los necesitas, sin retrasos ni complicaciones.',
    icon: (
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polygon points="28,6 50,18 50,38 28,50 6,38 6,18" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.90)" strokeWidth="2.2" strokeLinejoin="round" />
        <line x1="6" y1="18" x2="28" y2="28" stroke="rgba(255,255,255,0.60)" strokeWidth="1.5" />
        <line x1="50" y1="18" x2="28" y2="28" stroke="rgba(255,255,255,0.60)" strokeWidth="1.5" />
        <line x1="28" y1="28" x2="28" y2="50" stroke="rgba(255,255,255,0.60)" strokeWidth="1.5" />
        <line x1="6" y1="18" x2="28" y2="6" stroke="rgba(255,255,255,0.40)" strokeWidth="1.2" />
        <line x1="50" y1="18" x2="28" y2="6" stroke="rgba(255,255,255,0.40)" strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    title: 'Apoyo Científico',
    description: 'Nuestro equipo de veterinarios y farmacólogos matriculados brinda orientación técnica para ayudarte a seleccionar los productos, dosis y protocolos de tratamiento adecuados para cada escenario clínico.',
    icon: (
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polygon points="28,4 34,22 52,22 38,33 43,51 28,40 13,51 18,33 4,22 22,22" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.90)" strokeWidth="2" strokeLinejoin="round" />
        <circle cx="28" cy="28" r="8" fill="rgba(255,255,255,0.10)" stroke="rgba(255,255,255,0.60)" strokeWidth="1.5" />
      </svg>
    ),
  },
]

export default async function Home() {
  const products: SanityProduct[] = await client.fetch(productsQuery)

  return (
    <>
      {/* ── 1. HERO ── */}
      <section
        id="hero"
        style={{
          minHeight: '55vh',
          background: 'linear-gradient(155deg, #082E32 0%, #0A5C66 40%, #18909E 80%, #2AACB8 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '60px 20px 72px',
        }}
      >
        <div className="hero-logo" style={{ display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '28px' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/salu-img.png" width={80} height={90} alt="SALU animal logo" style={{ filter: 'brightness(0) invert(1)', flexShrink: 0 }} />
          <div className="logo-wordmark" style={{ textAlign: 'left' }}>
            <div className="logo-name" style={{ fontSize: '40px', fontWeight: 700, color: '#fff', lineHeight: 1, letterSpacing: '-1px' }}>SALU</div>
            <div className="logo-sub" style={{ fontSize: '15px', fontWeight: 400, fontStyle: 'italic', color: 'rgba(255,255,255,0.82)', marginTop: '4px', letterSpacing: '0.3px' }}>División Veterinaria</div>
          </div>
        </div>

        <p className="hero-sub" style={{ fontSize: '15px', fontWeight: 500, fontStyle: 'italic', color: 'rgba(255,255,255,0.85)', marginBottom: '16px' }}>
          Tu socio de confianza en salud animal
        </p>
        <h1 className="hero-h1" style={{ fontSize: '36px', fontWeight: 700, fontStyle: 'italic', color: '#fff', lineHeight: 1.14, maxWidth: '860px', marginBottom: '22px', letterSpacing: '-0.5px' }}>
          Productos y medicamentos veterinarios premium para cada práctica
        </h1>
        <p className="hero-desc" style={{ fontSize: '15px', color: 'rgba(255,255,255,0.88)', maxWidth: '720px', lineHeight: '1.75', marginBottom: '36px' }}>
          SALU División Veterinaria provee productos farmacéuticos certificados, biológicos y consumibles veterinarios a clínicas, hospitales y distribuidores en toda América Latina. Abastecimiento de calidad. Entrega confiable. Respaldo científico.
        </p>
        <a href="#products" className="btn btn-lg">VER TODOS LOS PRODUCTOS</a>
      </section>

      {/* ── STATS BAR ── */}
      <div className="stats-bar" role="region" aria-label="Estadísticas de la empresa">
        {[
          { num: '10+', lbl: 'Años de experiencia' },
          { num: '200+', lbl: 'Productos en catálogo' },
          { num: '500+', lbl: 'Clientes atendidos' },
        ].map((s, i) => (
          <div key={i} className="stat-item">
            <div className="stat-num">{s.num}</div>
            <div className="stat-lbl">{s.lbl}</div>
          </div>
        ))}
      </div>

      {/* ── 2. CONTACT ── */}
      <section id="contact" style={{ background: '#fff', padding: '72px 30px' }}>
        <div className="wrap">
          <div className="contact-grid">
            {/* Left: Info */}
            <div className="contact-left">
              <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#222222', marginBottom: '36px' }}>Respuesta rápida</h2>

              {[
                {
                  label: 'Correo Electrónico', value: 'salusrldv@gmail.com',
                  svg: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>,
                },
                {
                  label: 'WhatsApp', value: '+1 809 442 0017',
                  svg: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" /></svg>,
                },
              ].map((item, i) => (
                <div key={i} className="cinfo">
                  <div className="cinfo-icon" aria-hidden="true">{item.svg}</div>
                  <div>
                    <div className="cinfo-label">{item.label}</div>
                    <div className="cinfo-value">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right: Form */}
            <ContactForm />
          </div>
        </div>
      </section>

      {/* ── 3. PRODUCTS ── */}
      <section id="products" style={{ background: '#0A6973', padding: '60px 30px' }}>
        <div className="wrap">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h2 className="sec-title white">Productos más vendidos</h2>
              <div className="sec-divider white" />
            </div>
          </div>

          <div className="prod-grid">
            {products.map((p) => (
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
                  <a href="#contact" className="btn">COTIZACIÓN GRATIS</a>
                </div>
              </article>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <a href="#contact" className="btn btn-lg">VER CATÁLOGO COMPLETO</a>
          </div>
        </div>
      </section>

      {/* ── 4. PURPOSE ── */}
      <section id="purpose" style={{ background: '#fff', padding: '72px 30px' }}>
        <div className="wrap">
          <h2 className="sec-title">Nuestro Propósito</h2>
          <div className="sec-divider" />

          <div className="purpose-grid">
            {purposes.map((p, i) => (
              <div key={i} className="pur-card">
                <div className="pur-icon" aria-hidden="true">{p.icon}</div>
                <h3>{p.title}</h3>
                <p>{p.description}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <a href="#contact" className="btn btn-lg">OBTENER COTIZACIÓN GRATIS</a>
          </div>
        </div>
      </section>

      {/* ── 5. ANIMAL ── */}
      <section id="animal" style={{ background: '#EBF8F9', overflow: 'hidden' }}>
        <div className="animal-grid">
          <div className="animal-left" style={{ paddingBottom: '72px' }}>
            <h2 style={{ fontSize: '26px', fontWeight: 700, color: '#222222', lineHeight: 1.25, marginBottom: '20px' }}>
              Soluciones completas para la salud animal
            </h2>
            <p style={{ fontSize: '14px', color: '#3D3D3D', lineHeight: '1.78', marginBottom: '30px' }}>
              SALU División Veterinaria fue fundada para atender las crecientes necesidades de los profesionales veterinarios en América Latina. Ofrecemos un catálogo curado de medicamentos y suministros médicos certificados y probados — desde antibióticos y antiparasitarios hasta biológicos y consumibles quirúrgicos — todo a precios competitivos con respaldo técnico completo.
            </p>
            <a href="#contact" className="btn btn-lg">Obtener Cotización</a>
          </div>
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="animal-img"
              src="https://www.sh-vet.com/wp-content/uploads/2021/11/newsletter_dog_optimized.webp"
              alt="Healthy dog — SALU veterinary solutions"
              width={520}
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* ── 6. TESTIMONIALS ── */}
      <section id="testimonials" style={{ background: '#fff', padding: '72px 30px' }}>
        <div className="wrap">
          <h2 className="sec-title">Lo que dicen nuestros socios veterinarios</h2>
          <div className="sec-divider" />
          <TestimonialsCarousel />
        </div>
      </section>

      {/* ── 7. CTA ── */}
      <section id="cta" style={{ background: 'linear-gradient(135deg, #062428 0%, #0A4D55 50%, #0E7A86 100%)', padding: '72px 30px' }}>
        <div style={{ maxWidth: '1290px', margin: '0 auto', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ marginBottom: '28px' }} aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/salu-img.png" width={60} height={68} alt="" style={{ filter: 'brightness(0) invert(1)', opacity: 0.55 }} />
          </div>
          <h2 className="cta-inner" style={{ fontSize: '30px', fontWeight: 700, color: '#fff', maxWidth: '660px', lineHeight: 1.25, marginBottom: '36px', textAlign: 'center' }}>
            ¿Listo para abastecer tu práctica con productos veterinarios premium?<br />Asóciate con SALU hoy.
          </h2>
          <a href="#contact" className="btn btn-lg">OBTENER COTIZACIÓN</a>
        </div>
      </section>

      {/* ── WHATSAPP FAB ── */}
      <a
        href="https://wa.me/18094420017"
        className="wa-fab"
        aria-label="Contáctanos por WhatsApp"
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg width="30" height="30" viewBox="0 0 24 24" fill="#fff" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.464 3.488" />
        </svg>
      </a>
    </>
  )
}
