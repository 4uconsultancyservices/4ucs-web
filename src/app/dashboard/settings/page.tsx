'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Shield, Globe, CreditCard, Palette, Save, Upload } from 'lucide-react';

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'integrations', label: 'Integrations', icon: Globe },
  { id: 'billing', label: 'Billing', icon: CreditCard },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar tabs */}
        <div className="lg:col-span-1">
          <div className="dash-card p-2 space-y-0.5">
            {tabs.map((t) => {
              const Icon = t.icon;
              return (
                <button key={t.id} onClick={() => setActiveTab(t.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${activeTab === t.id ? 'bg-blue-500/15 text-white border border-blue-500/20' : 'text-white/50 hover:text-white hover:bg-white/[0.04]'}`}>
                  <Icon className={`w-4 h-4 ${activeTab === t.id ? 'text-blue-400' : ''}`} />
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content panel */}
        <motion.div key={activeTab} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }}
          className="lg:col-span-3 dash-card space-y-6">

          {activeTab === 'profile' && (
            <>
              <div className="font-display font-semibold text-white">Profile Settings</div>
              {/* Avatar */}
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-2xl font-bold text-white">A</div>
                <div>
                  <button className="btn-ghost py-2 px-4 gap-2 text-xs"><Upload className="w-3.5 h-3.5" /> Upload photo</button>
                  <div className="text-xs text-white/30 mt-2">PNG, JPG up to 5MB</div>
                </div>
              </div>
              {/* Fields */}
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { label: 'First Name', value: 'Admin', type: 'text' },
                  { label: 'Last Name', value: 'User', type: 'text' },
                  { label: 'Email', value: 'admin@4ucs.com', type: 'email' },
                  { label: 'Phone', value: '+1 (800) 4UCS-NOW', type: 'tel' },
                  { label: 'Role', value: 'Super Admin', type: 'text' },
                  { label: 'Timezone', value: 'UTC-5 (EST)', type: 'text' },
                ].map(f => (
                  <div key={f.label}>
                    <label className="text-xs text-white/40 uppercase tracking-wider mb-1.5 block">{f.label}</label>
                    <input type={f.type} defaultValue={f.value}
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/25 transition-all" />
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === 'notifications' && (
            <>
              <div className="font-display font-semibold text-white">Notification Preferences</div>
              <div className="space-y-4">
                {[
                  { label: 'New client signup', desc: 'Get notified when a new client signs up', email: true, push: true },
                  { label: 'Ticket opened', desc: 'Alerts for new support tickets', email: true, push: false },
                  { label: 'Invoice paid', desc: 'Payment confirmation notifications', email: true, push: true },
                  { label: 'Security alerts', desc: 'Critical security events', email: true, push: true },
                  { label: 'Weekly digest', desc: 'Summary of weekly metrics and activity', email: true, push: false },
                  { label: 'Deployment updates', desc: 'Status of production deployments', email: false, push: true },
                ].map((n, i) => (
                  <div key={n.label} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <div>
                      <div className="text-sm font-medium text-white">{n.label}</div>
                      <div className="text-xs text-white/40 mt-0.5">{n.desc}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      {(['email', 'push'] as const).map(ch => (
                        <label key={ch} className="flex items-center gap-1.5 cursor-pointer">
                          <span className="text-xs text-white/30 capitalize">{ch}</span>
                          <div className={`relative w-9 h-5 rounded-full transition-colors duration-200 ${n[ch] ? 'bg-blue-500' : 'bg-white/[0.1]'}`}>
                            <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${n[ch] ? 'left-4' : 'left-0.5'}`} />
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === 'security' && (
            <>
              <div className="font-display font-semibold text-white">Security Settings</div>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <div className="font-medium text-white mb-3 text-sm">Change Password</div>
                  {['Current Password', 'New Password', 'Confirm New Password'].map(l => (
                    <div key={l} className="mb-3">
                      <label className="text-xs text-white/40 mb-1.5 block">{l}</label>
                      <input type="password" placeholder="••••••••"
                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500/50 transition-all" />
                    </div>
                  ))}
                  <button className="btn-primary py-2.5 px-5 text-xs">Update Password</button>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                  <div>
                    <div className="font-medium text-white text-sm">Two-Factor Authentication</div>
                    <div className="text-xs text-white/40 mt-0.5">Add an extra layer of security to your account</div>
                  </div>
                  <button className="btn-ghost py-2 px-4 text-xs text-emerald-400 border-emerald-500/25 bg-emerald-500/10">Enabled ✓</button>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <div className="font-medium text-white text-sm mb-3">Active Sessions</div>
                  {[
                    { device: 'MacBook Pro — Chrome', location: 'New York, USA', time: 'Active now' },
                    { device: 'iPhone 15 — Safari', location: 'New York, USA', time: '2h ago' },
                  ].map(s => (
                    <div key={s.device} className="flex items-center justify-between py-2.5 border-b border-white/[0.04] last:border-0">
                      <div>
                        <div className="text-sm text-white/70">{s.device}</div>
                        <div className="text-xs text-white/35">{s.location} · {s.time}</div>
                      </div>
                      <button className="text-xs text-red-400/60 hover:text-red-400">Revoke</button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'appearance' && (
            <>
              <div className="font-display font-semibold text-white">Appearance</div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-white/40 uppercase tracking-wider mb-3 block">Theme</label>
                  <div className="flex gap-3">
                    {['Dark', 'Light', 'System'].map(t => (
                      <button key={t} className={`px-5 py-2.5 rounded-xl text-sm border transition-all ${t === 'Dark' ? 'bg-blue-500/15 text-white border-blue-500/30' : 'text-white/40 border-white/[0.08] hover:border-white/[0.15]'}`}>{t}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-white/40 uppercase tracking-wider mb-3 block">Accent Color</label>
                  <div className="flex gap-3">
                    {['#0066ff','#7c3aed','#22d3ee','#10b981','#f59e0b','#ec4899'].map(c => (
                      <button key={c} className="w-8 h-8 rounded-full ring-2 ring-offset-2 ring-offset-[#030712] ring-transparent hover:ring-white/30 transition-all"
                        style={{ background: c }} />
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <div>
                    <div className="text-sm font-medium text-white">Compact Mode</div>
                    <div className="text-xs text-white/40 mt-0.5">Reduce padding for denser layouts</div>
                  </div>
                  <div className="w-9 h-5 rounded-full bg-white/[0.1] relative cursor-pointer">
                    <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow" />
                  </div>
                </div>
              </div>
            </>
          )}

          {(activeTab === 'integrations' || activeTab === 'billing') && (
            <div className="py-12 text-center text-white/30">
              <Globe className="w-10 h-10 mx-auto mb-3 opacity-20" />
              <div className="text-sm">{activeTab === 'integrations' ? 'Integration settings coming soon.' : 'Billing settings managed via Stripe Portal.'}</div>
              <button className="btn-ghost py-2 px-5 text-xs mt-4">Open in Portal</button>
            </div>
          )}

          {/* Save button */}
          {['profile', 'notifications', 'appearance'].includes(activeTab) && (
            <div className="flex justify-end pt-4 border-t border-white/[0.06]">
              <button onClick={handleSave} className={`btn-primary py-2.5 px-6 gap-2 text-sm transition-all ${saved ? 'bg-emerald-500' : ''}`}>
                <Save className="w-4 h-4" />
                {saved ? 'Saved!' : 'Save Changes'}
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
