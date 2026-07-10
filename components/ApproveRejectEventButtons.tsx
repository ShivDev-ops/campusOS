'use client'

import { useTransition } from 'react'
import { approveCalendarEventAction, rejectCalendarEventAction } from '@/app/actions/calendar'

interface Props {
  eventId: string
}

export default function ApproveRejectEventButtons({ eventId }: Props) {
  const [isPending, startTransition] = useTransition()

  function handleApprove() {
    startTransition(async () => {
      await approveCalendarEventAction(eventId)
    })
  }

  function handleReject() {
    startTransition(async () => {
      await rejectCalendarEventAction(eventId)
    })
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={handleApprove}
        disabled={isPending}
        className="px-4 py-2 bg-success-sage text-white font-sans font-bold text-[10px] tracking-wider uppercase rounded hover:bg-success-sage/90 transition-all disabled:opacity-50"
      >
        {isPending ? 'Processing...' : 'Approve'}
      </button>
      <button
        onClick={handleReject}
        disabled={isPending}
        className="px-4 py-2 bg-error-brick text-white font-sans font-bold text-[10px] tracking-wider uppercase rounded hover:bg-error-brick/90 transition-all disabled:opacity-50"
      >
        {isPending ? 'Processing...' : 'Reject'}
      </button>
    </div>
  )
}
