'use client'

import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function QuoteError({ reset }: ErrorPageProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <AlertTriangle className="text-destructive mb-6 h-16 w-16" />
      <h1 className="mb-2 text-2xl font-bold">오류가 발생했습니다</h1>
      <p className="text-muted-foreground mb-8 text-center">
        견적서를 불러오는 중 문제가 발생했습니다.
        <br />
        잠시 후 다시 시도해 주세요.
      </p>
      <Button onClick={reset}>다시 시도</Button>
    </main>
  )
}
