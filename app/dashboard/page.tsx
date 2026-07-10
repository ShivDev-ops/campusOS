import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import DevReputationButton from '@/components/DevReputationButton'
import Sidebar from '@/components/Sidebar'
import MobileNavDropdown from '@/components/MobileNavDropdown'
import { signOutAction } from '@/app/actions/auth'
import DecryptedText from '@/components/DecryptedText'
import ShinyText from '@/components/ShinyText'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch student profile details
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const fullName = profile?.full_name || user.email?.split('@')[0] || 'Student'
  const department = profile?.department || 'Undeclared'
  const year = profile?.year || 1
  const reputation = profile?.reputation_score || '0.00'
  const tier = profile?.permission_tier || 'Reader'

  return (
    <div className="min-h-screen bg-paper-bg flex flex-col md:flex-row text-ink-navy">
      <Sidebar activeSegment="home" />

      {/* Main Content Wrapper */}
      <div className="md:ml-64 flex flex-col flex-1 min-h-screen">
        {/* TopAppBar */}
        <header className="sticky top-0 w-full h-16 bg-white border-b border-rule-grey flex justify-between items-center px-6 md:px-10 z-40">
          <MobileNavDropdown activeSegment="home" />
          <div className="hidden md:block"></div>
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center bg-paper-bg border border-rule-grey px-3 py-1 rounded-lg">
              <span className="material-symbols-outlined text-outline mr-2 text-[20px]">search</span>
              <input className="bg-transparent border-none focus:ring-0 text-sm w-48 lg:w-64 outline-none font-sans" placeholder="Search records..." type="text" />
            </div>
            <button className="relative text-ink-navy hover:text-verified-gold transition-colors">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-0 right-0 w-2 h-2 bg-error-brick rounded-full border border-white"></span>
            </button>
            {/* User Avatar Placeholder */}
            <div className="w-8 h-8 rounded-full border border-rule-grey bg-paper-bg flex items-center justify-center overflow-hidden font-bold text-xs">
              {fullName[0]?.toUpperCase()}
            </div>
          </div>
        </header>

        {/* Main Canvas */}
        <main className="p-6 md:p-10 space-y-8 max-w-[1200px] w-full mx-auto pb-24">
          {/* Summary Strip */}
          <section className="bg-white border border-rule-grey p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-2 border-rule-grey bg-paper-bg flex items-center justify-center font-bold text-lg">
                  {fullName[0]?.toUpperCase()}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-verified-gold text-white p-0.5 rounded-full border-2 border-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                </div>
              </div>
              <div>
                <h2 className="font-headline text-2xl font-bold leading-none">
                  <DecryptedText text={fullName} />
                </h2>
                <div className="flex items-center gap-2 mt-2">
                  <span className="font-sans font-bold text-[9px] tracking-widest bg-ink-navy text-white px-2 py-0.5 rounded uppercase">
                    {tier}
                  </span>
                  <span className="font-sans font-bold text-[9px] tracking-widest border border-rule-grey text-on-surface-variant px-2 py-0.5 rounded uppercase">
                    {department} • Year {year}
                  </span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 md:flex gap-8 border-t md:border-t-0 md:border-l border-rule-grey pt-6 md:pt-0 md:pl-8">
              <div className="space-y-1">
                <p className="font-sans font-bold text-[10px] text-on-surface-variant uppercase tracking-wider">REPUTATION SCORE</p>
                <p className="font-mono text-xl font-bold">{reputation}</p>
              </div>
              <div className="space-y-1">
                <p className="font-sans font-bold text-[10px] text-on-surface-variant uppercase tracking-wider">LEDGER BALANCE</p>
                <p className="font-mono text-xl font-bold">
                  <ShinyText text="100 ¤" />
                </p>
              </div>
            </div>
          </section>

          {/* Welcome Dashboard Note */}
          <section className="bg-white border border-rule-grey p-6 rounded-lg space-y-4">
            <h3 className="font-headline text-xl font-bold">
              <ShinyText text="Welcome to CampusOS!" />
            </h3>
            <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
              Your profile is verified and synced to the secure database ledger. Since this is a fresh account, you are initially in the <strong>Reader</strong> tier. Browse resources, listings, and events below.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 border border-rule-grey rounded-lg bg-paper-bg/30">
                <h4 className="font-sans font-bold text-xs uppercase tracking-wider mb-2">My Credentials</h4>
                <div className="font-mono text-xs text-on-surface-variant space-y-1">
                  <div>USER_ID: {user.id.substring(0, 16)}...</div>
                  <div>EMAIL: {user.email}</div>
                  <div>STATUS: ACTIVE</div>
                </div>
              </div>
              <div className="p-4 border border-rule-grey rounded-lg bg-paper-bg/30">
                <h4 className="font-sans font-bold text-xs uppercase tracking-wider mb-2">Reputation Goal</h4>
                <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                  Earn 25 reputation points and complete 3 contributions to unlock the <strong>Contributor</strong> tier. Unlocks resource posting and recruitment posting.
                </p>
              </div>
            </div>
          </section>

          {/* Dev Test controls */}
          <section className="max-w-md">
            <DevReputationButton />
          </section>
        </main>
      </div>
    </div>
  )
}
