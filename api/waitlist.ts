import type { VercelRequest, VercelResponse } from '@vercel/node'

// In-memory rate limit — resets on cold start, good enough for serverless
const recentIPs = new Map<string, number>()
const RATE_LIMIT_MS = 60_000 // 1 submission per IP per minute

const KLAVIYO_API_BASE = 'https://a.klaviyo.com/api'
const KLAVIYO_REVISION  = '2024-10-15'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  // ── Rate limiting ──────────────────────────────────────────────────────────
  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ?? 'unknown'
  const lastReq = recentIPs.get(ip) ?? 0
  if (Date.now() - lastReq < RATE_LIMIT_MS) {
    return res.status(429).json({ message: 'Too many requests. Please wait a moment.' })
  }
  recentIPs.set(ip, Date.now())

  const { name, email, consent, website } = req.body ?? {}

  // ── Honeypot — silent pass for bots ───────────────────────────────────────
  if (website) {
    return res.status(200).json({ message: 'Joined successfully.' })
  }

  // ── Input validation ──────────────────────────────────────────────────────
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ message: 'A valid email address is required.' })
  }
  const normalizedEmail = email.trim().toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    return res.status(400).json({ message: 'Please enter a valid email address.' })
  }
  if (!consent) {
    return res.status(400).json({ message: 'Please accept the terms to join.' })
  }

  // ── Environment variables ─────────────────────────────────────────────────
  const KLAVIYO_PRIVATE_API_KEY  = process.env.KLAVIYO_PRIVATE_API_KEY
  const KLAVIYO_WAITLIST_LIST_ID = process.env.KLAVIYO_WAITLIST_LIST_ID

  if (!KLAVIYO_PRIVATE_API_KEY || !KLAVIYO_WAITLIST_LIST_ID) {
    console.error('[waitlist] Missing KLAVIYO_PRIVATE_API_KEY or KLAVIYO_WAITLIST_LIST_ID')
    return res.status(500).json({ message: 'Server configuration error. Please try again later.' })
  }

  const firstName = (name ?? '').toString().trim() || undefined

  // ── Klaviyo: subscribe profile to list ────────────────────────────────────
  // Uses profile-subscription-bulk-create-jobs which:
  //  • Creates the profile if new, merges if already exists
  //  • Respects single / double opt-in configured on the list
  //  • Records explicit marketing consent with a timestamp
  //  • Is idempotent — safe to call multiple times for the same email
  const payload = {
    data: {
      type: 'profile-subscription-bulk-create-job',
      attributes: {
        profiles: {
          data: [
            {
              type: 'profile',
              attributes: {
                email: normalizedEmail,
                ...(firstName ? { first_name: firstName } : {}),
                subscriptions: {
                  email: {
                    marketing: {
                      consent: 'SUBSCRIBED',
                      consented_at: new Date().toISOString(),
                    },
                  },
                },
              },
            },
          ],
        },
        historical_import: false,
      },
      relationships: {
        list: {
          data: {
            type: 'list',
            id: KLAVIYO_WAITLIST_LIST_ID,
          },
        },
      },
    },
  }

  try {
    const klaviyoRes = await fetch(
      `${KLAVIYO_API_BASE}/profile-subscription-bulk-create-jobs/`,
      {
        method: 'POST',
        headers: {
          Authorization:  `Klaviyo-API-Key ${KLAVIYO_PRIVATE_API_KEY}`,
          'Content-Type': 'application/json',
          Accept:         'application/json',
          revision:       KLAVIYO_REVISION,
        },
        body: JSON.stringify(payload),
      }
    )

    // Klaviyo returns 202 Accepted for a successfully queued async job
    if (klaviyoRes.status === 202 || klaviyoRes.status === 200) {
      return res.status(200).json({ message: 'Joined successfully.' })
    }

    // Surface structured errors for debugging without leaking internals
    const errBody = await klaviyoRes.json().catch(() => ({}))
    console.error('[waitlist] Klaviyo error', klaviyoRes.status, JSON.stringify(errBody))

    return res.status(500).json({ message: 'Failed to join. Please try again.' })
  } catch (err) {
    console.error('[waitlist] Fetch error', err)
    return res.status(500).json({ message: 'Network error. Please try again.' })
  }
}
