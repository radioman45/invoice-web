import { unstable_cache } from 'next/cache'
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import { env } from '@/lib/env'
import { notion } from './client'
import { QUOTE_PROPS, ITEM_PROPS, QUOTE_STATUS } from './constants'
import type { Quote, QuoteItem } from './types'
import { pageToQuote, pageToQuoteItem } from './utils'

// ISR 재검증 주기 (초) - 페이지 revalidate와 동일하게 설정
const CACHE_TTL = 3600

// slug로 견적서 조회 (발행완료 상태만) - unstable_cache로 Notion API 중복 호출 방지
export const getQuoteBySlug = unstable_cache(
  async (slug: string): Promise<Quote | null> => {
    const response = await notion.databases.query({
      database_id: env.NOTION_QUOTES_DATABASE_ID,
      filter: {
        and: [
          {
            property: QUOTE_PROPS.SLUG,
            rich_text: { equals: slug },
          },
          {
            property: QUOTE_PROPS.STATUS,
            status: { equals: QUOTE_STATUS.PUBLISHED },
          },
        ],
      },
      page_size: 1,
    })

    if (response.results.length === 0) {
      return null
    }

    const page = response.results[0] as PageObjectResponse
    return pageToQuote(page)
  },
  ['quote-by-slug'],
  { revalidate: CACHE_TTL, tags: ['quotes'] }
)

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
