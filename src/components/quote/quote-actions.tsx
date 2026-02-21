'use client'

import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function QuoteActions() {
  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="flex justify-center gap-3 pt-2 print:hidden">
      <Button onClick={handlePrint} size="lg" aria-label="PDF로 저장 또는 인쇄">
        <Download className="mr-2 h-4 w-4" />
        PDF 다운로드 / 인쇄
      </Button>
    </div>
  )
}
