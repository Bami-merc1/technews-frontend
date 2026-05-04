'use client'

import { useState } from 'react'

interface QueuedArticle {
  id: string
  title: string
  category: string
  severity: string | null
  confidence: number
  source: string
  queued_at: string
}

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
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1)  return 'Just now'
  if (m < 60) return `${m}m ago`
  return `${Math.floor(m / 60)}h ago`
}

interface ArticleQueueProps {
  articles: QueuedArticle[]
  onPublish: (id: string) => void
  onReject: (id: string) => void
}

export default function ArticleQueue({ articles, onPublish, onReject }: ArticleQueueProps) {
  const [processing, setProcessing] = useState<string | null>(null)

  const handlePublish = async (id: string) => {
    setProcessing(id)
    await onPublish(id)
    setProcessing(null)
  }

  const handleReject = async (id: string) => {
    setProcessing(id)
    await onReject(id)
    setProcessing(null)
  }

  return (
    <div className="bg-surface border border-border rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display font-bold text-text-1 text-xl">Article queue</h2>
          <p className="text-text-3 text-xs mt-1">AI-generated articles pending review</p>
        </div>
        <span className="px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-medium">
          {articles.length} pending
        </span>
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-text-3 text-sm">No articles in queue — pipeline is up to date!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {articles.map(article => (
            <div key={article.id} className="bg-surface-2 border border-border rounded-xl p-4">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${CATEGORY_STYLES[article.category] ?? ''}`}>
                  {article.category}
                </span>
                {article.severity && (
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${SEVERITY_STYLES[article.severity] ?? ''}`}>
                    {article.severity}
                  </span>
                )}
                <span className="text-xs text-text-3 ml-auto">{timeAgo(article.queued_at)}</span>
              </div>

              <p className="text-text-1 text-sm font-medium leading-snug mb-3">
                {article.title}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-20 bg-border rounded-full overflow-hidden">
                    <div
                      className="h-full bg-live rounded-full"
                      style={{ width: `${article.confidence}%` }}
                    />
                  </div>
                  <span className="text-text-3 text-xs">{article.confidence}% confidence</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePublish(article.id)}
                    disabled={processing === article.id}
                    className="px-3 py-1 rounded-lg bg-live/10 border border-live/30 text-live text-xs hover:bg-live/20 transition-all disabled:opacity-50">
                    {processing === article.id ? '...' : '✓ Publish'}
                  </button>
                  <button
                    onClick={() => handleReject(article.id)}
                    disabled={processing === article.id}
                    className="px-3 py-1 rounded-lg bg-critical/10 border border-critical/30 text-critical text-xs hover:bg-critical/20 transition-all disabled:opacity-50">
                    {processing === article.id ? '...' : '✕ Reject'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}