import React from 'react';
import Link from 'next/link';

export default function AnnouncementBar() {
  return (
    <div className="relative bg-slate-950 text-white text-xs md:text-sm font-medium tracking-wide">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2.5">
        <span>Sign up and get 20% off your first order.</span>
        <Link href="/store" className="underline underline-offset-2 font-bold hover:text-amber-300">Shop Now</Link>
      </div>
    </div>
  );
}
