import { Client } from '@notionhq/client'
import { env } from '@/lib/env'

// 싱글톤 Notion 클라이언트
const globalForNotion = globalThis as unknown as {
  notionClient: Client | undefined
}

export const notion =
  globalForNotion.notionClient ??
  new Client({
    auth: env.NOTION_API_KEY,
  })

if (env.NODE_ENV !== 'production') {
  globalForNotion.notionClient = notion
}
