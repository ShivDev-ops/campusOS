'use client'

import { useTransition } from 'react'
import { markAsSoldAction } from '@/app/actions/marketplace'

interface Props {
  listingId: string
}

export default function MarkAsSoldButton({ listingId }: Props) {
  const [isPending, startTransition] = useTransition()

  function handleMarkAsSold() {
    startTransition(async () => {
      await markAsSoldAction(listingId)
    })
  }

  return (
    <button
      onClick={handleMarkAsSold}
      disabled={isPending}
      className="w-full py-3 bg-verified-gold text-white font-sans font-bold text-xs tracking-wider uppercase rounded-lg hover:bg-verified-gold/90 transition-all flex items-center justify-center gap-1 disabled:opacity-50"
    >
      {isPending ? 'Marking...' : 'Mark as Sold'}
      <span className="material-symbols-outlined text-sm">sell</span>
    </button>
  )
}
