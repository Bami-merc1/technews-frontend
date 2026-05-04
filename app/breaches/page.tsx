'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Article } from '@/lib/types'
import NewsCard from '@/components/ui/NewsCard'

const BREACH_FILTERS = [
  { label: 'All incidents',    value: 'all' },
  { label: 'Data breaches',    value: 'breach' },
  { label: 'Ransomware',       value: 'ransomware' },
  { label: 'CVEs',             value: 'cve' },
  { label: 'Zero-days',        value: 'zero-day' },
  { label: 'Africa & Nigeria', value: 'africa' },
]

const FILTER_KEYWORDS: Record<string, string[]> = {
  'breach':     ['breach', 'leaked', 'exposed', 'stolen', 'compromised', 'remita', 'unilag', 'inec', 'cac'],
  'ransomware': ['ransomware', 'ransom', 'encrypted', 'lockbit', 'blackcat'],
  'cve':        ['cve-', 'vulnerability', 'patch', 'exploit', 'rce', 'xss', 'sql injection'],
  'zero-day':   ['zero-day', '0-day', 'zero day', 'actively exploited', 'in the wild'],
  'africa':     ['nigeria', 'africa', 'african', 'naija', 'lagos', 'abuja', 'kenya', 'ghana', 'south africa'],
}

export default function BreachesPage() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [allArticles, setAllArticles]   = useState<Article[]>([])
  const [loading, setLoading]           = useState(true)

  useEffect(() => {
    async function fetchArticles() {
      setLoading(true)
      const { data } = await supabase
        .from('articles')
        .select('*')
        .eq('category', 'Cybersecurity')
        .order('published_at', { ascending: false })
        .limit(50)
      setAllArticles(data ?? [])
      setLoading(false)
    }
    fetchArticles()
  }, [])

  const filteredArticles = allArticles.filter(article => {
    if (activeFilter === 'all') return true
    const keywords = FILTER_KEYWORDS[activeFilter] ?? []
    const text = (article.title + ' ' + article.summary).toLowerCase()
    return keywords.some(kw => text.includes(kw))
  })

  const stats = {
    total:     allArticles.length,
    critical:  allArticles.filter(a => a.severity === 'critical').length,
    high:      allArticles.filter(a => a.severity === 'high').length,
    withGuide: allArticles.filter(a => a.safety_tips !== null).length,
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* ── Header ── */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-critical/10 border border-critical/30 flex items-center justify-center">
              <svg className="w-6 h-6 text-critical" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M12 9v3.75m0 3.75h.008v.008H12v-.008zm-9.303-7.124c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z"/>
              </svg>
            </div>
            <div>
              <h1 className="font-display text-4xl font-bold text-text-1">
                Breaches & Hacks
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="pulse-dot" style={{ background: '#ff4444' }}></span>
                <span className="text-critical text-sm">Live breach monitoring</span>
                <span className="text-text-3 text-sm">· Updated continuously</span>
              </div>
            </div>
          </div>
          <p className="text-text-2 text-lg max-w-3xl">
            Real-time feed of data breaches, ransomware attacks, zero-day exploits,
            CVEs and cybersecurity incidents from around the world — including Africa and Nigeria.
          </p>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total incidents tracked', value: stats.total.toString(),     icon: '🗂' },
            { label: 'Critical severity',        value: stats.critical.toString(),  icon: '🔴' },
            { label: 'High severity',            value: stats.high.toString(),      icon: '🟠' },
            { label: 'With safety guides',       value: stats.withGuide.toString(), icon: '🛡' },
          ].map(s => (
            <div key={s.label} className="bg-surface border border-border rounded-2xl p-5">
              <div className="text-2xl mb-2">{s.icon}</div>
              <div className="font-display font-bold text-3xl text-text-1 mb-1">{s.value}</div>
              <div className="text-text-3 text-xs leading-tight">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Filter tabs ── */}
        <div className="flex gap-2 flex-wrap mb-8">
          {BREACH_FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all
                ${activeFilter === f.value
                  ? 'bg-critical/10 border-critical/30 text-critical'
                  : 'border-border text-text-2 hover:border-border-hi hover:text-text-1'}`}>
              {f.label}
              {activeFilter === f.value && f.value !== 'all' && (
                <span className="ml-2 text-xs opacity-70">
                  ({filteredArticles.length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Sources banner ── */}
        <div className="bg-surface border border-border rounded-xl px-5 py-3 mb-8 flex items-center gap-3 flex-wrap">
          <span className="text-text-3 text-xs font-medium uppercase tracking-wider">
            Monitoring:
          </span>
          {[
            'The Hacker News', 'BleepingComputer', 'Krebs on Security',
            'Dark Reading', 'SecurityWeek', 'TechCabal',
            'Techpoint Africa', 'CVE Database', 'SANS ISC',
          ].map(src => (
            <span key={src} className="flex items-center gap-1.5 text-xs text-text-2">
              <span className="pulse-dot" style={{ width: '5px', height: '5px' }}></span>
              {src}
            </span>
          ))}
        </div>

        {/* ── Articles ── */}
        {loading ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-surface border border-border rounded-2xl p-6 animate-pulse">
                <div className="h-4 bg-surface-2 rounded w-1/4 mb-4"></div>
                <div className="h-6 bg-surface-2 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-surface-2 rounded w-full mb-2"></div>
                <div className="h-4 bg-surface-2 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : filteredArticles.length > 0 ? (
          <div className="flex flex-col gap-4 stagger">
            {filteredArticles.map(article => (
              <NewsCard key={article.id} article={article} variant="horizontal" />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="w-16 h-16 rounded-2xl bg-surface border border-border flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🛡</span>
            </div>
            <h3 className="font-display font-bold text-text-1 text-xl mb-2">
              No {activeFilter === 'all' ? 'incidents' : activeFilter} found
            </h3>
            <p className="text-text-2 text-sm mb-6">
              {activeFilter === 'all'
                ? 'The aggregator is fetching breach data — check back shortly.'
                : `No articles matched the "${BREACH_FILTERS.find(f => f.value === activeFilter)?.label}" filter yet.`
              }
            </p>
            {activeFilter !== 'all' && (
              <button
                onClick={() => setActiveFilter('all')}
                className="px-6 py-3 rounded-xl border border-border text-text-2 hover:border-accent hover:text-accent transition-all text-sm">
                Show all incidents
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  )
}