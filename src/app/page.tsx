import { FileText } from 'lucide-react'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <FileText className="text-primary mb-6 h-16 w-16" />
      <h1 className="mb-3 text-3xl font-bold">견적서 웹 뷰어</h1>
      <p className="text-muted-foreground max-w-md text-center">
        전달받은 견적서 링크를 통해 견적서를 확인하고 PDF로 다운로드할 수
        있습니다.
      </p>
    </main>
  )
}
