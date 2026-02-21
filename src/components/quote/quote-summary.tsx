import type { Quote } from '@/lib/notion'
import { formatCurrency } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'

interface QuoteSummaryProps {
  quote: Quote
}

export function QuoteSummary({ quote }: QuoteSummaryProps) {
  return (
    <div className="border-border/70 bg-card/80 w-full rounded-xl border shadow-sm">
      <div className="flex justify-between px-5 py-3.5 text-base">
        <span className="text-muted-foreground">공급가액</span>
        <span>{formatCurrency(quote.subtotal)}</span>
      </div>
      <div className="flex justify-between px-5 py-3.5 text-base">
        <span className="text-muted-foreground">부가세 (10%)</span>
        <span>{formatCurrency(quote.tax)}</span>
      </div>
      <Separator />
      <div className="flex justify-between px-5 py-4 text-xl font-bold">
        <span>총합계</span>
        <span className="text-primary">{formatCurrency(quote.total)}</span>
      </div>
    </div>
  )
}
