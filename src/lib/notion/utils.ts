import type {
  PageObjectResponse,
  RichTextItemResponse,
} from '@notionhq/client/build/src/api-endpoints'
import { QUOTE_PROPS, ITEM_PROPS } from './constants'
import type { Quote, QuoteItem } from './types'

// Notion 속성 타입 헬퍼
type Properties = PageObjectResponse['properties']
type Property = Properties[string]

// rich_text 속성에서 텍스트 추출
function getRichText(prop: Property): string {
  if (prop.type === 'rich_text') {
    return prop.rich_text
      .map((t: RichTextItemResponse) => t.plain_text)
      .join('')
  }
  return ''
}

// title 속성에서 텍스트 추출
function getTitle(prop: Property): string {
  if (prop.type === 'title') {
    return prop.title.map((t: RichTextItemResponse) => t.plain_text).join('')
  }
  return ''
}

// number 속성에서 숫자 추출
function getNumber(prop: Property): number {
  if (prop.type === 'number') {
    return prop.number ?? 0
  }
  return 0
}

// select 속성에서 값 추출
function getSelect(prop: Property): string {
  if (prop.type === 'select') {
    return prop.select?.name ?? ''
  }
  return ''
}

// date 속성에서 시작일 추출
function getDate(prop: Property): string | null {
  if (prop.type === 'date') {
    return prop.date?.start ?? null
  }
  return null
}

// phone_number 속성에서 전화번호 추출
function getPhone(prop: Property): string {
  if (prop.type === 'phone_number') {
    return prop.phone_number ?? ''
  }
  return ''
}

// email 속성에서 이메일 추출
function getEmail(prop: Property): string {
  if (prop.type === 'email') {
    return prop.email ?? ''
  }
  return ''
}

// formula 속성에서 숫자 추출
function getFormula(prop: Property): number {
  if (prop.type === 'formula') {
    const formula = prop.formula
    if (formula.type === 'number') {
      return formula.number ?? 0
    }
  }
  return 0
}

// Notion 견적서 페이지 → Quote 변환
export function pageToQuote(page: PageObjectResponse): Quote {
  const props = page.properties

  return {
    id: page.id,
    title: getTitle(props[QUOTE_PROPS.TITLE]),
    quoteNumber: getRichText(props[QUOTE_PROPS.NUMBER]),
    slug: getRichText(props[QUOTE_PROPS.SLUG]),
    status: getSelect(props[QUOTE_PROPS.STATUS]),
    issueDate: getDate(props[QUOTE_PROPS.ISSUE_DATE]),
    validUntil: getDate(props[QUOTE_PROPS.VALID_UNTIL]),
    clientCompany: getRichText(props[QUOTE_PROPS.CLIENT_COMPANY]),
    clientName: getRichText(props[QUOTE_PROPS.CLIENT_NAME]),
    clientPhone: getPhone(props[QUOTE_PROPS.CLIENT_PHONE]),
    clientEmail: getEmail(props[QUOTE_PROPS.CLIENT_EMAIL]),
    subtotal: getNumber(props[QUOTE_PROPS.SUBTOTAL]),
    tax: getNumber(props[QUOTE_PROPS.TAX]),
    total: getNumber(props[QUOTE_PROPS.TOTAL]),
    notes: getRichText(props[QUOTE_PROPS.NOTES]),
  }
}

// Notion 견적 항목 페이지 → QuoteItem 변환
export function pageToQuoteItem(page: PageObjectResponse): QuoteItem {
  const props = page.properties

  return {
    id: page.id,
    name: getTitle(props[ITEM_PROPS.NAME]),
    spec: getRichText(props[ITEM_PROPS.SPEC]),
    quantity: getNumber(props[ITEM_PROPS.QUANTITY]),
    unitPrice: getNumber(props[ITEM_PROPS.UNIT_PRICE]),
    amount: getFormula(props[ITEM_PROPS.AMOUNT]),
    unit: getSelect(props[ITEM_PROPS.UNIT]),
    order: getNumber(props[ITEM_PROPS.ORDER]),
  }
}
