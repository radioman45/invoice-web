import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  VERCEL_URL: z.string().optional(),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),

  // Notion API (서버 전용)
  NOTION_API_KEY: z.string().min(1),
  NOTION_QUOTES_DATABASE_ID: z.string().min(1),
  NOTION_ITEMS_DATABASE_ID: z.string().min(1),
})

export const env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  VERCEL_URL: process.env.VERCEL_URL,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NOTION_API_KEY: process.env.NOTION_API_KEY,
  NOTION_QUOTES_DATABASE_ID: process.env.NOTION_QUOTES_DATABASE_ID,
  NOTION_ITEMS_DATABASE_ID: process.env.NOTION_ITEMS_DATABASE_ID,
})

export type Env = z.infer<typeof envSchema>
