import type { Metadata } from 'next'

import { Geist, Geist_Mono } from 'next/font/google'
import Link from 'next/link'

import { AppProviders } from '@/components/AppProviders'

import './globals.css'

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans'
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono'
})

export const metadata: Metadata = {
  description: 'Browse and search with infinite scroll',
  title: 'Pokémon Explorer'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppProviders>
          <header className="sticky top-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur-md">
            <nav className="mx-auto flex h-14 max-w-7xl items-center gap-6 px-4">
              <Link
                href="/"
                className="text-sm font-semibold tracking-wide text-white/80 transition-colors hover:text-white"
              >
                Pokédex
              </Link>
              <Link
                href="/battles"
                className="text-sm font-semibold tracking-wide text-white/80 transition-colors hover:text-white"
              >
                Battles
              </Link>
            </nav>
          </header>
          {children}
        </AppProviders>
      </body>
    </html>
  )
}
