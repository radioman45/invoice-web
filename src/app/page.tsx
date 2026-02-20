import Link from 'next/link'
import {
  Globe,
  FileDown,
  ShieldCheck,
  ArrowRight,
  FileText,
  Link2,
  Eye,
  Download,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

// ─────────────────────────────────────────────
// 기능 소개 카드 데이터
// ─────────────────────────────────────────────
const features = [
  {
    icon: Globe,
    title: '웹 어디서든 열람',
    description:
      '별도 프로그램 설치 없이 링크 하나로 견적서를 웹 브라우저에서 바로 확인할 수 있습니다. PC, 모바일, 태블릿 모두 지원합니다.',
  },
  {
    icon: FileDown,
    title: 'PDF 다운로드',
    description:
      '필요할 때 언제든지 견적서를 PDF 파일로 저장할 수 있습니다. 인쇄에 최적화된 레이아웃으로 깔끔하게 출력됩니다.',
  },
  {
    icon: ShieldCheck,
    title: '상태 기반 접근 제어',
    description:
      '견적서 상태(활성/만료/취소)에 따라 열람 권한이 자동으로 제어됩니다. 유효하지 않은 견적서는 안전하게 차단됩니다.',
  },
]

// ─────────────────────────────────────────────
// 사용 방법 단계 데이터
// ─────────────────────────────────────────────
const steps = [
  {
    step: '01',
    icon: Link2,
    title: '링크를 받으세요',
    description:
      '담당자로부터 견적서 링크를 이메일 또는 메신저로 전달받습니다.',
  },
  {
    step: '02',
    icon: Eye,
    title: '웹에서 확인하세요',
    description:
      '링크를 클릭하면 브라우저에서 견적서 내용을 바로 확인할 수 있습니다.',
  },
  {
    step: '03',
    icon: Download,
    title: 'PDF로 저장하세요',
    description:
      '필요한 경우 PDF 다운로드 버튼을 눌러 견적서를 파일로 저장합니다.',
  },
]

// ─────────────────────────────────────────────
// 랜딩 페이지 메인 컴포넌트 (Server Component)
// ─────────────────────────────────────────────
export default function Home() {
  return (
    /* 인쇄 시 랜딩 페이지는 표시하지 않음 */
    <div className="bg-background flex min-h-screen flex-col print:hidden">
      {/* ── 히어로 섹션 ── */}
      <section
        aria-labelledby="hero-heading"
        className="flex flex-1 flex-col items-center justify-center px-4 py-20 text-center sm:px-6 md:py-32 lg:px-8"
      >
        <div className="mx-auto w-full max-w-3xl space-y-8">
          {/* 서비스 배지 */}
          <div className="flex justify-center">
            <Badge variant="secondary" className="gap-1.5 px-3 py-1 text-sm">
              <FileText className="size-3.5" aria-hidden="true" />웹 기반 견적서
              서비스
            </Badge>
          </div>

          {/* 메인 타이틀 */}
          <div className="space-y-4">
            <h1
              id="hero-heading"
              className="text-foreground text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
            >
              견적서를 웹에서
              <br />
              <span className="text-muted-foreground">간편하게 확인하세요</span>
            </h1>

            {/* 서브 설명 */}
            <p className="text-muted-foreground mx-auto max-w-xl text-base sm:text-lg">
              전달받은 링크 하나로 견적서를 웹 브라우저에서 바로 열람하고, PDF로
              저장하거나 인쇄할 수 있습니다.
            </p>
          </div>

          {/* CTA 버튼 그룹 */}
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            {/* TODO: 예시 견적서 페이지 경로 연결 필요 */}
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/quote/example">
                견적서 예시 보기
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>

            {/* TODO: 실제 서비스 안내 페이지 경로 연결 필요 */}
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
            >
              <Link href="#how-to-use">사용 방법 보기</Link>
            </Button>
          </div>
        </div>
      </section>

      <Separator />

      {/* ── 기능 소개 섹션 ── */}
      <section
        aria-labelledby="features-heading"
        className="bg-muted/30 px-4 py-16 sm:px-6 md:py-24 lg:px-8"
      >
        <div className="mx-auto w-full max-w-6xl">
          {/* 섹션 헤더 */}
          <div className="mx-auto mb-12 max-w-2xl space-y-3 text-center">
            <h2
              id="features-heading"
              className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl"
            >
              주요 기능
            </h2>
            <p className="text-muted-foreground">
              복잡한 과정 없이 견적서를 편리하게 관리하고 공유하세요.
            </p>
          </div>

          {/* 기능 카드 그리드 */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3" role="list">
            {features.map(feature => {
              const Icon = feature.icon
              return (
                <Card
                  key={feature.title}
                  role="listitem"
                  className="transition-shadow duration-200 hover:shadow-md"
                >
                  <CardHeader>
                    {/* 기능 아이콘 */}
                    <div
                      className="bg-primary/10 flex size-10 items-center justify-center rounded-lg"
                      aria-hidden="true"
                    >
                      <Icon className="text-primary size-5" />
                    </div>
                    <CardTitle className="text-base">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      <Separator />

      {/* ── 사용 방법 섹션 ── */}
      <section
        id="how-to-use"
        aria-labelledby="how-to-use-heading"
        className="px-4 py-16 sm:px-6 md:py-24 lg:px-8"
      >
        <div className="mx-auto w-full max-w-6xl">
          {/* 섹션 헤더 */}
          <div className="mx-auto mb-12 max-w-2xl space-y-3 text-center">
            <h2
              id="how-to-use-heading"
              className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl"
            >
              사용 방법
            </h2>
            <p className="text-muted-foreground">
              단 3단계로 견적서를 간편하게 확인할 수 있습니다.
            </p>
          </div>

          {/* 단계 그리드 */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {steps.map((item, index) => {
              const Icon = item.icon
              return (
                <div
                  key={item.step}
                  className="relative flex flex-col items-center gap-4 text-center"
                >
                  {/* 단계 번호와 아이콘 */}
                  <div className="bg-primary text-primary-foreground relative flex size-16 items-center justify-center rounded-full shadow-md">
                    <Icon className="size-7" aria-hidden="true" />
                    {/* 단계 번호 뱃지 */}
                    <span
                      className="bg-background text-foreground ring-border absolute -top-1 -right-1 flex size-6 items-center justify-center rounded-full text-xs font-bold ring-2"
                      aria-hidden="true"
                    >
                      {index + 1}
                    </span>
                  </div>

                  {/* 단계 내용 */}
                  <div className="space-y-2">
                    <h3 className="text-foreground text-lg font-semibold">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* 단계 연결 화살표 (마지막 단계 제외, 데스크톱 전용) */}
                  {index < steps.length - 1 && (
                    <ArrowRight
                      className="text-muted-foreground/50 absolute top-5 -right-4 hidden size-5 md:block"
                      aria-hidden="true"
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <Separator />

      {/* ── 푸터 ── */}
      <footer
        role="contentinfo"
        className="px-4 py-8 text-center sm:px-6 lg:px-8"
      >
        <p className="text-muted-foreground text-sm">
          &copy; {new Date().getFullYear()} 견적서 웹 뷰어. All rights reserved.
        </p>
      </footer>
    </div>
  )
}
