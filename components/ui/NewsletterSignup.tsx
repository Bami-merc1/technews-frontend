'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { z } from 'zod'

type Mode = 'email' | 'whatsapp'

// ── Validation schemas ──────────────────────────────────────────
const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address')
  .max(254, 'Email is too long')
  .refine(val => !/<|>|script|javascript|on\w+=/i.test(val), {
    message: 'Invalid characters detected',
  })

const whatsappSchema = z
  .string()
  .min(7,  'Phone number is too short')
  .max(20, 'Phone number is too long')
  .refine(val => /^\+?[0-9\s\-()]+$/.test(val), {
    message: 'Please enter a valid phone number',
  })
  .transform(val => val.replace(/\s|-|\(|\)/g, ''))

function sanitize(input: string): string {
  return input
    .trim()
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;')
    .replace(/'/g,  '&#x27;')
    .replace(/\//g, '&#x2F;')
}

export default function NewsletterSignup() {
  const [mode, setMode]       = useState<Mode>('email')
  const [value, setValue]     = useState('')
  const [status, setStatus]   = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [fieldError, setFieldError] = useState('')

  function handleChange(val: string) {
    setValue(val)
    setFieldError('')
    setStatus('idle')
    setMessage('')
  }

  function validate(): string | null {
    try {
      if (mode === 'email') {
        emailSchema.parse(value)
      } else {
        whatsappSchema.parse(value)
      }
      return null
    } catch (err) {
      if (err instanceof z.ZodError) {
        return err.errors[0].message
      }
      return 'Invalid input'
    }
  }

  async function handleSubscribe() {
    // Validate first
    const validationError = validate()
    if (validationError) {
      setFieldError(validationError)
      return
    }

    setStatus('loading')

    try {
      // Sanitize before storing
      const sanitizedValue = sanitize(value.trim())

      const { error } = await supabase.from('subscribers').insert({
        [mode]: sanitizedValue,
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
            onClick={() => { setMode('email'); setValue(''); setStatus('idle'); setFieldError('') }}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all
              ${mode === 'email' ? 'bg-accent text-bg' : 'text-text-2 hover:text-text-1'}`}>
            📧 Email
          </button>
          <button
            onClick={() => { setMode('whatsapp'); setValue(''); setStatus('idle'); setFieldError('') }}
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
              placeholder={mode === 'email'
                ? 'Enter your email address'
                : 'Enter WhatsApp number e.g +2348012345678'
              }
              maxLength={mode === 'email' ? 254 : 20}
              autoComplete={mode === 'email' ? 'email' : 'tel'}
              className={`w-full bg-surface border rounded-xl px-4 py-3 text-text-1 placeholder-text-3 focus:outline-none transition-colors text-sm
                ${fieldError ? 'border-critical focus:border-critical' : 'border-border focus:border-accent'}`}
            />
            {fieldError && (
              <p className="text-critical text-xs mt-1 text-left">{fieldError}</p>
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
          <p className={`mt-3 text-sm ${status === 'success' ? 'text-live' : 'text-critical'}`}>
            {message}
          </p>
        )}

        {/* Privacy note */}
        <p className="text-text-3 text-xs mt-4">
          No spam. Unsubscribe anytime. Your data is never shared.
        </p>

      </div>
    </section>
  )
}