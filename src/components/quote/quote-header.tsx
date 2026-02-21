import type { Quote } from '@/lib/notion'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive'> = {
  승인: 'default',
  발행완료: 'default',
  작성중: 'secondary',
  만료: 'destructive',
}

interface QuoteHeaderProps {
  quote: Quote
}

export function QuoteHeader({ quote }: QuoteHeaderProps) {
  const quoteNumber = quote.quoteNumber || '-'

  return (
    <div className="border-border/70 bg-card/80 space-y-4 rounded-xl border p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold sm:text-3xl">{quote.title}</h1>
        <Badge
          variant={statusVariant[quote.status] ?? 'secondary'}
          className="w-fit print:hidden"
        >
          {quote.status}
        </Badge>
      </div>
      <div className="text-muted-foreground grid gap-1.5 text-sm sm:grid-cols-3 sm:gap-3">
        <p>
          견적번호: <span className="text-foreground">{quoteNumber}</span>
        </p>
        <p>
          발행일:{' '}
          <span className="text-foreground">{formatDate(quote.issueDate)}</span>
        </p>
        <p>
          유효기간:{' '}
          <span className="text-foreground">
            {formatDate(quote.validUntil)}
          </span>
        </p>
      </div>
    </div>
  )
}
