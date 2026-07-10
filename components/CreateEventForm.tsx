'use client'

import { useState, useTransition } from 'react'
import { createCalendarEventAction } from '@/app/actions/calendar'

export default function CreateEventForm() {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    const formData = new FormData(event.currentTarget)
    startTransition(async () => {
      const response = await createCalendarEventAction(formData)
      if (response?.error) {
        setError(response.error)
      }
    })
  }

  return (
    <div className="bg-white border border-rule-grey rounded-lg p-6 md:p-8 space-y-6">
      <header className="border-b border-rule-grey pb-4">
        <h3 className="font-headline text-xl font-bold">Register Academic Event</h3>
        <p className="text-xs text-on-surface-variant mt-1">Submit event registry entry. Entry requires moderator approval.</p>
      </header>

      {error && (
        <div className="p-3 bg-error-brick/10 border border-error-brick text-error-brick rounded-lg text-sm font-sans flex items-start gap-2">
          <span className="material-symbols-outlined text-lg mt-0.5">error</span>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div className="space-y-1">
          <label className="font-sans font-bold text-xs tracking-wider text-on-surface-variant block uppercase">Event Title</label>
          <input
            name="title"
            required
            disabled={isPending}
            className="w-full h-12 px-4 border border-rule-grey rounded-lg focus:ring-0 focus:border-ink-navy outline-none bg-paper-bg font-sans text-on-surface text-sm disabled:opacity-50"
            placeholder="e.g. Advanced Game Theory Final Review Session"
            type="text"
          />
        </div>

        {/* Department & Date */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="font-sans font-bold text-xs tracking-wider text-on-surface-variant block uppercase">Department</label>
            <select
              name="department"
              required
              disabled={isPending}
              className="w-full h-12 px-4 border border-rule-grey rounded-lg focus:ring-0 focus:border-ink-navy outline-none bg-paper-bg font-sans text-on-surface text-sm appearance-none bg-[right_12px_center] bg-no-repeat bg-[size:16px] disabled:opacity-50"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%231F2A44'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`
              }}
            >
              <option value="" disabled selected>Select</option>
              <option value="ALL">All Campus</option>
              <option value="CSE">CSE</option>
              <option value="ECE">ECE</option>
              <option value="MECH">MECH</option>
              <option value="CHEM">CHEM</option>
              <option value="CIVIL">CIVIL</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="font-sans font-bold text-xs tracking-wider text-on-surface-variant block uppercase">Date & Time</label>
            <input
              name="event_date"
              type="datetime-local"
              required
              disabled={isPending}
              className="w-full h-12 px-4 border border-rule-grey rounded-lg focus:ring-0 focus:border-ink-navy outline-none bg-paper-bg font-sans text-on-surface text-sm disabled:opacity-50"
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1">
          <label className="font-sans font-bold text-xs tracking-wider text-on-surface-variant block uppercase">Event Description</label>
          <textarea
            name="description"
            disabled={isPending}
            className="w-full min-h-[120px] p-4 border border-rule-grey rounded-lg focus:ring-0 focus:border-ink-navy outline-none bg-paper-bg font-sans text-on-surface text-sm resize-y disabled:opacity-50"
            placeholder="Provide timing details, locations, links, or syllabus scope..."
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full h-12 bg-ink-navy text-white rounded-lg font-sans font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-ink-navy/90 active:scale-[0.98] transition-all pt-2 disabled:opacity-50"
        >
          {isPending ? 'Submitting...' : 'Register Event'}
          <span className="material-symbols-outlined text-[18px]">publish</span>
        </button>
      </form>
    </div>
  )
}
