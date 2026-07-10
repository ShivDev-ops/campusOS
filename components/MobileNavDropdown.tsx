'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Props {
  activeSegment: 'home' | 'marketplace' | 'lost-found' | 'calendar' | 'chat' | 'moderation'
}

export default function MobileNavDropdown({ activeSegment }: Props) {
  const [isOpen, setIsOpen] = useState(false)

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

  const activeItem = items.find(item => item.segment === activeSegment) || items[0]

  return (
    <div className="relative md:hidden z-50">
      {/* Dropdown Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 border border-rule-grey bg-white/90 backdrop-blur-sm rounded-lg hover:border-ink-navy transition-all focus:outline-none shadow-[0_1px_2px_rgba(0,0,0,0.02)] active:translate-y-[0.5px]"
      >
        <span className="material-symbols-outlined text-[18px] text-error-brick" style={{ fontVariationSettings: "'FILL' 1" }}>
          {activeItem.icon}
        </span>
        <span className="font-mono text-xs font-bold tracking-wider text-ink-navy uppercase">{activeItem.label}</span>
        <span className={`material-symbols-outlined text-xs text-on-surface-variant transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          expand_more
        </span>
      </button>

      {/* Backdrop (closes dropdown on tap) */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/10 backdrop-blur-[1px]"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 mt-2 w-56 rounded-lg border border-rule-grey bg-white/98 backdrop-blur-md p-1.5 shadow-[0_4px_16px_rgba(0,0,0,0.06)] z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="font-mono font-bold text-[9px] text-outline tracking-wider px-3 py-2 uppercase border-b border-dashed border-rule-grey mb-1.5">
            // navigation grid
          </div>
          <div className="space-y-0.5">
            {items.map((item) => {
              const isActive = activeSegment === item.segment
              return (
                <Link
                  key={item.segment}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 py-2 px-3 transition-all font-mono font-bold text-[10px] tracking-wider uppercase rounded ${
                    isActive
                      ? 'text-error-brick bg-paper-bg font-extrabold border-l-2 border-error-brick pl-2.5 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]'
                      : 'text-on-surface-variant hover:bg-paper-bg hover:text-ink-navy'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]" style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}>
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
