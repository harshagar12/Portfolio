"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin");
    } catch (err: any) {
      setError("Invalid email or password");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative p-4">
      <div className="w-full max-w-md relative z-10">
        {/* Login Card */}
        <div 
          className="rounded-3xl shadow-2xl backdrop-blur-sm"
          style={{
            background: 'rgb(23, 23, 23)',
            border: '1px solid rgba(71, 85, 105, 0.3)',
            padding: '2.5rem'
          }}
        >
          {/* Title */}
          <h2 className="text-3xl font-bold bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent text-center">
            Welcome Back
          </h2>
          
          {/* Subtitle */}
          <p className="text-slate-400 text-base text-center" style={{ marginTop: '16px', marginBottom: '32px' }}>
            Sign in to manage your portfolio
          </p>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm" style={{ marginBottom: '24px' }}>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin}>
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-base font-medium text-slate-300" style={{ marginBottom: '15px' }}>
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-800/30 border border-slate-600/50 text-slate-100 text-lg rounded-lg py-3 h-12 focus:outline-none focus:ring-2 focus:ring-sky-400/30 focus:border-sky-400/50 transition-all placeholder:text-slate-400"
                style={{ paddingLeft: '8px', paddingRight: '16px' }}
                placeholder="admin@example.com"
                required
              />
            </div>
            
            {/* Password Field */}
            <div style={{ marginTop: '24px' }}>
              <label htmlFor="password" className="block text-base font-medium text-slate-300" style={{ marginBottom: '15px' }}>
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-800/30 border border-slate-600/50 text-slate-100 text-lg rounded-lg py-3 h-12 focus:outline-none focus:ring-2 focus:ring-sky-400/30 focus:border-sky-400/50 transition-all placeholder:text-slate-400"
                style={{ paddingLeft: '8px', paddingRight: '16px' }}
                placeholder="••••••••"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full"
              style={{ marginTop: '32px' }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
