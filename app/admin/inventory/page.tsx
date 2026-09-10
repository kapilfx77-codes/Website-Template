import { siteConfig } from '@/config/site';
import { StockAdjuster } from '@/components/admin/StockAdjuster';
import { createClient } from '@/lib/supabase/client';
import { ProductVariants } from '@/types/supabase';

export default async function AdminInventoryPage() {
  const supabase = createClient();
  const { data: variants } = await supabase
    .from('product_variants')
    .select('*, products(name, sku)')
    .limit(50);

  const items = (variants || []) as (ProductVariants & { products?: { name?: string; sku?: string } })[];

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Inventory Overview</h1>
          <p className="mt-1 text-sm text-slate-500">Manage stock levels, view low-stock alerts, and adjust quantities inline.</p>
        </header>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xl">
          <table className="w-full text-sm" aria-label="Inventory table">
            <thead className="bg-slate-900 text-white">
              <tr>
                <th className="px-4 py-3 text-left font-bold">Product</th>
                <th className="px-4 py-3 text-left font-bold">SKU</th>
                <th className="px-4 py-3 text-left font-bold">Variant</th>
                <th className="px-4 py-3 text-left font-bold">Price</th>
                <th className="px-4 py-3 text-left font-bold">Stock</th>
                <th className="px-4 py-3 text-left font-bold">Status</th>
                <th className="px-4 py-3 text-left font-bold">Adjust</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((v) => (
                <tr key={v.id} className={v.stock < 10 ? 'bg-red-50' : 'hover:bg-blue-50'}>
                  <td className="px-4 py-3 font-medium text-slate-900">{v.products?.name || v.title}</td>
                  <td className="px-4 py-3 font-mono text-slate-500">{v.products?.sku || '—'}</td>
                  <td className="px-4 py-3 text-slate-600">{v.title || 'Default'}</td>
                  <td className="px-4 py-3 font-bold text-blue-700">${v.price / 100}</td>
                  <td className="px-4 py-3 font-bold text-slate-900">{v.stock}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-extrabold ${
                      v.stock === 0 ? 'bg-red-100 text-red-700' :
                      v.stock < 10 ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {v.stock === 0 ? 'Out' : v.stock < 10 ? 'Low' : 'OK'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <StockAdjuster productId={v.product_id || ''} variantId={v.id} currentStock={v.stock} />
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-400">No inventory records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
