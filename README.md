# 견적서 웹 뷰어

Notion 데이터베이스 기반 견적서 웹 뷰어 서비스입니다.

## 주요 기능

- **견적서 웹 열람**: 고유 링크(slug)로 견적서를 웹에서 확인
- **PDF 다운로드**: 브라우저 인쇄 기능을 통한 PDF 저장
- **Notion 연동**: Notion 데이터베이스에서 직접 데이터 관리
- **반응형 디자인**: 모바일/태블릿/데스크톱 지원

## 기술 스택

- **프레임워크**: Next.js 15.5.3 (App Router + Turbopack)
- **런타임**: React 19.1.0 + TypeScript 5
- **스타일링**: TailwindCSS v4 + shadcn/ui
- **데이터**: Notion API (@notionhq/client)
- **PDF**: window.print() + @media print
- **배포**: Vercel

## 시작하기

### 1. 환경 변수 설정

`.env.example` 파일을 `.env.local`로 복사하고 Notion API 정보를 입력하세요:

```bash
cp .env.example .env.local
```

`.env.local` 파일 내용:

```env
NOTION_API_KEY=your_notion_api_key_here
NOTION_QUOTES_DATABASE_ID=your_quotes_database_id_here
NOTION_ITEMS_DATABASE_ID=your_items_database_id_here
```

### 2. 패키지 설치

```bash
npm install
```

### 3. 개발 서버 실행

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 결과를 확인할 수 있습니다.

## Notion 설정

### Notion Integration 생성

1. [Notion Integrations](https://www.notion.so/profile/integrations)에서 새 Integration 생성
2. **Integration Token** 복사 → `NOTION_API_KEY`에 설정
3. 각 데이터베이스 페이지에서 **Connect to** → 생성한 Integration 추가
4. 데이터베이스 URL에서 ID 복사: `notion.so/workspace/[DATABASE_ID]?v=...`

### 견적서 URL 구조

```
https://your-domain.com/quotes/[slug]
```

- `slug`는 Notion Quotes DB의 `slug` 필드 값
- **발행완료** 상태인 견적서만 외부 접근 허용
- 그 외 상태(작성중, 만료)는 자동으로 404 처리

### 캐싱 전략

Notion API Rate Limit(평균 3req/s) 대응을 위해 ISR을 적용합니다:

- 페이지 캐시: 1시간(3600초) 후 재검증
- `unstable_cache`로 Notion API 호출 중복 방지

## Notion 데이터베이스 설정

### Quotes 데이터베이스

| 속성          | 타입         | 설명                   |
| ------------- | ------------ | ---------------------- |
| 견적서 제목   | title        | 견적서 제목            |
| 견적서 번호   | rich_text    | QT-2026-001 형식       |
| slug          | rich_text    | URL 접근용 고유 식별자 |
| 상태          | select       | 작성중/발행완료/만료   |
| 발행일        | date         | 발행 날짜              |
| 유효기간      | date         | 만료일                 |
| 수신 업체명   | rich_text    | 클라이언트 업체명      |
| 수신 담당자명 | rich_text    | 담당자                 |
| 수신 연락처   | phone_number | 전화번호               |
| 수신 이메일   | email        | 이메일                 |
| 공급가액      | number       | 공급가액 합계          |
| 부가세        | number       | 부가세 합계            |
| 총합계        | number       | 총합계 금액            |
| 비고          | rich_text    | 메모/참고사항          |

### Quote Items 데이터베이스

| 속성   | 타입      | 설명             |
| ------ | --------- | ---------------- |
| 품명   | title     | 항목명           |
| 견적서 | relation  | Quotes DB와 연결 |
| 규격   | rich_text | 사양/규격        |
| 수량   | number    | 수량             |
| 단가   | number    | 단가             |
| 금액   | formula   | 수량 × 단가      |
| 단위   | select    | 개/식/EA 등      |
| 순서   | number    | 표시 순서        |

## 스크립트

```bash
# 개발
npm run dev         # 개발 서버 실행 (Turbopack)
npm run build       # 프로덕션 빌드
npm run start       # 프로덕션 서버 실행

# 코드 품질
npm run lint        # ESLint 검사
npm run lint:fix    # ESLint 자동 수정
npm run format      # Prettier 포맷팅
npm run typecheck   # TypeScript 타입 검사
npm run check-all   # 모든 검사 통합 실행
```

## 프로젝트 구조

```
invoice-web/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # 루트 레이아웃
│   │   ├── page.tsx            # 랜딩 페이지
│   │   └── quotes/
│   │       └── [slug]/         # 견적서 상세 페이지
│   │           ├── page.tsx
│   │           ├── error.tsx
│   │           └── not-found.tsx
│   ├── components/
│   │   ├── providers/          # Context Providers
│   │   ├── quote/              # 견적서 관련 컴포넌트
│   │   └── ui/                 # shadcn/ui 컴포넌트
│   └── lib/
│       ├── notion/             # Notion API 로직
│       │   ├── client.ts       # Notion 클라이언트
│       │   ├── quotes.ts       # 견적서 데이터 조회
│       │   ├── types.ts        # TypeScript 타입
│       │   └── utils.ts        # 유틸리티
│       └── utils.ts            # 공통 유틸리티
├── docs/                       # 프로젝트 문서
└── public/                     # 정적 파일
```

## 배포

### Vercel 배포

1. GitHub 저장소와 Vercel 연결
2. 환경 변수 설정 (NOTION_API_KEY 등)
3. 자동 배포

## 개발 가이드

- **📋 PRD**: `docs/PRD.md`
- **🗺️ 로드맵**: `docs/ROADMAP.md`
- **📁 프로젝트 구조**: `docs/guides/project-structure.md`
- **🎨 스타일링**: `docs/guides/styling-guide.md`
- **🧩 컴포넌트**: `docs/guides/component-patterns.md`

## 라이선스

MIT
