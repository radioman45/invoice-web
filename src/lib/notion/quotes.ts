import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import { env } from '@/lib/env'
import { notion } from './client'
import { QUOTE_PROPS, ITEM_PROPS, QUOTE_STATUS } from './constants'
import type { Quote, QuoteItem } from './types'
import { pageToQuote, pageToQuoteItem } from './utils'

// slug로 견적서 조회 (발행완료 상태만)
export async function getQuoteBySlug(slug: string): Promise<Quote | null> {
  const response = await notion.dataSources.query({
    data_source_id: env.NOTION_QUOTES_DATABASE_ID,
    filter: {
      and: [
        {
          property: QUOTE_PROPS.SLUG,
          rich_text: { equals: slug },
        },
        {
          property: QUOTE_PROPS.STATUS,
          select: { equals: QUOTE_STATUS.PUBLISHED },
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
}

// 견적서에 연결된 항목 목록 조회 (순서대로 정렬)
export async function getQuoteItems(quoteId: string): Promise<QuoteItem[]> {
  const response = await notion.dataSources.query({
    data_source_id: env.NOTION_ITEMS_DATABASE_ID,
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
}
