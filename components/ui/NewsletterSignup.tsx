'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

type Mode = 'email' | 'whatsapp'

// ── Regex patterns ──────────────────────────────────────────────
const REGEX = {
  // RFC 5321 compliant email — blocks injection characters
  email: /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/,

  // WhatsApp — digits, plus, spaces, hyphens, parentheses only
  whatsapp: /^\+?[0-9]{7,15}$/,

  // Dangerous characters to strip from any input
  dangerous: /[<>'"`;\\\/\x00-\x1f\x7f]/g,

  // SQL injection patterns
  sqlInjection: /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b|--|;|\/\*|\*\/)/gi,

  // XSS patterns
  xss: /(javascript:|data:|vbscript:|on\w+\s*=|<\s*script|<\s*img|<\s*svg|<\s*iframe)/gi,
}

// ── Sanitize raw input ──────────────────────────────────────────
function sanitizeInput(value: string): string {
  return value
    .trim()
    .slice(0, 300)                          // hard length cap
    .replace(REGEX.dangerous, '')           // strip dangerous chars
    .replace(REGEX.sqlInjection, '')        // strip SQL keywords
    .replace(REGEX.xss, '')                 // strip XSS patterns
    .replace(/&/g,  '&amp;')               // HTML encode
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;')
    .replace(/'/g,  '&#x27;')
}

// ── Validate after sanitization ─────────────────────────────────
function validateEmail(value: string): string | null {
  if (!value)                  return 'Email address is required'
  if (value.length > 254)      return 'Email address is too long'
  if (!REGEX.email.test(value)) return 'Please enter a valid email address'
  if (value.includes('..'))    return 'Email address contains consecutive dots'
  return null
}

function validateWhatsApp(value: string): string | null {
  // Strip formatting before validation
  const cleaned = value.replace(/[\s\-()]/g, '')
  if (!cleaned)                      return 'WhatsApp number is required'
  if (cleaned.length < 7)            return 'Phone number is too short'
  if (cleaned.length > 15)           return 'Phone number is too long'
  if (!REGEX.whatsapp.test(cleaned)) return 'Please enter a valid phone number (digits only)'
  return null
}

// ── Allowed characters per field ────────────────────────────────
function filterKeystroke(value: string, mode: Mode): string {
  if (mode === 'email') {
    // Allow only email-safe characters as the user types
    return value.replace(/[^a-zA-Z0-9._%+\-@]/g, '')
  }
  if (mode === 'whatsapp') {
    // Allow only phone-safe characters as the user types
    return value.replace(/[^0-9+\s\-()]/g, '')
  }
  return value
}

export default function NewsletterSignup() {
  const [mode, setMode]             = useState<Mode>('email')
  const [value, setValue]           = useState('')
  const [status, setStatus]         = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage]       = useState('')
  const [fieldError, setFieldError] = useState('')

  function handleChange(raw: string) {
    // Filter invalid characters in real time as the user types
    const filtered = filterKeystroke(raw, mode)
    setValue(filtered)
    setFieldError('')
    setStatus('idle')
    setMessage('')
  }

  function handleModeSwitch(newMode: Mode) {
    setMode(newMode)
    setValue('')
    setFieldError('')
    setStatus('idle')
    setMessage('')
  }

  function validate(): string | null {
    const sanitized = sanitizeInput(value)
    if (mode === 'email')     return validateEmail(sanitized)
    if (mode === 'whatsapp')  return validateWhatsApp(sanitized)
    return null
  }

  async function handleSubscribe() {
    // Client-side validation
    const validationError = validate()
    if (validationError) {
      setFieldError(validationError)
      return
    }

    setStatus('loading')

    try {
      // Final sanitization before any database operation
      const sanitizedValue = sanitizeInput(value)

      // Additional server-side format check before Supabase insert
      if (mode === 'email' && !REGEX.email.test(sanitizedValue)) {
        setFieldError('Invalid email format detected after sanitization')
        setStatus('error')
        return
      }

      const cleaned = mode === 'whatsapp'
        ? sanitizedValue.replace(/[\s\-()]/g, '')
        : sanitizedValue

      const { error } = await supabase.from('subscribers').insert({
        [mode]: cleaned,
        type:   mode,
      })

      if (error) {
        if (error.code === '23505') {
          setMessage('You are already subscribed!')
          setStatus('error')
        } else {
          throw error
        }
      } else {
        setMessage(`Successfully subscribed via ${mode === 'email' ? 'email' : 'WhatsApp'}! 🎉`)
        setStatus('success')
        setValue('')
      }
    } catch {
      setMessage('Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  return (
    <section className="bg-surface-2 border border-border rounded-2xl p-8 my-12">
      <div className="max-w-xl mx-auto text-center">

        {/* Header */}
        <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-4">
          <span className="text-xl">📬</span>
        </div>
        <h2 className="font-display font-bold text-text-1 text-2xl mb-2">
          Stay ahead of every threat
        </h2>
        <p className="text-text-2 text-sm mb-6 leading-relaxed">
          Get notified instantly when new cybersecurity threats, data breaches
          or major tech news drops — directly to your email or WhatsApp.
        </p>

        {/* Mode toggle */}
        <div className="flex items-center justify-center gap-2 p-1 bg-surface rounded-xl border border-border mb-6 w-fit mx-auto">
          <button
            onClick={() => handleModeSwitch('email')}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all
              ${mode === 'email' ? 'bg-accent text-bg' : 'text-text-2 hover:text-text-1'}`}>
            📧 Email
          </button>
          <button
            onClick={() => handleModeSwitch('whatsapp')}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all
              ${mode === 'whatsapp' ? 'bg-accent text-bg' : 'text-text-2 hover:text-text-1'}`}>
            💬 WhatsApp
          </button>
        </div>

        {/* Input */}
        <div className="flex gap-3 flex-col sm:flex-row">
          <div className="flex-1">
            <input
              type={mode === 'email' ? 'email' : 'tel'}
              value={value}
              onChange={e => handleChange(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubscribe()}
              onPaste={e => {
                // Sanitize pasted content
                e.preventDefault()
                const pasted = e.clipboardData.getData('text')
                handleChange(pasted)
              }}
              placeholder={mode === 'email'
                ? 'Enter your email address'
                : 'Enter WhatsApp number e.g +2348012345678'
              }
              maxLength={mode === 'email' ? 254 : 20}
              autoComplete={mode === 'email' ? 'email' : 'tel'}
              spellCheck={false}
              autoCorrect="off"
              autoCapitalize="off"
              className={`w-full bg-surface border rounded-xl px-4 py-3 text-text-1 placeholder-text-3 focus:outline-none transition-colors text-sm
                ${fieldError
                  ? 'border-critical focus:border-critical'
                  : 'border-border focus:border-accent'
                }`}
            />
            {fieldError && (
              <p className="text-critical text-xs mt-1.5 text-left flex items-center gap-1">
                <span>⚠</span> {fieldError}
              </p>
            )}
          </div>
          <button
            onClick={handleSubscribe}
            disabled={status === 'loading' || !value.trim()}
            className="px-6 py-3 rounded-xl bg-accent text-bg font-medium text-sm hover:bg-accent/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap">
            {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
          </button>
        </div>

        {/* Status message */}
        {message && (
          <p className={`mt-3 text-sm font-medium ${status === 'success' ? 'text-live' : 'text-critical'}`}>
            {message}
          </p>
        )}

        {/* Privacy note */}
        <p className="text-text-3 text-xs mt-4">
          No spam. Unsubscribe anytime. Your data is never shared or sold.
        </p>

      </div>
    </section>
  )
}