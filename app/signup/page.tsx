'use client'

import { useState, useTransition } from 'react'
import { signUpAction } from '@/app/actions/auth'
import Link from 'next/link'
import RotatingText from '@/components/RotatingText'

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSuccess(null)

    const formData = new FormData(event.currentTarget)
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    startTransition(async () => {
      const response = await signUpAction(formData)
      if (response?.error) {
        setError(response.error)
      } else if (response?.success) {
        setSuccess(response.success)
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

        {/* Sign Up Card */}
        <div className="bg-white border border-rule-grey rounded-lg p-6 shadow-sm">
          {/* Header Section */}
          <div className="mb-6 border-b border-rule-grey pb-4">
            <h2 className="font-headline text-2xl text-ink-navy font-semibold">Create your account</h2>
            <p className="font-sans text-sm text-on-surface-variant mt-1">Institutional and verification identity setup</p>
          </div>

          {/* Success State */}
          {success && (
            <div className="mb-6 p-4 bg-success-sage/10 border border-success-sage text-success-sage rounded-lg text-sm font-sans space-y-2">
              <p className="font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-lg">check_circle</span>
                Check your inbox
              </p>
              <p>{success}</p>
            </div>
          )}

          {/* Form */}
          {!success && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error Message */}
              {error && (
                <div className="p-3 bg-error-brick/10 border border-error-brick text-error-brick rounded-lg text-sm font-sans flex items-start gap-2">
                  <span className="material-symbols-outlined text-lg mt-0.5">error</span>
                  <span>{error}</span>
                </div>
              )}

              {/* Full Name */}
              <div className="space-y-1">
                <label className="font-sans font-bold text-xs tracking-wider text-on-surface-variant block uppercase">Full Name</label>
                <input
                  name="fullName"
                  required
                  disabled={isPending}
                  className="w-full h-12 px-4 border border-rule-grey rounded-lg focus:ring-1 focus:ring-verified-gold/30 focus:border-ink-navy outline-none bg-paper-bg transition-all placeholder:text-outline/70 font-sans text-on-surface"
                  placeholder="e.g. Rahul Sharma"
                  type="text"
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="font-sans font-bold text-xs tracking-wider text-on-surface-variant block uppercase">Email Address</label>
                <input
                  name="email"
                  required
                  disabled={isPending}
                  className="w-full h-12 px-4 border border-rule-grey rounded-lg focus:ring-1 focus:ring-verified-gold/30 focus:border-ink-navy outline-none bg-paper-bg transition-all placeholder:text-outline/70 font-sans text-on-surface"
                  placeholder="e.g. rahul.sharma@example.edu.in"
                  type="email"
                />
              </div>

              {/* Row: Department & Year */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-sans font-bold text-xs tracking-wider text-on-surface-variant block uppercase">Department</label>
                  <select
                    name="department"
                    required
                    disabled={isPending}
                    className="w-full h-12 px-4 border border-rule-grey rounded-lg focus:ring-1 focus:ring-verified-gold/30 focus:border-ink-navy outline-none bg-paper-bg transition-all font-sans text-on-surface appearance-none bg-[right_12px_center] bg-no-repeat bg-[size:16px] text-sm"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%231F2A44'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`
                    }}
                  >
                    <option value="" disabled>Select</option>
                    <option value="Comp. Science">Comp. Science</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Economics">Economics</option>
                    <option value="Medicine">Medicine</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-sans font-bold text-xs tracking-wider text-on-surface-variant block uppercase">Year</label>
                  <select
                    name="year"
                    required
                    disabled={isPending}
                    className="w-full h-12 px-4 border border-rule-grey rounded-lg focus:ring-1 focus:ring-verified-gold/30 focus:border-ink-navy outline-none bg-paper-bg transition-all font-sans text-on-surface appearance-none bg-[right_12px_center] bg-no-repeat bg-[size:16px] text-sm"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%231F2A44'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`
                    }}
                  >
                    <option value="" disabled>Select</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                </div>
              </div>

              {/* Password Fields */}
              <div className="space-y-4 pt-1">
                <div className="space-y-1">
                  <label className="font-sans font-bold text-xs tracking-wider text-on-surface-variant block uppercase">Password</label>
                  <input
                    name="password"
                    required
                    disabled={isPending}
                    className="w-full h-12 px-4 border border-rule-grey rounded-lg focus:ring-1 focus:ring-verified-gold/30 focus:border-ink-navy outline-none bg-paper-bg transition-all placeholder:text-outline/70 font-sans text-on-surface"
                    placeholder="••••••••"
                    type="password"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-sans font-bold text-xs tracking-wider text-on-surface-variant block uppercase">Confirm Password</label>
                  <input
                    name="confirmPassword"
                    required
                    disabled={isPending}
                    className="w-full h-12 px-4 border border-rule-grey rounded-lg focus:ring-1 focus:ring-verified-gold/30 focus:border-ink-navy outline-none bg-paper-bg transition-all placeholder:text-outline/70 font-sans text-on-surface"
                    placeholder="••••••••"
                    type="password"
                  />
                </div>
              </div>

              {/* Primary CTA */}
              <button
                disabled={isPending}
                className="w-full h-12 bg-ink-navy text-white rounded-lg font-sans font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-1 hover:bg-ink-navy/90 active:scale-[0.98] transition-all mt-6 disabled:opacity-50"
                type="submit"
              >
                {isPending ? 'Verifying...' : 'VERIFY MY EMAIL'}
                <span className="material-symbols-outlined text-[18px]">verified_user</span>
              </button>
            </form>
          )}

          {/* Secondary Footer Link */}
          <div className="mt-6 text-center">
            <p className="font-sans text-sm text-on-surface-variant">
              Already have an account?{' '}
              <Link href="/login" className="text-ink-navy font-bold underline decoration-rule-grey underline-offset-4 hover:decoration-ink-navy transition-all">
                Login
              </Link>
            </p>
          </div>
        </div>

        {/* Bottom Footer Meta */}
        <footer className="mt-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="h-[1px] w-8 bg-rule-grey"></div>
            <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">Official Ledger System</span>
            <div className="h-[1px] w-8 bg-rule-grey"></div>
          </div>
          <p className="font-mono text-[9px] text-outline px-6">
            By signing up, you agree to the Institutional Data Residency and Campus Verification Protocols.
          </p>
        </footer>
      </main>

      {/* Floating Stamp Seal */}
      <div className="fixed top-6 right-6 pointer-events-none hidden md:block">
        <div className="w-32 h-32 rounded-full border border-dashed border-rule-grey flex items-center justify-center rotate-12 bg-radial-gradient">
          <span className="font-mono text-[10px] text-rule-grey text-center leading-none tracking-widest uppercase">
            Official<br />Stamp<br />CampusOS
          </span>
        </div>
      </div>
    </div>
  )
}
