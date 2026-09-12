import { createClient } from '@/lib/supabase/server';
import { formatCurrency } from '@/lib/store/useCart';
import ToggleActiveButton from '@/components/admin/ToggleActiveButton';
import Link from 'next/link';

export default async function AdminCategoriesPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase.from('categories').select('id, name, slug, is_active, sort_order').order('sort_order');
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <header className="mb-8 flex items-end justify-between">
          <h1 className="text-3xl font-extrabold text-slate-900">Categories</h1>
          <Link href="/admin" className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800">Back to Dashboard</Link>
        </header>
        <div className="bg-white rounded-2xl border shadow-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-900 text-white"><tr><th className="px-4 py-3 text-left font-bold">Name</th><th className="px-4 py-3 text-left font-bold">Slug</th><th className="px-4 py-3 text-left font-bold">Active</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {(categories || []).map((c: any) => (
                <tr key={c.id} className="hover:bg-blue-50"><td className="px-4 py-3 font-medium text-slate-900">{c.name}</td><td className="px-4 py-3 font-mono text-xs text-slate-500">{c.slug}</td><td className="px-4 py-3"><ToggleActiveButton id={c.id} isActive={c.is_active} /></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
