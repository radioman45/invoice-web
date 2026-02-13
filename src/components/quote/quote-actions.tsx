'use client'

import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function QuoteActions() {
  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="flex justify-center gap-3 print:hidden">
      <Button onClick={handlePrint} size="lg">
        <Download className="mr-2 h-4 w-4" />
        PDF 다운로드 / 인쇄
      </Button>
    </div>
  )
}
