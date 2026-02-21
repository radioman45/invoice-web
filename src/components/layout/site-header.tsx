'use client'

import Link from 'next/link'
import { FileText } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'

export function SiteHeader() {
  return (
    <header className="border-border/60 bg-background/85 sticky top-0 z-30 border-b backdrop-blur print:hidden">
      <div className="site-container flex h-16 items-center justify-between">
        <Link
          href="/"
          className="text-foreground flex items-center gap-2.5 transition-opacity hover:opacity-80"
        >
          <span className="bg-primary/10 text-primary inline-flex size-8 items-center justify-center rounded-md">
            <FileText className="size-4" aria-hidden="true" />
          </span>
          <span className="text-sm font-semibold tracking-tight sm:text-base">
            견적서 웹 뷰어
          </span>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  )
}
