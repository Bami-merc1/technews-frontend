'use client'

import { useState } from 'react'
import Link from 'next/link'

const NAV_LINKS = [
  { label: 'Home',             href: '/' },
  { label: 'Categories',       href: '/category/ai-ml' },
  { label: 'Breaches & Hacks', href: '/breaches',     dot: '#ff4444' },
  { label: 'Security Hub',     href: '/security-hub', dot: '#00ff88' },
  { label: 'Search',           href: '/search' },
]

export default function MobileMenu() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Hamburger button — only shows on mobile */}
      <button
        onClick={() => setOpen(prev => !prev)}
        className="md:hidden flex flex-col gap-1.5 w-8 h-8 items-center justify-center rounded-lg border border-border hover:border-accent transition-all"
        aria-label="Toggle menu"
      >
        <span className={`w-4 h-0.5 bg-text-2 transition-all duration-300 ${open ? 'rotate-45 translate-y-2' : ''}`}></span>
        <span className={`w-4 h-0.5 bg-text-2 transition-all duration-300 ${open ? 'opacity-0' : ''}`}></span>
        <span className={`w-4 h-0.5 bg-text-2 transition-all duration-300 ${open ? '-rotate-45 -translate-y-2' : ''}`}></span>
      </button>

      {/* Mobile dropdown menu */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-bg/60 backdrop-blur-sm md:hidden"
            onClick={() => setOpen(false)}
          />

          {/* Menu panel */}
          <div className="fixed top-16 left-0 right-0 z-50 bg-bg border-b border-border md:hidden">
            <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-1">

              {/* Live badge */}
              <div className="flex items-center gap-2 px-4 py-2 mb-2">
                <span className="pulse-dot"></span>
                <span className="text-live text-xs font-medium">Live feed active</span>
              </div>

              {/* Links */}
              {NAV_LINKS.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-text-2 hover:text-text-1 hover:bg-surface transition-all"
                >
                  {link.dot && (
                    <span
                      className="pulse-dot"
                      style={{ background: link.dot, width: '7px', height: '7px' }}
                    />
                  )}
                  {link.label}
                </Link>
              ))}

              {/* Divider */}
              <div className="border-t border-border my-2" />

              {/* Footer links */}
              <Link href="/breaches"
                onClick={() => setOpen(false)}
                className="px-4 py-2 text-xs text-text-3 hover:text-accent transition-colors">
                Breaches & Hacks feed →
              </Link>
              <Link href="/security-hub"
                onClick={() => setOpen(false)}
                className="px-4 py-2 text-xs text-text-3 hover:text-accent transition-colors">
                Security Hub →
              </Link>

            </div>
          </div>
        </>
      )}
    </>
  )
}