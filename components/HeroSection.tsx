import React from 'react';
import Image from 'next/image';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="mx-auto max-w-7xl px-4 md:px-6 pt-12 pb-6 md:pt-20 md:pb-10">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter leading-[0.95] text-neutral-900">
              FIND CLOTHING<br />
              <span className="text-neutral-500">THAT MATCHES</span><br />
              YOUR STYLE
            </h1>
            <p className="text-neutral-500 text-base md:text-lg max-w-md leading-relaxed">
              Discover curated pieces built for modern life — from casual staples to bold statement wear.
            </p>
            <a href="/store" className="inline-flex items-center rounded-full bg-black text-white px-10 py-4 text-base font-medium shadow-xl hover:bg-neutral-800 transition">Shop Now</a>
            <div className="flex gap-8 pt-4 text-sm font-medium text-neutral-900">
              <div><strong className="block text-xl">200+</strong> International Brands</div>
              <div><strong className="block text-xl">2,000+</strong> High-Quality Products</div>
              <div><strong className="block text-xl">30,000+</strong> Happy Customers</div>
            </div>
          </div>
          <div className="relative aspect-[4/5] rounded-[40px] overflow-hidden bg-paper shadow-2xl">
            <img src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80" alt="Fashion" className="w-full h-full object-cover scale-105 hover:scale-100 transition duration-700" />
          </div>
        </div>
      </div>

      {/* Brand marquee */}
      <div className="bg-black text-white py-8 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 md:px-6 flex gap-12 items-center justify-center text-xl md:text-2xl font-extrabold tracking-tight opacity-90">
          <span>VERSACE</span><span>ZARA</span><span>GUCCI</span><span>PRADA</span><span>CALVIN KLEIN</span>
        </div>
      </div>
    </section>
  );
}
