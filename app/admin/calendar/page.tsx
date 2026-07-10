import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import ApproveRejectEventButtons from '@/components/ApproveRejectEventButtons'
import Sidebar from '@/components/Sidebar'
import MobileNavDropdown from '@/components/MobileNavDropdown'

export default async function AdminCalendarPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Verify user profile to check if they are Admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('permission_tier')
    .eq('id', user.id)
    .single()

  if (profile?.permission_tier !== 'Admin') {
    redirect('/dashboard')
  }

  // Fetch pending events
  const { data: events } = await supabase
    .from('calendar_events')
    .select('*, profiles(full_name)')
    .eq('status', 'pending')
    .order('event_date', { ascending: true })

  return (
    <div className="min-h-screen bg-paper-bg flex flex-col md:flex-row text-ink-navy">
      <Sidebar activeSegment="moderation" />

      <div className="md:ml-64 flex flex-col flex-1 min-h-screen">
        <header className="sticky top-0 z-40 border-b border-rule-grey bg-white h-16 flex justify-between items-center px-6 md:px-10">
          <div className="flex items-center gap-3 md:hidden">
            <MobileNavDropdown activeSegment="calendar" />
          </div>
          <div className="hidden md:flex items-center gap-3">
            <h2 className="font-headline text-xl font-bold text-ink-navy">Event Approval Queue</h2>
          </div>
          <Link href="/calendar" className="flex items-center gap-1 text-xs font-sans font-bold text-on-surface-variant hover:text-ink-navy transition-colors">
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            BACK TO CALENDAR
          </Link>
        </header>

        <main className="p-6 md:p-10 space-y-8 max-w-[1000px] w-full mx-auto pb-24">
          <div className="space-y-1">
            <h2 className="font-headline text-2xl font-bold">Pending Event Submissions</h2>
            <p className="text-sm text-on-surface-variant italic">
              Review and approve calendar listings submitted by students.
            </p>
          </div>

          <div className="space-y-4">
            {events && events.length > 0 ? (
              events.map((event) => (
                <div
                  key={event.id}
                  className="bg-white border border-rule-grey rounded-lg p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-start gap-2">
                      <h3 className="font-headline text-lg font-bold text-ink-navy leading-tight">
                        {event.title}
                      </h3>
                      <span className="font-mono text-[9px] bg-paper-bg border border-rule-grey px-2 py-0.5 rounded text-on-surface-variant font-bold uppercase">
                        {event.department}
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant leading-relaxed max-w-2xl">
                      {event.description || 'No description provided.'}
                    </p>
                    <div className="text-[10px] text-outline font-sans uppercase font-bold tracking-wider">
                      <span>Occurs: {new Date(event.event_date).toLocaleString()}</span>
                      <span className="mx-2">•</span>
                      <span>Submitted by: {event.profiles?.full_name || 'Anonymous'}</span>
                    </div>
                  </div>

                  <ApproveRejectEventButtons eventId={event.id} />
                </div>
              ))
            ) : (
              <div className="border border-dashed border-rule-grey rounded-lg p-12 text-center bg-white space-y-2">
                <span className="material-symbols-outlined text-outline text-5xl">checklist</span>
                <h3 className="font-headline text-lg font-semibold">Queue is clear</h3>
                <p className="text-sm text-on-surface-variant max-w-sm mx-auto">
                  There are no pending academic events requiring moderation review right now.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
