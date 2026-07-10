import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Sidebar from '@/components/Sidebar'
import MobileNavDropdown from '@/components/MobileNavDropdown'
import ShinyText from '@/components/ShinyText'

interface SearchParams {
  dept?: string
}

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { dept } = await searchParams
  const currentDept = dept || 'ALL'

  // Fetch user profile to check if they are Admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('permission_tier')
    .eq('id', user.id)
    .single()

  const isAdmin = profile?.permission_tier === 'Admin'

  // Query approved events
  let query = supabase
    .from('calendar_events')
    .select('*, profiles(full_name)')
    .eq('status', 'approved')

  if (currentDept !== 'ALL') {
    query = query.eq('department', currentDept)
  }

  const { data: events } = await query.order('event_date', { ascending: true })

  return (
    <div className="min-h-screen bg-paper-bg flex flex-col md:flex-row text-ink-navy">
      <Sidebar activeSegment="calendar" />

      {/* Top AppBar */}
      <div className="md:ml-64 flex flex-col flex-1 min-h-screen">
        <header className="sticky top-0 z-40 border-b border-rule-grey bg-white h-16 flex justify-between items-center px-6 md:px-10">
          <div className="flex items-center gap-3 md:hidden">
            <MobileNavDropdown activeSegment="calendar" />
          </div>
          <div className="hidden md:flex items-center gap-3">
            <h2 className="font-headline text-xl font-bold text-ink-navy">
              <ShinyText text="Academic Calendar" />
            </h2>
          </div>
          <div className="flex items-center gap-4">
            {isAdmin && (
              <Link
                href="/admin/calendar"
                className="border border-error-brick text-error-brick px-3 py-1.5 rounded text-xs font-sans font-bold uppercase tracking-wider hover:bg-error-brick hover:text-white transition-all"
              >
                Approval Queue
              </Link>
            )}
            <Link href="/dashboard" className="w-8 h-8 rounded-full border border-rule-grey bg-paper-bg flex items-center justify-center overflow-hidden font-bold text-xs">
              U
            </Link>
          </div>
        </header>

        {/* Main Canvas */}
        <main className="p-6 md:p-10 space-y-8 max-w-[1000px] w-full mx-auto pb-24">
          {/* Header & Control Segment */}
          <div className="border-b border-rule-grey pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <h2 className="font-headline text-2xl font-bold text-ink-navy">Spring Events Ledger</h2>
              <p className="text-sm text-on-surface-variant italic leading-relaxed">
                Misplaced deadlines, exams, department seminars, and student conferences.
              </p>
            </div>

            {/* Department Filter Pills */}
            <div className="flex bg-white p-1 rounded-lg w-fit border border-rule-grey flex-wrap gap-1">
              {['ALL', 'CSE', 'ECE', 'MECH', 'CHEM', 'CIVIL'].map((d) => (
                <Link
                  key={d}
                  href={{ pathname: '/calendar', query: { dept: d } }}
                  className={`px-4 py-1.5 font-sans font-bold text-[10px] tracking-wider rounded transition-all uppercase ${
                    currentDept === d
                      ? 'bg-ink-navy text-white shadow-sm'
                      : 'text-on-surface-variant hover:text-ink-navy'
                  }`}
                >
                  {d}
                </Link>
              ))}
            </div>
          </div>

          {/* Agenda List */}
          <div className="space-y-4">
            {events && events.length > 0 ? (
              events.map((event) => (
                <div
                  key={event.id}
                  className="bg-white border border-rule-grey rounded-lg p-5 flex flex-col sm:flex-row gap-4 hover:border-ink-navy transition-all"
                >
                  <div className="flex-shrink-0 text-ink-navy font-mono text-xs font-bold pt-1 min-w-[120px]">
                    {new Date(event.event_date).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-headline text-lg font-bold leading-tight text-ink-navy">
                        {event.title}
                      </h3>
                      <span className="font-mono text-[9px] bg-paper-bg border border-rule-grey px-2 py-0.5 rounded text-on-surface-variant font-bold uppercase">
                        {event.department}
                      </span>
                    </div>
                    <p className="text-sm text-on-surface-variant leading-relaxed">
                      {event.description || 'No description provided.'}
                    </p>
                    <div className="pt-2 flex items-center justify-between text-[10px] text-outline font-sans uppercase font-bold tracking-wider">
                      <span>Posted by {event.profiles?.full_name || 'Anonymous'}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="border border-dashed border-rule-grey rounded-lg p-12 text-center bg-white space-y-2">
                <span className="material-symbols-outlined text-outline text-5xl">calendar_today</span>
                <h3 className="font-headline text-lg font-semibold">No events scheduled</h3>
                <p className="text-sm text-on-surface-variant max-w-sm mx-auto">
                  There are no approved calendar entries registered for {currentDept} department currently.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Floating Action Button for post event */}
      <Link
        href="/calendar/create"
        className="fixed bottom-24 right-6 md:bottom-12 md:right-12 w-14 h-14 bg-verified-gold text-white rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95 z-40"
      >
        <span className="material-symbols-outlined text-[32px]">add</span>
      </Link>
    </div>
  )
}
