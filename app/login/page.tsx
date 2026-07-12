'use client'

import { useState, useTransition } from 'react'
import { loginAction, signInWithGoogle } from '@/app/actions/auth'
import Link from 'next/link'
import RotatingText from '@/components/RotatingText'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    const formData = new FormData(event.currentTarget)
    startTransition(async () => {
      const response = await loginAction(formData)
      if (response?.error) {
        setError(response.error)
      }
    })
  }

  async function handleGoogleSignIn() {
    setError(null)
    startTransition(async () => {
      const response = await signInWithGoogle()
      if (response?.error) {
        setError(response.error)
      }
    })
  }

  return (
    <div className="bg-paper-bg font-sans min-h-screen flex flex-col items-center justify-center p-6 relative">
      {/* Background Atmospheric Effect */}
      <div className="fixed inset-0 pointer-events-none opacity-20 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full border border-rule-grey"></div>
        <div className="absolute bottom-[-5%] left-[-5%] w-[300px] h-[300px] rounded-full border border-rule-grey"></div>
      </div>

      <main className="relative z-10 w-full max-w-[420px]">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="font-headline text-2xl text-ink-navy flex items-center justify-center gap-1 hover:opacity-85 transition-opacity">
            <RotatingText texts={['CampusOS', 'Bazaar', 'Ledger', 'Calendar', 'Chat']} />
            <span className="material-symbols-outlined text-verified-gold" style={{ fontVariationSettings: "'FILL' 1" }}>
              verified
            </span>
          </Link>
        </div>

        {/* Login Card */}
        <div className="bg-white border border-rule-grey w-full p-6 flex flex-col gap-6 rounded-lg shadow-sm">
          <header className="border-b border-rule-grey pb-4 flex justify-between items-end">
            <h2 className="font-headline text-2xl text-ink-navy font-semibold">Welcome back</h2>
            <span className="material-symbols-outlined text-verified-gold text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              verified_user
            </span>
          </header>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="p-3 bg-error-brick/10 border border-error-brick text-error-brick rounded-lg text-sm font-sans flex items-start gap-2">
                <span className="material-symbols-outlined text-lg mt-0.5">error</span>
                <span>{error}</span>
              </div>
            )}

            {/* Email */}
            <div className="space-y-1">
              <label className="font-sans font-bold text-xs tracking-wider text-on-surface-variant block uppercase">Email Address</label>
              <input
                name="email"
                required
                disabled={isPending}
                className="w-full h-12 px-4 border border-rule-grey rounded-lg focus:ring-1 focus:ring-verified-gold/30 focus:border-ink-navy outline-none bg-paper-bg transition-all placeholder:text-outline/70 font-sans text-on-surface"
                placeholder="student@university.edu"
                type="email"
              />
            </div>

            {/* Password */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="font-sans font-bold text-xs tracking-wider text-on-surface-variant block uppercase">Password</label>
                <Link href="#" className="font-mono text-[10px] text-ink-navy/60 hover:text-ink-navy underline decoration-rule-grey underline-offset-4">
                  Forgot password?
                </Link>
              </div>
              <input
                name="password"
                required
                disabled={isPending}
                className="w-full h-12 px-4 border border-rule-grey rounded-lg focus:ring-1 focus:ring-verified-gold/30 focus:border-ink-navy outline-none bg-paper-bg transition-all placeholder:text-outline/70 font-sans text-on-surface"
                placeholder="••••••••"
                type="password"
              />
            </div>

            {/* Submit Button */}
            <button
              disabled={isPending}
              className="w-full h-12 bg-ink-navy text-white rounded-lg font-sans font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-1 hover:bg-ink-navy/90 active:scale-[0.98] transition-all disabled:opacity-50 mt-2"
              type="submit"
            >
              {isPending ? 'Logging in...' : 'LOG IN'}
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-2">
            <div className="h-[1px] bg-rule-grey flex-grow"></div>
            <span className="font-mono text-[10px] text-on-surface-variant uppercase">OR</span>
            <div className="h-[1px] bg-rule-grey flex-grow"></div>
          </div>

          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isPending}
            className="w-full h-12 border border-rule-grey hover:bg-paper-bg text-ink-navy rounded-lg font-sans font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </button>

          {/* Footer Link */}
          <footer className="pt-4 border-t border-rule-grey flex justify-center">
            <p className="font-sans text-sm text-on-surface-variant">
              New student?{' '}
              <Link href="/signup" className="text-ink-navy font-bold hover:text-verified-gold transition-colors">
                Apply for access
              </Link>
            </p>
          </footer>
        </div>
      </main>
    </div>
  )
}
