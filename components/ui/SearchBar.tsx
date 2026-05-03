'use client'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function SearchBar({
  value,
  onChange,
  placeholder = 'Search articles, topics, CVEs...'
}: SearchBarProps) {
  return (
    <div className="relative">
      <svg
        className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-3"
        fill="none" viewBox="0 0 24 24"
        stroke="currentColor" strokeWidth={2}
      >
        <circle cx="11" cy="11" r="8"/>
        <path d="m21 21-4.35-4.35"/>
      </svg>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-surface border border-border rounded-xl pl-12 pr-10 py-4 text-text-1 placeholder-text-3 focus:outline-none focus:border-accent transition-colors text-base"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-text-3 hover:text-text-1 transition-colors"
        >
          ✕
        </button>
      )}
    </div>
  )
}