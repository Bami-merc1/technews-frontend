import Link from 'next/link'
import { getCriticalThreats, getThreatMetrics } from '@/lib/supabase'
import { Article } from '@/lib/types'
import ThreatFeed from '@/components/security/ThreatFeed'
import ThreatMetrics from '@/components/security/ThreatMetrics'

export default async function SecurityHubPage() {
  let threats: Article[] = []
  let metrics = {
    active_today: 0,
    critical_this_week: 0,
    guides_published: 0,
    resolved_percentage: 0,
  }

  try {
    threats = await getCriticalThreats()
    metrics = await getThreatMetrics()
  } catch (error) {
    console.error('Failed to fetch threats:', error)
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-5xl mx-auto px-6 py-12">

        {/* ── Header ── */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-critical/10 border border-critical/30 flex items-center justify-center">
              <svg className="w-5 h-5 text-critical" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
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
        <ThreatMetrics
          activeToday={threats.length}
          criticalThisWeek={threats.filter(t => t.severity === 'critical').length}
          guidesPublished={metrics.guides_published}
          resolvedPercentage={metrics.resolved_percentage}
        />

        {/* ── Threat feed ── */}
        <ThreatFeed threats={threats} />

        {/* ── Bottom CTA ── */}
        <div className="mt-12 bg-surface border border-border rounded-2xl p-8 text-center">
          <h3 className="font-display font-bold text-text-1 text-2xl mb-3">
            Stay protected automatically
          </h3>
          <p className="text-text-2 mb-6 max-w-md mx-auto text-sm">
            EMerc Intel monitors hundreds of security feeds 24/7 and generates
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