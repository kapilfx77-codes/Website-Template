'use client';
export default function ToggleActiveButton({ id, isActive }: { id: string; isActive: boolean }) {
  return (
    <button
      onClick={async () => {
        try {
          const res = await fetch(`/api/admin/categories/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ is_active: !isActive }) });
          if (res.ok) window.location.reload(); else alert('Toggle failed');
        } catch { alert('Error'); }
      }}
      className={`rounded-full px-3 py-1 text-xs font-bold transition ${isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}
    >{isActive ? 'Active' : 'Inactive'}</button>
  );
}
