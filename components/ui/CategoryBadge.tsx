const CATEGORY_STYLES: Record<string, string> = {
  'AI/ML':                'bg-accent/10 text-accent',
  'Cybersecurity':        'bg-critical/10 text-critical',
  'Software Development': 'bg-live/10 text-live',
  'Blockchain':           'bg-medium/10 text-medium',
  'FinTech & Business':   'bg-high/10 text-high',
  'Hardware':             'bg-purple-400/10 text-purple-400',
}

interface CategoryBadgeProps {
  category: string
  size?: 'sm' | 'md'
}

export default function CategoryBadge({ category, size = 'sm' }: CategoryBadgeProps) {
  const styles = CATEGORY_STYLES[category] ?? 'bg-surface text-text-2'
  const padding = size === 'md' ? 'px-3 py-1' : 'px-2.5 py-1'

  return (
    <span className={`text-xs font-medium rounded-full ${padding} ${styles}`}>
      {category}
    </span>
  )
}