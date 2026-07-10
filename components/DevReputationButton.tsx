'use client'

import { useState, useTransition } from 'react'
import { grantDevReputation, resetDevReputation } from '@/app/actions/reputation'

export default function DevReputationButton() {
  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState<string | null>(null)

  function handleGrant() {
    setStatus(null)
    startTransition(async () => {
      const res = await grantDevReputation(100)
      if (res?.error) {
        setStatus(`Error: ${res.error}`)
      } else {
        setStatus('Upgraded to Trader!')
      }
    })
  }

  function handleReset() {
    setStatus(null)
    startTransition(async () => {
      const res = await resetDevReputation()
      if (res?.error) {
        setStatus(`Error: ${res.error}`)
      } else {
        setStatus('Reset to Reader!')
      }
    })
  }

  return (
    <div className="flex flex-col gap-2 p-4 border border-rule-grey rounded-lg bg-verified-gold/5">
      <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-verified-gold flex items-center gap-1">
        <span className="material-symbols-outlined text-[16px]">bug_report</span>
        Developer Testing Controls
      </h4>
      <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
        Simulate reputation changes to test access gates (Reader vs Contributor vs Trader).
      </p>
      <div className="flex gap-2 pt-1">
        <button
          onClick={handleGrant}
          disabled={isPending}
          className="flex-1 bg-verified-gold text-white font-sans font-bold text-[10px] tracking-wider uppercase py-2 rounded hover:bg-verified-gold/90 transition-colors disabled:opacity-50"
        >
          {isPending ? 'Upgrading...' : 'Unlock Trader (+100)'}
        </button>
        <button
          onClick={handleReset}
          disabled={isPending}
          className="flex-1 border border-rule-grey bg-white text-ink-navy font-sans font-bold text-[10px] tracking-wider uppercase py-2 rounded hover:bg-paper-bg transition-colors disabled:opacity-50"
        >
          {isPending ? 'Resetting...' : 'Reset to Reader'}
        </button>
      </div>
      {status && (
        <p className="font-mono text-[9px] text-ink-navy mt-1 text-center font-bold">
          {status}
        </p>
      )}
    </div>
  )
}
