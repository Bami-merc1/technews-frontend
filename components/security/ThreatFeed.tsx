import Link from 'next/link'
import { Article } from '@/lib/types'

const SEVERITY_CONFIG: Record<string, { label: string; styles: string; dotColor: string }> = {
  critical: { label: 'Critical', styles: 'bg-critical/10 text-critical border-critical/30', dotColor: '#ff4444' },
  high:     { label: 'High',     styles: 'bg-high/10 text-high border-high/30',             dotColor: '#ff8c00' },
  medium:   { label: 'Medium',   styles: 'bg-medium/10 text-medium border-medium/30',       dotColor: '#f5c400' },
  low:      { label: 'Low',      styles: 'bg-low/10 text-low border-low/30',                dotColor: '#00cc88' },
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const h = Math.floor(diff / 3600000)
  if (h < 1)  return 'Just now'
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

interface ThreatFeedProps {
  threats: Article[]
}

export default function ThreatFeed({ threats }: ThreatFeedProps) {
  if (threats.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 rounded-2xl bg-surface border border-border flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">🛡</span>
        </div>
        <h3 className="font-display font-bold text-text-1 text-xl mb-2">No active threats</h3>
        <p className="text-text-2 text-sm">
          All clear — the AI is continuously monitoring for new threats.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {threats.map(threat => {
        const sev = threat.severity ? SEVERITY_CONFIG[threat.severity] : null
        return (
          <Link key={threat.id} href={`/article/${threat.slug}`}
            className="group bg-surface border border-border rounded-2xl p-6 hover:border-border-hi hover:bg-surface-2 transition-all block">

            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1 min-w-0">

                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {sev && (
                    <span className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full border ${sev.styles}`}>
                      {threat.severity === 'critical' && (
                        <span className="pulse-dot" style={{ width: '6px', height: '6px', background: sev.dotColor }}></span>
                      )}
                      {sev.label}
                    </span>
                  )}
                  {threat.cve_id && (
                    <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-surface-2 border border-border text-text-2">
                      {threat.cve_id}
                    </span>
                  )}
                  {threat.safety_tips && (
                    <span className="text-xs px-2.5 py-1 rounded-full bg-live/10 text-live border border-live/20">
                      ✓ Safety guide available
                    </span>
                  )}
                </div>

                {/* Title */}
                <h2 className="font-display font-bold text-text-1 text-lg leading-snug mb-2 group-hover:text-accent transition-colors">
                  {threat.title}
                </h2>

                {/* Summary */}
                <p className="text-text-2 text-sm leading-relaxed">{threat.summary}</p>
              </div>

              {/* Arrow */}
              <div className="flex-shrink-0 w-8 h-8 rounded-lg border border-border flex items-center justify-center text-text-3 group-hover:border-accent group-hover:text-accent transition-all">
                →
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-text-3 text-xs pt-4 border-t border-border">
              <span>{threat.source_name}</span>
              <div className="flex items-center gap-3">
                <span>{timeAgo(threat.published_at)}</span>
                <span className="text-accent group-hover:underline">View safety guide →</span>
              </div>
            </div>

          </Link>
        )
      })}
    </div>
  )
}