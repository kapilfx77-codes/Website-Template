/**
 * Storefront Header — Sticky responsive navbar
 *
 * Reads store identity, features, and POS toggle directly from siteConfig.
 * Includes search bar, navigation links, CartButton, and mobile drawer.
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, Search, Store } from 'lucide-react';
import { cn } from '@/lib/utils';
import { siteConfig } from '@/config/site';
import { CartButton } from '@/components/cart/CartButton';

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { features, name, shortName } = siteConfig;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        {/* Mobile toggle */}
        <button
          className="rounded-md p-2 text-slate-700 hover:bg-slate-100 md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle mobile menu"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 text-xl font-extrabold tracking-tight text-slate-900">
          <span className="rounded-lg bg-slate-900 px-2 py-1 text-sm text-white">Apex</span>
          <span className="hidden sm:inline">{name}</span>
        </Link>

        {/* Search */}
        <div className="mx-6 hidden max-w-md flex-1 md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full rounded-full border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm text-slate-900 shadow-sm transition focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {features.enablePOS && (
            <Link href="/admin" className="hidden items-center gap-1.5 rounded-full bg-amber-100 px-3 py-2 text-xs font-bold text-amber-800 hover:bg-amber-200 sm:inline-flex">
              <Store className="h-3.5 w-3.5" /> POS
            </Link>
          )}
          <span className="hidden text-xs font-medium text-slate-400 sm:inline">{siteConfig.localization.currencySymbol}</span>
          <CartButton />
        </div>
      </div>

      {/* Mobile drawer */}
      <div className={cn('md:hidden overflow-hidden transition-all duration-300', mobileOpen ? 'max-h-80 border-t border-slate-100' : 'max-h-0')}>
        <nav className="flex flex-col gap-1 px-4 py-3 text-sm font-medium text-slate-700">
          <Link href="/" className="rounded-md px-3 py-2 hover:bg-slate-50" onClick={() => setMobileOpen(false)}>Catalog</Link>
          <Link href="/store" className="rounded-md px-3 py-2 hover:bg-slate-50" onClick={() => setMobileOpen(false)}>Categories</Link>
          {features.enablePOS && (
            <Link href="/admin" className="rounded-md px-3 py-2 hover:bg-slate-50" onClick={() => setMobileOpen(false)}>In-Store POS</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
export default Header;
