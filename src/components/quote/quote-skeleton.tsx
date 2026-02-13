import { Skeleton } from '@/components/ui/skeleton'

export function QuoteSkeleton() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* 헤더 */}
      <div className="space-y-4">
        <Skeleton className="h-9 w-64" />
        <div className="flex gap-6">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>

      {/* 카드 2개 */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Skeleton className="h-36 rounded-lg" />
        <Skeleton className="h-36 rounded-lg" />
      </div>

      {/* 테이블 */}
      <Skeleton className="h-64 rounded-lg" />

      {/* 합계 */}
      <div className="flex justify-end">
        <Skeleton className="h-28 w-72" />
      </div>
    </div>
  )
}
