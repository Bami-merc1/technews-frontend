import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getArticlesByCategory } from '@/lib/supabase'
import { Article, Category } from '@/lib/types'

const CATEGORY_STYLES: Record<string, string> = {
  'AI/ML':                'bg-accent/10 text-accent',
  'Cybersecurity':        'bg-critical/10 text-critical',
  'Software Development': 'bg-live/10 text-live',
  'Blockchain':           'bg-medium/10 text-medium',
  'FinTech & Business':   'bg-high/10 text-high',
  'Hardware':             'bg-purple-400/10 text-purple-400',
}

const SEVERITY_STYLES: Record<string, string> = {
  critical: 'bg-critical/10 text-critical border border-critical/30',
  high:     'bg-high/10 text-high border border-high/30',
  medium:   'bg-medium/10 text-medium border border-medium/30',
  low:      'bg-low/10 text-low border border-low/30',
}

const SLUG_TO_CATEGORY: Record<string, Category> = {
  'ai-ml':                'AI/ML',
  'cybersecurity':        'Cybersecurity',
  'software-development': 'Software Development',
  'blockchain':           'Blockchain',
  'fintech-business':     'FinTech & Business',
  'hardware':             'Hardware',
}

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  'AI/ML':                'Artificial intelligence, machine learning, large language models and neural networks.',
  'Cybersecurity':        'Vulnerabilities, CVEs, exploits, patches and security best practices.',
  'Software Development': 'Programming languages, frameworks, tools and engineering best practices.',
  'Blockchain':           'Cryptocurrency, DeFi, NFTs, Web3 and distributed ledger technology.',
  'FinTech & Business':   'Financial technology, startups, venture capital and business strategy.',
  'Hardware':             'CPUs, GPUs, semiconductors, devices and electronics.',
}

const CATEGORIES = [
  { label: 'AI/ML',                slug: 'ai-ml' },
  { label: 'Cybersecurity',        slug: 'cybersecurity' },
  { label: 'Software Development', slug: 'software-development' },
  { label: 'Blockchain',           slug: 'blockchain' },
  { label: 'FinTech & Business',   slug: 'fintech-business' },
  { label: 'Hardware',             slug: 'hardware' },
]

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const h = Math.floor(diff / 3600000)
  if (h < 1) return 'Just now'
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export default async function CategoryPage({
  params,
}: {
  params: { slug: string }
}) {
  const category = SLUG_TO_CATEGORY[params.slug]
  if (!category) notFound()

  let articles: Article[] = []
  try {
    articles = await getArticlesByCategory(category, 20)
  } catch (error) {
    console.error('Failed to fetch articles:', error)
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* ── Breadcrumb ── */}
        <div className="flex items-center gap-2 text-text-3 text-sm mb-8">
          <Link href="/" className="hover:text-accent transition-colors">Home</Link>
          <span>/</span>
          <span className="text-text-2">Categories</span>
          <span>/</span>
          <span className="text-text-1">{category}</span>
        </div>

        {/* ── Header ── */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <span className={`text-sm font-medium px-3 py-1 rounded-full ${CATEGORY_STYLES[category]}`}>
              {category}
            </span>
            <span className="text-text-3 text-sm">{articles.length} articles</span>
          </div>
          <h1 className="font-display text-4xl font-bold text-text-1 mb-3">{category}</h1>
          <p className="text-text-2 text-lg max-w-2xl">{CATEGORY_DESCRIPTIONS[category]}</p>
        </div>

        {/* ── Category switcher ── */}
        <div className="flex gap-2 flex-wrap mb-10">
          <Link href="/" className="px-4 py-2 rounded-full text-sm font-medium border border-border text-text-2 hover:border-accent hover:text-accent transition-all">
            All
          </Link>
          {CATEGORIES.map(cat => (
            <Link key={cat.slug} href={`/category/${cat.slug}`}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all
                ${cat.slug === params.slug
                  ? 'bg-accent text-bg border-accent'
                  : 'border-border text-text-2 hover:border-accent hover:text-accent'
                }`}>
              {cat.label}
            </Link>
          ))}
        </div>

        {/* ── Articles grid ── */}
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger">
            {articles.map(article => (
              <Link key={article.id} href={`/article/${article.slug}`}
                className="group block bg-surface border border-border rounded-2xl p-6 hover:border-border-hi hover:bg-surface-2 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${CATEGORY_STYLES[article.category] ?? ''}`}>
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
                <h2 className="font-display font-bold text-text-1 text-lg leading-snug mb-3 group-hover:text-accent transition-colors">
                  {article.title}
                </h2>
                <p className="text-text-2 text-sm leading-relaxed mb-5 line-clamp-3">
                  {article.summary}
                </p>
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
            <h3 className="font-display font-bold text-text-1 text-xl mb-2">No articles yet</h3>
            <p className="text-text-2 text-sm">The AI is monitoring this category — check back soon.</p>
            <Link href="/" className="mt-6 inline-block px-6 py-3 rounded-xl border border-border text-text-2 hover:border-accent hover:text-accent transition-all text-sm">
              Back to home
            </Link>
          </div>
        )}

      </div>
    </div>
  )
}