import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getArticlesByCategory } from '@/lib/supabase'
import { Article, Category } from '@/lib/types'
import NewsCard from '@/components/ui/NewsCard'
import CategoryBadge from '@/components/ui/CategoryBadge'

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
            <CategoryBadge category={category} size="md" />
            <span className="text-text-3 text-sm">{articles.length} articles</span>
          </div>
          <h1 className="font-display text-4xl font-bold text-text-1 mb-3">{category}</h1>
          <p className="text-text-2 text-lg max-w-2xl">{CATEGORY_DESCRIPTIONS[category]}</p>
        </div>

        {/* ── Category switcher ── */}
        <div className="flex gap-2 flex-wrap mb-10">
          <Link href="/"
            className="px-4 py-2 rounded-full text-sm font-medium border border-border text-text-2 hover:border-accent hover:text-accent transition-all">
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
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-surface border border-border flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📡</span>
            </div>
            <h3 className="font-display font-bold text-text-1 text-xl mb-2">No articles yet</h3>
            <p className="text-text-2 text-sm">The AI is monitoring this category — check back soon.</p>
            <Link href="/"
              className="mt-6 inline-block px-6 py-3 rounded-xl border border-border text-text-2 hover:border-accent hover:text-accent transition-all text-sm">
              Back to home
            </Link>
          </div>
        )}

      </div>
    </div>
  )
}