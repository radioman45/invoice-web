import type { Quote } from '@/lib/notion'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive'> = {
  발행완료: 'default',
  작성중: 'secondary',
  만료: 'destructive',
}

interface QuoteHeaderProps {
  quote: Quote
}

export function QuoteHeader({ quote }: QuoteHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold sm:text-3xl">{quote.title}</h1>
        <Badge
          variant={statusVariant[quote.status] ?? 'secondary'}
          className="w-fit print:hidden"
        >
          {quote.status}
        </Badge>
      </div>
      <div className="text-muted-foreground flex flex-wrap gap-x-6 gap-y-1 text-sm">
        <span>견적번호: {quote.quoteNumber}</span>
        <span>발행일: {formatDate(quote.issueDate)}</span>
        <span>유효기간: {formatDate(quote.validUntil)}</span>
      </div>
    </div>
  )
}
