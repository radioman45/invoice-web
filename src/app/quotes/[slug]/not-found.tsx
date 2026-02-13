import Link from 'next/link'
import { FileQuestion } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function QuoteNotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <FileQuestion className="text-muted-foreground mb-6 h-16 w-16" />
      <h1 className="mb-2 text-2xl font-bold">견적서를 찾을 수 없습니다</h1>
      <p className="text-muted-foreground mb-8 text-center">
        요청하신 견적서가 존재하지 않거나 만료되었습니다.
        <br />
        링크를 다시 확인해 주세요.
      </p>
      <Button asChild>
        <Link href="/">홈으로 돌아가기</Link>
      </Button>
    </main>
  )
}
