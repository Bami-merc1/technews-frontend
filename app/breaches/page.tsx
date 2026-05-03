import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Article } from '@/lib/types'
import NewsCard from '@/components/ui/NewsCard'

const SEVERITY_CONFIG: Record<string, { label: string; styles: string; dotColor: string }> = {
  critical: { label: 'Critical', styles: 'bg-critical/10 text-critical border-critical/30', dotColor: '#ff4444' },
  high:     { label: 'High',     styles: 'bg-high/10 text-high border-high/30',             dotColor: '#ff8c00' },
  medium:   { label: 'Medium',   styles: 'bg-medium/10 text-medium border-medium/30',       dotColor: '#f5c400' },
  low:      { label: 'Low',      styles: 'bg-low/10 text-low border-low/30',                dotColor: '#00cc88' },
}

const BREACH_FILTERS = [
  { label: 'All incidents',    value: 'all' },
  { label: 'Data breaches',    value: 'breach' },
  { label: 'Ransomware',       value: 'ransomware' },
  { label: 'CVEs',             value: 'cve' },
  { label: 'Zero-days',        value: 'zero-day' },
  { label: 'Africa & Nigeria', value: 'africa' },
]

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const h = Math.floor(diff / 3600000)
  const d = Math.floor(h / 24)
  if (h < 1)  return 'Just now'
  if (h < 24) return `${h}h ago`
  if (d < 30) return `${d}d ago`
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

async function getBreachArticles(): Promise<Article[]> {
  const { data } = await supabase
    .from('articles')
    .select('*')
    .eq('category', 'Cybersecurity')
    .order('published_at', { ascending: false })
    .limit(50)
  return data ?? []
}

async function getBreachStats() {
  const { data } = await supabase
    .from('articles')
    .select('severity')
    .eq('category', 'Cybersecurity')

  const all      = data ?? []
  const critical = all.filter(a => a.severity === 'critical').length
  const high     = all.filter(a => a.severity === 'high').length
  const withCve  = all.filter(a => a.severity !== null).length

  return { total: all.length, critical, high, withCve }
}

export default async function BreachesPage() {
  const [articles, stats] = await Promise.all([
    getBreachArticles(),
    getBreachStats(),
  ])

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* ── Header ── */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-critical/10 border border-critical/30 flex items-center justify-center">
              <svg className="w-6 h-6 text-critical" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0 3.75h.008v.008H12v-.008zm-9.303-7.124c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z"/>
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
            Every incident is AI-processed with safety guides tailored to your level.
          </p>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total incidents tracked', value: stats.total.toString(),    icon: '🗂' },
            { label: 'Critical severity',        value: stats.critical.toString(), icon: '🔴' },
            { label: 'High severity',            value: stats.high.toString(),     icon: '🟠' },
            { label: 'With safety guides',       value: stats.withCve.toString(),  icon: '🛡' },
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
            <span key={f.value}
              className={`px-4 py-2 rounded-full text-sm font-medium border cursor-pointer transition-all
                ${f.value === 'all'
                  ? 'bg-critical/10 border-critical/30 text-critical'
                  : 'border-border text-text-2 hover:border-border-hi hover:text-text-1'}`}>
              {f.label}
            </span>
          ))}
        </div>

        {/* ── Sources banner ── */}
        <div className="bg-surface border border-border rounded-xl px-5 py-3 mb-8 flex items-center gap-3 flex-wrap">
          <span className="text-text-3 text-xs font-medium uppercase tracking-wider">Monitoring:</span>
          {[
            'The Hacker News',
            'BleepingComputer',
            'Krebs on Security',
            'Dark Reading',
            'SecurityWeek',
            'TechCabal',
            'Techpoint Africa',
            'CVE Database',
            'SANS ISC',
          ].map(src => (
            <span key={src} className="flex items-center gap-1.5 text-xs text-text-2">
              <span className="pulse-dot" style={{ width: '5px', height: '5px' }}></span>
              {src}
            </span>
          ))}
        </div>

        {/* ── Articles ── */}
        <div className="flex flex-col gap-4 stagger">
            {articles.map(article => (
              <NewsCard key={article.id} article={article} variant="horizontal" />
            ))}
          </div>

      </div>
    </div>
  )
}