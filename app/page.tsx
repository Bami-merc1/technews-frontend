import Link from 'next/link'
import { getLatestArticles } from '@/lib/supabase'
import { Article } from '@/lib/types'
import NewsCard from '@/components/ui/NewsCard'

const CATEGORIES = [
  { label: 'All',                  slug: 'all' },
  { label: 'AI/ML',                slug: 'ai-ml' },
  { label: 'Cybersecurity',        slug: 'cybersecurity' },
  { label: 'Software Development', slug: 'software-development' },
  { label: 'Blockchain',           slug: 'blockchain' },
  { label: 'FinTech & Business',   slug: 'fintech-business' },
  { label: 'Hardware',             slug: 'hardware' },
]

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
            <span className="text-accent">by EMerc</span>
          </h1>
          <p className="text-text-2 text-xl max-w-2xl leading-relaxed mb-10">
            Real-time summaries of the latest in AI, cybersecurity, software,
            blockchain, data breaches and hardware — aggregated and written autonomously.
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
            { label: 'Articles today',    value: articles.length.toString() },
            { label: 'Sources monitored', value: '120+' },
            { label: 'Categories',        value: '6' },
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
              <NewsCard key={article.id} article={article} />
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