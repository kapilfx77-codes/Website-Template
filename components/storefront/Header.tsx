'use client';
import React from 'react';
import Link from 'next/link';
import { Search, Menu, X, User, ShoppingCart } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  return (
    <>
      {/* Top Announcement Bar */}
      {!dismissed && (
        <div className="relative bg-black text-white text-sm font-medium tracking-wide">
          <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-4 py-3 md:px-6">
            <span>Sign up and get 20% off your first order.</span>
            <Link href="/store" className="font-bold underline underline-offset-2 hover:text-gray-300">Shop Now</Link>
          </div>
          <button
            onClick={() => setDismissed(true)}
            aria-label="Dismiss"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Main Navigation Header */}
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#F0EEED]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6 lg:px-10">
          {/* Left: Brand */}
          <Link href="/" className="text-2xl font-black uppercase tracking-tighter text-black leading-none">
            APEX
          </Link>

          {/* Center: Nav + Search */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-black">
            <Link href="/store" className="hover:text-neutral-600 transition">Shop</Link>
            <Link href="/?category=on-sale" className="hover:text-neutral-600 transition">On Sale</Link>
            <Link href="/store" className="hover:text-neutral-600 transition">New Arrivals</Link>
            <Link href="/store" className="hover:text-neutral-600 transition">Brands</Link>
          </nav>

          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full rounded-full bg-[#F0EEED] px-4 py-2.5 pl-10 text-sm text-black placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-black/10 transition"
              />
            </div>
          </div>

          {/* Right: Cart + Account */}
          <div className="flex items-center gap-4">
            <Link href="/cart" className="relative p-2 hover:bg-[#F0EEED] rounded-full transition" aria-label="Cart">
              <ShoppingCart className="h-5 w-5 text-black" />
              <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-black text-white text-[10px] font-bold flex items-center justify-center">2</span>
            </Link>
            <Link href="#" className="p-2 hover:bg-[#F0EEED] rounded-full transition" aria-label="Account">
              <User className="h-5 w-5 text-black" />
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 hover:bg-[#F0EEED] rounded-full transition"
              aria-label="Menu"
            >
              <Menu className="h-5 w-5 text-black" />
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${mobileOpen ? 'max-h-96 border-t border-[#F0EEED]' : 'max-h-0'}`}>
          <nav className="flex flex-col gap-1 px-4 py-3 text-sm font-medium text-black">
            <Link href="/store" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 hover:bg-[#F0EEED]">Shop</Link>
            <Link href="/" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 hover:bg-[#F0EEED]">On Sale</Link>
            <Link href="/store" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 hover:bg-[#F0EEED]">New Arrivals</Link>
            <Link href="/store" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 hover:bg-[#F0EEED]">Brands</Link>
          </nav>
        </div>
      </header>
    </>
  );
}
