'use client'

import Link from 'next/link'
import { useRef } from 'react'
import RotatingText from '@/components/RotatingText'

export default function LandingPage() {
  const scrollRef = useRef<HTMLDivElement>(null)

  function scroll(offset: number) {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' })
    }
  }

  return (
    <div className="font-sans text-ink-navy selection:bg-verified-gold/30">
      {/* TopAppBar */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white h-16 border-b border-rule-grey flex justify-between items-center px-6 md:px-10">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-headline text-2xl font-bold text-ink-navy flex items-center gap-1">
            <RotatingText texts={['CampusOS', 'Bazaar', 'Ledger', 'Calendar', 'Chat']} />
            <span className="material-symbols-outlined text-verified-gold text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
              verified
            </span>
          </Link>
          <nav className="hidden md:flex gap-6 items-center">
            <a className="font-sans font-bold text-xs tracking-wider text-on-surface-variant hover:text-verified-gold transition-colors uppercase" href="#features">FEATURES</a>
            <a className="font-sans font-bold text-xs tracking-wider text-on-surface-variant hover:text-verified-gold transition-colors uppercase" href="#ledger">HOW IT WORKS</a>
            <Link className="font-sans font-bold text-xs tracking-wider text-on-surface-variant hover:text-verified-gold transition-colors uppercase" href="/login">LOG IN</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="material-symbols-outlined text-ink-navy cursor-pointer md:block hidden hover:text-verified-gold transition-colors">
            notifications
          </Link>
          <Link href="/signup" className="bg-ink-navy text-white px-6 py-2 font-sans font-bold text-xs tracking-wider uppercase rounded-lg hover:scale-105 active:scale-95 transition-all">
            SIGN UP
          </Link>
        </div>
      </header>

      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-paper-bg py-20 md:py-32 border-b border-rule-grey">
          <div className="max-w-[1200px] mx-auto px-6 md:px-10 grid md:grid-cols-2 gap-12 items-center">
            <div className="z-10">
              <span className="inline-block font-sans font-bold text-xs tracking-wider text-verified-gold mb-4 px-2 py-0.5 border border-verified-gold">
                VERIFIED CAMPUS LEDGER
              </span>
              <h2 className="font-headline text-4xl md:text-5xl text-ink-navy mb-6 leading-tight font-bold">
                One verified place for everything campus.
              </h2>
              <p className="font-sans text-lg text-on-surface-variant mb-8 max-w-md">
                The definitive ecosystem for campus life. Replace chaotic WhatsApp groups and manual spreadsheets with a verified paper-trail.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/signup" className="bg-ink-navy text-center text-white px-8 py-3 font-sans font-bold text-xs tracking-wider uppercase rounded-lg hover:bg-ink-navy/90 transition-colors">
                  JOIN YOUR CAMPUS
                </Link>
                <Link href="/login" className="border text-center border-rule-grey text-ink-navy px-8 py-3 font-sans font-bold text-xs tracking-wider uppercase rounded-lg hover:bg-white transition-colors">
                  VIEW DEMO
                </Link>
              </div>
            </div>
            <div className="relative flex justify-center items-center">
              <div className="w-full h-[300px] md:h-[500px] bg-white border border-rule-grey rounded-xl rotate-2 absolute top-0 -z-10 shadow-sm opacity-50"></div>
              <div className="w-full h-[300px] md:h-[500px] bg-white border border-rule-grey rounded-xl -rotate-1 shadow-md flex flex-col p-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-paper-bg rounded-full border border-rule-grey flex items-center justify-center">
                      <span className="material-symbols-outlined text-ink-navy">school</span>
                    </div>
                    <div>
                      <p className="font-sans font-bold text-xs tracking-wider">UNIVERSITY COUNCIL</p>
                      <p className="font-mono text-[10px] text-on-surface-variant">ID: 2026-OFFICIAL</p>
                    </div>
                  </div>
                  <div className="w-12 h-12 flex items-center justify-center border-2 border-verified-gold text-verified-gold rounded-full rotate-12">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  </div>
                </div>
                <div className="flex-grow space-y-4">
                  <div className="h-4 bg-paper-bg w-3/4 rounded"></div>
                  <div className="h-4 bg-paper-bg w-full rounded"></div>
                  <div className="h-4 bg-paper-bg w-5/6 rounded"></div>
                  <div className="h-32 bg-paper-bg border border-dashed border-rule-grey w-full mt-6 flex items-center justify-center rounded">
                    <span className="material-symbols-outlined text-rule-grey text-4xl">inventory_2</span>
                  </div>
                </div>
                <div className="mt-8 pt-4 border-t border-rule-grey flex justify-between">
                  <div className="font-mono text-[10px] text-on-surface-variant">SERIAL NO: AB-00129-C</div>
                  <div className="font-mono text-[10px] text-on-surface-variant">SECURE NODE: ACTIVE</div>
                </div>
              </div>
              {/* Paper Texture Overlay Simulation */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/paper.png')` }}></div>
            </div>
          </div>
        </section>

        {/* Why Verified Section */}
        <section className="py-20 md:py-32 bg-white" id="features">
          <div className="max-w-[1200px] mx-auto px-6 md:px-10">
            <div className="mb-16">
              <h3 className="font-headline text-3xl text-ink-navy border-l-4 border-verified-gold pl-4 font-bold">The Pillars of Credibility</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <span className="material-symbols-outlined text-verified-gold text-4xl">fingerprint</span>
                <h4 className="font-headline text-xl font-bold">Verification-First</h4>
                <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
                  No anonymous trolls. Every user is authenticated via official credentials, ensuring a space built on accountability and trust.
                </p>
              </div>
              <div className="space-y-4">
                <span className="material-symbols-outlined text-verified-gold text-4xl">rewarded_ads</span>
                <h4 className="font-headline text-xl font-bold">Reputation-Driven</h4>
                <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
                  Your actions build your ledger. Trade skills, sell books, or lead groups—every successful interaction enhances your campus credibility score.
                </p>
              </div>
              <div className="space-y-4">
                <span className="material-symbols-outlined text-verified-gold text-4xl">school</span>
                <h4 className="font-headline text-xl font-bold">Built for Campus</h4>
                <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
                  Not a generic tool. From club recruitment to skill bartering, our modules are tailor-made for the specific workflows of university life.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Module Showcase */}
        <section className="py-20 bg-paper-bg border-y border-rule-grey overflow-hidden" id="ledger">
          <div className="max-w-[1200px] mx-auto px-6 md:px-10 mb-8 flex justify-between items-end">
            <div>
              <h3 className="font-headline text-3xl font-bold text-ink-navy">The Ecosystem</h3>
              <p className="font-mono text-xs text-on-surface-variant mt-1">SYSTEM_OVERVIEW: v1.0.4</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => scroll(-340)} className="w-10 h-10 border border-rule-grey flex items-center justify-center rounded-lg hover:bg-white transition-colors cursor-pointer">
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button onClick={() => scroll(340)} className="w-10 h-10 border border-rule-grey flex items-center justify-center rounded-lg hover:bg-white transition-colors cursor-pointer">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
          <div ref={scrollRef} className="flex gap-6 overflow-x-auto px-6 md:px-10 pb-6 hide-scrollbar snap-x" id="module-scroll">
            {/* Academic Ledger */}
            <div className="min-w-[280px] md:min-w-[340px] bg-white border border-rule-grey p-6 snap-start flex flex-col h-[400px] rounded-lg">
              <span className="material-symbols-outlined text-ink-navy text-4xl mb-4">account_balance</span>
              <h5 className="font-headline text-xl font-bold mb-2">Academic Ledger</h5>
              <p className="text-on-surface-variant text-sm mb-6">Unified tracking for club credits, attendance boons, and formal achievements.</p>
              <div className="flex-grow bg-paper-bg rounded p-4 font-mono text-[11px] space-y-2">
                <div className="flex justify-between border-b border-rule-grey pb-1"><span>CREDIT_ID</span><span>TX_001</span></div>
                <div className="flex justify-between border-b border-rule-grey pb-1"><span>SIGMA_CLUB</span><span>+10.5</span></div>
                <div className="flex justify-between border-b border-rule-grey pb-1"><span>DEBATE_SOC</span><span>+4.0</span></div>
              </div>
            </div>
            {/* Marketplace */}
            <div className="min-w-[280px] md:min-w-[340px] bg-white border border-rule-grey p-6 snap-start flex flex-col h-[400px] rounded-lg">
              <span className="material-symbols-outlined text-ink-navy text-4xl mb-4">storefront</span>
              <h5 className="font-headline text-xl font-bold mb-2">Marketplace</h5>
              <p className="text-on-surface-variant text-sm mb-6">Verified peer-to-peer commerce. Books, cycles, and lab gear with safe campus hand-offs.</p>
              <div className="flex-grow bg-paper-bg rounded p-4">
                <div className="h-24 bg-white border border-rule-grey rounded mb-3 relative overflow-hidden flex items-center justify-center">
                  <div className="absolute bottom-2 left-2 bg-verified-gold text-white text-[10px] px-2 py-0.5 font-bold rounded">SALE</div>
                  <span className="material-symbols-outlined text-rule-grey text-3xl">image</span>
                </div>
                <div className="h-3 bg-ink-navy w-2/3 mb-2 rounded"></div>
                <div className="h-3 bg-rule-grey w-1/3 rounded"></div>
              </div>
            </div>
            {/* Skill Barter */}
            <div className="min-w-[280px] md:min-w-[340px] bg-white border border-rule-grey p-6 snap-start flex flex-col h-[400px] rounded-lg">
              <span className="material-symbols-outlined text-ink-navy text-4xl mb-4">swap_horiz</span>
              <h5 className="font-headline text-xl font-bold mb-2">Skill Barter</h5>
              <p className="text-on-surface-variant text-sm mb-6">Trade your Python tutoring for a guitar lesson. Currencies of talent, not just cash.</p>
              <div className="flex-grow bg-paper-bg rounded p-4 flex flex-col justify-center">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-verified-gold/20 flex items-center justify-center text-verified-gold font-bold text-xs">A</div>
                  <div className="h-1 bg-rule-grey flex-grow rounded"></div>
                  <span className="material-symbols-outlined text-verified-gold">sync</span>
                  <div className="h-1 bg-rule-grey flex-grow rounded"></div>
                  <div className="w-8 h-8 rounded-full bg-ink-navy/20 flex items-center justify-center text-ink-navy font-bold text-xs">B</div>
                </div>
              </div>
            </div>
            {/* Identity */}
            <div className="min-w-[280px] md:min-w-[340px] bg-white border border-rule-grey p-6 snap-start flex flex-col h-[400px] rounded-lg">
              <span className="material-symbols-outlined text-ink-navy text-4xl mb-4">badge</span>
              <h5 className="font-headline text-xl font-bold mb-2">Digital Identity</h5>
              <p className="text-on-surface-variant text-sm mb-6">One ID for entry, library access, and student discounts. Secure and always present.</p>
              <div className="flex-grow bg-paper-bg rounded p-4 flex items-center justify-center">
                <div className="w-3/4 h-24 border-2 border-verified-gold flex flex-col p-2 relative overflow-hidden rounded bg-white">
                  <div className="w-8 h-8 bg-paper-bg rounded border border-rule-grey"></div>
                  <div className="mt-2 h-2 bg-ink-navy w-1/2 rounded"></div>
                  <div className="mt-1 h-2 bg-rule-grey w-1/3 rounded"></div>
                  <div className="absolute -bottom-4 -right-4 w-12 h-12 rounded-full border border-verified-gold opacity-30"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-20 md:py-32 bg-white">
          <div className="max-w-[1200px] mx-auto px-6 md:px-10 grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 flex justify-center">
              <div className="w-48 h-48 md:w-64 md:h-64 rounded-full border-4 border-verified-gold flex flex-col items-center justify-center text-verified-gold bg-paper-bg shadow-sm rotate-12 relative">
                <span className="material-symbols-outlined text-6xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                <span className="font-sans font-bold text-xs tracking-wider mt-2 uppercase">VERIFIED PAPER</span>
                {/* Dashed outer ring */}
                <div className="absolute inset-[-12px] border border-dashed border-verified-gold rounded-full animate-[spin_40s_linear_infinite]"></div>
              </div>
            </div>
            <div className="order-1 md:order-2 space-y-6">
              <h3 className="font-headline text-3xl md:text-4xl text-ink-navy font-bold leading-tight">
                Academic Ledger Protocols.
              </h3>
              <p className="text-base text-on-surface-variant leading-relaxed">
                CampusOS utilizes a non-custodial reputation system. Trust metrics, peer reviews, and service exchanges are recorded to generate a persistent profile grade.
              </p>
              <div className="p-6 bg-paper-bg border border-rule-grey border-l-4 border-l-verified-gold rounded-lg">
                <p className="font-mono text-xs mb-2 text-ink-navy font-bold">LEDGER STATUS:</p>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-success-sage rounded-full animate-pulse"></div>
                  <p className="font-mono text-xs uppercase text-on-surface-variant font-bold">Active: Secure Ledger Node</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-paper-bg border-t border-rule-grey py-12">
          <div className="max-w-[1200px] mx-auto px-6 md:px-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div>
              <h4 className="font-headline text-xl font-bold text-ink-navy mb-1">CampusOS</h4>
              <p className="text-on-surface-variant text-sm">Official Record of Student Life.</p>
              <p className="text-on-surface-variant text-[10px] mt-4 font-mono">SPONSORED BY THE UNIVERSITY COUNCIL</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
              <div className="flex flex-col gap-2">
                <span className="font-sans font-bold text-xs tracking-wider text-ink-navy">LEGAL</span>
                <Link className="text-xs text-on-surface-variant hover:text-ink-navy" href="#">Privacy</Link>
                <Link className="text-xs text-on-surface-variant hover:text-ink-navy" href="#">Terms</Link>
              </div>
              <div className="flex flex-col gap-2">
                <span className="font-sans font-bold text-xs tracking-wider text-ink-navy">SUPPORT</span>
                <Link className="text-xs text-on-surface-variant hover:text-ink-navy" href="#">Help Desk</Link>
                <Link className="text-xs text-on-surface-variant hover:text-ink-navy" href="#">Contact</Link>
              </div>
              <div className="flex flex-col gap-2">
                <span className="font-sans font-bold text-xs tracking-wider text-ink-navy">CONNECT</span>
                <Link className="text-xs text-on-surface-variant hover:text-ink-navy" href="#">Twitter</Link>
                <Link className="text-xs text-on-surface-variant hover:text-ink-navy" href="#">Discord</Link>
              </div>
            </div>
          </div>
          <div className="max-w-[1200px] mx-auto px-6 md:px-10 mt-8 pt-4 border-t border-rule-grey/50 flex justify-between items-center text-[9px] text-on-surface-variant font-mono">
            <span>© 2026 CAMPUSOS TECHNOLOGIES</span>
            <span>BUILD_REF: 5.0.0-GOLD</span>
          </div>
        </footer>
      </main>

      {/* BottomNavBar (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-paper-bg border-t border-rule-grey flex justify-around items-center h-16 pb-safe">
        <Link className="flex flex-col items-center justify-center text-ink-navy pt-2 border-t-2 border-verified-gold" href="#">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>home</span>
          <span className="font-sans font-bold text-[9px] tracking-wider mt-1">HOME</span>
        </Link>
        <a className="flex flex-col items-center justify-center text-on-surface-variant pt-2" href="#ledger">
          <span className="material-symbols-outlined">account_balance</span>
          <span className="font-sans font-bold text-[9px] tracking-wider mt-1">LEDGER</span>
        </a>
        <a className="flex flex-col items-center justify-center text-on-surface-variant pt-2" href="#features">
          <span className="material-symbols-outlined">storefront</span>
          <span className="font-sans font-bold text-[9px] tracking-wider mt-1">MARKET</span>
        </a>
        <Link className="flex flex-col items-center justify-center text-on-surface-variant pt-2" href="/login">
          <span className="material-symbols-outlined">person</span>
          <span className="font-sans font-bold text-[9px] tracking-wider mt-1">PROFILE</span>
        </Link>
      </nav>
    </div>
  )
}
