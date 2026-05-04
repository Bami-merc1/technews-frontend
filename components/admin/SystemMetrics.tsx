interface Metric {
  label: string
  value: string
  trend: string
  positive: boolean
}

interface SystemMetricsProps {
  metrics: Metric[]
}

export default function SystemMetrics({ metrics }: SystemMetricsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {metrics.map(m => (
        <div key={m.label} className="bg-surface border border-border rounded-2xl p-5">
          <p className="text-text-3 text-xs mb-2 leading-tight">{m.label}</p>
          <p className="font-display font-bold text-2xl text-text-1 mb-1">{m.value}</p>
          <p className={`text-xs ${m.positive ? 'text-live' : 'text-critical'}`}>
            {m.trend}
          </p>
        </div>
      ))}
    </div>
  )
}