'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { authApi, ApiError } from '@/lib/api-client';

export default function LoginPage() {
  const router = useRouter();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [show,     setShow]     = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  const quickFill = (role: string) => {
    const map: Record<string, { email: string; password: string }> = {
      admin:     { email: 'admin@4ucs.com',      password: 'Admin@4UCS2026!'  },
      sales:     { email: 'sales@4ucs.com',       password: 'Sales@4UCS2026!' },
      marketing: { email: 'marketing@4ucs.com',   password: 'Mktg@4UCS2026!'  },
      client:    { email: 'client@acmecorp.com',  password: 'Client@4UCS2026!'},
    };
    if (map[role]) { setEmail(map[role].email); setPassword(map[role].password); setError(''); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError('Email and password are required'); return; }
    setLoading(true);
    setError('');
    try {
      const result = await authApi.login({ email, password }) as any;
      const role   = result?.data?.user?.role ?? '';
      if (role === 'CLIENT') router.push('/portal');
      else                   router.push('/dashboard');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div style={{ background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(0,102,255,0.12) 0%, transparent 60%)' }} className="absolute inset-0" />
        <div className="absolute inset-0 animated-grid opacity-40" />
      </div>

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        className="relative w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-violet-600 rounded-xl" />
            <div className="absolute inset-0.5 bg-[#030712] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-blue-400" />
            </div>
          </div>
          <div>
            <div className="text-lg font-bold text-white font-display leading-none">4UCS</div>
            <div className="text-[10px] text-white/35 tracking-widest uppercase leading-none mt-0.5">Enterprise Platform</div>
          </div>
        </div>

        {/* Card */}
        <div className="glass-card rounded-2xl p-8 border border-white/[0.1]">
          <div className="mb-8">
            <h1 className="font-display text-2xl font-bold text-white mb-1.5">Welcome back</h1>
            <p className="text-sm text-white/45">Sign in to your account to continue</p>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/25 text-sm text-red-400">
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-white/40 uppercase tracking-wider mb-1.5 block">Email address</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@company.com" autoComplete="email" required
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/25 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/25 transition-all"
              />
            </div>

            <div>
              <label className="text-xs text-white/40 uppercase tracking-wider mb-1.5 block">Password</label>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" autoComplete="current-password" required
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 pr-11 text-sm text-white placeholder:text-white/25 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/25 transition-all"
                />
                <button type="button" onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors p-1">
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full py-3 text-sm justify-center gap-2 disabled:opacity-60">
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</>
                : <>Sign In <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          {/* Quick-fill demo credentials */}
          <div className="mt-6 pt-6 border-t border-white/[0.07]">
            <p className="text-xs text-white/30 uppercase tracking-wider mb-3">Demo credentials</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Admin',     role: 'admin'     },
                { label: 'Sales',     role: 'sales'     },
                { label: 'Marketing', role: 'marketing' },
                { label: 'Client',    role: 'client'    },
              ].map(({ label, role }) => (
                <button key={role} type="button" onClick={() => quickFill(role)}
                  className="text-xs px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.07] text-white/50 hover:text-white/80 hover:border-white/[0.14] transition-all text-left">
                  <span className="font-medium text-white/70">{label}</span>
                  <br />
                  <span className="text-[10px] text-white/30">{role}@4ucs.com</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-white/25 mt-6">
          © {new Date().getFullYear()} 4U Consultancy Services · All rights reserved
        </p>
      </motion.div>
    </div>
  );
}
