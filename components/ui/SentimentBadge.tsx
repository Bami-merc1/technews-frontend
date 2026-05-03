import { Severity } from '@/lib/types'

const SEVERITY_STYLES: Record<string, string> = {
  critical: 'bg-critical/10 text-critical border border-critical/30',
  high:     'bg-high/10 text-high border border-high/30',
  medium:   'bg-medium/10 text-medium border border-medium/30',
  low:      'bg-low/10 text-low border border-low/30',
}

const SEVERITY_COLORS: Record<string, string> = {
  critical: '#ff4444',
  high:     '#ff8c00',
  medium:   '#f5c400',
  low:      '#00cc88',
}

interface SentimentBadgeProps {
  severity: Severity
  showLabel?: boolean
}

export default function SentimentBadge({ severity, showLabel = true }: SentimentBadgeProps) {
  if (!severity) return null

  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1 ${SEVERITY_STYLES[severity]}`}>
      {(severity === 'critical' || severity === 'high') && (
        <span
          className="pulse-dot"
          style={{ width: '6px', height: '6px', background: SEVERITY_COLORS[severity] }}
        />
      )}
      {showLabel && severity.charAt(0).toUpperCase() + severity.slice(1)}
    </span>
  )
}