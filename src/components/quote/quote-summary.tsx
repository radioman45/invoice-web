import type { Quote } from '@/lib/notion'
import { formatCurrency } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'

interface QuoteSummaryProps {
  quote: Quote
}

export function QuoteSummary({ quote }: QuoteSummaryProps) {
  return (
    <div className="flex justify-end">
      <div className="w-full space-y-2 sm:w-72">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">공급가액</span>
          <span>{formatCurrency(quote.subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">부가세 (10%)</span>
          <span>{formatCurrency(quote.tax)}</span>
        </div>
        <Separator />
        <div className="flex justify-between text-lg font-bold">
          <span>총합계</span>
          <span className="text-primary">{formatCurrency(quote.total)}</span>
        </div>
      </div>
    </div>
  )
}
