import { unstable_cache } from 'next/cache'
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import { env } from '@/lib/env'
import { notion } from './client'
import { QUOTE_PROPS, ITEM_PROPS } from './constants'
import type { Quote, QuoteItem } from './types'
import { pageToQuote, pageToQuoteItem } from './utils'

// ISR 재검증 주기 (초) - 페이지 revalidate와 동일하게 설정
const CACHE_TTL = 3600

// slug로 견적서 조회 - 임시: 캐시/상태 필터 제거 (진단용)
export async function getQuoteBySlug(slug: string): Promise<Quote | null> {
  try {
    const response = await notion.databases.query({
      database_id: env.NOTION_QUOTES_DATABASE_ID,
      filter: {
        property: QUOTE_PROPS.SLUG,
        rich_text: { equals: slug },
      },
      page_size: 1,
    })

    console.log(`[Notion] slug="${slug}" 결과: ${response.results.length}건`)

    if (response.results.length === 0) {
      return null
    }

    const page = response.results[0] as PageObjectResponse
    const quote = pageToQuote(page)
    console.log(`[Notion] 상태값: "${quote.status}"`)
    return quote
  } catch (error) {
    console.error('[Notion] getQuoteBySlug 오류:', error)
    return null
  }
}

// 견적서에 연결된 항목 목록 조회 (순서대로 정렬) - unstable_cache로 캐싱
export const getQuoteItems = unstable_cache(
  async (quoteId: string): Promise<QuoteItem[]> => {
    const response = await notion.databases.query({
      database_id: env.NOTION_ITEMS_DATABASE_ID,
      filter: {
        property: ITEM_PROPS.QUOTE,
        relation: { contains: quoteId },
      },
      sorts: [
        {
          property: ITEM_PROPS.ORDER,
          direction: 'ascending',
        },
      ],
    })

    return response.results.map(page =>
      pageToQuoteItem(page as PageObjectResponse)
    )
  },
  ['quote-items'],
  { revalidate: CACHE_TTL, tags: ['quote-items'] }
)
