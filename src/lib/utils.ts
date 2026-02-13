import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 원화 금액 포맷 (예: 1,500,000원)
export function formatCurrency(amount: number): string {
  return `${amount.toLocaleString('ko-KR')}원`
}

// 날짜 포맷 (예: 2026년 2월 14일)
export function formatDate(dateString: string | null): string {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
