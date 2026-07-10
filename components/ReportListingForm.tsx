'use client'

import { useState, useTransition } from 'react'
import { reportListingAction } from '@/app/actions/marketplace'

interface Props {
  listingId: string
}

export default function ReportListingForm({ listingId }: Props) {
  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState<string | null>(null)

  async function handleReport(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus(null)

    const formData = new FormData(event.currentTarget)
    startTransition(async () => {
      const response = await reportListingAction(formData)
      if (response?.error) {
        setStatus(`Error: ${response.error}`)
      } else if (response?.success) {
        setStatus('Report submitted successfully.')
        event.currentTarget.reset()
      }
    })
  }

  return (
    <div className="w-full space-y-2">
      <form onSubmit={handleReport} className="w-full flex gap-2">
        <input type="hidden" name="listingId" value={listingId} />
        <select
          name="reason"
          required
          disabled={isPending}
          className="flex-1 px-3 py-1 border border-rule-grey rounded text-xs font-sans bg-white outline-none disabled:opacity-50"
        >
          <option value="" disabled selected>Select Reason</option>
          <option value="scam">Scam / Fraud</option>
          <option value="inappropriate">Inappropriate Content</option>
          <option value="spam">Spam</option>
          <option value="harassment">Harassment</option>
        </select>
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-1.5 bg-error-brick text-white font-sans font-bold text-[10px] tracking-wider uppercase rounded hover:bg-error-brick/95 transition-all disabled:opacity-50"
        >
          {isPending ? 'Reporting...' : 'Report'}
        </button>
      </form>
      {status && (
        <p className="font-sans text-[10px] text-error-brick text-center font-bold">
          {status}
        </p>
      )}
    </div>
  )
}
