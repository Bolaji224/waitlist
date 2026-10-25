import { useState, type FormEvent } from 'react'
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react'

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function WaitlistForm() {
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [consent, setConsent]   = useState(false)
  const [status, setStatus]     = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setErrorMsg('')
    if (honeypot) { setStatus('success'); return }
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setErrorMsg('Please enter a valid email address.')
      setStatus('error')
      return
    }
    if (!consent) {
      setErrorMsg('Please accept the terms to continue.')
      setStatus('error')
      return
    }
    setStatus('loading')
    try {
      const res  = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, consent, website: honeypot }),
      })
      const data = await res.json()
      if (res.ok) setStatus('success')
      else { setErrorMsg(data.message || 'Something went wrong.'); setStatus('error') }
    } catch {
      setErrorMsg('Network error. Please try again.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '28px 0', textAlign: 'center' }}>
        <div style={{
          width: 68, height: 68, borderRadius: '50%',
          background: 'rgba(74,222,128,0.12)',
          border: '1.5px solid rgba(74,222,128,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 32px rgba(74,222,128,0.15)',
        }}>
          <CheckCircle2 size={32} color="#4ADE80" />
        </div>
        <div>
          <p style={{ fontSize: 20, fontWeight: 800, color: '#F8FAF8', marginBottom: 6, letterSpacing: '-0.02em' }}>
            You&apos;re on the list!
          </p>
          <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.42)', lineHeight: 1.6, margin: 0 }}>
            We&apos;ll reach out when TurboStore launches.<br />Keep an eye on your inbox.
          </p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Honeypot */}
      <input type="text" name="website" value={honeypot} onChange={e => setHoneypot(e.target.value)}
        tabIndex={-1} autoComplete="off" style={{ display: 'none' }} aria-hidden="true" />

      {/* Name */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        <label htmlFor="wl-name" style={{
          fontSize: 10, fontWeight: 700, letterSpacing: '0.14em',
          color: 'rgba(255,255,255,0.38)', textTransform: 'uppercase',
        }}>
          First Name
        </label>
        <input
          id="wl-name" type="text" className="input-field"
          value={name} onChange={e => setName(e.target.value)}
          placeholder="Your first name (optional)"
          autoComplete="given-name"
        />
      </div>

      {/* Email */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        <label htmlFor="wl-email" style={{
          fontSize: 10, fontWeight: 700, letterSpacing: '0.14em',
          color: 'rgba(255,255,255,0.38)', textTransform: 'uppercase',
        }}>
          Email Address <span style={{ color: '#4ADE80' }}>*</span>
        </label>
        <input
          id="wl-email" type="email" required className="input-field"
          value={email} onChange={e => setEmail(e.target.value)}
          placeholder="Enter your email address"
          autoComplete="email"
          style={status === 'error' && !email.trim() ? { borderColor: 'rgba(239,68,68,0.5)' } as React.CSSProperties : undefined}
        />
      </div>

      {/* Consent */}
      <label style={{
        display: 'flex', alignItems: 'flex-start', gap: 10,
        cursor: 'pointer', padding: '10px 12px', borderRadius: 10,
        background: consent ? 'rgba(74,222,128,0.05)' : 'rgba(255,255,255,0.02)',
        border: `1px solid ${consent ? 'rgba(74,222,128,0.2)' : 'rgba(255,255,255,0.07)'}`,
        transition: 'all 0.2s',
      }}>
        <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)}
          style={{ width: 15, height: 15, flexShrink: 0, marginTop: 1, accentColor: '#4ADE80', cursor: 'pointer' }} />
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.42)', lineHeight: 1.55 }}>
          I agree to receive TurboStore launch updates and early-access news.{' '}
          <a href="#" style={{ color: '#4ADE80', textDecoration: 'none' }}>Privacy Policy</a>.
        </span>
      </label>

      {/* Error */}
      {status === 'error' && errorMsg && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 10,
          background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)',
        }}>
          <AlertCircle size={13} color="#F87171" />
          <span style={{ fontSize: 12.5, color: '#F87171', flex: 1 }}>{errorMsg}</span>
          <button type="button" onClick={() => { setStatus('idle'); setErrorMsg('') }}
            style={{ fontSize: 11, color: 'rgba(248,113,113,0.6)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
            Dismiss
          </button>
        </div>
      )}

      {/* Submit */}
      <button type="submit" disabled={status === 'loading'} className="btn-primary" style={{ marginTop: 4 }}>
        {status === 'loading' ? (
          <>
            <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />
            Joining…
          </>
        ) : (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
            Join the Waitlist
            <span style={{ marginLeft: 2 }}>→</span>
          </>
        )}
      </button>
    </form>
  )
}
