import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import CreateLostFoundForm from '@/components/CreateLostFoundForm'
import Sidebar from '@/components/Sidebar'
import MobileNavDropdown from '@/components/MobileNavDropdown'

export default async function CreateLostFoundPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-paper-bg flex flex-col md:flex-row text-ink-navy">
      {/* Sidebar Navigation */}
      <Sidebar activeSegment="lost-found" />

      <div className="md:ml-64 flex flex-col flex-1 min-h-screen">
        <header className="sticky top-0 z-40 border-b border-rule-grey bg-white h-16 flex justify-between items-center px-6 md:px-10">
          <div className="flex items-center gap-3 md:hidden">
            <MobileNavDropdown activeSegment="lost-found" />
          </div>
          <div className="hidden md:flex items-center gap-3">
            <h2 className="font-headline text-xl font-bold text-ink-navy">Report Misplaced Artifact</h2>
          </div>
          <Link href="/lost-found" className="flex items-center gap-1 text-xs font-sans font-bold text-on-surface-variant hover:text-ink-navy transition-colors">
            <span className="material-symbols-outlined text-[16px]">close</span>
            CANCEL
          </Link>
        </header>

        <main className="p-6 md:p-10 max-w-[640px] w-full mx-auto pb-24">
          <CreateLostFoundForm />
        </main>
      </div>
    </div>
  )
}
