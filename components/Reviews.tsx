import React from 'react';
import { Star, Check } from 'lucide-react';

export default function Reviews() {
  const reviews = [
    { name: 'Sarah M.', role: 'Verified Buyer', quote: 'The quality is unmatched. I wear these every single day and they still look brand new. Highly recommend!', rating: 5 },
    { name: 'James K.', role: 'Verified Buyer', quote: 'Best shopping experience ever. Fast delivery and the packaging felt premium. Will definitely order again.', rating: 5 },
    { name: 'Emma T.', role: 'Verified Buyer', quote: 'Love the design and fit. The discount made it an absolute steal. Thank you APEX!', rating: 4 },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 md:px-6 lg:px-10 py-16 md:py-24">
      <div className="flex items-center justify-between mb-12">
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-black">OUR HAPPY CUSTOMERS</h2>
        <div className="flex gap-2">
          <button aria-label="Previous" className="h-10 w-10 rounded-full border border-neutral-200 flex items-center justify-center hover:bg-black hover:text-white transition"><span>←</span></button>
          <button aria-label="Next" className="h-10 w-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-neutral-800 transition"><span>→</span></button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((r) => (
          <article key={r.name} className="bg-white rounded-[20px] border border-neutral-100 p-7 md:p-8 shadow-sm hover:shadow-md transition">
            <div className="flex text-[#FFC107] mb-4">
              {[1, 2, 3, 4, 5].slice(0, r.rating).map((i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <p className="text-base text-neutral-700 leading-relaxed mb-6">"{r.quote}"</p>
            <div className="flex items-center gap-2.5">
              <span className="font-extrabold text-black">{r.name}</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-green-50 text-green-600 text-[10px] font-bold px-2 py-0.5"><Check className="h-3 w-3" /> Verified</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
