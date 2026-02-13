// 견적서 타입
export interface Quote {
  id: string
  title: string
  quoteNumber: string
  slug: string
  status: string
  issueDate: string | null
  validUntil: string | null
  clientCompany: string
  clientName: string
  clientPhone: string
  clientEmail: string
  subtotal: number
  tax: number
  total: number
  notes: string
}

// 견적 항목 타입
export interface QuoteItem {
  id: string
  name: string
  spec: string
  quantity: number
  unitPrice: number
  amount: number
  unit: string
  order: number
}
