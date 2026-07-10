'use client'

import { useState, useTransition } from 'react'
import { createLostFoundAction } from '@/app/actions/lost-found'

export default function CreateLostFoundForm() {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    const formData = new FormData(event.currentTarget)
    startTransition(async () => {
      const response = await createLostFoundAction(formData)
      if (response?.error) {
        setError(response.error)
      }
    })
  }

  return (
    <div className="bg-white border border-rule-grey rounded-lg p-6 md:p-8 space-y-6">
      <header className="border-b border-rule-grey pb-4">
        <h3 className="font-headline text-xl font-bold">Artifact Report Lodging</h3>
        <p className="text-xs text-on-surface-variant mt-1">Submit description and location of the misplaced object</p>
      </header>

      {error && (
        <div className="p-3 bg-error-brick/10 border border-error-brick text-error-brick rounded-lg text-sm font-sans flex items-start gap-2">
          <span className="material-symbols-outlined text-lg mt-0.5">error</span>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
        {/* Type selection */}
        <div className="space-y-1">
          <label className="font-sans font-bold text-xs tracking-wider text-on-surface-variant block uppercase">Report Type</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer font-sans text-sm text-ink-navy font-semibold">
              <input
                type="radio"
                name="type"
                value="lost"
                defaultChecked
                disabled={isPending}
                className="text-ink-navy focus:ring-0 focus:ring-offset-0"
              />
              MISPLACED (LOST)
            </label>
            <label className="flex items-center gap-2 cursor-pointer font-sans text-sm text-ink-navy font-semibold">
              <input
                type="radio"
                name="type"
                value="found"
                disabled={isPending}
                className="text-ink-navy focus:ring-0 focus:ring-offset-0"
              />
              DISCOVERED (FOUND)
            </label>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-1">
          <label className="font-sans font-bold text-xs tracking-wider text-on-surface-variant block uppercase">Item Title</label>
          <input
            name="title"
            required
            disabled={isPending}
            className="w-full h-12 px-4 border border-rule-grey rounded-lg focus:ring-0 focus:border-ink-navy outline-none bg-paper-bg font-sans text-on-surface text-sm disabled:opacity-50"
            placeholder="e.g. Leather Keychain, iPad with felt sleeve"
            type="text"
          />
        </div>

        {/* Location & Date */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="font-sans font-bold text-xs tracking-wider text-on-surface-variant block uppercase">Location Area</label>
            <input
              name="location"
              required
              disabled={isPending}
              className="w-full h-12 px-4 border border-rule-grey rounded-lg focus:ring-0 focus:border-ink-navy outline-none bg-paper-bg font-sans text-on-surface text-sm disabled:opacity-50"
              placeholder="e.g. Library Plaza, Arts Corridor"
              type="text"
            />
          </div>
          <div className="space-y-1">
            <label className="font-sans font-bold text-xs tracking-wider text-on-surface-variant block uppercase">Date Occurred</label>
            <input
              name="occurred_at"
              type="datetime-local"
              disabled={isPending}
              className="w-full h-12 px-4 border border-rule-grey rounded-lg focus:ring-0 focus:border-ink-navy outline-none bg-paper-bg font-sans text-on-surface text-sm disabled:opacity-50"
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1">
          <label className="font-sans font-bold text-xs tracking-wider text-on-surface-variant block uppercase">Manifest Description</label>
          <textarea
            name="description"
            disabled={isPending}
            className="w-full min-h-[120px] p-4 border border-rule-grey rounded-lg focus:ring-0 focus:border-ink-navy outline-none bg-paper-bg font-sans text-on-surface text-sm resize-y disabled:opacity-50"
            placeholder="Provide detail characteristics (inscribed text, specific brand models, color details)..."
          />
        </div>

        {/* Image */}
        <div className="space-y-1">
          <label className="font-sans font-bold text-xs tracking-wider text-on-surface-variant block uppercase">Object Photograph</label>
          <input
            name="image"
            type="file"
            accept="image/*"
            disabled={isPending}
            className="w-full p-2 border border-rule-grey rounded-lg font-sans text-xs bg-paper-bg cursor-pointer disabled:opacity-50"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full h-12 bg-ink-navy text-white rounded-lg font-sans font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-ink-navy/90 active:scale-[0.98] transition-all pt-2 disabled:opacity-50"
        >
          {isPending ? 'Filing Report...' : 'File Official Report'}
          <span className="material-symbols-outlined text-[18px]">publish</span>
        </button>
      </form>
    </div>
  )
}
