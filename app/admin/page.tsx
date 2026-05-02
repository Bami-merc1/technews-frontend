import Link from 'next/link'

const QUEUED_ARTICLES = [
  { id: 'q1', title: 'Apple Vision Pro 2 Specs Leaked — 8K Display and M4 Ultra Chip', category: 'Hardware', severity: null, confidence: 94, source: 'MacRumors', queued_at: '2025-05-01T09:15:00Z' },
  { id: 'q2', title: 'New Ransomware Strain Targets Healthcare Sector in West Africa', category: 'Cybersecurity', severity: 'critical', confidence: 98, source: 'Bleeping Computer', queued_at: '2025-05-01T09:10:00Z' },
  { id: 'q3', title: 'TypeScript 6.0 Introduces Structural Pattern Matching', category: 'Software Development', severity: null, confidence: 91, source: 'TypeScript Blog', queued_at: '2025-05-01T09:05:00Z' },
  { id: 'q4', title: 'Solana DeFi Protocol Loses $47M in Flash Loan Attack', category: 'Blockchain', severity: 'high', confidence: 96, source: 'DeFi Pulse', queued_at: '2025-05-01T09:00:00Z' },
]

const SEVERITY_STYLES: Record<string, string> = {
  critical: 'bg-critical/10 text-critical border border-critical/30',
  high:     'bg-high/10 text-high border border-high/30',
  medium:   'bg-medium/10 text-medium border border-medium/30',
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
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'Just now'
  if (m < 60) return `${m}m ago`
  return `${Math.floor(m / 60)}h ago`
}

const systemMetrics = [
  { label: 'Articles published today', value: '47', trend: '+12 vs yesterday', positive: true },
  { label: 'API calls made', value: '1,284', trend: '84% of daily limit', positive: true },
  { label: 'System uptime', value: '99.8%', trend: 'Last 30 days', positive: true },
  { label: 'Avg. publish latency', value: '1.4 min', trend: '-0.3 min vs last week', positive: true },
]

const errorLog = [
  { time: '09:12', level: 'WARN', message: 'NewsAPI rate limit approaching — 850/1000 calls used' },
  { time: '08:47', level: 'INFO', message: 'CVE database sync completed — 12 new entries fetched' },
  { time: '08:30', level: 'INFO', message: 'AI summarization batch completed — 8 articles processed' },
  { time: '07:15', level: 'ERROR', message: 'GitHub API timeout — retried successfully after 3s' },
]

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="font-display text-4xl font-bold text-text-1 mb-1">Admin Dashboard</h1>
            <p className="text-text-2">Pipeline control and content oversight</p>
          </div>
          <Link href="/" className="px-4 py-2 rounded-lg border border-border text-text-2 text-sm hover:border-accent hover:text-accent transition-all">
            ← Back to site
          </Link>
        </div>

        {/* ── Pipeline status ── */}
        <div className="bg-surface border border-border rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-3 text-xs uppercase tracking-wider mb-2">Pipeline status</p>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="pulse-dot"></span>
                  <span className="font-display font-bold text-live text-xl">Running</span>
                </div>
                <span className="text-text-3 text-sm">· Next poll in 4 minutes</span>
              </div>
              <p className="text-text-2 text-sm mt-1">Last article published: <span className="text-text-1">3 minutes ago</span></p>
            </div>
            <div className="flex gap-3">
              <button className="px-5 py-2.5 rounded-xl bg-critical/10 border border-critical/30 text-critical text-sm font-medium hover:bg-critical/20 transition-all">
                ⏸ Pause pipeline
              </button>
              <button className="px-5 py-2.5 rounded-xl bg-live/10 border border-live/30 text-live text-sm font-medium hover:bg-live/20 transition-all">
                ↺ Force sync now
              </button>
            </div>
          </div>
        </div>

        {/* ── System metrics ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {systemMetrics.map(m => (
            <div key={m.label} className="bg-surface border border-border rounded-2xl p-5">
              <p className="text-text-3 text-xs mb-2 leading-tight">{m.label}</p>
              <p className="font-display font-bold text-2xl text-text-1 mb-1">{m.value}</p>
              <p className={`text-xs ${m.positive ? 'text-live' : 'text-critical'}`}>{m.trend}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

          {/* ── Article queue ── */}
          <div className="bg-surface border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display font-bold text-text-1 text-xl">Article queue</h2>
                <p className="text-text-3 text-xs mt-1">AI-generated articles pending review</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-medium">
                {QUEUED_ARTICLES.length} pending
              </span>
            </div>
            <div className="flex flex-col gap-3">
              {QUEUED_ARTICLES.map(article => (
                <div key={article.id} className="bg-surface-2 border border-border rounded-xl p-4">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${CATEGORY_STYLES[article.category] ?? ''}`}>
                      {article.category}
                    </span>
                    {article.severity && (
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${SEVERITY_STYLES[article.severity]}`}>
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
                        <div className="h-full bg-live rounded-full" style={{ width: `${article.confidence}%` }}></div>
                      </div>
                      <span className="text-text-3 text-xs">{article.confidence}% confidence</span>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 rounded-lg bg-live/10 border border-live/30 text-live text-xs hover:bg-live/20 transition-all">
                        ✓ Publish
                      </button>
                      <button className="px-3 py-1 rounded-lg bg-critical/10 border border-critical/30 text-critical text-xs hover:bg-critical/20 transition-all">
                        ✕ Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Error log ── */}
          <div className="bg-surface border border-border rounded-2xl p-6">
            <div className="mb-6">
              <h2 className="font-display font-bold text-text-1 text-xl">System log</h2>
              <p className="text-text-3 text-xs mt-1">Recent pipeline events and errors</p>
            </div>
            <div className="flex flex-col gap-3">
              {errorLog.map((log, i) => (
                <div key={i} className="flex items-start gap-3 bg-surface-2 border border-border rounded-xl p-4">
                  <span className="font-mono text-xs text-text-3 flex-shrink-0 mt-0.5">{log.time}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded flex-shrink-0 font-mono
                    ${log.level === 'ERROR' ? 'bg-critical/10 text-critical' :
                      log.level === 'WARN'  ? 'bg-high/10 text-high' :
                      'bg-live/10 text-live'}`}>
                    {log.level}
                  </span>
                  <p className="text-text-2 text-xs leading-relaxed">{log.message}</p>
                </div>
              ))}
            </div>

            {/* Sources monitored */}
            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-text-3 text-xs uppercase tracking-wider mb-3">Sources monitored</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: 'NewsAPI', status: 'active', calls: '850/1000' },
                  { name: 'GitHub API', status: 'active', calls: '120/5000' },
                  { name: 'CVE Database', status: 'active', calls: 'Unlimited' },
                  { name: 'RSS Feeds', status: 'active', calls: '47 feeds' },
                ].map(src => (
                  <div key={src.name} className="flex items-center justify-between bg-surface border border-border rounded-lg px-3 py-2">
                    <div>
                      <p className="text-text-1 text-xs font-medium">{src.name}</p>
                      <p className="text-text-3 text-xs">{src.calls}</p>
                    </div>
                    <span className="pulse-dot" style={{ width: '6px', height: '6px' }}></span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}