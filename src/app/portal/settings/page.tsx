'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Shield, Users, Save, Upload, Plus, Trash2 } from 'lucide-react';

const tabs = [
  { id: 'profile', label: 'Company Profile', icon: User },
  { id: 'team', label: 'Team Members', icon: Users },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
];

const teamMembers = [
  { name: 'Alice Ford', email: 'alice@acmecorp.com', role: 'Admin', avatar: 'AF', status: 'active' },
  { name: 'Bob Chen', email: 'bob@acmecorp.com', role: 'Member', avatar: 'BC', status: 'active' },
  { name: 'Carol Smith', email: 'carol@acmecorp.com', role: 'Viewer', avatar: 'CS', status: 'active' },
  { name: 'Dan Park', email: 'dan@acmecorp.com', role: 'Member', avatar: 'DP', status: 'pending' },
];

export default function PortalSettingsPage() {
  const [tab, setTab] = useState('profile');
  const [saved, setSaved] = useState(false);

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Tab nav */}
        <div className="dash-card p-2 space-y-0.5 h-fit">
          {tabs.map(t => {
            const Icon = t.icon;
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${tab === t.id ? 'bg-blue-500/15 text-white border border-blue-500/20' : 'text-white/50 hover:text-white hover:bg-white/[0.04]'}`}>
                <Icon className={`w-4 h-4 ${tab === t.id ? 'text-blue-400' : ''}`} />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <motion.div key={tab} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.22 }}
          className="lg:col-span-3 dash-card space-y-5">

          {tab === 'profile' && (
            <>
              <div className="font-display font-semibold text-white">Company Profile</div>
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-2xl font-bold text-white">A</div>
                <button className="btn-ghost py-2 px-4 gap-2 text-xs"><Upload className="w-3.5 h-3.5" />Upload Logo</button>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { label: 'Company Name', value: 'Acme Corp' },
                  { label: 'Industry', value: 'Technology' },
                  { label: 'Website', value: 'https://acmecorp.com' },
                  { label: 'Primary Contact', value: 'Alice Ford' },
                  { label: 'Contact Email', value: 'alice@acmecorp.com' },
                  { label: 'Phone', value: '+1 (555) 000-0001' },
                ].map(f => (
                  <div key={f.label}>
                    <label className="text-xs text-white/40 uppercase tracking-wider mb-1.5 block">{f.label}</label>
                    <input defaultValue={f.value} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500/50 transition-all" />
                  </div>
                ))}
              </div>
            </>
          )}

          {tab === 'team' && (
            <>
              <div className="flex items-center justify-between">
                <div className="font-display font-semibold text-white">Team Members</div>
                <button className="btn-primary py-2 px-4 gap-2 text-xs"><Plus className="w-3.5 h-3.5" />Invite Member</button>
              </div>
              <div className="space-y-2">
                {teamMembers.map((m, i) => (
                  <motion.div key={m.email} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500/60 to-violet-600/60 flex items-center justify-center text-xs font-bold text-white">{m.avatar}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white">{m.name}</div>
                      <div className="text-xs text-white/40">{m.email}</div>
                    </div>
                    <select defaultValue={m.role} className="bg-white/[0.04] border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-xs text-white/70 outline-none cursor-pointer">
                      {['Admin','Member','Viewer'].map(r => <option key={r} className="bg-[#060d1f]">{r}</option>)}
                    </select>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${m.status === 'active' ? 'bg-emerald-500/12 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/12 text-amber-400 border border-amber-500/20'}`}>{m.status}</span>
                    <button className="text-white/20 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </motion.div>
                ))}
              </div>
            </>
          )}

          {tab === 'notifications' && (
            <>
              <div className="font-display font-semibold text-white">Notification Preferences</div>
              <div className="space-y-3">
                {[
                  { label: 'Project updates', desc: 'Progress changes and milestone completions' },
                  { label: 'Ticket responses', desc: 'When your support tickets get a reply' },
                  { label: 'Invoice reminders', desc: 'Payment due reminders and confirmations' },
                  { label: 'Document shared', desc: 'When new documents are added for you' },
                  { label: 'Monthly reports', desc: 'Monthly usage and performance digest' },
                ].map(n => (
                  <div key={n.label} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <div>
                      <div className="text-sm font-medium text-white">{n.label}</div>
                      <div className="text-xs text-white/40 mt-0.5">{n.desc}</div>
                    </div>
                    <div className="w-9 h-5 rounded-full bg-blue-500 relative cursor-pointer">
                      <div className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-white shadow" />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {tab === 'security' && (
            <>
              <div className="font-display font-semibold text-white">Security</div>
              <div className="space-y-3">
                {[
                  { title: 'Two-Factor Authentication', desc: 'Require 2FA for all team members', enabled: true },
                  { title: 'SSO Integration', desc: 'Sign in with Okta, Auth0, or SAML', enabled: false },
                  { title: 'IP Allowlisting', desc: 'Restrict access to specific IP ranges', enabled: false },
                  { title: 'Audit Log Access', desc: 'Export detailed activity audit logs', enabled: true },
                ].map(s => (
                  <div key={s.title} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <div>
                      <div className="text-sm font-medium text-white">{s.title}</div>
                      <div className="text-xs text-white/40 mt-0.5">{s.desc}</div>
                    </div>
                    <div className={`w-9 h-5 rounded-full relative cursor-pointer transition-colors ${s.enabled ? 'bg-blue-500' : 'bg-white/[0.1]'}`}>
                      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${s.enabled ? 'right-0.5' : 'left-0.5'}`} />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {tab !== 'team' && (
            <div className="flex justify-end pt-4 border-t border-white/[0.06]">
              <button onClick={handleSave} className="btn-primary py-2.5 px-6 gap-2 text-sm">
                <Save className="w-4 h-4" />{saved ? 'Saved!' : 'Save Changes'}
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
