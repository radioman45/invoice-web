# Invoice-Web 프로젝트 개발 가이드라인 (AI Agent 전용)

> **목적**: 이 문서는 AI Agent가 invoice-web 프로젝트에서 코드를 작성하고 수정할 때 따라야 할 **프로젝트 특화 규칙**만을 담고 있습니다. 일반적인 Next.js/React 지식은 포함하지 않습니다.

## 1. 프로젝트 개요

### 1-1. MVP 범위

- **핵심 기능**: Notion DB 기반 견적서 웹 뷰어 + PDF 다운로드
- **인증 없음**: slug 기반 접근 제어만 사용
- **Notion 연동**: 관리자는 Notion에서 견적서 관리, 클라이언트는 웹에서 열람

### 1-2. 기술 스택 (고정)

| 항목        | 버전             | 용도                   |
| ----------- | ---------------- | ---------------------- |
| Next.js     | 15.5.3           | App Router + Turbopack |
| React       | 19.1.0           | Server Component 중심  |
| TypeScript  | 5                | 엄격한 타입 체크       |
| TailwindCSS | v4               | 유틸리티 스타일링      |
| shadcn/ui   | latest           | new-york 스타일        |
| Notion API  | @notionhq/client | 데이터 소스            |

### 1-3. 디렉토리 구조

```
src/
├── app/
│   ├── quotes/[slug]/       # 견적서 상세 페이지 (동적 라우팅)
│   │   ├── page.tsx        # 메인 페이지 (Server Component)
│   │   ├── error.tsx       # 에러 UI (필수)
│   │   └── not-found.tsx   # 404 UI (필수)
│   ├── layout.tsx          # 루트 레이아웃
│   └── page.tsx            # 랜딩 페이지
├── components/
│   ├── quote/              # 견적서 도메인 컴포넌트
│   │   ├── quote-header.tsx
│   │   ├── quote-parties.tsx
│   │   ├── quote-items-table.tsx
│   │   ├── quote-summary.tsx
│   │   └── quote-actions.tsx
│   ├── ui/                 # shadcn/ui 기본 컴포넌트
│   └── providers/          # Context 프로바이더
└── lib/
    ├── notion/             # Notion API 추상화 계층
    │   ├── index.ts       # 공개 API (외부에서 여기만 import)
    │   ├── client.ts      # Notion 클라이언트 초기화
    │   ├── quotes.ts      # 견적서 조회 로직
    │   ├── types.ts       # 타입 정의
    │   ├── schemas.ts     # Zod 스키마
    │   └── utils.ts       # 헬퍼 함수
    ├── utils.ts           # 공통 유틸리티 (cn 함수 등)
    └── env.ts             # 환경변수 검증
```

---

## 2. 핵심 아키텍처 규칙

### 2-1. Notion API 연동 규칙

#### ✅ 반드시 지켜야 할 규칙

1. **Notion API 직접 호출 금지**
   - ❌ 페이지나 컴포넌트에서 `@notionhq/client` 직접 import 금지
   - ✅ 반드시 `@/lib/notion/index.ts`의 추상화 함수만 사용

   ```tsx
   // ❌ 잘못된 방법
   import { Client } from '@notionhq/client'
   const notion = new Client({ auth: process.env.NOTION_API_KEY })

   // ✅ 올바른 방법
   import { getQuoteBySlug, getQuoteItems } from '@/lib/notion'
   ```

2. **타입과 스키마 동시 관리**
   - Notion 속성 추가/수정 시 **반드시 3개 파일 동시 업데이트**:
     - `lib/notion/types.ts`: TypeScript 타입 정의
     - `lib/notion/schemas.ts`: Zod 스키마 정의
     - `lib/notion/quotes.ts`: 데이터 변환 로직 수정

   ```typescript
   // lib/notion/types.ts
   export interface Quote {
     id: string
     title: string
     quoteNumber: string
     // 새 필드 추가 시 여기에도 추가
   }

   // lib/notion/schemas.ts
   export const quoteSchema = z.object({
     id: z.string(),
     title: z.string(),
     quoteNumber: z.string(),
     // 새 필드 추가 시 여기에도 추가
   })
   ```

3. **환경변수 사용**
   - Notion 인증: `NOTION_API_KEY` (필수)
   - Quotes DB ID: `NOTION_QUOTES_DATABASE_ID` (필수)
   - Quote Items DB ID: `NOTION_QUOTE_ITEMS_DATABASE_ID` (필수)
   - `lib/env.ts`에서 자동 검증됨 - 새 환경변수 추가 시 여기에 추가

### 2-2. Server Component 우선 원칙

#### ✅ Server Component 사용 (기본)

```tsx
// ✅ 이런 컴포넌트는 Server Component로 유지
export default async function QuotePage({ params }: QuotePageProps) {
  const quote = await getQuoteBySlug(params.slug) // 서버에서 데이터 패칭
  return <QuoteHeader quote={quote} />
}

// ✅ props로 데이터만 받는 컴포넌트도 Server Component
export function QuoteHeader({ quote }: { quote: Quote }) {
  return <div>{quote.title}</div>
}
```

#### ✅ Client Component 필요 조건 (최소화)

**'use client'를 추가해야 하는 경우만**:

1. `useState`, `useEffect` 등 React 훅 사용
2. 브라우저 전용 API 사용 (`window`, `localStorage`)
3. 이벤트 핸들러 (`onClick`, `onChange`)

```tsx
'use client'

// ✅ PDF 다운로드는 window.print() 사용으로 Client Component 필요
export function QuoteActions() {
  const handlePrint = () => window.print()
  return <Button onClick={handlePrint}>PDF 다운로드</Button>
}
```

**⚠️ 주의**: 기존 Server Component에 'use client' 추가 금지. 새 파일로 분리하세요.

### 2-3. 컴포넌트 구조 규칙

#### 파일 배치 의사결정 트리

```
새 컴포넌트를 어디에 둘까?
│
├─ 견적서 기능 관련인가?
│  └─ YES → components/quote/
│      예: QuoteHeader, QuoteParties, QuoteItemsTable
│
├─ shadcn/ui 기본 컴포넌트인가?
│  └─ YES → npx shadcn@latest add [component-name]
│      자동으로 components/ui/에 생성됨
│
├─ Context 프로바이더인가?
│  └─ YES → components/providers/
│      예: ThemeProvider
│
└─ 그 외 공통 컴포넌트
   └─ components/ (루트)
       예: ThemeToggle
```

#### 컴포넌트 네이밍

- **파일명**: kebab-case (예: `quote-header.tsx`)
- **컴포넌트명**: PascalCase (예: `QuoteHeader`)
- **export 방식**: Named export 사용 (Default export는 page.tsx만)

---

## 3. 개발 워크플로우

### 3-1. 새 기능 추가 시 체크리스트

1. **Server Component 우선 검토**
   - 상호작용 없으면 Server Component 유지
   - 필요 시에만 'use client' 분리

2. **타입 안전성 확보**
   - `any` 타입 절대 금지
   - 새 데이터 구조는 `types.ts`에 interface 정의
   - Notion 데이터는 Zod 스키마로 검증

3. **스타일링**
   - Tailwind 클래스만 사용 (인라인 스타일 금지)
   - 시맨틱 색상 변수 사용 (`bg-background`, `text-foreground`)
   - 프린트 영향 고려 (`@media print`, `print:hidden`)

4. **에러 처리**
   - 페이지 레벨 에러: `error.tsx` 활용
   - 데이터 없음: `notFound()` 호출 → `not-found.tsx` 표시
   - 서버 에러: try-catch + error.tsx 자동 처리

### 3-2. Notion 스키마 변경 워크플로우

Notion DB에 새 속성 추가/수정 시:

```typescript
// 1단계: lib/notion/types.ts - 타입 추가
export interface Quote {
  // 기존 필드...
  newField: string  // 새 필드 추가
}

// 2단계: lib/notion/schemas.ts - 스키마 추가
export const quoteSchema = z.object({
  // 기존 필드...
  newField: z.string(),  // 새 필드 추가
})

// 3단계: lib/notion/quotes.ts - 데이터 매핑 수정
function transformQuote(page: any): Quote {
  return {
    // 기존 매핑...
    newField: extractRichText(page.properties.NewField),
  }
}

// 4단계: 컴포넌트에서 사용
<div>{quote.newField}</div>
```

### 3-3. 새 UI 컴포넌트 추가

#### ✅ shadcn/ui 컴포넌트 추가

```bash
# 반드시 이 명령어 사용 (직접 파일 생성 금지)
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog
```

#### ❌ 직접 생성 금지

```tsx
// ❌ 이렇게 하지 마세요
// components/ui/custom-button.tsx
export function CustomButton() {
  return <button className="...">...</button>
}
```

---

## 4. 스타일링 특수 규칙

### 4-1. 프린트 스타일 (PDF 다운로드 핵심)

#### ✅ 프린트용 클래스 시스템

```tsx
// 프린트 시 표시할 컨텐츠
<div className="print-content">  {/* 이 클래스 필수 */}
  <QuoteHeader />
  <QuoteParties />
  <QuoteItemsTable />
</div>

// 프린트 시 숨길 요소
<Button className="print:hidden">PDF 다운로드</Button>
<ThemeToggle className="print:hidden" />
```

#### ⚠️ 프린트 영향 고려 필수

- 새 버튼/액션 추가 시 → `print:hidden` 클래스 추가
- 헤더/푸터 수정 시 → 프린트 레이아웃 확인
- 여백/패딩 변경 시 → 프린트 페이지 넘김 확인

### 4-2. 시맨틱 색상 시스템

#### ✅ 반드시 사용해야 할 색상 변수

```tsx
// ✅ 올바른 방법 (다크모드 자동 대응)
<div className="bg-background text-foreground">
  <h1 className="text-primary">제목</h1>
  <p className="text-muted-foreground">설명</p>
  <Badge className="bg-secondary text-secondary-foreground">배지</Badge>
</div>

// ❌ 잘못된 방법 (하드코딩된 색상)
<div className="bg-white text-black">
  <h1 className="text-blue-600">제목</h1>
  <p className="text-gray-500">설명</p>
</div>
```

#### 색상 변수 목록

| 변수               | 용도           |
| ------------------ | -------------- |
| `background`       | 페이지 배경    |
| `foreground`       | 메인 텍스트    |
| `primary`          | 주요 액션/강조 |
| `secondary`        | 보조 액션      |
| `muted`            | 비활성 배경    |
| `muted-foreground` | 보조 텍스트    |
| `border`           | 테두리         |
| `destructive`      | 삭제/경고 액션 |

### 4-3. Tailwind 클래스 작성 규칙

```tsx
import { cn } from '@/lib/utils'

// ✅ cn() 함수로 클래스 조합
<div className={cn(
  "base-classes flex items-center",
  condition && "conditional-classes",
  className  // props로 받은 추가 클래스
)}>

// ❌ 인라인 스타일 사용 금지
<div style={{ display: 'flex', padding: '16px' }}>

// ❌ 문자열 연결 금지
<div className={`flex ${isActive ? 'bg-blue-500' : ''} ${className}`}>
```

---

## 5. 엄격한 금지사항

### 5-1. 절대 금지 (Can NOT Do)

| 금지 항목                            | 이유                        | 대안                          |
| ------------------------------------ | --------------------------- | ----------------------------- |
| Server Component에 'use client' 추가 | 서버 최적화 깨짐            | 새 Client Component 파일 분리 |
| Notion API 직접 호출                 | 타입 안전성 상실            | `@/lib/notion` 사용           |
| `any` 타입 사용                      | 타입 체크 무력화            | 명시적 타입 정의              |
| 인라인 스타일 사용                   | Tailwind 시스템 일관성 깨짐 | Tailwind 클래스 사용          |
| 하드코딩된 색상                      | 다크모드 깨짐               | 시맨틱 색상 변수 사용         |
| UI 컴포넌트 직접 생성                | 디자인 시스템 일관성 깨짐   | `npx shadcn add` 사용         |
| `print:hidden` 누락                  | PDF에 불필요한 요소 표시    | 버튼/액션에 필수 추가         |

### 5-2. 일반적 주의사항 (Can Do, But Carefully)

| 주의 항목      | 조건             | 확인사항                           |
| -------------- | ---------------- | ---------------------------------- |
| 새 페이지 추가 | app/ 폴더에 추가 | error.tsx, not-found.tsx 함께 생성 |
| 환경변수 추가  | 필요 시 가능     | `lib/env.ts`에 검증 로직 추가      |
| 컴포넌트 분리  | 재사용성 고려    | 도메인별 폴더 구조 유지            |
| 타입 정의 추가 | 새 데이터 구조   | `types.ts`에 interface 정의        |

---

## 6. AI 의사결정 가이드

### 6-1. "이 파일을 어디에 둘까?" 결정 트리

```
파일 타입 식별
│
├─ Notion 관련 로직인가?
│  └─ lib/notion/
│      - API 호출: quotes.ts
│      - 타입: types.ts
│      - 스키마: schemas.ts
│
├─ 견적서 컴포넌트인가?
│  └─ components/quote/
│      - 도메인 로직 포함
│
├─ shadcn/ui 기본 컴포넌트인가?
│  └─ components/ui/
│      - npx shadcn add 사용
│
├─ 페이지인가?
│  └─ app/[route]/
│      - page.tsx + error.tsx + not-found.tsx
│
└─ 유틸리티 함수인가?
   └─ lib/
       - 공통: utils.ts
       - 환경변수: env.ts
```

### 6-2. "Server vs Client Component?" 결정 트리

```
새 컴포넌트 생성 시
│
├─ useState, useEffect, 이벤트 핸들러 필요?
│  └─ YES → 'use client' 필요
│      - 새 파일로 분리
│      - props로 데이터 전달받기
│
├─ window, localStorage 등 브라우저 API 필요?
│  └─ YES → 'use client' 필요
│
└─ 그 외
   └─ NO → Server Component 유지
       - async 함수로 데이터 패칭
       - props로 자식에게 전달
```

### 6-3. "에러 처리 방법?" 결정 트리

```
에러 발생 위치
│
├─ 페이지 레벨 (page.tsx)
│  └─ error.tsx 자동 처리
│      - try-catch 불필요
│
├─ 데이터 없음
│  └─ notFound() 호출
│      - not-found.tsx 표시
│
└─ 컴포넌트 레벨
   └─ props 검증
       - 조건부 렌더링
       - null 체크
```

---

## 7. 프로젝트 특화 예시

### 7-1. 견적서 조회 전체 플로우

```tsx
// 1. app/quotes/[slug]/page.tsx (Server Component)
export default async function QuotePage({ params }: QuotePageProps) {
  const { slug } = await params

  // 2. lib/notion/index.ts의 추상화 함수 사용
  const quote = await getQuoteBySlug(slug)

  // 3. 데이터 없으면 not-found.tsx로 이동
  if (!quote) {
    notFound()
  }

  // 4. 견적 항목 조회
  const items = await getQuoteItems(quote.id)

  // 5. 컴포넌트에 props 전달 (모두 Server Component)
  return (
    <div className="print-content">
      <QuoteHeader quote={quote} />
      <QuoteParties quote={quote} />
      <QuoteItemsTable items={items} />
      <QuoteSummary quote={quote} />
      <QuoteActions /> {/* 유일한 Client Component */}
    </div>
  )
}
```

### 7-2. 새 Notion 필드 추가 예시

**시나리오**: 견적서에 "할인율" 필드 추가

```typescript
// 1단계: lib/notion/types.ts
export interface Quote {
  // 기존 필드...
  discountRate?: number  // 선택적 필드로 추가
}

// 2단계: lib/notion/schemas.ts
const quoteSchema = z.object({
  // 기존 필드...
  discountRate: z.number().optional(),
})

// 3단계: lib/notion/quotes.ts
function transformQuote(page: PageObjectResponse): Quote {
  const props = page.properties
  return {
    // 기존 매핑...
    discountRate: props.DiscountRate?.type === 'number'
      ? props.DiscountRate.number ?? undefined
      : undefined,
  }
}

// 4단계: components/quote/quote-summary.tsx
export function QuoteSummary({ quote }: { quote: Quote }) {
  return (
    <div>
      {/* 기존 합계 표시... */}
      {quote.discountRate && (
        <div className="text-muted-foreground">
          할인율: {quote.discountRate}%
        </div>
      )}
    </div>
  )
}
```

---

## 8. 문서 동기화 규칙

### 8-1. 코드 변경 시 문서 업데이트 필요

| 코드 변경          | 업데이트 필요 문서                  |
| ------------------ | ----------------------------------- |
| 새 페이지 추가     | `docs/PRD.md` (페이지 구성 섹션)    |
| Notion 스키마 변경 | `docs/PRD.md` (데이터 모델 섹션)    |
| 컴포넌트 패턴 변경 | `docs/guides/component-patterns.md` |
| 스타일링 규칙 변경 | `docs/guides/styling-guide.md`      |
| 프로젝트 구조 변경 | `docs/guides/project-structure.md`  |

### 8-2. 문서 우선순위

1. **PRD (`docs/PRD.md`)**: 기능 요구사항, 데이터 모델 → 변경 시 필수 업데이트
2. **프로젝트 구조 (`docs/guides/project-structure.md`)**: 폴더 구조 → 새 폴더 추가 시 업데이트
3. **컴포넌트 패턴 (`docs/guides/component-patterns.md`)**: 새 패턴 도입 시 예시 추가
4. **스타일링 가이드 (`docs/guides/styling-guide.md`)**: 스타일 규칙 변경 시 업데이트

---

## 9. 빠른 참조 (Quick Reference)

### 자주 사용하는 명령어

```bash
# 개발 서버 실행
npm run dev

# 전체 검사 (커밋 전 필수)
npm run check-all

# shadcn/ui 컴포넌트 추가
npx shadcn@latest add [component-name]

# 빌드 테스트
npm run build
```

### 자주 import하는 모듈

```typescript
// Notion API
import { getQuoteBySlug, getQuoteItems } from '@/lib/notion'

// 유틸리티
import { cn } from '@/lib/utils'

// UI 컴포넌트
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

// Next.js
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
```

### 핵심 파일 위치

| 파일                      | 역할                              |
| ------------------------- | --------------------------------- |
| `src/lib/notion/index.ts` | Notion API 진입점 (여기만 import) |
| `src/lib/utils.ts`        | cn() 함수 등 공통 유틸리티        |
| `src/app/globals.css`     | 전역 스타일 (프린트 스타일 포함)  |
| `components.json`         | shadcn/ui 설정                    |
| `CLAUDE.md`               | 개발 지침 메인 문서               |

---

## 10. 마무리 체크리스트

### 코드 작성 후 필수 확인사항

- [ ] Server Component에 'use client' 추가하지 않았는가?
- [ ] Notion API는 lib/notion/index.ts를 통해 호출했는가?
- [ ] any 타입을 사용하지 않았는가?
- [ ] 시맨틱 색상 변수를 사용했는가? (하드코딩 X)
- [ ] 버튼/액션에 print:hidden을 추가했는가?
- [ ] 새 UI 컴포넌트는 npx shadcn add로 추가했는가?
- [ ] 타입 정의를 추가/수정했다면 스키마도 함께 업데이트했는가?
- [ ] npm run check-all이 통과하는가?

---

**이 문서는 AI Agent가 invoice-web 프로젝트에서 즉시 의사결정할 수 있도록 작성되었습니다. 일반적인 Next.js/React 지식은 이미 알고 있다고 가정하며, 프로젝트만의 특수성에만 집중합니다.**
