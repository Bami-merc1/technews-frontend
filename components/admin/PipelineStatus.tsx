'use client'

interface PipelineStatusProps {
  isRunning: boolean
  lastPublished: string
  nextPoll: string
  onPause: () => void
  onForceSync: () => void
}

export default function PipelineStatus({
  isRunning,
  lastPublished,
  nextPoll,
  onPause,
  onForceSync,
}: PipelineStatusProps) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-6 mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-text-3 text-xs uppercase tracking-wider mb-2">Pipeline status</p>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {isRunning
                ? <span className="pulse-dot"></span>
                : <span className="w-2 h-2 rounded-full bg-critical"></span>
              }
              <span className={`font-display font-bold text-xl ${isRunning ? 'text-live' : 'text-critical'}`}>
                {isRunning ? 'Running' : 'Paused'}
              </span>
            </div>
            <span className="text-text-3 text-sm">· Next poll in {nextPoll}</span>
          </div>
          <p className="text-text-2 text-sm mt-1">
            Last article published: <span className="text-text-1">{lastPublished}</span>
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={onPause}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium border transition-all
              ${isRunning
                ? 'bg-critical/10 border-critical/30 text-critical hover:bg-critical/20'
                : 'bg-live/10 border-live/30 text-live hover:bg-live/20'}`}>
            {isRunning ? '⏸ Pause pipeline' : '▶ Resume pipeline'}
          </button>
          <button
            onClick={onForceSync}
            className="px-5 py-2.5 rounded-xl bg-live/10 border border-live/30 text-live text-sm font-medium hover:bg-live/20 transition-all">
            ↺ Force sync now
          </button>
        </div>
      </div>
    </div>
  )
}