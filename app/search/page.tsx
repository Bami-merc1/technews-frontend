'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { Article } from '@/lib/types'
import NewsCard from '@/components/ui/NewsCard'
import SearchBar from '@/components/ui/SearchBar'

const CATEGORIES = [
  'All',
  'AI/ML',
  'Cybersecurity',
  'Software Development',
  'Blockchain',
  'FinTech & Business',
  'Hardware',
]

export default function SearchPage() {
  const [query, setQuery]                   = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [results, setResults]               = useState<Article[]>([])
  const [loading, setLoading]               = useState(false)

  const search = useCallback(async () => {
    setLoading(true)
    try {
      let q = supabase
        .from('articles')
        .select('*')
        .order('published_at', { ascending: false })
        .limit(30)

      if (activeCategory !== 'All') {
        q = q.eq('category', activeCategory)
      }
      if (query.trim()) {
        q = q.ilike('title', `%${query}%`)
      }

      const { data } = await q
      setResults(data ?? [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [query, activeCategory])

  useEffect(() => {
    const timer = setTimeout(search, 400)
    return () => clearTimeout(timer)
  }, [search])

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-5xl mx-auto px-6 py-12">

        {/* ── Header ── */}
        <div className="mb-10">
          <h1 className="font-display text-4xl font-bold text-text-1 mb-2">Search</h1>
          <p className="text-text-2">Search across all AI-generated tech news articles</p>
        </div>

        {/* ── Search bar ── */}
        <div className="mb-6">
          <SearchBar value={query} onChange={setQuery} />
        </div>

        {/* ── Category filter ── */}
        <div className="flex gap-2 flex-wrap mb-8">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all
                ${activeCategory === cat
                  ? 'bg-accent text-bg border-accent'
                  : 'border-border text-text-2 hover:border-accent hover:text-accent'
                }`}>
              {cat}
            </button>
          ))}
        </div>

        {/* ── Results count ── */}
        <div className="mb-6">
          <p className="text-text-3 text-sm">
            {loading ? 'Searching...' :
              `${results.length} result${results.length !== 1 ? 's' : ''}
              ${query ? ` for "${query}"` : ''}
              ${activeCategory !== 'All' ? ` in ${activeCategory}` : ''}`
            }
          </p>
        </div>

        {/* ── Results ── */}
        {results.length > 0 ? (
          <div className="flex flex-col gap-4 stagger">
            {results.map(article => (
              <NewsCard key={article.id} article={article} variant="horizontal" />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-surface border border-border flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-text-3" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" strokeWidth={1.5}>
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </div>
            <h3 className="font-display font-bold text-text-1 text-xl mb-2">
              {loading ? 'Searching...' : 'No results found'}
            </h3>
            <p className="text-text-2 text-sm mb-2">
              No articles found for <span className="text-text-1">"{query}"</span> yet.
            </p>
            <p className="text-text-3 text-xs mb-6">
              Our AI pipeline checks for new articles every 15 minutes from 30+ sources.
              If this topic was recently published, it will appear here soon.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => { setQuery(''); setActiveCategory('All') }}
                className="px-6 py-3 rounded-xl border border-border text-text-2 hover:border-accent hover:text-accent transition-all text-sm">
                Clear filters
              </button>
              
               <a href={`https://www.google.com/search?q=${encodeURIComponent(query + ' site:thehackernews.com OR site:bleepingcomputer.com OR site:techcabal.com')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl border border-accent/30 text-accent hover:bg-accent/10 transition-all text-sm">
                Search on our sources →
              </a>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}