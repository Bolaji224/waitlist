import WaitlistForm from './WaitlistForm'

// ─── Flag emojis for notification cards ──────────────────────────────────────
const FLAG_CA = '🇨🇦'
const FLAG_FR = '🇫🇷'
const FLAG_US = '🇺🇸'
const FLAG_WA = '📱'

// ─── Floating notification cards ─────────────────────────────────────────────
function NotifCard({
  flag, title, subtitle, style, animClass,
}: {
  flag: string
  title: string
  subtitle: string
  style?: React.CSSProperties
  animClass: string
}) {
  return (
    <div
      className="notif-card"
      style={{
        position: 'absolute',
        ...style,
        animation: `${animClass} 6s ease-in-out infinite`,
      }}
    >
      <span style={{ fontSize: 22, lineHeight: 1, flexShrink: 0 }}>{flag}</span>
      <div>
        <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.55)', margin: 0 }}>{title}</p>
        <p style={{ fontSize: 12, fontWeight: 700, color: '#F0F7F2', margin: 0 }}>{subtitle}</p>
      </div>
      <span style={{
        width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
        background: 'rgba(74,222,128,0.18)', border: '1px solid rgba(74,222,128,0.35)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 4,
      }}>
        <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
          <path d="M1.5 4.5L3.5 6.5L7.5 2.5" stroke="#4ADE80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </div>
  )
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  return (
    <nav style={{
      position: 'absolute', top: 0, left: 0, right: 0, zIndex: 50,
      padding: '0 40px',
      height: 72,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      {/* Logo */}
      <img src="/logo.png" alt="TurboStore" style={{ height: 36, objectFit: 'contain' }} />

      {/* Coming soon pill */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '8px 20px', borderRadius: 999,
        background: 'rgba(10,26,14,0.7)',
        border: '1px solid rgba(74,222,128,0.25)',
        backdropFilter: 'blur(12px)',
      }}>
        <span style={{
          width: 8, height: 8, borderRadius: '50%', background: '#4ADE80',
          animation: 'pulseDot 2s ease-in-out infinite',
          boxShadow: '0 0 8px #4ADE80',
          flexShrink: 0,
        }} />
        <span style={{ fontSize: 13, fontWeight: 700, color: '#F0F7F2', letterSpacing: '0.04em' }}>
          COMING SOON
        </span>
      </div>

    </nav>
  )
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section style={{
      maxWidth: 1280,
      margin: '0 auto',
      padding: '88px 40px 40px',
      display: 'grid',
      gridTemplateColumns: '1fr 460px',
      gap: 48,
      alignItems: 'center',
      position: 'relative',
      zIndex: 10,
      minHeight: '100vh',
    }} className="hero-grid">

      {/* ── Left column ────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Eyebrow tag */}
        <p className="fade-up-1" style={{
          fontSize: 11, fontWeight: 700, letterSpacing: '0.16em',
          color: '#4ADE80', textTransform: 'uppercase', margin: 0,
        }}>
          Digital Services &nbsp;•&nbsp; Virtual Numbers &nbsp;•&nbsp; More Soon
        </p>

        {/* H1 */}
        <div className="fade-up-2">
          <h1 style={{
            fontSize: 'clamp(40px, 5vw, 62px)',
            fontWeight: 900, lineHeight: 1.06,
            letterSpacing: '-0.03em', color: '#F8FAF8', margin: 0,
          }}>
            Your next digital<br />
            <span className="gradient-text">essentials destination.</span>
          </h1>
        </div>

        {/* Subtext */}
        <p className="fade-up-3" style={{
          fontSize: 15, lineHeight: 1.7,
          color: 'rgba(255,255,255,0.48)', maxWidth: 460, margin: 0,
        }}>
          TurboStore is building a simpler way to access virtual numbers and
          useful digital services, with more ways to connect and pay planned
          for the future.
        </p>

        {/* Phone mockup + floating cards */}
        <div className="fade-up-4" style={{
          position: 'relative',
          width: '100%',
          height: 420,
          marginTop: 16,
        }}>

          {/* Phone image — centered in the container */}
          <img
            src="/phone.png"
            alt="TurboStore app"
            style={{
              position: 'absolute',
              bottom: 0,
              left: '30%',
              transform: 'translateX(-50%)',
              height: 420,
              width: 'auto',
              maxWidth: '70%',
              objectFit: 'contain',
              filter: 'drop-shadow(0 24px 60px rgba(0,0,0,0.85)) drop-shadow(0 0 50px rgba(22,163,74,0.3))',
              animation: 'floatUp 6s ease-in-out infinite',
              zIndex: 2,
            }}
          />

          {/* Canada card — left, vertically 30% */}
          <NotifCard
            flag={FLAG_CA}
            title="Your Canada Phone Number is"
            subtitle="+1361277150789"
            animClass="floatCard1"
            style={{ top: '28%', left: 0, zIndex: 5 }}
          />

          {/* WhatsApp card — right, vertically 22% */}
          <NotifCard
            flag={FLAG_WA}
            title="Your Whatsapp verification code is"
            subtitle="12445"
            animClass="floatCard2"
            style={{ top: '18%', right: 0, zIndex: 5 }}
          />

          {/* France card — left, vertically 62% */}
          <NotifCard
            flag={FLAG_FR}
            title="Your France Phone Number is"
            subtitle="+13314425678"
            animClass="floatCard3"
            style={{ top: '60%', left: 0, zIndex: 5 }}
          />

          {/* USA card — right, vertically 62% */}
          <NotifCard
            flag={FLAG_US}
            title="Your USA Phone Number is"
            subtitle="+16612345678"
            animClass="floatCard4"
            style={{ top: '60%', right: 0, zIndex: 5 }}
          />
        </div>
      </div>

      {/* ── Right column: form card ─────────────────────── */}
      <div id="waitlist" className="fade-up-3" style={{ position: 'relative', zIndex: 20, alignSelf: 'center' }}>
        <div style={{
          background: 'rgba(6,16,10,0.75)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          border: '1px solid rgba(74,222,128,0.15)',
          borderRadius: 24,
          padding: '40px 36px',
          boxShadow: '0 24px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Inner corner glow */}
          <div style={{
            position: 'absolute', top: -60, right: -60,
            width: 200, height: 200, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(22,163,74,0.15) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          {/* Card header */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <span style={{
                fontSize: 10, fontWeight: 700, letterSpacing: '0.16em',
                color: '#4ADE80', textTransform: 'uppercase',
              }}>
                Early Access
              </span>
              <span style={{ flex: 1, height: 1, background: 'rgba(74,222,128,0.25)' }} />
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.04em' }}>
                Limited spots
              </span>
            </div>
            <h2 style={{
              fontSize: 30, fontWeight: 800, color: '#F8FAF8',
              letterSpacing: '-0.025em', margin: '0 0 8px', lineHeight: 1.15,
            }}>
              Join the Waitlist
            </h2>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, margin: 0 }}>
              Be first to know when we launch. No spam, ever.
            </p>
          </div>

          <WaitlistForm />
        </div>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{
      position: 'relative', zIndex: 10,
      borderTop: '1px solid rgba(255,255,255,0.06)',
      padding: '22px 40px',
    }}>
      <div style={{
        maxWidth: 1280, margin: '0 auto',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
      }}>
        {/* Logo */}
        <img src="/logo.png" alt="TurboStore" style={{ height: 28, objectFit: 'contain' }} />

        {/* Copyright */}
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', margin: 0 }}>
          &copy; {new Date().getFullYear()} TurboStore. All rights reserved.
        </p>

        {/* Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <a href="#" style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={e => ((e.target as HTMLAnchorElement).style.color = '#4ADE80')}
            onMouseLeave={e => ((e.target as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.3)')}>
            Privacy Policy
          </a>
          <span style={{ width: 1, height: 12, background: 'rgba(255,255,255,0.12)' }} />
          <a href="mailto:hello@turbostore.com" style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={e => ((e.target as HTMLAnchorElement).style.color = '#4ADE80')}
            onMouseLeave={e => ((e.target as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.3)')}>
            hello@turbostore.com
          </a>
        </div>
      </div>
    </footer>
  )
}

// ─── LandingPage ──────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden', background: '#060E08' }}>

      {/* Wave background image — anchored to bottom */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
      }}>
        <img
          src="/bg-wave.jpg"
          alt=""
          style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            width: '100%', height: '60%',
            objectFit: 'cover', objectPosition: 'top center',
            opacity: 0.85,
          }}
        />
        {/* Fade top of the wave so it blends into dark bg */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '62%',
          background: 'linear-gradient(to bottom, #060E08 0%, transparent 30%)',
        }} />
      </div>

      <Navbar />
      <main style={{ position: 'relative', zIndex: 10 }}>
        <HeroSection />
      </main>
      <Footer />

      <style>{`
        @media (max-width: 960px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            padding: 100px 24px 60px !important;
            gap: 48px !important;
            min-height: auto !important;
          }
        }
        @media (max-width: 640px) {
          nav { padding: 0 20px !important; }
          footer { padding: 20px !important; }
        }
      `}</style>
    </div>
  )
}
