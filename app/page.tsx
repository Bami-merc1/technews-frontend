import Link from 'next/link'
import { getLatestArticles } from '@/lib/supabase'
import { Article } from '@/lib/types'

const CATEGORIES = [
  { label: 'All', slug: 'all' },
  { label: 'AI/ML', slug: 'ai-ml' },
  { label: 'Cybersecurity', slug: 'cybersecurity' },
  { label: 'Software Development', slug: 'software-development' },
  { label: 'Blockchain', slug: 'blockchain' },
  { label: 'FinTech & Business', slug: 'fintech-business' },
  { label: 'Hardware', slug: 'hardware' },
]

const SEVERITY_STYLES: Record<string, string> = {
  critical: 'bg-critical/10 text-critical border border-critical/30',
  high:     'bg-high/10 text-high border border-high/30',
  medium:   'bg-medium/10 text-medium border border-medium/30',
  low:      'bg-low/10 text-low border border-low/30',
}

const CATEGORY_STYLES: Record<string, string> = {
  'AI/ML':                'bg-accent/10 text-accent',
  'Cybersecurity':        'bg-critical/10 text-critical',
  'Software Development': 'bg-live/10 text-live',
  'Blockchain':           'bg-medium/10 text-medium',
  'FinTech & Business':   'bg-high/10 text-high',
  'Hardware':             'bg-purple-400/10 text-purple-400',
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const h = Math.floor(diff / 3600000)
  if (h < 1) return 'Just now'
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export default async function HomePage() {
  let articles: Article[] = []

  try {
    articles = await getLatestArticles(20)
  } catch (error) {
    console.error('Failed to fetch articles:', error)
  }

  return (
    <div className="min-h-screen bg-bg">

      {/* ── Hero ── */}
      <section className="relative border-b border-border overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="flex items-center gap-2 mb-6">
            <span className="pulse-dot"></span>
            <span className="text-live text-sm font-medium">Live feed active</span>
            <span className="text-text-3 text-sm">· Updated every 15 minutes</span>
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-text-1 leading-tight mb-6">
            Tech news, powered<br />
            <span className="text-accent">by AI</span>
          </h1>
          <p className="text-text-2 text-xl max-w-2xl leading-relaxed mb-10">
            Real-time summaries of the latest in AI, cybersecurity, software,
            blockchain, data-breachs and hardware — aggregated and written autonomously.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/security-hub"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-critical/10 border border-critical/30 text-critical font-medium hover:bg-critical/20 transition-all">
              <span className="pulse-dot" style={{ background: '#ff4444' }}></span>
              Security Hub
            </Link>
            <Link href="/search"
              className="px-6 py-3 rounded-xl border border-border text-text-2 font-medium hover:border-accent hover:text-accent transition-all">
              Search articles
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="border-b border-border bg-surface">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap gap-8">
          {[
            { label: 'Articles today', value: articles.length.toString() },
            { label: 'Sources monitored', value: '120+' },
            { label: 'Categories', value: '6' },
            { label: 'Avg. publish delay', value: '< 2 min' },
          ].map(stat => (
            <div key={stat.label}>
              <div className="text-text-1 font-display font-bold text-xl">{stat.value}</div>
              <div className="text-text-3 text-xs mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>



      {/* ── Breaking Breaches Strip ── */}
      {articles.filter(a => a.category === 'Cybersecurity' && a.severity).length > 0 && (
        <section className="border-b border-border bg-critical/5">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="pulse-dot" style={{ background: '#ff4444' }}></span>
                <span className="text-critical text-xs font-bold uppercase tracking-wider">
                  Breaking
                </span>
              </div>
              <div className="flex items-center gap-3 overflow-x-auto scrollbar-none flex-1">
                {articles
                  .filter(a => a.category === 'Cybersecurity' && a.severity)
                  .slice(0, 5)
                  .map(article => (
                    <Link key={article.id} href={`/article/${article.slug}`}
                      className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-lg border border-critical/20 bg-critical/5 hover:bg-critical/10 transition-all">
                      <span className={`text-xs font-medium
                        ${article.severity === 'critical' ? 'text-critical' :
                          article.severity === 'high'     ? 'text-high' : 'text-medium'}`}>
                        {article.severity?.toUpperCase()}
                      </span>
                      <span className="text-text-2 text-xs truncate max-w-48">
                        {article.title}
                      </span>
                    </Link>
                  ))
                }
                <Link href="/breaches"
                  className="flex-shrink-0 text-xs text-critical hover:underline">
                  View all →
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}



      {/* ── Main content ── */}
      <section className="max-w-7xl mx-auto px-6 py-12">

        {/* Category filter */}
        <div className="flex gap-2 flex-wrap mb-10">
          {CATEGORIES.map(cat => (
            <Link
              key={cat.slug}
              href={cat.slug === 'all' ? '/' : `/category/${cat.slug}`}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all
                ${cat.slug === 'all'
                  ? 'bg-accent text-bg border-accent'
                  : 'border-border text-text-2 hover:border-accent hover:text-accent'
                }`}>
              {cat.label}
            </Link>
          ))}
        </div>

        {/* Articles grid */}
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger">
            {articles.map(article => (
              <Link key={article.id} href={`/article/${article.slug}`}
                className="group block bg-surface border border-border rounded-2xl p-6 hover:border-border-hi hover:bg-surface-2 transition-all">

                {/* Top row */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${CATEGORY_STYLES[article.category] ?? 'bg-surface text-text-2'}`}>
                    {article.category}
                  </span>
                  {article.severity && (
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1 ${SEVERITY_STYLES[article.severity]}`}>
                      {article.severity === 'critical' && (
                        <span className="pulse-dot" style={{ width: '6px', height: '6px', background: '#ff4444' }}></span>
                      )}
                      {article.severity.charAt(0).toUpperCase() + article.severity.slice(1)}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h2 className="font-display font-bold text-text-1 text-lg leading-snug mb-3 group-hover:text-accent transition-colors">
                  {article.title}
                </h2>

                {/* Summary */}
                <p className="text-text-2 text-sm leading-relaxed mb-5 line-clamp-3">
                  {article.summary}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between text-text-3 text-xs pt-4 border-t border-border">
                  <span>{article.source_name}</span>
                  <div className="flex items-center gap-3">
                    <span>{article.read_time_minutes} min read</span>
                    <span>{timeAgo(article.published_at)}</span>
                  </div>
                </div>

              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-surface border border-border flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📡</span>
            </div>
            <h3 className="font-display font-bold text-text-1 text-xl mb-2">
              No articles yet
            </h3>
            <p className="text-text-2 text-sm">
              The AI aggregator is warming up — check back shortly.
            </p>
          </div>
        )}

      </section>
    </div>
  )
}