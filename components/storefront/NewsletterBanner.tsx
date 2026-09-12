'use client';
import React from 'react';
import { siteConfig } from '@/config/site';

export default function NewsletterBanner() {
  return (
    <section className="mx-auto w-full">
      <div className="bg-black text-white rounded-[20px] p-8 md:p-12 shadow-2xl">
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">STAY UP TO DATE ABOUT OUR LATEST OFFERS</h2>
        <form className="flex flex-col sm:flex-row gap-3" onSubmit={(e: React.FormEvent) => { e.preventDefault(); }}>
          <input
            type="email"
            placeholder="Enter your email address"
            className="flex-1 rounded-full bg-white text-black px-6 py-3.5 text-sm font-medium placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-white/30"
          />
          <button
            type="submit"
            className="rounded-full bg-white text-black px-8 py-3.5 font-bold text-sm hover:bg-neutral-100 transition"
          >
            Subscribe to Newsletter
          </button>
        </form>
      </div>
    </section>
  );
}
