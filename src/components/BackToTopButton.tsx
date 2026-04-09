'use client'

import { ChevronUp } from 'lucide-react'
import { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'

const SCROLL_SHOW_AT = 400

export function BackToTopButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SCROLL_SHOW_AT)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      aria-label="Back to top"
      className={cn(
        'fixed bottom-6 right-4 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-white/80 bg-white/90 text-foreground shadow-[0_18px_40px_rgba(148,163,184,0.18)] transition-[opacity,transform] duration-200 hover:bg-white focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none sm:right-6 lg:right-8',
        visible
          ? 'pointer-events-auto translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-2 opacity-0'
      )}
      onClick={() => window.scrollTo({ behavior: 'smooth', top: 0 })}
      type="button"
    >
      <ChevronUp aria-hidden className="size-5" />
    </button>
  )
}
