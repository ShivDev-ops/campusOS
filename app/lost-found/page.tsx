import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import ResolveLostFoundButton from '@/components/ResolveLostFoundButton'
import Sidebar from '@/components/Sidebar'
import MobileNavDropdown from '@/components/MobileNavDropdown'
import ShinyText from '@/components/ShinyText'

interface SearchParams {
  type?: string
  q?: string
}

export default async function LostFoundPage({
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

  const { type, q } = await searchParams
  const currentType = type === 'found' ? 'found' : 'lost'

  // Fetch items
  let query = supabase
    .from('lost_found_items')
    .select('*, profiles(full_name, permission_tier)')
    .eq('type', currentType)
    .eq('status', 'active')

  if (q) {
    query = query.ilike('title', `%${q}%`)
  }

  const { data: items } = await query.order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-paper-bg flex flex-col md:flex-row text-ink-navy">
      <Sidebar activeSegment="lost-found" />

      {/* Top AppBar */}
      <div className="md:ml-64 flex flex-col flex-1 min-h-screen">
        <header className="sticky top-0 z-40 border-b border-rule-grey bg-white h-16 flex justify-between items-center px-6 md:px-10">
          <div className="flex items-center gap-3 md:hidden">
            <MobileNavDropdown activeSegment="lost-found" />
          </div>
          <div className="hidden md:flex items-center gap-3">
            <h2 className="font-headline text-xl font-bold text-ink-navy">
              <ShinyText text="Lost & Found" />
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="w-8 h-8 rounded-full border border-rule-grey bg-paper-bg flex items-center justify-center overflow-hidden font-bold text-xs">
              U
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6 md:p-10 space-y-8 max-w-[1200px] w-full mx-auto pb-24">
          {/* Header & Segmented control */}
          <div className="border-b border-rule-grey pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1">
              <h2 className="font-headline text-2xl font-bold">Campus Ledger</h2>
              <p className="text-sm text-on-surface-variant italic leading-relaxed">
                The official ledger of misplaced artifacts and community discovery.
              </p>
            </div>
            {/* Segmented control */}
            <div className="flex bg-white p-1 rounded-lg w-fit border border-rule-grey">
              <Link
                href={{ pathname: '/lost-found', query: { ...(q && { q }), type: 'lost' } }}
                className={`px-6 py-1.5 font-sans font-bold text-xs rounded transition-all uppercase ${
                  currentType === 'lost'
                    ? 'bg-ink-navy text-white shadow-sm'
                    : 'text-on-surface-variant hover:text-ink-navy'
                }`}
              >
                LOST
              </Link>
              <Link
                href={{ pathname: '/lost-found', query: { ...(q && { q }), type: 'found' } }}
                className={`px-6 py-1.5 font-sans font-bold text-xs rounded transition-all uppercase ${
                  currentType === 'found'
                    ? 'bg-ink-navy text-white shadow-sm'
                    : 'text-on-surface-variant hover:text-ink-navy'
                }`}
              >
                FOUND
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Grid of items (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Active Items */}
                {items && items.length > 0 ? (
                  items.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white border border-rule-grey rounded-lg overflow-hidden group hover:border-verified-gold transition-colors flex flex-col"
                    >
                      <div className="relative h-48 bg-paper-bg overflow-hidden border-b border-rule-grey flex items-center justify-center">
                        {item.image_url ? (
                          <img
                            className="w-full h-full object-cover"
                            alt={item.title}
                            src={item.image_url}
                          />
                        ) : (
                          <span className="material-symbols-outlined text-outline text-5xl">inventory_2</span>
                        )}
                        <div className="absolute top-3 right-3">
                          <span className="bg-white border border-verified-gold text-verified-gold px-3 py-0.5 rounded-full font-sans font-bold text-[9px] tracking-widest flex items-center gap-1 uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-verified-gold animate-pulse"></span>
                            ACTIVE
                          </span>
                        </div>
                      </div>
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-1">
                          <h3 className="font-headline text-lg font-bold text-ink-navy">{item.title}</h3>
                          <p className="font-mono text-[10px] text-on-surface-variant">Near {item.location}</p>
                        </div>
                        <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-2">
                          {item.description || 'No description provided.'}
                        </p>
                        <div className="pt-2 border-t border-rule-grey flex justify-between items-center text-[10px] font-sans font-bold uppercase tracking-wider text-outline">
                          <span>Reported: {new Date(item.occurred_at).toLocaleDateString()}</span>
                          {item.reporter_id === user.id && (
                            <ResolveLostFoundButton itemId={item.id} />
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : null}

                {/* File a Report Box */}
                <div className="bg-white/40 border border-dashed border-rule-grey rounded-lg flex flex-col items-center justify-center p-8 text-center h-[350px] space-y-4">
                  <div className="w-16 h-16 rounded-full bg-white border border-rule-grey flex items-center justify-center text-outline">
                    <span className="material-symbols-outlined text-3xl">add_photo_alternate</span>
                  </div>
                  <h3 className="font-headline text-base font-bold text-ink-navy">Missing Something?</h3>
                  <p className="text-xs text-on-surface-variant max-w-xs leading-relaxed">
                    Document your lost or found item in the campus ledger to begin the verification and recovery process.
                  </p>
                  <Link
                    href="/lost-found/create"
                    className="bg-ink-navy text-white px-6 py-2.5 rounded-lg font-sans font-bold text-xs tracking-wider uppercase hover:bg-ink-navy/90 transition-colors"
                  >
                    FILE A REPORT
                  </Link>
                </div>
              </div>
            </div>

            {/* Notify Me Widget Sidebar (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white border border-rule-grey p-6 rounded-lg space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-verified-gold">campaign</span>
                  <h3 className="font-headline text-lg font-bold text-ink-navy">Notify Me</h3>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Set up automated email alerts for matching keywords appearing in the recovery ledger.
                </p>
                <form className="space-y-4">
                  <div className="space-y-1">
                    <label className="font-sans font-bold text-[10px] text-on-surface-variant block uppercase">Item Keyword</label>
                    <input
                      className="w-full px-3 py-2 border border-rule-grey rounded-lg outline-none focus:border-ink-navy font-sans text-xs bg-paper-bg"
                      placeholder="e.g. iPad, AirPods, Keys"
                      type="text"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-sans font-bold text-[10px] text-on-surface-variant block uppercase">Location Radius</label>
                    <select
                      className="w-full px-3 py-2 border border-rule-grey rounded-lg outline-none focus:border-ink-navy font-sans text-xs bg-paper-bg"
                    >
                      <option>Main Campus Only</option>
                      <option>Academic East facilities</option>
                      <option>Sports Complex</option>
                      <option>All campus areas</option>
                    </select>
                  </div>
                  <button
                    type="button"
                    className="w-full border-2 border-ink-navy text-ink-navy font-sans font-bold text-xs tracking-wider uppercase py-2.5 rounded hover:bg-ink-navy hover:text-white transition-all flex items-center justify-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">notifications_active</span>
                    Enable Watcher
                  </button>
                </form>
              </div>

              {/* Status Certificate badge */}
              <div className="bg-white border border-rule-grey p-6 rounded-lg text-center space-y-2 relative overflow-hidden">
                <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full border-2 border-verified-gold/10 flex items-center justify-center opacity-30">
                  <span className="material-symbols-outlined text-3xl text-verified-gold">verified</span>
                </div>
                <p className="font-sans font-bold text-[9px] text-verified-gold uppercase tracking-wider">Verification protocol</p>
                <h4 className="font-headline text-lg font-bold text-ink-navy">High-Trust Account</h4>
                <p className="text-[11px] text-on-surface-variant leading-relaxed">
                  Your student digital signature is active. Required for reporting or claiming high-value items.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
