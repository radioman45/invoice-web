# 견적서 웹 뷰어 서비스 - PRD (Product Requirements Document)

## 1. 개요

### 1-1. 프로젝트 목적

Notion 데이터베이스에 입력한 견적서를 클라이언트(고객)가 웹에서 열람하고 PDF로 다운로드할 수 있는 MVP 서비스입니다.

### 1-2. 핵심 가치

- **관리자**: Notion에서 직접 견적서 데이터를 관리 (별도 관리 페이지 불필요)
- **클라이언트**: 고유 링크(slug)로 견적서를 웹에서 열람하고 PDF 다운로드

### 1-3. 범위

- MVP 단계: 견적서 웹 뷰어 + PDF 다운로드
- 인증 없음: slug 기반 고유 링크로 접근 제어

---

## 2. 페이지 구성

| 페이지      | 경로                         | 설명                 |
| ----------- | ---------------------------- | -------------------- |
| 랜딩        | `/`                          | 서비스 안내 페이지   |
| 견적서 상세 | `/quotes/[slug]`             | 견적서 웹 뷰어       |
| 404 에러    | `/quotes/[slug]` (not-found) | 존재하지 않는 견적서 |
| 에러        | `/quotes/[slug]` (error)     | 서버 오류            |

---

## 3. 핵심 기능

### F001. 견적서 웹 열람

- Notion DB에서 slug로 견적서 조회
- 견적서 헤더: 제목, 번호, 발행일, 유효기간, 상태 배지
- 발행자/수신자 정보 카드
- 상태가 "발행완료"인 견적서만 열람 가능

### F002. 항목 테이블

- 견적 항목 목록 테이블 (품명, 규격, 수량, 단위, 단가, 금액)
- 순서(order) 기준 정렬
- 금액 포맷팅 (원화, 천 단위 콤마)

### F003. 합계 계산

- 공급가액, 부가세(10%), 총합계 표시
- Notion DB의 값을 그대로 표시

### F004. PDF 다운로드

- `window.print()` 기반 브라우저 인쇄/PDF 저장
- `@media print` 프린트 스타일시트로 견적서 전용 레이아웃
- 헤더/푸터/버튼 등 불필요한 요소 숨김

### F005. Notion 연동

- `@notionhq/client` 패키지 사용
- Server Component에서 직접 API 호출
- ISR(Incremental Static Regeneration) 또는 동적 렌더링

---

## 4. 데이터 모델

### 4-1. 견적서 (Quotes) DB

| 속성          | Notion 타입  | 용도                     |
| ------------- | ------------ | ------------------------ |
| 견적서 제목   | title        | 견적서 제목              |
| 견적서 번호   | rich_text    | QT-2026-001 형식         |
| slug          | rich_text    | URL 접근용 고유 식별자   |
| 상태          | select       | 작성중 / 발행완료 / 만료 |
| 발행일        | date         | 발행 날짜                |
| 유효기간      | date         | 만료일                   |
| 수신 업체명   | rich_text    | 클라이언트 업체명        |
| 수신 담당자명 | rich_text    | 담당자                   |
| 수신 연락처   | phone_number | 전화번호                 |
| 수신 이메일   | email        | 이메일                   |
| 공급가액      | number       | 공급가액 합계            |
| 부가세        | number       | 부가세 합계              |
| 총합계        | number       | 총합계 금액              |
| 비고          | rich_text    | 메모/참고사항            |

### 4-2. 견적 항목 (Quote Items) DB

| 속성   | Notion 타입 | 용도             |
| ------ | ----------- | ---------------- |
| 품명   | title       | 항목명           |
| 견적서 | relation    | Quotes DB와 연결 |
| 규격   | rich_text   | 사양/규격        |
| 수량   | number      | 수량             |
| 단가   | number      | 단가             |
| 금액   | formula     | 수량 × 단가      |
| 단위   | select      | 개/식/EA 등      |
| 순서   | number      | 표시 순서        |

---

## 5. 비기능 요구사항

- **반응형**: 모바일/태블릿/데스크톱 지원
- **성능**: Server Component 기반, 초기 로딩 최적화
- **접근성**: 시맨틱 HTML, 적절한 ARIA 속성
- **SEO**: 견적서 제목 기반 메타데이터 생성
- **보안**: slug 기반 접근 제어 (추측 불가능한 slug 사용 권장)

---

## 6. 기술 스택

- **프레임워크**: Next.js 15.5.3 (App Router)
- **런타임**: React 19, TypeScript 5
- **스타일링**: TailwindCSS v4 + shadcn/ui
- **데이터**: Notion API (@notionhq/client)
- **PDF**: window.print() + @media print
- **배포**: Vercel
