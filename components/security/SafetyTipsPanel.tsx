'use client'

import { useState } from 'react'
import { SafetyTips, Severity } from '@/lib/types'

interface SafetyTipsPanelProps {
  safetyTips: SafetyTips
  severity: Severity
}

export default function SafetyTipsPanel({ safetyTips, severity }: SafetyTipsPanelProps) {
  const [audience, setAudience] = useState<'general' | 'technical' | 'student'>('general')

  const tabs = [
    { key: 'general'   as const, label: 'General public' },
    { key: 'technical' as const, label: 'Tech / Developers' },
    { key: 'student'   as const, label: 'Students' },
  ]

  const activeTips = safetyTips[audience]

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 mb-12">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display font-bold text-text-1 text-xl">How to stay safe</h3>
        {severity && (
          <span className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full border
            ${severity === 'critical'
              ? 'bg-critical/10 text-critical border-critical/30'
              : 'bg-high/10 text-high border-high/30'}`}>
            {severity === 'critical' && (
              <span className="pulse-dot" style={{ width: '6px', height: '6px', background: '#ff4444' }}></span>
            )}
            {severity.charAt(0).toUpperCase() + severity.slice(1)} threat
          </span>
        )}
      </div>

      {/* Audience toggle */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {tabs.map(tab => (
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

      {/* Student explainer */}
      {audience === 'student' && safetyTips.student.explainer && (
        <div className="bg-surface-2 border border-border rounded-xl p-4 mb-6">
          <p className="text-xs font-medium text-text-3 mb-1">Plain English explainer</p>
          <p className="text-text-1 text-sm leading-relaxed">
            {safetyTips.student.explainer}
          </p>
        </div>
      )}

      {/* Bullets */}
      <ul className="flex flex-col gap-3 mb-6">
        {activeTips.bullets.map((tip, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-text-1">
            <div className="w-5 h-5 rounded-full bg-live/10 border border-live/30 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <polyline points="1.5,5 4,7.5 8.5,2" stroke="#00ff88"
                  strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className={tip.isCode
              ? 'font-mono text-accent text-xs bg-surface-2 px-2 py-1 rounded'
              : ''}>
              {tip.text}
            </span>
          </li>
        ))}
      </ul>

      {/* Guide steps */}
      {activeTips.guide.length > 0 && (
        <div className="border-t border-border pt-4">
          <p className="text-text-3 text-xs mb-3 font-medium uppercase tracking-wider">
            {audience === 'student' ? 'Learn more' : 'Detailed guide'}
          </p>
          <div className="flex flex-col gap-3">
            {activeTips.guide.map((step, i) => (
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
  )
}