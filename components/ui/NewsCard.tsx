import Link from 'next/link'
import { Article } from '@/lib/types'

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
  const d = Math.floor(h / 24)
  if (h < 1)  return 'Just now'
  if (h < 24) return `${h}h ago`
  if (d < 30) return `${d}d ago`
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

interface NewsCardProps {
  article: Article
  variant?: 'default' | 'horizontal'
}

export default function NewsCard({ article, variant = 'default' }: NewsCardProps) {
  if (variant === 'horizontal') {
    return (
      <Link href={`/article/${article.slug}`}
        className="group bg-surface border border-border rounded-2xl p-6 hover:border-border-hi hover:bg-surface-2 transition-all block">
        <div className="flex items-start gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-3">
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
              {article.cve_id && (
                <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-surface-2 border border-border text-text-2">
                  {article.cve_id}
                </span>
              )}
              {article.safety_tips && (
                <span className="text-xs px-2.5 py-1 rounded-full bg-live/10 text-live border border-live/20">
                  ✓ Safety guide
                </span>
              )}
            </div>
            <h2 className="font-display font-bold text-text-1 text-lg leading-snug mb-2 group-hover:text-accent transition-colors">
              {article.title}
            </h2>
            <p className="text-text-2 text-sm leading-relaxed line-clamp-2">
              {article.summary}
            </p>
          </div>
          <div className="flex-shrink-0 w-9 h-9 rounded-xl border border-border flex items-center justify-center text-text-3 group-hover:border-accent group-hover:text-accent transition-all">
            →
          </div>
        </div>
        <div className="flex items-center justify-between text-text-3 text-xs mt-4 pt-4 border-t border-border">
          <span>{article.source_name}</span>
          <div className="flex items-center gap-3">
            <span>{article.read_time_minutes} min read</span>
            <span>{timeAgo(article.published_at)}</span>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/article/${article.slug}`}
      className="group block bg-surface border border-border rounded-2xl p-6 hover:border-border-hi hover:bg-surface-2 transition-all">
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
  )
}