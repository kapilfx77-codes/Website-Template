'use client';
export default function LoginPage() {
  return <div className="min-h-screen flex items-center justify-center"><form className="max-w-sm w-full space-y-4"><h1>Sign In</h1><input type="email" placeholder="Email" className="w-full p-3 border rounded"/><input type="password" placeholder="Password" className="w-full p-3 border rounded"/><button className="w-full bg-black text-white p-3 rounded">Sign In</button></form></div>;
}
