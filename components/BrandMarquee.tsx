export default function BrandMarquee() {
  return (
    <section className="bg-black w-full py-6 md:py-8 overflow-hidden relative" style={{ maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)' }}>
      <div className="animate-[marquee_20s_linear_infinite] whitespace-nowrap flex gap-12 md:gap-20">
        {[...['VERSACE','ZARA','GUCCI','PRADA','CALVIN KLEIN','NIKE','ADIDAS']].map(b=>
          <span key={b} className="text-white text-2xl md:text-3xl font-black tracking-tighter uppercase opacity-90">{b}</span>
        )}
      </div>
      <style jsx>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 20s linear infinite; }
      `}</style>
    </section>
  );
}
