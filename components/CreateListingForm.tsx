'use client'

import { useState, useTransition } from 'react'
import { createListingAction } from '@/app/actions/marketplace'
import Link from 'next/link'

export default function CreateListingForm() {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    const formData = new FormData(event.currentTarget)
    startTransition(async () => {
      const response = await createListingAction(formData)
      if (response?.error) {
        setError(response.error)
      }
    })
  }

  return (
    <div className="bg-white border border-rule-grey rounded-lg p-6 md:p-8 space-y-6">
      <header className="border-b border-rule-grey pb-4">
        <h3 className="font-headline text-xl font-bold">Bazaar Entry Registration</h3>
        <p className="text-xs text-on-surface-variant mt-1">Submit description and images for your asset</p>
      </header>

      {error && (
        <div className="p-3 bg-error-brick/10 border border-error-brick text-error-brick rounded-lg text-sm font-sans flex items-start gap-2">
          <span className="material-symbols-outlined text-lg mt-0.5">error</span>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
        {/* Title */}
        <div className="space-y-1">
          <label className="font-sans font-bold text-xs tracking-wider text-on-surface-variant block uppercase">Listing Title</label>
          <input
            name="title"
            required
            disabled={isPending}
            className="w-full h-12 px-4 border border-rule-grey rounded-lg focus:ring-0 focus:border-ink-navy outline-none bg-paper-bg font-sans text-on-surface text-sm disabled:opacity-50"
            placeholder="e.g. TI-84 CE Calculator"
            type="text"
          />
        </div>

        {/* Category & Condition */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="font-sans font-bold text-xs tracking-wider text-on-surface-variant block uppercase">Category</label>
            <select
              name="category"
              required
              disabled={isPending}
              className="w-full h-12 px-4 border border-rule-grey rounded-lg focus:ring-0 focus:border-ink-navy outline-none bg-paper-bg font-sans text-on-surface text-sm appearance-none bg-[right_12px_center] bg-no-repeat bg-[size:16px] disabled:opacity-50"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%231F2A44'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`
              }}
            >
              <option value="" disabled selected>Select</option>
              <option value="books">Books</option>
              <option value="electronics">Electronics</option>
              <option value="misc">Misc</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="font-sans font-bold text-xs tracking-wider text-on-surface-variant block uppercase">Condition</label>
            <select
              name="condition"
              required
              disabled={isPending}
              className="w-full h-12 px-4 border border-rule-grey rounded-lg focus:ring-0 focus:border-ink-navy outline-none bg-paper-bg font-sans text-on-surface text-sm appearance-none bg-[right_12px_center] bg-no-repeat bg-[size:16px] disabled:opacity-50"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%231F2A44'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`
              }}
            >
              <option value="" disabled selected>Select</option>
              <option value="New">New</option>
              <option value="Like New">Like New</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
            </select>
          </div>
        </div>

        {/* Price */}
        <div className="space-y-1">
          <label className="font-sans font-bold text-xs tracking-wider text-on-surface-variant block uppercase">Price (USD)</label>
          <input
            name="price"
            required
            min="0"
            step="0.01"
            disabled={isPending}
            className="w-full h-12 px-4 border border-rule-grey rounded-lg focus:ring-0 focus:border-ink-navy outline-none bg-paper-bg font-mono text-on-surface text-sm disabled:opacity-50"
            placeholder="e.g. 45.00"
            type="number"
          />
        </div>

        {/* Description */}
        <div className="space-y-1">
          <label className="font-sans font-bold text-xs tracking-wider text-on-surface-variant block uppercase">Manifest Description</label>
          <textarea
            name="description"
            disabled={isPending}
            className="w-full min-h-[120px] p-4 border border-rule-grey rounded-lg focus:ring-0 focus:border-ink-navy outline-none bg-paper-bg font-sans text-on-surface text-sm resize-y disabled:opacity-50"
            placeholder="Provide details about condition, textbook courses, or cycle pickup points..."
          />
        </div>

        {/* Images */}
        <div className="space-y-1">
          <label className="font-sans font-bold text-xs tracking-wider text-on-surface-variant block uppercase">Upload Images</label>
          <input
            name="images"
            type="file"
            multiple
            accept="image/*"
            disabled={isPending}
            className="w-full p-2 border border-rule-grey rounded-lg font-sans text-xs bg-paper-bg cursor-pointer disabled:opacity-50"
          />
        </div>

        {/* Primary Submit */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full h-12 bg-ink-navy text-white rounded-lg font-sans font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-ink-navy/90 active:scale-[0.98] transition-all pt-2 disabled:opacity-50"
        >
          {isPending ? 'Publishing...' : 'Post Registry Listing'}
          <span className="material-symbols-outlined text-[18px]">publish</span>
        </button>
      </form>
    </div>
  )
}
