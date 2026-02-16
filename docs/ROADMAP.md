# 견적서 웹 뷰어 서비스 개발 로드맵

Notion 데이터베이스에 입력한 견적서를 클라이언트(고객)가 웹에서 열람하고 PDF로 다운로드할 수 있는 MVP 서비스

## 개요

견적서 웹 뷰어 서비스는 B2B 사업자를 위한 견적서 공유 솔루션으로 다음 기능을 제공합니다:

- **견적서 웹 열람**: Notion DB에 저장된 견적서를 고유 slug URL로 열람
- **PDF 다운로드**: 브라우저 인쇄 기능을 활용한 PDF 다운로드
- **상태 기반 접근 제어**: "발행완료" 상태의 견적서만 외부 열람 허용
- **반응형 디자인**: 데스크톱/모바일 모두 최적화된 견적서 뷰어

**주요 기술 스택**: Next.js 15.5.3, React 19, TypeScript, TailwindCSS v4, shadcn/ui, Notion API (@notionhq/client)

## 개발 워크플로우

1. **작업 계획**

- 기존 코드베이스를 학습하고 현재 상태를 파악
- 새로운 작업을 포함하도록 `ROADMAP.md` 업데이트
- 우선순위 작업은 마지막 완료된 작업 다음에 삽입

2. **작업 생성**

- 기존 코드베이스를 학습하고 현재 상태를 파악
- `/tasks` 디렉토리에 새 작업 파일 생성
- 명명 형식: `XXX-description.md` (예: `001-setup.md`)
- 고수준 명세서, 관련 파일, 수락 기준, 구현 단계 포함
- API/비즈니스 로직 작업 시 "## 테스트 체크리스트" 섹션 필수 포함 (Playwright MCP 테스트 시나리오 작성)

3. **작업 구현**

- 작업 파일의 명세서를 따름
- 기능과 기능성 구현
- **구현 -> 테스트 -> 검증 사이클 필수 준수**:
  - 각 기능 구현 직후 즉시 Playwright MCP로 테스트 수행
  - API 엔드포인트 구현 시: 엔드포인트별 단위 테스트 먼저 실행
  - 비즈니스 로직 구현 시: 로직별 테스트 케이스 작성 및 실행
  - 테스트 실패 시 즉시 수정하고 재테스트
  - 모든 테스트 통과 확인 후에만 다음 단계로 진행
- 각 단계 후 작업 파일 내 단계 진행 상황 업데이트
- 각 단계 완료 후 중단하고 추가 지시를 기다림

4. **로드맵 업데이트**

- 로드맵에서 완료된 작업을 체크로 표시

## 개발 단계

### Phase 1: 애플리케이션 골격 구축 - 프로젝트 구조 및 타입 정의 ✅

- **Task 001: 프로젝트 구조 및 라우팅 설정** ✅ - 완료
  - ✅ Next.js App Router 기반 전체 라우트 구조 생성 (`src/app/`)
  - ✅ 루트 레이아웃 구조 확인 (`src/app/layout.tsx`) - ThemeProvider, 폰트 설정
  - ✅ 랜딩 페이지 파일 생성 (`src/app/page.tsx`)
  - ✅ 견적서 상세 페이지 동적 라우팅 (`/quotes/[slug]/page.tsx`) - `await params` 패턴 적용
  - ✅ 404 페이지 생성 (`/quotes/[slug]/not-found.tsx`)
  - ✅ 에러 페이지 생성 (`/quotes/[slug]/error.tsx`) - 클라이언트 컴포넌트, 재시도 버튼

- **Task 002: 타입 정의 및 인터페이스 설계** ✅ - 완료
  - ✅ `Quote` 인터페이스 정의 (`src/lib/notion/types.ts`) - 제목, 번호, slug, 상태, 날짜, 수신자 정보, 금액 등
  - ✅ `QuoteItem` 인터페이스 정의 - 품명, 규격, 수량, 단위, 단가, 금액, 순서
  - ✅ 환경변수 Zod 스키마 검증 (`src/lib/env.ts`) - NOTION_API_KEY, DATABASE_ID 등
  - ✅ Notion 속성명 상수 정의 (`src/lib/notion/constants.ts`) - QUOTE_PROPS, ITEM_PROPS, QUOTE_STATUS

- **Task 003: 유틸리티 함수 작성** ✅ - 완료
  - ✅ 금액 포맷팅 유틸리티 (`formatCurrency`) - `toLocaleString('ko-KR')` 사용
  - ✅ 날짜 포맷팅 유틸리티 (`formatDate`) - `toLocaleDateString('ko-KR')` 사용
  - ✅ CSS 클래스 유틸리티 (`cn`) - clsx + tailwind-merge

### Phase 2: UI/UX 완성 - 견적서 뷰어 화면 구현 ✅

- **Task 004: 견적서 컴포넌트 라이브러리 구현** ✅ - 완료
  - ✅ shadcn/ui 기반 공통 컴포넌트 설치 (Card, Badge, Button, Skeleton 등)
  - ✅ 견적서 헤더 컴포넌트 (`src/components/quote/quote-header.tsx`) - 제목, 번호, 날짜, 상태 배지
  - ✅ 발행자/수신자 정보 컴포넌트 (`src/components/quote/quote-parties.tsx`)
  - ✅ 견적 항목 테이블 컴포넌트 (`src/components/quote/quote-items-table.tsx`) - 반응형 (데스크톱 테이블 / 모바일 카드)
  - ✅ 합계 섹션 컴포넌트 (`src/components/quote/quote-summary.tsx`) - 공급가액, 부가세, 총합계
  - ✅ PDF 다운로드/인쇄 액션 컴포넌트 (`src/components/quote/quote-actions.tsx`)
  - ✅ 로딩 스켈레톤 컴포넌트 (`src/components/quote/quote-skeleton.tsx`)

- **Task 005: 페이지 UI 및 반응형 디자인 완성** ✅ - 완료
  - ✅ 견적서 상세 페이지 전체 레이아웃 구성 (`/quotes/[slug]/page.tsx`)
  - ✅ 랜딩 페이지 기본 UI 구현 (`src/app/page.tsx`) - 서비스 소개
  - ✅ 404 페이지 UI 구현 - FileQuestion 아이콘, 홈으로 돌아가기 버튼
  - ✅ 에러 페이지 UI 구현 - AlertTriangle 아이콘, 다시 시도 버튼
  - ✅ 프린트 전용 CSS (`@media print`) - A4 용지, 불필요 요소 숨김, 테이블 border 유지
  - ✅ 반응형 레이아웃 적용 - 모바일 우선 접근

### Phase 3: Notion API 연동 - 실제 데이터 통합 ✅

- **Task 006: Notion API 클라이언트 및 데이터 레이어 구축** ✅ - 완료
  - ✅ `@notionhq/client` 패키지 설치 및 싱글톤 클라이언트 초기화 (`src/lib/notion/client.ts`)
  - ✅ 환경변수 설정 및 Zod 스키마 검증 (`src/lib/env.ts`)
  - ✅ Notion 데이터 변환 유틸리티 (`src/lib/notion/utils.ts`) - `pageToQuote()`, `pageToQuoteItem()`
  - ✅ Property 타입별 추출 헬퍼 - getRichText, getTitle, getNumber, getSelect, getDate, getPhone, getEmail, getFormula
  - ✅ slug 기반 견적서 조회 함수 (`getQuoteBySlug`) - 발행완료 상태 필터 포함
  - ✅ Relation 기반 견적 항목 조회 함수 (`getQuoteItems`) - 순서(order) 기준 정렬
  - ✅ 상태 기반 접근 제어 적용 - "발행완료" 상태만 조회 가능 (서버 측 필터)

- **Task 007: 동적 메타데이터 및 SEO 기본 설정** ✅ - 완료
  - ✅ `generateMetadata()` 함수 구현 (`/quotes/[slug]/page.tsx`) - 견적서 제목, 번호, 클라이언트사 정보 반영
  - ✅ Suspense 경계 설정 - QuoteSkeleton fallback

### Phase 4: 성능 최적화 및 배포 준비

- **Task 008: 성능 최적화 및 캐싱 전략** - 우선순위
  - ISR 설정 (`revalidate = 3600`) - Notion API Rate Limit 고려
  - 폰트 최적화 - `next/font` 적용 (Pretendard 또는 Geist Sans)
  - 이미지 최적화 - `next/image` 적용 (필요시)
  - **필수 테스트 항목**:
    - Playwright MCP로 ISR 캐싱 동작 검증
    - 페이지 로딩 시간 측정
    - Notion API 호출 횟수 검증 (캐시 히트율)
    - 모든 테스트 통과 후에만 다음 Task로 진행

- **Task 009: 접근성 및 SEO 최종 마무리**
  - 시맨틱 HTML 최종 검토 - heading 계층 (h1, h2, h3), article/section/main 태그
  - ARIA 속성 추가 - 테이블, 버튼에 aria-label 추가
  - 루트 레이아웃 메타데이터 보완 - title, description, favicon
  - 키보드 네비게이션 테스트
  - **필수 테스트 항목**:
    - Playwright MCP로 접근성 검증 (heading 구조, ARIA 속성)
    - 키보드 탐색 시나리오 테스트
    - 스크린 리더 호환성 확인

- **Task 010: 통합 테스트 및 품질 검증** - 필수
  - Playwright MCP를 사용한 전체 사용자 플로우 E2E 테스트
  - **필수 테스트 시나리오**:
    - 시나리오 1: 유효한 slug로 견적서 조회 -> 정상 표시 확인
    - 시나리오 2: PDF 다운로드 버튼 클릭 -> 브라우저 인쇄 대화상자 표시
    - 시나리오 3: 존재하지 않는 slug -> 404 페이지 표시
    - 시나리오 4: "작성중" 상태 견적서 -> 접근 거부 (notFound)
    - 시나리오 5: "만료" 상태 견적서 -> 접근 거부 (notFound)
    - 시나리오 6: 모바일 뷰포트에서 카드 레이아웃 확인
    - 시나리오 7: 데스크톱 뷰포트에서 테이블 레이아웃 확인
    - 시나리오 8: 인쇄 미리보기에서 불필요 UI 숨김 확인
  - 에러 핸들링 및 엣지 케이스 테스트:
    - 잘못된 API 키 -> 에러 페이지 표시
    - 네트워크 오류 시 에러 페이지 동작
    - 금액 0원, null 날짜 등 엣지 케이스
  - Lighthouse 벤치마크 - Performance, Accessibility, Best Practices, SEO 각 90점 이상 목표
  - 브라우저 호환성 - Chrome, Firefox, Safari, Edge

- **Task 011: Vercel 배포 및 프로덕션 검증**
  - 프로덕션 빌드 테스트 (`npm run build` + `npm run start`)
  - Vercel 프로젝트 생성 및 GitHub 연동
  - Vercel 환경변수 설정 (NOTION_API_KEY, NOTION_QUOTES_DATABASE_ID, NOTION_ITEMS_DATABASE_ID)
  - 배포 후 실제 환경에서 전체 시나리오 테스트
  - 커스텀 도메인 설정 (선택)
  - **필수 테스트 항목**:
    - Playwright MCP로 배포된 URL에서 E2E 테스트
    - 실제 Notion DB 데이터로 견적서 조회 확인
    - ISR 캐싱 동작 확인
    - 환경변수 누락 시 에러 처리 확인

- **Task 012: 문서화 및 마무리**
  - README 업데이트 - 프로젝트 소개, 기능 설명, 환경변수 설정 방법, 실행 가이드
  - Notion DB 구조 문서화 (선택) - DB 필드 목록, Relation 설정, Integration 연결 방법
  - 랜딩 페이지 UI 보완 (선택) - 히어로 섹션, 기능 소개 섹션 추가

## 주요 파일 구조

```
src/
  app/
    layout.tsx              # 루트 레이아웃 (ThemeProvider, 폰트)
    page.tsx                # 랜딩 페이지
    globals.css             # 전역 스타일 + @media print
    quotes/
      [slug]/
        page.tsx            # 견적서 상세 페이지 (Server Component)
        not-found.tsx       # 404 페이지
        error.tsx           # 에러 페이지 (Client Component)
  components/
    quote/
      quote-header.tsx      # 견적서 헤더 (제목, 번호, 날짜, 상태)
      quote-parties.tsx     # 발행자/수신자 정보 카드
      quote-items-table.tsx # 견적 항목 테이블 (반응형)
      quote-summary.tsx     # 합계 섹션
      quote-actions.tsx     # PDF 다운로드/인쇄 버튼
      quote-skeleton.tsx    # 로딩 스켈레톤
    ui/                     # shadcn/ui 컴포넌트
  lib/
    env.ts                  # 환경변수 Zod 검증
    utils.ts                # cn(), formatCurrency(), formatDate()
    notion/
      client.ts             # Notion API 싱글톤 클라이언트
      constants.ts          # DB 속성명 상수 (QUOTE_PROPS, ITEM_PROPS)
      types.ts              # Quote, QuoteItem 인터페이스
      utils.ts              # Notion -> 도메인 모델 변환 함수
      quotes.ts             # 견적서/항목 조회 함수
      index.ts              # 모듈 export
```

## 기술적 고려사항

### Notion API

- **Rate Limit**: 평균 3 requests/second 제한 -> ISR 캐싱 전략 필수
- **Property Types**: rich_text, number, date, select, relation, phone_number, email, formula 등 변환 로직 구현 완료
- **Relation 처리**: 견적서와 견적 항목 간 Relation filter로 효율적 조회
- **Pagination**: 견적 항목 100개 이상 시 pagination 처리 필요 (has_more, next_cursor) - 미구현

### Next.js 15.5.3 특화

- **Server Components**: 기본적으로 모든 컴포넌트는 Server Component로 구현
- **async params**: 동적 라우팅에서 `const { slug } = await params` 패턴 적용
- **ISR**: `revalidate` 옵션으로 캐시 전략 적용 예정
- **generateMetadata**: 동적 메타데이터 생성 함수 구현 완료
- **notFound()**: 견적서 미존재 시 404 트리거

### 반응형 디자인

- **Mobile-First**: TailwindCSS v4 모바일 우선 접근
- **테이블 대응**: 모바일 카드 / 데스크톱 테이블 전환
- **프린트 대응**: `@media print` 블록으로 A4 인쇄 최적화

### 보안

- **Slug 기반 접근**: 추측 불가능한 slug로 견적서 접근
- **환경변수 보호**: Notion API Key는 Server Component에서만 사용
- **상태 제어**: "발행완료" 상태만 열람 가능 (서버 측 Notion API 필터)

---

**마지막 업데이트**: 2026-02-17
