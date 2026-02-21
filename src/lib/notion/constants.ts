// Notion 견적서(Quotes) DB 속성명
export const QUOTE_PROPS = {
  TITLE: '견적서 제목',
  NUMBER: '견적서 번호',
  SLUG: 'slug',
  STATUS: '상태',
  ISSUE_DATE: '발행일',
  VALID_UNTIL: '유효기간',
  CLIENT_COMPANY: '수신업체명',
  CLIENT_NAME: '수신담당자명',
  CLIENT_PHONE: '수신연락처',
  CLIENT_EMAIL: '수신이메일',
  SUBTOTAL: '공급가액',
  TAX: '부가세',
  TOTAL: '총합계',
  NOTES: '비고',
} as const

// Notion 견적 항목(Quote Items) DB 속성명
export const ITEM_PROPS = {
  NAME: '품명',
  QUOTE: 'Invoices',
  SPEC: '규격',
  QUANTITY: '수량',
  UNIT_PRICE: '단가',
  AMOUNT: '금액',
  UNIT: '단위',
  ORDER: '순서',
} as const

// 견적서 상태값
export const QUOTE_STATUS = {
  DRAFT: '작성중',
  PUBLISHED: '승인',
  EXPIRED: '만료',
} as const
