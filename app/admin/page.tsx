import { createClient } from '@/lib/supabase/server';
import { LayoutDashboard, Package, Tag, ShoppingCart, AlertTriangle, Settings, BarChart3, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const [{ data: products }, { data: categories }, { data: orders }] = await Promise.all([
    supabase.from('products').select('id, is_active, stock').eq('is_active', true),
    supabase.from('categories').select('id, is_active'),
    supabase.from('orders').select('id'),
  ]);
  const lowStock = (products || []).filter((p: any) => (p.stock ?? 0) <= 3).length;

  const stats = [
    { label: 'Total Products', value: String(products?.length ?? 0), icon: Package, color: 'bg-blue-600' },
    { label: 'Active Categories', value: String(categories?.length ?? 0), icon: Tag, color: 'bg-emerald-600' },
    { label: 'Orders', value: String(orders?.length ?? 0), icon: ShoppingCart, color: 'bg-violet-600' },
    { label: 'Low Stock Alerts', value: String(lowStock), icon: AlertTriangle, color: 'bg-amber-500' },
  ];

  const links = [
    { href: '/admin/products', label: 'Products', desc: 'Manage inventory & pricing', icon: Package },
    { href: '/admin/categories', label: 'Categories', desc: 'Organize shelves', icon: Tag },
    { href: '/admin/inventory', label: 'Inventory', desc: 'Stock levels & variants', icon: BarChart3 },
    { href: '/admin/orders', label: 'Orders', desc: 'View customer orders', icon: ShoppingCart },
    { href: '/pos', label: 'POS Counter', desc: 'In-store checkout', icon: LayoutDashboard },
    { href: '/admin/settings', label: 'Settings', desc: 'Site config & taxes', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <header className="mb-8 flex items-end justify-between">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Admin Dashboard</h1>
            <p className="mt-2 text-slate-500">Executive hub for Apex Store operations.</p>
          </div>
          <Link href="/" className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800">Back to Storefront</Link>
        </header>

        <nav aria-label="Admin sub-routes" className="mb-10 flex flex-wrap gap-2">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="rounded-lg bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow border border-slate-200 hover:border-blue-300 hover:text-blue-700">{l.label}</Link>
          ))}
        </nav>

        <section aria-label="Metrics" className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <Link key={s.label} href={
              s.label === 'Total Products' ? '/admin/products' :
              s.label === 'Active Categories' ? '/admin/categories' :
              s.label === 'Orders' ? '/admin/orders' :
              s.label === 'Low Stock Alerts' ? '/admin/products?filter=low-stock' : '#'
            } className="rounded-2xl bg-white p-6 shadow-xl border border-slate-200 hover:border-blue-500 hover:shadow-2xl transition block">
              <div className={`mb-4 inline-flex rounded-xl ${s.color} p-3`}><s.icon className="h-6 w-6 text-white" /></div>
              <div className="text-3xl font-extrabold text-slate-900">{s.value}</div>
              <div className="text-sm font-medium text-slate-500">{s.label}</div>
            </Link>
          ))}
        </section>

        <section aria-label="Navigation cards" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="group rounded-2xl bg-white p-6 shadow-lg border border-slate-200 hover:border-blue-300 transition">
              <div className="flex items-start justify-between">
                <div className="rounded-xl bg-blue-50 p-3 text-blue-700"><l.icon className="h-6 w-6" /></div>
                <ArrowRight className="h-5 w-5 text-slate-300 group-hover:text-blue-600 transition" />
              </div>
              <h3 className="mt-4 text-xl font-extrabold text-slate-900">{l.label}</h3>
              <p className="mt-1 text-sm text-slate-500">{l.desc}</p>
            </Link>
          ))}
        </section>
      </div>
    </div>
  );
}
