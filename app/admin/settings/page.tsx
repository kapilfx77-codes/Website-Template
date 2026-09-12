export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <h1 className="text-3xl font-extrabold mb-6">Settings</h1>
      <div className="bg-white rounded-2xl shadow p-6 space-y-4">
        <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Enable payments</label>
        <label className="flex items-center gap-2"><input type="checkbox" /> Notifications</label>
      </div>
    </div>
  );
}
