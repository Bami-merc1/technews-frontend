'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Article } from '@/lib/types'
import NewsCard from '@/components/ui/NewsCard'
import SearchBar from '@/components/ui/SearchBar'

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

const CATEGORIES = ['All', 'AI/ML', 'Cybersecurity', 'Software Development', 'Blockchain', 'FinTech & Business', 'Hardware']

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const h = Math.floor(diff / 3600000)
  if (h < 1) return 'Just now'
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export default function SearchPage() {
  const [query, setQuery]               = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [results, setResults]           = useState<Article[]>([])
  const [loading, setLoading]           = useState(false)

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

  // Debounce search
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
        <div className="relative mb-6">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-3"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          
          <SearchBar value={query} onChange={setQuery} />

          {query && (
            <button onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-text-3 hover:text-text-1 transition-colors">
              ✕
            </button>
          )}
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
        <div className="flex flex-col gap-4 stagger">
            {results.map(article => (
              <NewsCard key={article.id} article={article} variant="horizontal" />
            ))}
          </div>

      </div>
    </div>
  )
}