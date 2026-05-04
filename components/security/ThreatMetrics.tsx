interface ThreatMetricsProps {
  activeToday: number
  criticalThisWeek: number
  guidesPublished: number
  resolvedPercentage: number
}

export default function ThreatMetrics({
  activeToday,
  criticalThisWeek,
  guidesPublished,
  resolvedPercentage,
}: ThreatMetricsProps) {
  const metrics = [
    { label: 'Active threats today',    value: activeToday.toString(),          icon: '⚠' },
    { label: 'Critical CVEs this week', value: criticalThisWeek.toString(),      icon: '🔴' },
    { label: 'Safety guides published', value: guidesPublished.toString(),       icon: '📋' },
    { label: 'Threats resolved',        value: `${resolvedPercentage}%`,         icon: '✅' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
      {metrics.map(m => (
        <div key={m.label} className="bg-surface border border-border rounded-2xl p-5">
          <div className="text-2xl mb-2">{m.icon}</div>
          <div className="font-display font-bold text-3xl text-text-1 mb-1">{m.value}</div>
          <div className="text-text-3 text-xs leading-tight">{m.label}</div>
        </div>
      ))}
    </div>
  )
}