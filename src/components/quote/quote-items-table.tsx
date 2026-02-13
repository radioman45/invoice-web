import type { QuoteItem } from '@/lib/notion'
import { formatCurrency } from '@/lib/utils'

interface QuoteItemsTableProps {
  items: QuoteItem[]
}

export function QuoteItemsTable({ items }: QuoteItemsTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted/50 border-b">
            <th className="px-4 py-3 text-left font-semibold">No.</th>
            <th className="px-4 py-3 text-left font-semibold">품명</th>
            <th className="hidden px-4 py-3 text-left font-semibold sm:table-cell">
              규격
            </th>
            <th className="px-4 py-3 text-right font-semibold">수량</th>
            <th className="hidden px-4 py-3 text-center font-semibold sm:table-cell">
              단위
            </th>
            <th className="hidden px-4 py-3 text-right font-semibold sm:table-cell">
              단가
            </th>
            <th className="px-4 py-3 text-right font-semibold">금액</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={item.id} className="border-b last:border-b-0">
              <td className="text-muted-foreground px-4 py-3">{index + 1}</td>
              <td className="px-4 py-3 font-medium">
                {item.name}
                {/* 모바일에서 규격 표시 */}
                {item.spec && (
                  <span className="text-muted-foreground block text-xs sm:hidden">
                    {item.spec}
                  </span>
                )}
              </td>
              <td className="text-muted-foreground hidden px-4 py-3 sm:table-cell">
                {item.spec || '-'}
              </td>
              <td className="px-4 py-3 text-right">
                {item.quantity.toLocaleString('ko-KR')}
              </td>
              <td className="hidden px-4 py-3 text-center sm:table-cell">
                {item.unit || '-'}
              </td>
              <td className="hidden px-4 py-3 text-right sm:table-cell">
                {formatCurrency(item.unitPrice)}
              </td>
              <td className="px-4 py-3 text-right font-medium">
                {formatCurrency(item.amount)}
              </td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr>
              <td
                colSpan={7}
                className="text-muted-foreground px-4 py-8 text-center"
              >
                견적 항목이 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
