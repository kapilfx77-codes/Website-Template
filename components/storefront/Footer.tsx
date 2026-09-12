/** Storefront Footer */
import React from 'react';
import Link from 'next/link';
import { Globe, MessageCircle, Image, Code2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#F0EEED] pt-12 pb-12">
        <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-10">
          {/* 5-column layout */}
          <div className="grid gap-10 md:grid-cols-5">
            {/* Brand Summary */}
            <div className="md:col-span-2">
              <Link href="/" className="text-2xl font-black uppercase tracking-tighter text-black leading-none">APEX</Link>
              <p className="mt-4 text-sm text-neutral-600 leading-relaxed max-w-sm">
                A modern e-commerce experience delivering premium fashion with style, quality, and value.
              </p>
              <div className="mt-5 flex gap-3">
                <a href="#" aria-label="Twitter" className="h-9 w-9 rounded-full bg-black text-white flex items-center justify-center hover:bg-neutral-800 transition"><Globe className="h-4 w-4" /></a>
                <a href="#" aria-label="Facebook" className="h-9 w-9 rounded-full bg-black text-white flex items-center justify-center hover:bg-neutral-800 transition"><MessageCircle className="h-4 w-4" /></a>
                <a href="#" aria-label="Instagram" className="h-9 w-9 rounded-full bg-black text-white flex items-center justify-center hover:bg-neutral-800 transition"><Image className="h-4 w-4" /></a>
                <a href="#" aria-label="GitHub" className="h-9 w-9 rounded-full bg-black text-white flex items-center justify-center hover:bg-neutral-800 transition"><Code2 className="h-4 w-4" /></a>
              </div>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-sm font-extrabold uppercase tracking-wide text-black mb-4">Company</h4>
              <ul className="space-y-2.5 text-sm text-neutral-600">
                <li><Link href="/" className="hover:text-black transition">About</Link></li>
                <li><Link href="/store" className="hover:text-black transition">Features</Link></li>
                <li><Link href="#" className="hover:text-black transition">Works</Link></li>
                <li><Link href="#" className="hover:text-black transition">Career</Link></li>
              </ul>
            </div>

            {/* Help */}
            <div>
              <h4 className="text-sm font-extrabold uppercase tracking-wide text-black mb-4">Help</h4>
              <ul className="space-y-2.5 text-sm text-neutral-600">
                <li><Link href="#" className="hover:text-black transition">Customer Support</Link></li>
                <li><Link href="#" className="hover:text-black transition">Delivery Details</Link></li>
                <li><Link href="#" className="hover:text-black transition">Terms & Conditions</Link></li>
                <li><Link href="#" className="hover:text-black transition">Privacy Policy</Link></li>
              </ul>
            </div>

            {/* FAQ / Resources */}
            <div>
              <h4 className="text-sm font-extrabold uppercase tracking-wide text-black mb-4">FAQ</h4>
              <ul className="space-y-2.5 text-sm text-neutral-600">
                <li><Link href="#" className="hover:text-black transition">Account</Link></li>
                <li><Link href="#" className="hover:text-black transition">Manage Deliveries</Link></li>
                <li><Link href="#" className="hover:text-black transition">Orders</Link></li>
                <li><Link href="#" className="hover:text-black transition">Payments</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-neutral-200 pt-8">
            <p className="text-xs text-neutral-400">© 2026 Apex Store. All rights reserved.</p>
            <div className="flex gap-3 text-neutral-500">
              <span className="text-[10px] font-bold bg-white px-2.5 py-1 rounded-md">VISA</span>
              <span className="text-[10px] font-bold bg-white px-2.5 py-1 rounded-md">MASTERCARD</span>
              <span className="text-[10px] font-bold bg-white px-2.5 py-1 rounded-md">PAYPAL</span>
              <span className="text-[10px] font-bold bg-white px-2.5 py-1 rounded-md">APPLE PAY</span>
              <span className="text-[10px] font-bold bg-white px-2.5 py-1 rounded-md">GOOGLE PAY</span>
            </div>
          </div>
        </div>
      </footer>
  );
}
