import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Resend } from 'resend'

// Simple in-memory rate limit (resets on cold start — good enough for serverless)
const recentIPs = new Map<string, number>()
const RATE_LIMIT_MS = 60_000 // 1 per minute per IP

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  // Rate limiting
  const ip =
    (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || 'unknown'
  const lastReq = recentIPs.get(ip) || 0
  if (Date.now() - lastReq < RATE_LIMIT_MS) {
    return res.status(429).json({ message: 'Too many requests. Please wait a moment.' })
  }
  recentIPs.set(ip, Date.now())

  const { name, email, consent, website } = req.body ?? {}

  // Honeypot check (silently pass bots)
  if (website) {
    return res.status(200).json({ message: 'Joined successfully.' })
  }

  // Validate
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ message: 'A valid email address is required.' })
  }
  const normalizedEmail = email.trim().toLowerCase()
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(normalizedEmail)) {
    return res.status(400).json({ message: 'Please enter a valid email address.' })
  }
  if (!consent) {
    return res.status(400).json({ message: 'Please accept the terms to join.' })
  }

  // Check required env vars
  const RESEND_API_KEY = process.env.RESEND_API_KEY
  const NOTIFY_EMAIL = process.env.WAITLIST_NOTIFY_EMAIL
  const FROM_EMAIL = process.env.WAITLIST_FROM_EMAIL || 'onboarding@resend.dev'

  if (!RESEND_API_KEY || !NOTIFY_EMAIL) {
    console.error('Missing RESEND_API_KEY or WAITLIST_NOTIFY_EMAIL')
    // Still return success to user — don't expose config errors
    return res.status(200).json({ message: 'Joined successfully.' })
  }

  const resend = new Resend(RESEND_API_KEY)

  // Optional: Resend Audience deduplication
  const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID

  try {
    // Add to Resend audience if configured (handles duplicates via Resend)
    if (AUDIENCE_ID) {
      await resend.contacts
        .create({
          email: normalizedEmail,
          firstName: (name || '').trim() || undefined,
          unsubscribed: false,
          audienceId: AUDIENCE_ID,
        })
        .catch(() => {}) // Don't fail if contact already exists
    }

    // Send notification to owner
    await resend.emails.send({
      from: FROM_EMAIL,
      to: NOTIFY_EMAIL,
      subject: 'New TurboStore Waitlist Signup',
      html: `
        <div style="font-family:Inter,system-ui,sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;background:#060D09;color:#F8FAF8;border-radius:12px">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:28px">
            <div style="width:36px;height:36px;background:#16A34A;border-radius:8px;display:flex;align-items:center;justify-content:center">
              <span style="color:#4ADE80;font-size:18px;font-weight:900">&#x26A1;</span>
            </div>
            <span style="font-size:18px;font-weight:800;color:#F8FAF8">TurboStore</span>
          </div>
          <h2 style="font-size:22px;font-weight:700;margin:0 0 20px;color:#4ADE80">New Waitlist Signup</h2>
          <table style="width:100%;border-collapse:collapse">
            <tr>
              <td style="padding:10px 0;color:rgba(255,255,255,0.5);font-size:13px;border-bottom:1px solid rgba(255,255,255,0.06)">Email</td>
              <td style="padding:10px 0;font-size:14px;font-weight:600;color:#F8FAF8">${normalizedEmail}</td>
            </tr>
            ${
              name
                ? `<tr>
              <td style="padding:10px 0;color:rgba(255,255,255,0.5);font-size:13px;border-bottom:1px solid rgba(255,255,255,0.06)">Name</td>
              <td style="padding:10px 0;font-size:14px;font-weight:600;color:#F8FAF8">${String(name).trim()}</td>
            </tr>`
                : ''
            }
            <tr>
              <td style="padding:10px 0;color:rgba(255,255,255,0.5);font-size:13px;border-bottom:1px solid rgba(255,255,255,0.06)">Date</td>
              <td style="padding:10px 0;font-size:14px;color:#F8FAF8">${new Date().toUTCString()}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;color:rgba(255,255,255,0.5);font-size:13px">Consent</td>
              <td style="padding:10px 0;font-size:14px;color:#4ADE80">&#x2713; Given</td>
            </tr>
          </table>
        </div>
      `,
      text: `New TurboStore Waitlist Signup\n\nEmail: ${normalizedEmail}\n${name ? `Name: ${String(name).trim()}\n` : ''}Date: ${new Date().toUTCString()}\nConsent: Given`,
    })

    return res.status(200).json({ message: 'Joined successfully.' })
  } catch (err) {
    console.error('Waitlist handler error:', err)
    return res.status(500).json({ message: 'Failed to join. Please try again.' })
  }
}
