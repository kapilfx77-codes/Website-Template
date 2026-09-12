import Link from 'next/link';
export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <h1 className="text-3xl font-extrabold mb-6">Orders</h1>
      <table className="w-full bg-white rounded-xl shadow text-sm">
        <thead className="bg-slate-100"><tr><th className="p-3 text-left">Order</th><th>Customer</th><th>Status</th><th>Total</th></tr></thead>
        <tbody><tr><td className="p-3">#001</td><td>customer@example.com</td><td><span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-bold">Completed</span></td><td>$49.99</td></tr></tbody>
      </table>
    </div>
  );
}
