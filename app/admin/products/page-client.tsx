'use client';

import { useState } from 'react';
import { createProduct, updateProduct, deleteProduct, createCategory } from '@/lib/actions/products';
import { Products, Categories } from '@/types/supabase';

interface AdminProductsClientProps {
  products: Products[];
  categories: Categories[];
}

export default function AdminProductsClient({ products, categories }: AdminProductsClientProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState<string | null>(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [seedStatus, setSeedStatus] = useState<string>('');

  async function handleSeed() {
    try {
      const res = await fetch('/api/setup/seed', { method: 'POST' });
      const data = await res.json();
      setSeedStatus(data.message || 'Seed complete');
      window.location.reload();
    } catch {
      setSeedStatus('Seed failed');
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Product Inventory</h1>
            <p className="mt-1 text-sm text-slate-500">Manage products, categories, pricing and stock.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={handleSeed} className="rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-bold text-white shadow hover:bg-amber-600">Seed Sample Inventory</button>
            <button onClick={() => setShowCategoryForm(!showCategoryForm)} className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-bold text-white shadow hover:bg-slate-800">+ Category</button>
            <button onClick={() => setShowAdd(true)} className="rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-bold text-white shadow hover:bg-blue-800">+ Product</button>
          </div>
        </header>
        {seedStatus && <div className="mb-4 rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-green-800">{seedStatus}</div>}

        {showCategoryForm && (
          <form action={async (formData: FormData) => { await createCategory(formData); setShowCategoryForm(false); setTimeout(() => window.location.reload(), 300); }} className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" onSubmit={undefined}>
            <h3 className="mb-4 text-lg font-bold text-slate-900">New Category</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="cat-name" className="block text-xs font-bold text-slate-700">Name</label>
                <input id="cat-name" name="name" required className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
              </div>
              <div>
                <label htmlFor="cat-slug" className="block text-xs font-bold text-slate-700">Slug</label>
                <input id="cat-slug" name="slug" required className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
              </div>
            </div>
            <button type="submit" className="mt-4 rounded-lg bg-blue-700 px-4 py-2 text-sm font-bold text-white hover:bg-blue-800">Save Category</button>
          </form>
        )}

        {showAdd && (
          <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-bold text-slate-900">Add Product</h3>
            <form action={async (formData: FormData) => { await createProduct(formData); setShowAdd(false); setTimeout(() => window.location.reload(), 300); }} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label htmlFor="p-name" className="block text-xs font-bold text-slate-700">Name</label>
                <input id="p-name" name="name" required className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              </div>
              <div>
                <label htmlFor="p-price" className="block text-xs font-bold text-slate-700">Price (cents)</label>
                <input id="p-price" name="price" type="number" required className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              </div>
              <div>
                <label htmlFor="p-sku" className="block text-xs font-bold text-slate-700">SKU</label>
                <input id="p-sku" name="sku" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              </div>
              <div>
                <label htmlFor="p-cat" className="block text-xs font-bold text-slate-700">Category</label>
                <select id="p-cat" name="category_id" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
                  <option value="">None</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="p-img" className="block text-xs font-bold text-slate-700">Image URLs (comma-separated)</label>
                <input id="p-img" name="image_urls" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              </div>
              <div>
                <label htmlFor="p-active" className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <input id="p-active" name="is_active" type="checkbox" defaultChecked className="h-4 w-4 rounded border-slate-300 text-blue-700" /> Active
                </label>
              </div>
              <div className="sm:col-span-2 lg:col-span-3">
                <button type="submit" className="rounded-lg bg-blue-700 px-6 py-2.5 text-sm font-bold text-white shadow hover:bg-blue-800">Save Product</button>
              </div>
            </form>
          </div>
        )}

        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xl">
          <table className="w-full text-sm" aria-label="Products">
            <thead className="bg-slate-900 text-white">
              <tr>
                <th className="px-4 py-3 text-left font-bold">Name</th>
                <th className="px-4 py-3 text-left font-bold">SKU</th>
                <th className="px-4 py-3 text-left font-bold">Category</th>
                <th className="px-4 py-3 text-left font-bold">Price</th>
                <th className="px-4 py-3 text-left font-bold">Active</th>
                <th className="px-4 py-3 text-left font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map(p => (
                <tr key={p.id} className="hover:bg-blue-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{p.name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">{p.sku || '—'}</td>
                  <td className="px-4 py-3 text-slate-600">{categories.find(c => c.id === p.category_id)?.name || '—'}</td>
                  <td className="px-4 py-3 font-bold text-blue-700">${(Number(p.price) / 100).toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-extrabold ${p.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {p.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => setShowEdit(p.id)} className="rounded-md bg-blue-600 px-2.5 py-1 text-xs font-bold text-white hover:bg-blue-700">Edit</button>
                      <form action={async () => { await deleteProduct(p.id); setTimeout(() => window.location.reload(), 300); }}>
                        <button type="submit" className="rounded-md bg-red-600 px-2.5 py-1 text-xs font-bold text-white hover:bg-red-700">Delete</button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-400">No products found.</td></tr>}
            </tbody>
          </table>
        </div>

        {showEdit && (
          <EditProductModal product={products.find(p => p.id === showEdit)!} categories={categories} onClose={() => setShowEdit(null)} />
        )}
      </div>
    </div>
  );
}

function EditProductModal({ product, categories, onClose }: { product: Products; categories: Categories[]; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
        <h3 className="mb-4 text-lg font-bold text-slate-900">Edit Product</h3>
        <form action={(formData: FormData) => { updateProduct(product.id, formData); onClose(); setTimeout(() => window.location.reload(), 300); }} className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="e-name" className="block text-xs font-bold text-slate-700">Name</label>
            <input id="e-name" name="name" defaultValue={product.name} required className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label htmlFor="e-price" className="block text-xs font-bold text-slate-700">Price</label>
            <input id="e-price" name="price" type="number" defaultValue={product.price} required className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label htmlFor="e-sku" className="block text-xs font-bold text-slate-700">SKU</label>
            <input id="e-sku" name="sku" defaultValue={product.sku || ''} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label htmlFor="e-cat" className="block text-xs font-bold text-slate-700">Category</label>
            <select id="e-cat" name="category_id" defaultValue={product.category_id || ''} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
              <option value="">None</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="e-img" className="block text-xs font-bold text-slate-700">Image URLs (comma-separated)</label>
            <input id="e-img" name="image_urls" defaultValue={Array.isArray(product.image_urls) ? product.image_urls.join(', ') : ''} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label htmlFor="e-active" className="flex items-center gap-2 text-xs font-bold text-slate-700"><input id="e-active" name="is_active" type="checkbox" defaultChecked={product.is_active} className="h-4 w-4 rounded border-slate-300 text-blue-700" /> Active</label>
          </div>
          <div className="sm:col-span-2 flex gap-2">
            <button type="submit" className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-bold text-white">Save</button>
            <button type="button" onClick={onClose} className="rounded-lg bg-slate-200 px-4 py-2 text-sm font-bold text-slate-700">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
