import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import MobileNavDropdown from '@/components/MobileNavDropdown'
import ShinyText from '@/components/ShinyText'

interface SearchParams {
  q?: string
  category?: string
}

export default async function MarketplacePage({
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

  const { q, category } = await searchParams

  let query = supabase
    .from('listings')
    .select('*, profiles(full_name, permission_tier)')
    .eq('status', 'active')

  if (category && category !== 'all') {
    query = query.eq('category', category)
  }

  if (q) {
    query = query.ilike('title', `%${q}%`)
  }

  const { data: listings } = await query.order('created_at', { ascending: false })

  const currentCategory = category || 'all'

  return (
    <div className="min-h-screen bg-paper-bg flex flex-col md:flex-row text-ink-navy">
      <Sidebar activeSegment="marketplace" />

      {/* Top AppBar */}
      <div className="md:ml-64 flex flex-col flex-1 min-h-screen">
        <header className="sticky top-0 z-40 border-b border-rule-grey bg-white h-16 flex justify-between items-center px-6 md:px-10">
          <div className="flex items-center gap-3 md:hidden">
            <MobileNavDropdown activeSegment="marketplace" />
          </div>
          <div className="hidden md:flex items-center gap-3">
            <h2 className="font-headline text-xl font-bold text-ink-navy">
              <ShinyText text="Bazaar Catalog" />
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="w-8 h-8 rounded-full border border-rule-grey bg-paper-bg flex items-center justify-center overflow-hidden font-bold text-xs">
              U
            </Link>
          </div>
        </header>

        {/* Main Canvas */}
        <main className="p-6 md:p-10 space-y-8 max-w-[1200px] w-full mx-auto pb-24">
          {/* Search & Filter Cluster */}
          <div className="space-y-4">
            <form action="/marketplace" method="GET" className="relative w-full max-w-2xl">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline">search</span>
              <input
                name="q"
                defaultValue={q || ''}
                className="w-full pl-10 pr-4 py-3 bg-white border border-rule-grey rounded-lg focus:outline-none focus:border-ink-navy font-mono text-xs uppercase tracking-wider transition-all"
                placeholder="SEARCH THE ARCHIVES..."
                type="text"
              />
              {category && <input type="hidden" name="category" value={category} />}
            </form>

            {/* Category Filter Pills */}
            <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
              <Link
                href={{ pathname: '/marketplace', query: { ...(q && { q }), category: 'all' } }}
                className={`whitespace-nowrap px-6 py-1.5 rounded-full border text-xs font-sans font-bold uppercase ${
                  currentCategory === 'all'
                    ? 'border-ink-navy bg-ink-navy text-white'
                    : 'border-rule-grey text-on-surface-variant hover:border-ink-navy bg-white'
                }`}
              >
                All Records
              </Link>
              <Link
                href={{ pathname: '/marketplace', query: { ...(q && { q }), category: 'books' } }}
                className={`whitespace-nowrap px-6 py-1.5 rounded-full border text-xs font-sans font-bold uppercase ${
                  currentCategory === 'books'
                    ? 'border-ink-navy bg-ink-navy text-white'
                    : 'border-rule-grey text-on-surface-variant hover:border-ink-navy bg-white'
                }`}
              >
                Books
              </Link>
              <Link
                href={{ pathname: '/marketplace', query: { ...(q && { q }), category: 'electronics' } }}
                className={`whitespace-nowrap px-6 py-1.5 rounded-full border text-xs font-sans font-bold uppercase ${
                  currentCategory === 'electronics'
                    ? 'border-ink-navy bg-ink-navy text-white'
                    : 'border-rule-grey text-on-surface-variant hover:border-ink-navy bg-white'
                }`}
              >
                Electronics
              </Link>
              <Link
                href={{ pathname: '/marketplace', query: { ...(q && { q }), category: 'misc' } }}
                className={`whitespace-nowrap px-6 py-1.5 rounded-full border text-xs font-sans font-bold uppercase ${
                  currentCategory === 'misc'
                    ? 'border-ink-navy bg-ink-navy text-white'
                    : 'border-rule-grey text-on-surface-variant hover:border-ink-navy bg-white'
                }`}
              >
                Misc
              </Link>
            </div>
          </div>

          {/* Listings Grid */}
          {listings && listings.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {listings.map((item) => {
                const sellerName = item.profiles?.full_name || 'Anonymous'
                const isSellerVerified = item.profiles?.permission_tier === 'Trader' || item.profiles?.permission_tier === 'Admin'
                const priceFormatted = new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(item.price)

                return (
                  <Link
                    key={item.id}
                    href={`/marketplace/${item.id}`}
                    className="group cursor-pointer bg-white border border-rule-grey rounded-lg overflow-hidden flex flex-col transition-all hover:border-ink-navy"
                  >
                    <div className="relative aspect-square overflow-hidden border-b border-rule-grey bg-paper-bg flex items-center justify-center">
                      {item.images && item.images.length > 0 ? (
                        <img
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          alt={item.title}
                          src={item.images[0]}
                        />
                      ) : (
                        <span className="material-symbols-outlined text-outline text-4xl">storefront</span>
                      )}
                      <div className="absolute top-2 right-2 bg-white/95 border border-rule-grey px-2 py-0.5 rounded">
                        <span className="font-mono text-[9px] text-ink-navy uppercase font-bold">{item.condition}</span>
                      </div>
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div className="space-y-1">
                        <h3 className="font-headline text-sm font-bold text-ink-navy line-clamp-1 group-hover:underline">
                          {item.title}
                        </h3>
                        <p className="font-mono text-verified-gold text-xs font-bold">{priceFormatted}</p>
                      </div>
                      <div className="mt-4 flex items-center justify-between border-t border-rule-grey pt-2">
                        <span className="font-sans text-[10px] text-on-surface-variant font-medium">
                          {sellerName}
                        </span>
                        {isSellerVerified ? (
                          <div className="border border-verified-gold text-verified-gold p-0.5 rounded-full flex items-center justify-center scale-90" title="Verified Trader">
                            <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                              verified
                            </span>
                          </div>
                        ) : (
                          <span className="font-mono text-[8px] border border-rule-grey px-1.5 py-0.5 rounded text-outline uppercase">
                            Peer
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="border border-dashed border-rule-grey rounded-lg p-12 text-center bg-white space-y-2">
              <span className="material-symbols-outlined text-outline text-5xl">folder_open</span>
              <h3 className="font-headline text-lg font-semibold">No records found</h3>
              <p className="text-sm text-on-surface-variant max-w-sm mx-auto">
                No active listings matched your search criteria. Check back later or post a listing yourself!
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Floating Action Button (FAB) */}
      <Link
        href="/marketplace/create"
        className="fixed bottom-24 right-6 md:bottom-12 md:right-12 w-14 h-14 bg-verified-gold text-white rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95 z-40"
      >
        <span className="material-symbols-outlined text-[32px]">add</span>
      </Link>

    </div>
  )
}
