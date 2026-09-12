import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function BentoCategories() {
  const categories = [
    { name: 'Casual', img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80', label: 'Casual' },
    { name: 'Formal', img: 'https://images.unsplash.com/photo-1490481651871-ab68de3e35e3?w=400&q=80', label: 'Formal' },
    { name: 'Party', img: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80', label: 'Party' },
    { name: 'Gym', img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80', label: 'Gym' },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 md:px-6 lg:px-10 py-16 md:py-24">
      <div className="bg-[#F0EEED] rounded-[40px] p-8 md:p-14">
        <h2 className="text-center text-3xl md:text-5xl font-extrabold tracking-tight text-black mb-12">BROWSE BY DRESS STYLE</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((cat) => (
            <a key={cat.name} href="#" className="group relative overflow-hidden rounded-[20px] aspect-[4/3] md:aspect-[3/2]">
              <img src={cat.img} alt={cat.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-4 left-4 md:bottom-6 md:left-8">
                <h3 className="text-2xl md:text-3xl font-extrabold text-white drop-shadow-lg">{cat.name}</h3>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
