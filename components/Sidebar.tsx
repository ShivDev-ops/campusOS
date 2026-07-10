import Link from 'next/link'
import { signOutAction } from '@/app/actions/auth'
import RotatingText from '@/components/RotatingText'

interface Props {
  activeSegment: 'home' | 'marketplace' | 'lost-found' | 'calendar' | 'chat' | 'moderation'
}

export default function Sidebar({ activeSegment }: Props) {
  const items = [
    {
      segment: 'home',
      label: 'Home',
      href: '/dashboard',
      icon: 'home'
    },
    {
      segment: 'marketplace',
      label: 'Marketplace',
      href: '/marketplace',
      icon: 'storefront'
    },
    {
      segment: 'lost-found',
      label: 'Lost & Found',
      href: '/lost-found',
      icon: 'inventory_2'
    },
    {
      segment: 'calendar',
      label: 'Calendar',
      href: '/calendar',
      icon: 'calendar_month'
    },
    {
      segment: 'chat',
      label: 'Chat Rooms',
      href: '/chat',
      icon: 'forum'
    }
  ]

  return (
    <aside className="hidden md:flex flex-col h-screen w-64 fixed left-0 top-0 border-r border-rule-grey bg-paper-bg py-8 px-4 z-50">
      <div className="mb-8 px-2">
        <h1 className="font-headline text-2xl font-bold text-ink-navy">
          <RotatingText texts={['CampusOS', 'Bazaar', 'Ledger', 'Calendar', 'Chat']} />
        </h1>
        <p className="font-sans font-bold text-[10px] text-on-surface-variant tracking-wider mt-1 uppercase">Student Shell</p>
      </div>
      <nav className="flex-1 space-y-2 relative border-l border-rule-grey pl-4 ml-2">
        {items.map((item) => {
          const isActive = activeSegment === item.segment
          return (
            <Link
              key={item.segment}
              href={item.href}
              className={`flex items-center gap-3 py-2.5 px-4 transition-all font-sans font-bold text-xs tracking-wider uppercase rounded relative ${
                isActive
                  ? 'text-ink-navy bg-white/60 font-extrabold shadow-sm'
                  : 'text-on-surface-variant hover:bg-white/40'
              }`}
            >
              {/* Active Indicator Line Segment */}
              {isActive && (
                <div className="absolute left-[-18.5px] top-1/2 -translate-y-1/2 w-[4px] h-6 bg-verified-gold rounded-r" />
              )}
              <span className="material-symbols-outlined" style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="mt-auto border-t border-rule-grey pt-4 space-y-3">
        <form action={signOutAction}>
          <button
            type="submit"
            className="w-full border border-rule-grey bg-white text-ink-navy py-2.5 rounded-lg font-sans font-bold text-xs tracking-wider uppercase hover:bg-paper-bg transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[16px]">logout</span>
            LOG OUT
          </button>
        </form>
      </div>
    </aside>
  )
}
