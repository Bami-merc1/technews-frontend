import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TechPulse — AI-Powered Tech News',
  description: 'Real-time AI-generated technology news, cybersecurity alerts and safety guides.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>

        {/* ── Navbar ── */}
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-bg/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-accent flex items-center justify-center">
                <span className="text-bg font-bold text-sm">EM</span>
              </div>
              <span className="font-display font-bold text-text-1 text-lg tracking-tight">
                EMerc<span className="text-accent">Intel</span>
              </span>
            </Link>

            {/* Nav links */}
            <div className="hidden md:flex items-center gap-1">
              <Link href="/" className="px-4 py-2 rounded-lg text-sm text-text-2 hover:text-text-1 hover:bg-surface transition-all">
                Home
              </Link>
              <Link href="/category/ai-ml" className="px-4 py-2 rounded-lg text-sm text-text-2 hover:text-text-1 hover:bg-surface transition-all">
                Categories
              </Link>
              <Link href="/breaches" className="px-4 py-2 rounded-lg text-sm text-text-2 hover:text-text-1 hover:bg-surface transition-all flex items-center gap-2">
                <span className="pulse-dot" style={{ background: '#ff4444' }}></span>
                Breaches & Hacks
              </Link>
              <Link href="/security-hub" className="px-4 py-2 rounded-lg text-sm text-text-2 hover:text-text-1 hover:bg-surface transition-all flex items-center gap-2">
                <span className="pulse-dot"></span>
                Security Hub
              </Link>
              <Link href="/search" className="px-4 py-2 rounded-lg text-sm text-text-2 hover:text-text-1 hover:bg-surface transition-all">
                Search
              </Link>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-live/30 bg-live/5">
                <span className="pulse-dot"></span>
                <span className="text-live text-xs font-medium">Live</span>
              </div>
              <Link href="/admin" className="px-4 py-2 rounded-lg text-sm border border-border text-text-2 hover:border-accent hover:text-accent transition-all">
                Admin
              </Link>
            </div>

          </div>
        </nav>

        {/* ── Page content ── */}
        <main className="pt-16 min-h-screen">
          {children}
        </main>

        {/* ── Footer ── */}
        <footer className="border-t border-border bg-surface mt-20">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

              {/* Brand */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 rounded-md bg-accent flex items-center justify-center">
                    <span className="text-bg font-bold text-sm">EM</span>
                  </div>
                  <span className="font-display font-bold text-text-1 text-lg">
                    EMerc<span className="text-accent">Intel</span>
                  </span>
                </div>
                <p className="text-text-3 text-sm leading-relaxed">
                  AI-powered real-time technology news. Automated, categorized, and always on.
                </p>
              </div>

              {/* Categories */}
              <div>
                <h4 className="text-text-1 font-medium text-sm mb-4">Categories</h4>
                <div className="flex flex-col gap-2">
                  {[
                    'AI/ML',
                    'Cybersecurity',
                    'Software Development',
                    'Blockchain',
                    'FinTech & Business',
                    'Hardware',
                  ].map(cat => (
                    <Link
                      key={cat}
                      href={`/category/${cat.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                      className="text-text-3 text-sm hover:text-accent transition-colors"
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Platform */}
              <div>
                <h4 className="text-text-1 font-medium text-sm mb-4">Platform</h4>
                <div className="flex flex-col gap-2">
                  {[
                    { label: 'Breaches & Hacks', href: '/breaches' },
                    { label: 'Security Hub',      href: '/security-hub' },
                    { label: 'Search',            href: '/search' },
                    { label: 'Admin Dashboard',   href: '/admin' },
                  ].map(link => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-text-3 text-sm hover:text-accent transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>

            </div>

            {/* Bottom bar */}
            <div className="border-t border-border mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-text-3 text-xs">
                © {new Date().getFullYear()} EMercIntel · Built by EMerc Enterprise
              </p>
              <p className="text-text-3 text-xs flex items-center gap-1">
                <span className="pulse-dot" style={{width:'6px', height:'6px'}}></span>
                Powered by EMerc Enterprise · Updated in real time through AI
              </p>
            </div>

          </div>
        </footer>

      </body>
    </html>
  )
}