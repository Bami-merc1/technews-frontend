'use client'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

// Strip dangerous characters as user types
function sanitizeKeystroke(raw: string): string {
  return raw
    .slice(0, 100)
    .replace(/[<>'"`;\\\/\x00-\x1f\x7f]/g, '')
    .replace(/(javascript:|data:|on\w+\s*=)/gi, '')
}

export default function SearchBar({
  value,
  onChange,
  placeholder = 'Search articles, topics, CVEs...',
}: SearchBarProps) {
  function handleChange(raw: string) {
    onChange(sanitizeKeystroke(raw))
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text')
    onChange(sanitizeKeystroke(pasted))
  }

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
        onChange={e => handleChange(e.target.value)}
        onPaste={handlePaste}
        placeholder={placeholder}
        maxLength={100}
        autoComplete="off"
        spellCheck={false}
        autoCorrect="off"
        autoCapitalize="off"
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