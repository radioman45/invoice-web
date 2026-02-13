import { z } from 'zod'

// 견적서 Zod 검증 스키마
export const quoteSchema = z.object({
  id: z.string(),
  title: z.string(),
  quoteNumber: z.string(),
  slug: z.string(),
  status: z.string(),
  issueDate: z.string().nullable(),
  validUntil: z.string().nullable(),
  clientCompany: z.string(),
  clientName: z.string(),
  clientPhone: z.string(),
  clientEmail: z.string(),
  subtotal: z.number(),
  tax: z.number(),
  total: z.number(),
  notes: z.string(),
})

// 견적 항목 Zod 검증 스키마
export const quoteItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  spec: z.string(),
  quantity: z.number(),
  unitPrice: z.number(),
  amount: z.number(),
  unit: z.string(),
  order: z.number(),
})

export type QuoteSchema = z.infer<typeof quoteSchema>
export type QuoteItemSchema = z.infer<typeof quoteItemSchema>
