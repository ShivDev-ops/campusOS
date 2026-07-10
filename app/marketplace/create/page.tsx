import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import CreateListingForm from '@/components/CreateListingForm'
import Sidebar from '@/components/Sidebar'
import MobileNavDropdown from '@/components/MobileNavDropdown'

export default async function CreateListingPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch user profile to verify permission tier
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const isGated = profile?.permission_tier !== 'Trader' && profile?.permission_tier !== 'Admin'

  return (
    <div className="min-h-screen bg-paper-bg flex flex-col md:flex-row text-ink-navy">
      <Sidebar activeSegment="marketplace" />

      <div className="md:ml-64 flex flex-col flex-1 min-h-screen">
        <header className="sticky top-0 z-40 border-b border-rule-grey bg-white h-16 flex justify-between items-center px-6 md:px-10">
          <div className="flex items-center gap-3 md:hidden">
            <MobileNavDropdown activeSegment="marketplace" />
          </div>
          <div className="hidden md:flex items-center gap-3">
            <h2 className="font-headline text-xl font-bold text-ink-navy">Register New Asset</h2>
          </div>
          <Link href="/marketplace" className="flex items-center gap-1 text-xs font-sans font-bold text-on-surface-variant hover:text-ink-navy transition-colors">
            <span className="material-symbols-outlined text-[16px]">close</span>
            CANCEL
          </Link>
        </header>

        <main className="p-6 md:p-10 max-w-[640px] w-full mx-auto pb-24">
          {isGated ? (
            /* Permission Tier Gate Screen */
            <div className="bg-white border border-rule-grey rounded-lg p-8 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-verified-gold/10 border border-verified-gold flex items-center justify-center mx-auto text-verified-gold">
                <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>gavel</span>
              </div>
              <h3 className="font-headline text-2xl font-semibold">Write Privileges Gated</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed max-w-md mx-auto">
                Write-heavy actions, such as creating a marketplace listing, are restricted to the <strong>Trader</strong> tier. This system protocol protects the campus bazaar from spam and malicious listings.
              </p>
              <div className="p-4 border border-rule-grey rounded-lg bg-paper-bg/40 max-w-sm mx-auto grid grid-cols-2 gap-4">
                <div>
                  <p className="font-sans font-bold text-[9px] text-on-surface-variant uppercase">Your Tier</p>
                  <p className="font-sans text-sm font-bold text-ink-navy mt-1 uppercase">{profile?.permission_tier || 'Reader'}</p>
                </div>
                <div>
                  <p className="font-sans font-bold text-[9px] text-on-surface-variant uppercase">Your Reputation</p>
                  <p className="font-mono text-sm font-bold text-ink-navy mt-1">{profile?.reputation_score || '0.00'}</p>
                </div>
              </div>
              <p className="font-sans text-xs text-verified-gold font-bold">
                Goal: Earn 75 reputation points and keep 0 open reports to unlock.
              </p>
              <div className="pt-4 flex gap-4 justify-center">
                <Link href="/dashboard" className="bg-ink-navy text-white font-sans font-bold text-xs tracking-wider uppercase py-3 px-6 rounded-lg hover:bg-ink-navy/90 transition-colors">
                  Go to Dashboard
                </Link>
                <Link href="/marketplace" className="border border-rule-grey text-ink-navy font-sans font-bold text-xs tracking-wider uppercase py-3 px-6 rounded-lg hover:bg-white transition-colors">
                  Browse Bazaar
                </Link>
              </div>
            </div>
          ) : (
            <CreateListingForm />
          )}
        </main>
      </div>
    </div>
  )
}
