import type { Quote } from '@/lib/notion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface QuotePartiesProps {
  quote: Quote
}

export function QuoteParties({ quote }: QuotePartiesProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {/* 수신자 정보 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-muted-foreground text-sm font-semibold">
            수신
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm">
          <p className="font-medium">{quote.clientCompany}</p>
          {quote.clientName && <p>{quote.clientName} 님</p>}
          {quote.clientPhone && <p>{quote.clientPhone}</p>}
          {quote.clientEmail && <p>{quote.clientEmail}</p>}
        </CardContent>
      </Card>

      {/* 발행 정보 (필요시 확장 가능) */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-muted-foreground text-sm font-semibold">
            발행
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm">
          <p className="font-medium">견적서 발행자</p>
          <p className="text-muted-foreground">
            본 견적서는 상기 내용으로 발행되었습니다.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
