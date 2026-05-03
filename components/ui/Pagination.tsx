'use client'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded-lg border border-border text-text-2 text-sm disabled:opacity-30 hover:border-accent hover:text-accent transition-all disabled:cursor-not-allowed"
      >
        ← Prev
      </button>

      {pages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-9 h-9 rounded-lg text-sm font-medium border transition-all
            ${currentPage === page
              ? 'bg-accent text-bg border-accent'
              : 'border-border text-text-2 hover:border-accent hover:text-accent'
            }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded-lg border border-border text-text-2 text-sm disabled:opacity-30 hover:border-accent hover:text-accent transition-all disabled:cursor-not-allowed"
      >
        Next →
      </button>
    </div>
  )
}