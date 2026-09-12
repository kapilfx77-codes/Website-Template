'use client';
import React from 'react';
export default function DeleteCategoryButton({ categoryId, onDeleted }: { categoryId: string; onDeleted?: () => void }) {
  return (
    <button
      onClick={async () => {
        if (!confirm('Delete this category? Products will be set to uncategorized.')) return;
        try {
          const res = await fetch(`/api/admin/categories/${categoryId}/delete`, { method: 'POST' });
          if (res.ok) { if (onDeleted) onDeleted(); else window.location.reload(); }
          else alert('Failed to delete');
        } catch { alert('Error'); }
      }}
      className="rounded-md bg-red-50 px-3 py-1 text-xs font-bold text-red-600 hover:bg-red-100"
    >Delete</button>
  );
}
