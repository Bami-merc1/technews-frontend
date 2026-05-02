'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Article } from '@/lib/types'

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

function renderBody(body: string) {
  return body.trim().split('\n\n').map((block, i) => {
    if (block.startsWith('## ')) return <h2 key={i}>{block.replace('## ', '')}</h2>
    if (block.startsWith('# '))  return <h2 key={i}>{block.replace('# ', '')}</h2>
    return <p key={i}>{block}</p>
  })
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

export default function ArticleClient({
  article,
  relatedArticles,
}: {
  article: Article & { raw_content?: string }
  relatedArticles: Article[]
}) {
  const [view, setView] = useState<'summary' | 'full'>('summary')

  const [audience, setAudience] = useState<'general' | 'technical' | 'student'>('general')

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-4xl mx-auto px-6 py-12">

        {/* ── Breadcrumb ── */}
        <div className="flex items-center gap-2 text-text-3 text-sm mb-8 flex-wrap">
          <Link href="/" className="hover:text-accent transition-colors">Home</Link>
          <span>/</span>
          <Link
            href={`/category/${article.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
            className="hover:text-accent transition-colors">
            {article.category}
          </Link>
          <span>/</span>
          <span className="text-text-2 truncate max-w-xs">{article.title.slice(0, 40)}...</span>
        </div>

        {/* ── Header ── */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className={`text-xs font-medium px-3 py-1 rounded-full ${CATEGORY_STYLES[article.category] ?? 'bg-surface text-text-2'}`}>
              {article.category}
            </span>
            {article.severity && (
              <span className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full
                ${article.severity === 'critical' ? 'bg-critical/10 text-critical border border-critical/30' :
                  article.severity === 'high'     ? 'bg-high/10 text-high border border-high/30' :
                  'bg-medium/10 text-medium border border-medium/30'}`}>
                {article.severity === 'critical' && (
                  <span className="pulse-dot" style={{ width: '6px', height: '6px', background: '#ff4444' }}></span>
                )}
                {article.severity.charAt(0).toUpperCase() + article.severity.slice(1)} threat
              </span>
            )}
            {article.cve_id && (
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-surface border border-border text-text-2">
                {article.cve_id}
              </span>
            )}
          </div>

          <h1 className="font-display text-3xl md:text-4xl font-bold text-text-1 leading-tight mb-4">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-text-3 text-sm">
            <span>
              Source:{' '}
              <a href={article.source_url} target="_blank" rel="noopener noreferrer"
                className="text-accent hover:underline">
                {article.source_name}
              </a>
            </span>
            <span>{article.read_time_minutes} min read</span>
            <span>{timeAgo(article.published_at)}</span>
            <span>{new Date(article.published_at).toLocaleDateString('en-US', { dateStyle: 'medium' })}</span>
          </div>
        </div>

        {/* ── View Toggle ── */}
        <div className="flex items-center gap-2 p-1 bg-surface rounded-xl border border-border mb-8 w-fit">
          <button
            onClick={() => setView('summary')}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all
              ${view === 'summary'
                ? 'bg-accent text-bg'
                : 'text-text-2 hover:text-text-1'}`}>
            ✨ AI Summary
          </button>
          <button
            onClick={() => setView('full')}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all
              ${view === 'full'
                ? 'bg-accent text-bg'
                : 'text-text-2 hover:text-text-1'}`}>
            📰 Full Story
          </button>
        </div>

        {/* ── AI SUMMARY VIEW ── */}
        {view === 'summary' && (
          <div>
            {article.summary && (
              <div className="bg-surface-2 border border-accent/20 rounded-2xl p-6 mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-md bg-accent/20 flex items-center justify-center">
                    <span className="text-accent text-xs font-bold">AI</span>
                  </div>
                  <span className="text-accent text-sm font-medium">AI-Generated Summary</span>
                </div>
                <p className="text-text-1 leading-relaxed">{article.summary}</p>
              </div>
            )}
            {article.body && (
              <div className="article-body mb-12">
                {renderBody(article.body)}
              </div>
            )}
          </div>
        )}

        {/* ── FULL STORY VIEW ── */}
        {view === 'full' && (
          <div>
            <div className="bg-surface border border-border rounded-2xl p-6 mb-8">

              {/* Header */}
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
                <div className="w-8 h-8 rounded-lg bg-surface-2 border border-border flex items-center justify-center">
                  <span className="text-sm">📰</span>
                </div>
                <div>
                  <p className="text-text-1 text-sm font-medium">Full story</p>
                  <p className="text-text-3 text-xs">
                    AI-expanded from {article.source_name} — all facts preserved
                  </p>
                </div>
                <a href={article.source_url} target="_blank" rel="noopener noreferrer"
                  className="ml-auto text-xs text-text-3 hover:text-accent transition-colors border border-border px-3 py-1.5 rounded-lg">
                  Original source ↗
                </a>
              </div>

              {/* Full story content */}
              {article.full_story ? (
                <div className="article-body">
                  {article.full_story.trim().split('\n\n').map((block, i) => {
                    if (block.startsWith('## ')) return <h2 key={i}>{block.replace('## ', '')}</h2>
                    if (block.startsWith('# '))  return <h2 key={i}>{block.replace('# ', '')}</h2>
                    if (block.startsWith('**') && block.endsWith('**')) {
                      return <h2 key={i}>{block.replace(/\*\*/g, '')}</h2>
                    }
                    return <p key={i}>{block}</p>
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-12 h-12 rounded-xl bg-surface-2 border border-border flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl">⏳</span>
                  </div>
                  <p className="text-text-2 text-sm font-medium mb-2">
                    Full story being generated
                  </p>
                  <p className="text-text-3 text-xs mb-6">
                    This article was published before the full story feature was added.
                    New articles will have full stories automatically.
                  </p>
                  <a href={article.source_url} target="_blank" rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-xl border border-accent/30 text-accent text-sm hover:bg-accent/10 transition-all inline-block">
                    Read on {article.source_name} →
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Safety Tips Panel ── */}
        {article.safety_tips && (
          <div className="bg-surface border border-border rounded-2xl p-6 mb-12">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display font-bold text-text-1 text-xl">How to stay safe</h3>
              {article.severity && (
                <span className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full border
                  ${article.severity === 'critical'
                    ? 'bg-critical/10 text-critical border-critical/30'
                    : 'bg-high/10 text-high border-high/30'}`}>
                  {article.severity === 'critical' && (
                    <span className="pulse-dot" style={{ width: '6px', height: '6px', background: '#ff4444' }}></span>
                  )}
                  {article.severity.charAt(0).toUpperCase() + article.severity.slice(1)} threat
                </span>
              )}
            </div>

            {/* ── Audience toggle ── */}
            <div className="flex gap-2 mb-6 flex-wrap">
              {([
                { key: 'general',   label: 'General public' },
                { key: 'technical', label: 'Tech / Developers' },
                { key: 'student',   label: 'Students' },
              ] as const).map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setAudience(tab.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all
                    ${audience === tab.key
                      ? 'bg-accent/10 border-accent/40 text-accent'
                      : 'border-border text-text-2 hover:border-border-hi hover:text-text-1'}`}>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* ── General public tips ── */}
            {audience === 'general' && (
              <div>
                <ul className="flex flex-col gap-3 mb-6">
                  {article.safety_tips.general.bullets.map((tip, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-text-1">
                      <div className="w-5 h-5 rounded-full bg-live/10 border border-live/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <polyline points="1.5,5 4,7.5 8.5,2" stroke="#00ff88" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span className={tip.isCode ? 'font-mono text-accent text-xs bg-surface-2 px-2 py-1 rounded' : ''}>
                        {tip.text}
                      </span>
                    </li>
                  ))}
                </ul>
                {article.safety_tips.general.guide.length > 0 && (
                  <div className="border-t border-border pt-4">
                    <p className="text-text-3 text-xs mb-3 font-medium uppercase tracking-wider">Detailed guide</p>
                    <div className="flex flex-col gap-3">
                      {article.safety_tips.general.guide.map((step, i) => (
                        <div key={i} className="bg-surface-2 rounded-xl p-4">
                          <p className="text-text-3 text-xs mb-1 font-medium">{step.title}</p>
                          <p className="text-text-1 text-sm leading-relaxed">{step.body}</p>
                          {step.command && (
                            <code className="block mt-2 font-mono text-xs text-accent bg-bg px-3 py-2 rounded-lg border border-border">
                              {step.command}
                            </code>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── Technical tips ── */}
            {audience === 'technical' && (
              <div>
                <ul className="flex flex-col gap-3 mb-6">
                  {article.safety_tips.technical.bullets.map((tip, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-text-1">
                      <div className="w-5 h-5 rounded-full bg-live/10 border border-live/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <polyline points="1.5,5 4,7.5 8.5,2" stroke="#00ff88" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span className={tip.isCode ? 'font-mono text-accent text-xs bg-surface-2 px-2 py-1 rounded' : ''}>
                        {tip.text}
                      </span>
                    </li>
                  ))}
                </ul>
                {article.safety_tips.technical.guide.length > 0 && (
                  <div className="border-t border-border pt-4">
                    <p className="text-text-3 text-xs mb-3 font-medium uppercase tracking-wider">Detailed guide</p>
                    <div className="flex flex-col gap-3">
                      {article.safety_tips.technical.guide.map((step, i) => (
                        <div key={i} className="bg-surface-2 rounded-xl p-4">
                          <p className="text-text-3 text-xs mb-1 font-medium">{step.title}</p>
                          <p className="text-text-1 text-sm leading-relaxed">{step.body}</p>
                          {step.command && (
                            <code className="block mt-2 font-mono text-xs text-accent bg-bg px-3 py-2 rounded-lg border border-border">
                              {step.command}
                            </code>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── Student tips ── */}
            {audience === 'student' && (
              <div>
                {article.safety_tips.student.explainer && (
                  <div className="bg-surface-2 border border-border rounded-xl p-4 mb-6">
                    <p className="text-xs font-medium text-text-3 mb-1">Plain English explainer</p>
                    <p className="text-text-1 text-sm leading-relaxed">
                      {article.safety_tips.student.explainer}
                    </p>
                  </div>
                )}
                <ul className="flex flex-col gap-3 mb-6">
                  {article.safety_tips.student.bullets.map((tip, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-text-1">
                      <div className="w-5 h-5 rounded-full bg-live/10 border border-live/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <polyline points="1.5,5 4,7.5 8.5,2" stroke="#00ff88" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span>{tip.text}</span>
                    </li>
                  ))}
                </ul>
                {article.safety_tips.student.guide.length > 0 && (
                  <div className="border-t border-border pt-4">
                    <p className="text-text-3 text-xs mb-3 font-medium uppercase tracking-wider">Learn more</p>
                    <div className="flex flex-col gap-3">
                      {article.safety_tips.student.guide.map((step, i) => (
                        <div key={i} className="bg-surface-2 rounded-xl p-4">
                          <p className="text-text-3 text-xs mb-1 font-medium">{step.title}</p>
                          <p className="text-text-1 text-sm leading-relaxed">{step.body}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        )}

        {/* ── Source link ── */}
        <div className="flex items-center justify-between p-4 bg-surface rounded-xl border border-border mb-12">
          <div>
            <p className="text-text-3 text-xs mb-1">Original source</p>
            <p className="text-text-1 text-sm font-medium">{article.source_name}</p>
          </div>
          <a href={article.source_url} target="_blank" rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg border border-accent/30 text-accent text-sm hover:bg-accent/10 transition-all">
            Read original →
          </a>
        </div>

        {/* ── Related articles ── */}
        {relatedArticles.length > 0 && (
          <div>
            <h3 className="font-display font-bold text-text-1 text-xl mb-6">Related articles</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedArticles.map(rel => (
                <Link key={rel.id} href={`/article/${rel.slug}`}
                  className="bg-surface border border-border rounded-xl p-4 hover:border-border-hi hover:bg-surface-2 transition-all group">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full mb-3 inline-block ${CATEGORY_STYLES[rel.category] ?? ''}`}>
                    {rel.category}
                  </span>
                  <p className="text-text-1 text-sm font-medium leading-snug group-hover:text-accent transition-colors mt-2">
                    {rel.title}
                  </p>
                  <p className="text-text-3 text-xs mt-2">{timeAgo(rel.published_at)}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}