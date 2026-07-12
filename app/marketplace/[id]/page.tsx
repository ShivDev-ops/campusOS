import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import MarkAsSoldButton from '@/components/MarkAsSoldButton'
import ReportListingForm from '@/components/ReportListingForm'
import MessageSellerButton from '@/components/MessageSellerButton'
import Sidebar from '@/components/Sidebar'

interface Props {
  params: Promise<{ id: string }>
}

export default async function ListingDetailPage({ params }: Props) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { id } = await params

  // Fetch listing details
  const { data: item } = await supabase
    .from('listings')
    .select('*, profiles(full_name, permission_tier, department, year)')
    .eq('id', id)
    .single()

  if (!item) {
    redirect('/marketplace')
  }

  const sellerName = item.profiles?.full_name || 'Anonymous'
  const sellerDept = item.profiles?.department || 'Undeclared'
  const sellerYear = item.profiles?.year || 1
  const isSellerVerified = item.profiles?.permission_tier === 'Trader' || item.profiles?.permission_tier === 'Admin'
  const isOwner = user.id === item.seller_id

  const priceFormatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(item.price)

  return (
    <div className="min-h-screen bg-paper-bg flex flex-col md:flex-row text-ink-navy">
      <Sidebar activeSegment="marketplace" />

      <div className="md:ml-64 flex flex-col flex-1 min-h-screen">
        <header className="sticky top-0 z-40 border-b border-rule-grey shadow-[0_1px_3px_rgba(0,0,0,0.04)] bg-white h-16 flex justify-between items-center px-6 md:px-10">
          <Link href="/marketplace" className="flex items-center gap-1 text-xs font-sans font-bold text-on-surface-variant hover:text-ink-navy transition-colors">
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            BACK TO BAZAAR
          </Link>
          <div className="flex items-center gap-4">
            <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">ENTRY_ID: {item.id.substring(0, 8)}</span>
          </div>
        </header>

        <main className="p-6 md:p-10 max-w-[1000px] w-full mx-auto pb-24">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Image Section */}
            <div className="w-full lg:w-3/5 space-y-4">
              <div className="relative aspect-[4/3] bg-white border border-rule-grey rounded-lg overflow-hidden flex items-center justify-center">
                {item.images && item.images.length > 0 ? (
                  <img
                    className="w-full h-full object-cover"
                    alt={item.title}
                    src={item.images[0]}
                  />
                ) : (
                  <span className="material-symbols-outlined text-outline text-6xl">storefront</span>
                )}

                {item.status === 'sold' && (
                  <div className="absolute inset-0 bg-ink-navy/40 backdrop-blur-sm flex items-center justify-center">
                    <span className="border-4 border-white text-white text-3xl font-headline font-bold px-6 py-2 rotate-[-12deg] tracking-widest rounded-lg">
                      SOLD OUT
                    </span>
                  </div>
                )}
              </div>

              {item.images && item.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto hide-scrollbar">
                  {item.images.slice(1).map((imgUrl: string, idx: number) => (
                    <div key={idx} className="w-20 h-20 border border-rule-grey rounded-lg overflow-hidden flex-shrink-0 bg-white">
                      <img className="w-full h-full object-cover" alt="Detail shot" src={imgUrl} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Info Sidebar */}
            <div className="w-full lg:w-2/5 space-y-6">
              <div className="space-y-2">
                <h1 className="font-headline text-3xl font-bold leading-tight">{item.title}</h1>
                <p className="font-mono text-2xl text-verified-gold font-bold">{priceFormatted}</p>
                <div className="flex gap-2 pt-1">
                  <span className="px-3 py-1 bg-white border border-rule-grey rounded font-sans font-bold text-[9px] text-ink-navy uppercase">
                    {item.condition}
                  </span>
                  <span className="px-3 py-1 bg-white border border-rule-grey rounded font-sans font-bold text-[9px] text-ink-navy uppercase">
                    {item.category}
                  </span>
                </div>
              </div>

              {/* Seller Certificate */}
              <div className="p-6 bg-white border border-rule-grey rounded-lg space-y-4">
                <h2 className="font-sans font-bold text-xs text-on-surface-variant border-b border-rule-grey pb-2 uppercase tracking-wider">
                  Seller Certificate
                </h2>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full border border-rule-grey bg-paper-bg flex items-center justify-center font-bold text-base">
                      {sellerName[0]?.toUpperCase()}
                    </div>
                    {isSellerVerified && (
                      <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-[1px]">
                        <div className="border border-verified-gold text-verified-gold rounded-full flex items-center justify-center p-0.5 scale-75">
                          <span className="material-symbols-outlined text-[10px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                            verified
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-sans font-bold text-sm text-ink-navy">{sellerName}</p>
                    <p className="font-mono text-[10px] text-on-surface-variant">Class of '2{sellerYear} | {sellerDept}</p>
                  </div>
                </div>

                {isOwner && item.status === 'active' ? (
                  <MarkAsSoldButton listingId={item.id} />
                ) : (
                  <MessageSellerButton
                    sellerId={item.seller_id}
                    disabled={item.status === 'sold'}
                    label={item.status === 'sold' ? 'Asset Sold' : 'Message Seller'}
                  />
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h3 className="font-sans font-bold text-xs text-on-surface-variant border-b border-rule-grey pb-1 uppercase tracking-wider">
                  Manifest Description
                </h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  {item.description || 'No description provided by the seller.'}
                </p>
              </div>

              {/* Reporting (Only visible to non-owners) */}
              {!isOwner && item.status !== 'hidden' && (
                <div className="pt-4 border-t border-rule-grey flex flex-col items-center">
                  <ReportListingForm listingId={item.id} />
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
