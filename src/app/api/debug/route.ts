/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server'
import { notion } from '@/lib/notion/client'
import { env } from '@/lib/env'
import { QUOTE_PROPS, QUOTE_STATUS } from '@/lib/notion/constants'

// 임시 진단용 API - 배포 확인 후 삭제
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug') ?? ''

  try {
    // 1) 환경 변수 확인
    const envCheck = {
      NOTION_API_KEY: env.NOTION_API_KEY ? '✅ 설정됨' : '❌ 없음',
      NOTION_QUOTES_DATABASE_ID: env.NOTION_QUOTES_DATABASE_ID
        ? '✅ 설정됨'
        : '❌ 없음',
      NOTION_ITEMS_DATABASE_ID: env.NOTION_ITEMS_DATABASE_ID
        ? '✅ 설정됨'
        : '❌ 없음',
    }

    // 2) 상태 필터 없이 전체 조회 (최근 5건)
    const allResults = await notion.databases.query({
      database_id: env.NOTION_QUOTES_DATABASE_ID,
      page_size: 5,
    })

    const pages = allResults.results.map(page => {
      const p = page as any
      const props = p.properties ?? {}
      return {
        id: page.id,
        slug: props[QUOTE_PROPS.SLUG]?.rich_text?.[0]?.plain_text ?? '없음',
        status: props[QUOTE_PROPS.STATUS]?.status?.name ?? '없음',
      }
    })

    // 3) slug로 필터링 (상태 조건 없이)
    const slugResult = slug
      ? await notion.databases.query({
          database_id: env.NOTION_QUOTES_DATABASE_ID,
          filter: {
            property: QUOTE_PROPS.SLUG,
            rich_text: { equals: slug },
          },
        })
      : null

    return NextResponse.json({
      envCheck,
      publishedStatus: QUOTE_STATUS.PUBLISHED,
      recentQuotes: pages,
      slugSearch: slug
        ? {
            slug,
            found: (slugResult?.results.length ?? 0) > 0,
            count: slugResult?.results.length ?? 0,
          }
        : '?slug=값 으로 검색 가능',
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
