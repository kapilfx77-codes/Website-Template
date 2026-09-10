import { siteConfig } from '@/config/site';
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-white px-6 py-24">
      <div className="max-w-lg text-center space-y-6">
        <h1 className="text-7xl font-black tracking-tighter text-blue-500">404</h1>
        <h2 className="text-3xl font-extrabold tracking-tight">Page Not Found</h2>
        <p className="text-slate-400 text-lg">The page you are looking for does not exist or has been moved.</p>
        <div className="flex items-center justify-center gap-4 pt-4">
          <Link href="/" className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition">Back to Home</Link>
          <Link href="/store" className="rounded-xl bg-slate-800 px-6 py-3 font-bold text-white hover:bg-slate-700 transition">Browse Store</Link>
        </div>
        <p className="text-xs text-slate-600 pt-2">{siteConfig.shortName} — {siteConfig.description}</p>
      </div>
    </main>
  );
}
