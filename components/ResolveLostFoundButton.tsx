'use client'

import { useTransition } from 'react'
import { resolveLostFoundAction } from '@/app/actions/lost-found'

interface Props {
  itemId: string
}

export default function ResolveLostFoundButton({ itemId }: Props) {
  const [isPending, startTransition] = useTransition()

  function handleResolve() {
    startTransition(async () => {
      await resolveLostFoundAction(itemId)
    })
  }

  return (
    <button
      onClick={handleResolve}
      disabled={isPending}
      className="text-ink-navy border-b border-ink-navy hover:text-verified-gold hover:border-verified-gold transition-colors font-bold uppercase tracking-wider text-[10px] disabled:opacity-50"
    >
      {isPending ? 'RESOLVING...' : 'RESOLVE'}
    </button>
  )
}
