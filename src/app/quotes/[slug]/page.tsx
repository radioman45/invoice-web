import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Suspense } from 'react'
import { getQuoteBySlug, getQuoteItems } from '@/lib/notion'
import { QuoteHeader } from '@/components/quote/quote-header'
import { QuoteParties } from '@/components/quote/quote-parties'
import { QuoteItemsTable } from '@/components/quote/quote-items-table'
import { QuoteSummary } from '@/components/quote/quote-summary'
import { QuoteActions } from '@/components/quote/quote-actions'
import { QuoteSkeleton } from '@/components/quote/quote-skeleton'

interface QuotePageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: QuotePageProps): Promise<Metadata> {
  const { slug } = await params
  const quote = await getQuoteBySlug(slug)

  if (!quote) {
    return { title: '견적서를 찾을 수 없습니다' }
  }

  return {
    title: `${quote.title} - ${quote.quoteNumber}`,
    description: `${quote.clientCompany}님께 보내는 견적서`,
  }
}

async function QuoteContent({ slug }: { slug: string }) {
  const quote = await getQuoteBySlug(slug)

  if (!quote) {
    notFound()
  }

  const items = await getQuoteItems(quote.id)

  return (
    <div className="print-content mx-auto max-w-4xl space-y-8">
      <QuoteHeader quote={quote} />
      <QuoteParties quote={quote} />
      <QuoteItemsTable items={items} />
      <QuoteSummary quote={quote} />
      {quote.notes && (
        <div className="rounded-lg border p-6">
          <h3 className="text-muted-foreground mb-2 text-sm font-semibold">
            비고
          </h3>
          <p className="text-sm whitespace-pre-wrap">{quote.notes}</p>
        </div>
      )}
      <QuoteActions />
    </div>
  )
}

export default async function QuotePage({ params }: QuotePageProps) {
  const { slug } = await params

  return (
    <main className="bg-background min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <Suspense fallback={<QuoteSkeleton />}>
        <QuoteContent slug={slug} />
      </Suspense>
    </main>
  )
}
