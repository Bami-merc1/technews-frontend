import Link from 'next/link'
import { getCriticalThreats, getThreatMetrics } from '@/lib/supabase'
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
  if (h < 1) return 'Just now'
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export default async function SecurityHubPage() {
  let threats: Article[] = []
  let metrics = { active_today: 0, critical_this_week: 0, guides_published: 0, resolved_percentage: 0 }

  try {
    threats = await getCriticalThreats()
    metrics = await getThreatMetrics()
  } catch (error) {
    console.error('Failed to fetch threats:', error)
  }

  const metricCards = [
    { label: 'Active threats today',    value: threats.length.toString(), icon: '⚠' },
    { label: 'Critical CVEs this week', value: threats.filter(t => t.severity === 'critical').length.toString(), icon: '🔴' },
    { label: 'Safety guides published', value: metrics.guides_published.toString(), icon: '📋' },
    { label: 'Threats resolved',        value: `${metrics.resolved_percentage}%`, icon: '✅' },
  ]

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-5xl mx-auto px-6 py-12">

        {/* ── Header ── */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-critical/10 border border-critical/30 flex items-center justify-center">
              <svg className="w-5 h-5 text-critical" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
              </svg>
            </div>
            <div>
              <h1 className="font-display text-4xl font-bold text-text-1">Security Hub</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="pulse-dot"></span>
                <span className="text-live text-sm">Live threat monitoring</span>
                <span className="text-text-3 text-sm">· Updated every 15 minutes</span>
              </div>
            </div>
          </div>
          <p className="text-text-2 text-lg max-w-2xl">
            Real-time cybersecurity threat intelligence with AI-generated safety guides
            tailored to your technical level.
          </p>
        </div>

        {/* ── Metrics ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {metricCards.map(m => (
            <div key={m.label} className="bg-surface border border-border rounded-2xl p-5">
              <div className="text-2xl mb-2">{m.icon}</div>
              <div className="font-display font-bold text-3xl text-text-1 mb-1">{m.value}</div>
              <div className="text-text-3 text-xs leading-tight">{m.label}</div>
            </div>
          ))}
        </div>

        {/* ── Threat feed ── */}
        {threats.length > 0 ? (
          <div className="flex flex-col gap-4">
            {threats.map(threat => {
              const sev = threat.severity ? SEVERITY_CONFIG[threat.severity] : null
              return (
                <Link key={threat.id} href={`/article/${threat.slug}`}
                  className="group bg-surface border border-border rounded-2xl p-6 hover:border-border-hi hover:bg-surface-2 transition-all block">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1 min-w-0">
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
                      <h2 className="font-display font-bold text-text-1 text-lg leading-snug mb-2 group-hover:text-accent transition-colors">
                        {threat.title}
                      </h2>
                      <p className="text-text-2 text-sm leading-relaxed">{threat.summary}</p>
                    </div>
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg border border-border flex items-center justify-center text-text-3 group-hover:border-accent group-hover:text-accent transition-all">
                      →
                    </div>
                  </div>
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
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-surface border border-border flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🛡</span>
            </div>
            <h3 className="font-display font-bold text-text-1 text-xl mb-2">No active threats</h3>
            <p className="text-text-2 text-sm">All clear — the AI is continuously monitoring for new threats.</p>
          </div>
        )}

        {/* ── Bottom CTA ── */}
        <div className="mt-12 bg-surface border border-border rounded-2xl p-8 text-center">
          <h3 className="font-display font-bold text-text-1 text-2xl mb-3">
            Stay protected automatically
          </h3>
          <p className="text-text-2 mb-6 max-w-md mx-auto text-sm">
            TechPulse monitors hundreds of security feeds 24/7 and generates
            plain-English safety guides the moment a new threat is detected.
          </p>
          <Link href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-bg font-medium hover:bg-accent/90 transition-all">
            Browse all tech news
          </Link>
        </div>

      </div>
    </div>
  )
}