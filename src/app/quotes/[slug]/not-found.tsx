import Link from 'next/link'
import { FileQuestion } from 'lucide-react'
import { SiteHeader } from '@/components/layout/site-header'
import { Button } from '@/components/ui/button'

export default function QuoteNotFound() {
  return (
    <div className="bg-background min-h-screen">
      <SiteHeader />
      <main className="site-container flex min-h-[calc(100vh-4rem)] items-center py-8">
        <section className="border-border/70 bg-card/80 w-full rounded-xl border px-6 py-10 text-center shadow-sm sm:px-8">
          <FileQuestion className="text-muted-foreground mx-auto mb-6 h-16 w-16" />
          <h1 className="mb-2 text-2xl font-bold">견적서를 찾을 수 없습니다</h1>
          <p className="text-muted-foreground mb-8 text-center">
            요청하신 견적서가 존재하지 않거나 만료되었습니다.
            <br />
            링크를 다시 확인해 주세요.
          </p>
          <Button asChild>
            <Link href="/">홈으로 돌아가기</Link>
          </Button>
        </section>
      </main>
    </div>
  )
}
