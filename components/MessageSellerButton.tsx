'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { getOrCreateDirectChat } from '@/app/actions/chat'

interface Props {
  sellerId: string
  disabled?: boolean
  label?: string
}

export default function MessageSellerButton({ sellerId, disabled, label }: Props) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleMessage() {
    startTransition(async () => {
      const response = await getOrCreateDirectChat(sellerId)
      if (response?.error) {
        alert(response.error)
      } else if (response?.roomId) {
        router.push(`/chat?room=${response.roomId}`)
      }
    })
  }

  return (
    <button
      onClick={handleMessage}
      disabled={disabled || isPending}
      className="w-full py-3 bg-ink-navy text-white font-sans font-bold text-xs tracking-wider uppercase rounded-lg hover:bg-ink-navy/90 transition-all disabled:opacity-50"
    >
      {isPending ? 'Initiating Chat...' : (label || 'Message Seller')}
    </button>
  )
}
