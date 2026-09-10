'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Package, AlertTriangle, Plus, Minus, ArrowRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { siteConfig } from '@/config/site';
import { ProductVariants, Inventory } from '@/types/supabase';
import { createClient } from '@/lib/supabase/client';

interface POSQuickSearchProps {
  onAddToBasket: (variant: ProductVariants) => void;
}

export function POSQuickSearch({ onAddToBasket }: POSQuickSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ProductVariants[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K or / to focus search
      if ((e.ctrlKey && e.key === 'k') || e.key === '/') {
        if (document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
          e.preventDefault();
          inputRef.current?.focus();
        }
      }
      // Escape to hide
      if (e.key === 'Escape') {
        setShowResults(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const searchProducts = async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    try {
      // In a production environment, this would ideally call a specialized RPC or search endpoint.
      // For this template, we perform a broad filter on product_variants.
      // Note: This is a client-side demonstration.
      const { data, error } = await supabase
        .from('product_variants')
        .select(`
          *,
          products (
            name,
            sku,
            category ( name )
          )
        `)
        .or(`title.ilike.%${searchQuery}%,products.name.ilike.%${searchQuery}%,products.sku.ilike.%${searchQuery}%`)
        .limit(10);

      if (error) throw error;
      setResults(data || []);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setShowResults(true);
    searchProducts(val);
  };

  const selectProduct = (variant: ProductVariants) => {
    onAddToBasket(variant);
    setQuery('');
    setShowResults(false);
    inputRef.current?.blur();
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setShowResults(true)}
          placeholder="Search products by name, SKU, or barcode... (Press '/' to focus)"
          className="w-full rounded-xl border border-slate-200 bg-white py-4 pl-12 pr-4 text-base shadow-sm transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none"
        />
        {isSearching && (
          <div className="absolute inset-y-0 right-4 flex items-center">
            <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
          </div>
        )}
      </div>

      {showResults && results.length > 0 && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl animate-in fade-in slide-in-from-top-2">
          <ul className="max-h-96 overflow-y-auto divide-y divide-slate-100">
            {results.map((variant) => (
              <li key={variant.id}>
                <button
                  onClick={() => selectProduct(variant)}
                  className="flex w-full items-center gap-4 px-4 py-3 text-left transition hover:bg-blue-50 active:bg-blue-100"
                >
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-100 border border-slate-200">
                    <img
                      src={(variant as any).products?.image_urls?.[0] || '/placeholder-product.png'}
                      alt={variant.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <span className="font-bold text-slate-900">{variant.title}</span>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="uppercase">{ (variant as any).products?.category?.name || 'Uncategorized' }</span>
                      <span>•</span>
                      <span className="font-mono">SKU: {(variant as any).products?.sku || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-blue-600">${(variant.price / 100).toFixed(2)}</div>
                    <div className={cn(
                      "text-[10px] font-bold uppercase tracking-tighter px-1.5 py-0.5 rounded-md",
                      variant.stock > 10 ? "bg-green-100 text-green-700" :
                      variant.stock > 0 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
                    )}>
                      {variant.stock > 0 ? `${variant.stock} In Stock` : 'Out of Stock'}
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-300" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showResults && query.length > 0 && results.length === 0 && !isSearching && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white p-8 text-center shadow-xl">
          <Search className="mx-auto h-12 w-12 text-slate-200" />
          <p className="mt-2 text-slate-500 font-medium">No products found matching "{query}"</p>
        </div>
      )}
    </div>
  );
}
