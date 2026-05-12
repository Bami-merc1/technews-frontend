'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import PipelineStatus from '@/components/admin/PipelineStatus'
import SystemMetrics from '@/components/admin/SystemMetrics'
import ArticleQueue from '@/components/admin/ArticleQueue'
import { z } from 'zod'

const ADMIN_PASSWORD = 'emercintel@God!sgr34t'

const ERROR_LOG = [
  { time: '09:12', level: 'WARN',  message: 'NewsAPI rate limit approaching — 850/1000 calls used' },
  { time: '08:47', level: 'INFO',  message: 'CVE database sync completed — 12 new entries fetched' },
  { time: '08:30', level: 'INFO',  message: 'AI summarization batch completed — 8 articles processed' },
  { time: '07:15', level: 'ERROR', message: 'GitHub API timeout — retried successfully after 3s' },
]

const SOURCES = [
  { name: 'NewsAPI',      calls: '850/1000' },
  { name: 'GitHub API',  calls: '120/5000' },
  { name: 'CVE Database', calls: 'Unlimited' },
  { name: 'RSS Feeds',   calls: '47 feeds' },
]

export default function AdminPage() {
  const router = useRouter()
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword]           = useState('')
  const [error, setError]                 = useState('')
  const [isRunning, setIsRunning]         = useState(true)
  const [articleCount, setArticleCount]   = useState(0)
  const [queuedArticles, setQueuedArticles] = useState<any[]>([])

  useEffect(() => {
    const auth = sessionStorage.getItem('admin_auth')
    if (auth === 'true') setAuthenticated(true)
  }, [])

  useEffect(() => {
    if (!authenticated) return
    fetchStats()
  }, [authenticated])

  async function fetchStats() {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const { count } = await supabase
      .from('articles')
      .select('*', { count: 'exact', head: true })
      .gte('published_at', today.toISOString())

    setArticleCount(count ?? 0)
  }

  // ── Password sanitization ────────────────────────────────────
  const PASSWORD_REGEX = {
    dangerous:  /[<>'"`;\\\/\x00-\x1f\x7f]/g,
    xss:        /(javascript:|data:|on\w+\s*=|<\s*script)/gi,
    maxLength:  100,
  }

  function sanitizePassword(raw: string): string {
    return raw
      .trim()
      .slice(0, PASSWORD_REGEX.maxLength)
      .replace(PASSWORD_REGEX.dangerous, '')
      .replace(PASSWORD_REGEX.xss, '')
  }

  function handleLogin() {
    const sanitized = sanitizePassword(password)

    if (!sanitized) {
      setError('Password cannot be empty')
      return
    }
    if (sanitized.length > 100) {
      setError('Password is too long')
      return
    }
    if (sanitized === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_auth', 'true')
      setAuthenticated(true)
      setError('')
    } else {
      setError('Incorrect password. Try again.')
    }
  }

  function handleLogout() {
    sessionStorage.removeItem('admin_auth')
    setAuthenticated(false)
    setPassword('')
  }

  async function handlePublish(id: string) {
    await supabase.from('articles').update({ published_at: new Date().toISOString() }).eq('id', id)
    setQueuedArticles(prev => prev.filter(a => a.id !== id))
  }

  async function handleReject(id: string) {
    await supabase.from('articles').delete().eq('id', id)
    setQueuedArticles(prev => prev.filter(a => a.id !== id))
  }

  async function handleForceSync() {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pipeline/trigger`, { method: 'POST' })
      alert('Pipeline sync triggered successfully!')
    } catch {
      alert('Failed to trigger pipeline. Check backend connection.')
    }
  }

  const systemMetrics = [
    { label: 'Articles published today', value: articleCount.toString(), trend: 'Live from database', positive: true },
    { label: 'API calls made',           value: '1,284',                 trend: '84% of daily limit',  positive: true },
    { label: 'System uptime',            value: '99.8%',                 trend: 'Last 30 days',         positive: true },
    { label: 'Avg. publish latency',     value: '1.4 min',               trend: 'AI processing time',   positive: true },
  ]

  // ── Login screen ──
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-4">
              <span className="text-accent text-xl">🔐</span>
            </div>
            <h1 className="font-display font-bold text-text-1 text-2xl mb-1">Admin Access</h1>
            <p className="text-text-3 text-sm">EMerc Intel — restricted area</p>
          </div>

          <div className="bg-surface border border-border rounded-2xl p-6">
            <div className="mb-4">
              <label className="text-text-2 text-sm mb-2 block">Password</label>
              <input
              type="password"
              value={password}
              onChange={e => setPassword(
                e.target.value
                  .slice(0, 100)
                  .replace(/[<>'"`;\\\/\x00-\x1f\x7f]/g, '')
              )}
              onPaste={e => {
                e.preventDefault()
                const pasted = e.clipboardData.getData('text')
                setPassword(
                  pasted
                    .slice(0, 100)
                    .replace(/[<>'"`;\\\/\x00-\x1f\x7f]/g, '')
                )
              }}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              placeholder="Enter admin password"
              maxLength={100}
              autoComplete="current-password"
              className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-text-1 placeholder-text-3 focus:outline-none focus:border-accent transition-colors"
              />
            </div>
            {error && <p className="text-critical text-xs mb-4">{error}</p>}
            <button
              onClick={handleLogin}
              className="w-full py-3 rounded-xl bg-accent text-bg font-medium hover:bg-accent/90 transition-all">
              Sign in
            </button>
          </div>

          <div className="text-center mt-6">
            <Link href="/" className="text-text-3 text-sm hover:text-accent transition-colors">
              ← Back to site
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // ── Admin dashboard ──
  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
          <div>
            <h1 className="font-display text-4xl font-bold text-text-1 mb-1">Admin Dashboard</h1>
            <p className="text-text-2">Pipeline control and content oversight</p>
          </div>
          <div className="flex gap-3">
            <Link href="/"
              className="px-4 py-2 rounded-lg border border-border text-text-2 text-sm hover:border-accent hover:text-accent transition-all">
              ← Back to site
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg border border-critical/30 text-critical text-sm hover:bg-critical/10 transition-all">
              Sign out
            </button>
          </div>
        </div>

        {/* ── Pipeline status ── */}
        <PipelineStatus
          isRunning={isRunning}
          lastPublished="3 minutes ago"
          nextPoll="4 minutes"
          onPause={() => setIsRunning(prev => !prev)}
          onForceSync={handleForceSync}
        />

        {/* ── System metrics ── */}
        <SystemMetrics metrics={systemMetrics} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

          {/* ── Article queue ── */}
          <ArticleQueue
            articles={queuedArticles}
            onPublish={handlePublish}
            onReject={handleReject}
          />

          {/* ── System log ── */}
          <div className="bg-surface border border-border rounded-2xl p-6">
            <div className="mb-6">
              <h2 className="font-display font-bold text-text-1 text-xl">System log</h2>
              <p className="text-text-3 text-xs mt-1">Recent pipeline events and errors</p>
            </div>
            <div className="flex flex-col gap-3 mb-6">
              {ERROR_LOG.map((log, i) => (
                <div key={i} className="flex items-start gap-3 bg-surface-2 border border-border rounded-xl p-4">
                  <span className="font-mono text-xs text-text-3 flex-shrink-0 mt-0.5">{log.time}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded flex-shrink-0 font-mono
                    ${log.level === 'ERROR' ? 'bg-critical/10 text-critical' :
                      log.level === 'WARN'  ? 'bg-high/10 text-high' :
                      'bg-live/10 text-live'}`}>
                    {log.level}
                  </span>
                  <p className="text-text-2 text-xs leading-relaxed">{log.message}</p>
                </div>
              ))}
            </div>

            {/* Sources monitored */}
            <div className="border-t border-border pt-4">
              <p className="text-text-3 text-xs uppercase tracking-wider mb-3">Sources monitored</p>
              <div className="grid grid-cols-2 gap-2">
                {SOURCES.map(src => (
                  <div key={src.name}
                    className="flex items-center justify-between bg-surface border border-border rounded-lg px-3 py-2">
                    <div>
                      <p className="text-text-1 text-xs font-medium">{src.name}</p>
                      <p className="text-text-3 text-xs">{src.calls}</p>
                    </div>
                    <span className="pulse-dot" style={{ width: '6px', height: '6px' }}></span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}