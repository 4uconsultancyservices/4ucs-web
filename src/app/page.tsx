'use client';
import { useState, useEffect, useRef, Suspense } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Play, Star, TrendingUp, Users, Globe, ChevronDown, Menu, X, Sparkles, Command, Zap, Shield, BarChart3, Cloud, CheckCircle, Brain, Workflow, Code2, Building2, Heart, ShoppingBag, GraduationCap, Banknote, Truck, Factory, Wifi, Plus, Minus, HelpCircle, Quote, ChevronLeft, ChevronRight, Calendar, DollarSign, RefreshCw, Rocket, Search, Lightbulb, Twitter, Linkedin, Github, Youtube, ArrowUpRight, Mail, MapPin } from 'lucide-react';
import { motion as m } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar } from 'recharts';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import { cn } from '@/lib/utils';

const HeroScene = dynamic(() => import('@/components/three/HeroScene'), { ssr: false, loading: () => <div className="absolute inset-0 bg-[#030712]" /> });
const Globe3D = dynamic(() => import('@/components/three/Globe'), { ssr: false, loading: () => <div className="w-full h-full flex items-center justify-center"><div className="w-64 h-64 rounded-full border border-blue-500/20 animate-pulse" /></div> });

// ─── DATA ─────────────────────────────────────────────
const companies = ['Microsoft', 'Google', 'Amazon', 'Salesforce', 'Oracle', 'SAP', 'Workday', 'Zendesk', 'HubSpot', 'Stripe', 'Shopify', 'Databricks', 'Snowflake', 'Vercel'];
const services = [
  { id: 'saas', icon: Zap, title: 'SaaS Strategy & Launch', desc: 'End-to-end SaaS product strategy, architecture, and rapid go-to-market execution.', features: ['Product roadmap design', 'Market positioning', 'GTM strategy', 'Growth playbooks'], color: '#0066ff' },
  { id: 'cloud', icon: Cloud, title: 'Cloud Architecture', desc: 'Design scalable, resilient cloud infrastructure that handles enterprise workloads at 99.99% uptime.', features: ['Multi-cloud design', 'Auto-scaling systems', 'Cost optimization', 'DevOps enablement'], color: '#7c3aed' },
  { id: 'security', icon: Shield, title: 'Security & Compliance', desc: 'Comprehensive frameworks, compliance automation, and proactive threat intelligence.', features: ['SOC2 & ISO 27001', 'Zero-trust architecture', 'Penetration testing', 'Compliance audits'], color: '#22d3ee' },
  { id: 'analytics', icon: BarChart3, title: 'Analytics & BI', desc: 'Transform raw data into strategic insights with enterprise BI and predictive analytics.', features: ['Data warehouse design', 'Real-time dashboards', 'Predictive modeling', 'ML integration'], color: '#f59e0b' },
  { id: 'ai', icon: Brain, title: 'AI & Automation', desc: 'Embed intelligent automation and AI capabilities directly into your workflows.', features: ['LLM integration', 'Process automation', 'MLOps pipelines', 'AI product development'], color: '#ec4899' },
  { id: 'integration', icon: Workflow, title: 'Enterprise Integration', desc: 'Seamlessly connect your entire tech stack with robust APIs and data pipelines.', features: ['API design & build', 'Legacy modernization', 'Data pipelines', 'Event-driven arch'], color: '#10b981' },
];
const features = [
  { icon: Rocket, title: 'Rapid Deployment', desc: 'Go from concept to production in days with battle-tested frameworks.', color: '#0066ff' },
  { icon: Globe, title: 'Global Scale', desc: 'Multi-region architecture and 99.99% uptime SLAs, worldwide.', color: '#7c3aed' },
  { icon: Shield, title: 'Enterprise Security', desc: 'SOC2 Type II, ISO 27001, and GDPR compliance built in.', color: '#22d3ee' },
  { icon: Brain, title: 'AI-Powered', desc: 'Cutting-edge AI and ML embedded directly into your workflows.', color: '#f59e0b' },
  { icon: BarChart3, title: 'Real-time Analytics', desc: 'Live dashboards and predictive insights that drive decisions.', color: '#10b981' },
  { icon: RefreshCw, title: 'Continuous Delivery', desc: 'Modern CI/CD with automated testing, zero-downtime deployments.', color: '#ec4899' },
  { icon: Building2, title: 'Admin Control Center', desc: 'Complete visibility and control from one unified dashboard.', color: '#a78bfa' },
  { icon: Sparkles, title: 'White-Glove Support', desc: '24/7 dedicated enterprise support that knows your business.', color: '#60b0ff' },
];
const industries = [
  { icon: Banknote, name: 'Financial Services', count: '120+ clients', color: '#0066ff', desc: 'Core banking, fintech platforms, trading systems, regulatory compliance.' },
  { icon: Heart, name: 'Healthcare', count: '85+ clients', color: '#22d3ee', desc: 'HIPAA-compliant SaaS, EHR integrations, telemedicine, population health.' },
  { icon: ShoppingBag, name: 'Retail & Commerce', count: '95+ clients', color: '#f59e0b', desc: 'Omnichannel platforms, inventory intelligence, demand forecasting.' },
  { icon: GraduationCap, name: 'Education & EdTech', count: '60+ clients', color: '#10b981', desc: 'LMS, adaptive content delivery, institutional analytics.' },
  { icon: Building2, name: 'Real Estate', count: '45+ clients', color: '#7c3aed', desc: 'Property intelligence, CRE data, transaction automation.' },
  { icon: Truck, name: 'Logistics', count: '70+ clients', color: '#ec4899', desc: 'Fleet management, real-time tracking, routing optimization.' },
  { icon: Factory, name: 'Manufacturing', count: '55+ clients', color: '#f97316', desc: 'Smart factory, IoT data, predictive maintenance, quality.' },
  { icon: Wifi, name: 'Telecommunications', count: '40+ clients', color: '#60b0ff', desc: 'BSS/OSS modernization, network analytics, 5G enablement.' },
];
const testimonials = [
  { id: 1, name: 'Sarah Chen', role: 'CTO', company: 'NovaTech Systems', content: '4UCS transformed our infrastructure in 6 weeks. What would have taken a year was done with surgical precision. They saved us $2.1M annually.', rating: 5, metric: '$2.1M saved', avatar: 'SC', color: '#0066ff' },
  { id: 2, name: 'Marcus Rodriguez', role: 'VP Engineering', company: 'Apex Financial', content: "SOC2 Type II certification in record time. Their compliance team's depth of knowledge is unmatched in the industry.", rating: 5, metric: 'SOC2 in 8 weeks', avatar: 'MR', color: '#7c3aed' },
  { id: 3, name: 'Priya Sharma', role: 'CEO', company: 'ScaleForce Inc', content: 'From zero to $10M ARR in 18 months. 4UCS was the strategic partner that made it possible. Their SaaS GTM playbook is world-class.', rating: 5, metric: '$10M ARR in 18mo', avatar: 'PS', color: '#22d3ee' },
  { id: 4, name: 'David Kim', role: 'Head of Data', company: 'Meridian Analytics', content: 'Real-time insights across 40+ data sources. Our decision velocity improved 10x and executive reporting went from days to seconds.', rating: 5, metric: '10x decision speed', avatar: 'DK', color: '#f59e0b' },
  { id: 5, name: 'Elena Vasquez', role: 'COO', company: 'Luminary Health', content: 'Migrating a HIPAA SaaS platform requires extreme care. 4UCS delivered zero-downtime migration with full compliance. Phenomenal.', rating: 5, metric: 'Zero-downtime', avatar: 'EV', color: '#10b981' },
];
const pricingPlans = [
  { id: 'growth', name: 'Growth', monthlyPrice: 2500, annualPrice: 2000, desc: 'For scaling startups and SMBs.', color: '#0066ff', features: ['SaaS strategy consultation', 'Cloud architecture review', '10 hrs/month advisory', 'Quarterly roadmap sessions', 'Playbook library access', 'Email & chat support'], cta: 'Start with Growth' },
  { id: 'enterprise', name: 'Enterprise', monthlyPrice: 8500, annualPrice: 6800, desc: 'Dedicated expertise and execution.', color: '#7c3aed', popular: true, features: ['Everything in Growth', 'Dedicated solution architect', '40 hrs/month advisory', 'Weekly strategy sessions', 'Security & compliance audit', 'Custom integration builds', 'Priority 24/7 support'], cta: 'Start with Enterprise' },
  { id: 'global', name: 'Global', monthlyPrice: 'Custom' as const, annualPrice: 'Custom' as const, desc: 'White-glove Fortune 500 partnership.', color: '#22d3ee', features: ['Everything in Enterprise', 'Embedded team members', 'Unlimited advisory hours', 'Board-level reporting', 'Global expansion strategy', 'Dedicated 24/7 war room', '99.99% SLA guarantee'], cta: 'Contact Sales' },
];
const faqs = [
  { q: 'How quickly can 4UCS deploy our first solution?', a: 'Most projects launch within 2–6 weeks. SaaS strategy engagements begin delivering insights on Day 1. Cloud infrastructure typically goes live within 3–4 weeks.' },
  { q: 'Do you work with startups or only enterprise clients?', a: 'We work with organisations at every stage — from funded startups to Fortune 500 enterprises. Our Growth plan is specifically designed for high-growth startups.' },
  { q: 'What makes 4UCS different from traditional IT consultants?', a: 'We specialize exclusively in modern SaaS and cloud. Our team are practitioners — former CTOs, cloud architects, and product leaders who have built and scaled real products.' },
  { q: 'Can we start with one service and expand?', a: 'Absolutely. Many clients start with a specific need and expand as they see results. Our modular engagement model is designed for this.' },
  { q: 'What compliance standards do you support?', a: 'SOC2 Type I & II, ISO 27001, HIPAA, GDPR, PCI-DSS, FedRAMP, and CCPA. Our compliance-as-code approach embeds controls directly into your SDLC.' },
  { q: 'How do you handle knowledge transfer?', a: 'Every engagement includes documentation, runbooks, and knowledge transfer sessions. Optional ongoing advisory retainers ensure continued access to expertise.' },
];
const revData = [
  { month: 'Jan', v: 420 }, { month: 'Feb', v: 580 }, { month: 'Mar', v: 510 }, { month: 'Apr', v: 780 },
  { month: 'May', v: 690 }, { month: 'Jun', v: 920 }, { month: 'Jul', v: 850 }, { month: 'Aug', v: 1100 },
  { month: 'Sep', v: 980 }, { month: 'Oct', v: 1340 }, { month: 'Nov', v: 1280 }, { month: 'Dec', v: 1580 },
];
const usersData = [
  { q: "Q1'22", u: 120 }, { q: "Q2'22", u: 245 }, { q: "Q3'22", u: 380 }, { q: "Q4'22", u: 520 },
  { q: "Q1'23", u: 710 }, { q: "Q2'23", u: 940 }, { q: "Q3'23", u: 1180 }, { q: "Q4'23", u: 1520 },
];
const cases = [
  { id: 1, client: 'GlobalPay Inc.', industry: 'Fintech', tag: 'Cloud Migration', title: 'Migrated 40M txn/day platform — zero downtime', desc: '4UCS executed a phased strangler-fig migration over 14 weeks, resulting in zero downtime and massive cost savings.', metrics: [{ l: 'Downtime', v: '0s' }, { l: 'Cost reduced', v: '67%' }, { l: 'Throughput', v: '8×' }, { l: 'Duration', v: '14 weeks' }], color: '#0066ff' },
  { id: 2, client: 'HealthFirst', industry: 'Healthcare', tag: 'Compliance', title: 'SOC2 Type II + HIPAA in 8 weeks', desc: '4UCS embedded a dedicated compliance team and implemented compliance-as-code across their entire infrastructure.', metrics: [{ l: 'Time to SOC2', v: '8 weeks' }, { l: 'Pipeline unlocked', v: '$24M' }, { l: 'Controls automated', v: '180+' }, { l: 'Critical findings', v: '0' }], color: '#22d3ee' },
  { id: 3, client: 'RetailFlow', industry: 'E-commerce', tag: 'SaaS Launch', title: '$10M ARR e-commerce platform in 90 days', desc: '4UCS designed the full architecture, built the product, and executed a successful beta launch with 48 customers.', metrics: [{ l: 'Time to market', v: '90 days' }, { l: 'Year 1 ARR', v: '$10M' }, { l: 'Beta customers', v: '48' }, { l: 'Churn', v: '2.1%' }], color: '#f59e0b' },
];
const processSteps = [
  { icon: Search, n: '01', title: 'Discovery & Audit', desc: 'Deep-dive into your tech stack, processes, goals, and constraints to uncover real opportunities.', color: '#0066ff', dur: '1–2 weeks' },
  { icon: Lightbulb, n: '02', title: 'Strategy & Blueprint', desc: 'Precise roadmap with milestones, risk mitigations, and expected outcomes.', color: '#7c3aed', dur: '1 week' },
  { icon: Code2, n: '03', title: 'Rapid Build', desc: 'Embedded experts executing at startup speed with enterprise quality.', color: '#22d3ee', dur: '2–8 weeks' },
  { icon: Rocket, n: '04', title: 'Launch & Scale', desc: 'Controlled deployment with monitoring and a dedicated launch team on standby.', color: '#f59e0b', dur: '1 week' },
  { icon: BarChart3, n: '05', title: 'Measure & Optimize', desc: 'Weekly analytics reviews and proactive optimization cycles.', color: '#10b981', dur: 'Ongoing' },
  { icon: RefreshCw, n: '06', title: 'Evolve & Grow', desc: 'Quarterly technology reviews to keep your platform ahead of the market.', color: '#ec4899', dur: 'Quarterly' },
];

// ─── NAVBAR ──────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);
  const links = [['Services', '#services'], ['Solutions', '#solutions'], ['Industries', '#industries'], ['Pricing', '#pricing'], ['Case Studies', '#case-studies']];
  return (
    <motion.header initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, ease: [.25, .46, .45, .94] }}
      className={cn('fixed top-0 left-0 right-0 z-50 transition-all duration-500', scrolled ? 'bg-[#030712]/90 backdrop-blur-xl border-b border-white/[0.06] py-3' : 'bg-transparent py-5')}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-9 h-9">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-violet-600 rounded-xl" />
            <div className="absolute inset-0.5 bg-[#030712] rounded-[10px] flex items-center justify-center"><Sparkles className="w-4 h-4 text-blue-400" /></div>
          </div>
          <div><div className="text-sm font-bold text-white font-display leading-none">4UCS</div><div className="text-[10px] text-white/40 tracking-widest uppercase leading-none mt-0.5">Enterprise</div></div>
        </Link>
        <nav className="hidden lg:flex items-center gap-1">
          {links.map(([label, href]) => <a key={href} href={href} className="px-3 py-2 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/[0.04] transition-all">{label}</a>)}
        </nav>
        <div className="hidden lg:flex items-center gap-3">
          <Link href="/portal" className="btn-ghost text-sm py-2 px-4">Sign In</Link>
          <a href="#cta" className="btn-primary text-sm py-2 px-5">Get Started <ArrowRight className="w-3.5 h-3.5" /></a>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 text-white/60 hover:text-white rounded-lg hover:bg-white/[0.04] transition-colors">
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-white/[0.06] bg-[#030712]/95 backdrop-blur-xl overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 py-5 space-y-1">
              {links.map(([label, href]) => <a key={href} href={href} onClick={() => setMobileOpen(false)} className="flex items-center justify-between px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/[0.04] transition-colors">{label}<ArrowRight className="w-4 h-4 opacity-40" /></a>)}
              <div className="pt-4 border-t border-white/[0.06] flex flex-col gap-2">
                <Link href="/portal" className="btn-ghost text-center">Sign In</Link>
                <a href="#cta" className="btn-primary justify-center">Get Started <ArrowRight className="w-4 h-4" /></a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

// ─── HERO ─────────────────────────────────────────────
function Hero() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const heroStats = [{ icon: Users, v: '500+', l: 'Enterprise Clients' }, { icon: Globe, v: '40+', l: 'Countries' }, { icon: TrendingUp, v: '$2.4B', l: 'Revenue Generated' }, { icon: Star, v: '98%', l: 'CSAT' }];
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-[#030712]">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% -10%,rgba(0,102,255,.15) 0%,transparent 60%)' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 50% at 80% 80%,rgba(124,58,237,.1) 0%,transparent 50%)' }} />
        <div className="absolute inset-0 animated-grid opacity-60" />
      </div>
      {mounted && <Suspense fallback={null}><HeroScene /></Suspense>}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .2 }} className="inline-flex mb-8">
              <span className="badge-enterprise"><span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />Trusted by Fortune 500</span>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .35, duration: .7 }}
              className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-6">
              <span className="text-white">Launch in</span><br />
              <span className="gradient-text">Days.</span><br />
              <span className="text-white">Scale</span> <span className="gradient-text">Globally.</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .5 }}
              className="text-lg text-white/50 leading-relaxed mb-10 max-w-lg">
              4UCS delivers enterprise-grade SaaS consulting, cloud architecture, and digital transformation — faster, smarter, at scale.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .65 }} className="flex flex-col sm:flex-row gap-4 mb-14">
              <a href="#cta" className="btn-primary group text-base py-3.5 px-7">Start Your Journey <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></a>
              <a href="#analytics" className="btn-ghost text-base py-3.5 px-7 gap-3"><div className="w-8 h-8 rounded-full bg-white/[0.06] border border-white/[0.1] flex items-center justify-center"><Play className="w-3 h-3 text-white fill-current ml-0.5" /></div>Watch Demo</a>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .8 }} className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {heroStats.map(({ icon: Icon, v, l }) => (
                <div key={l} className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-white/30 text-xs mb-1"><Icon className="w-3 h-3" /><span className="uppercase tracking-wider">{l}</span></div>
                  <span className="font-display text-2xl font-bold text-white">{v}</span>
                </div>
              ))}
            </motion.div>
          </div>
          <div className="hidden lg:block relative h-[560px]">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }} className="absolute top-0 right-0 w-80 glass-card rounded-2xl p-4">
              <div className="flex items-center justify-between mb-4">
                <div><div className="text-xs text-white/40 uppercase tracking-wider">Revenue Growth</div><div className="text-2xl font-bold text-white font-display mt-1">$2.4M</div><div className="text-xs text-emerald-400 flex items-center gap-1 mt-1"><TrendingUp className="w-3 h-3" />+34.2% this quarter</div></div>
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center"><TrendingUp className="w-5 h-5 text-blue-400" /></div>
              </div>
              <div className="flex items-end gap-1 h-16">
                {[40, 65, 45, 80, 60, 90, 75, 95].map((h, i) => (
                  <motion.div key={i} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: 1.5 + i * .06, duration: .4 }}
                    className="flex-1 rounded-sm origin-bottom" style={{ height: `${h}%`, background: i === 7 ? 'linear-gradient(to top,#0066ff,#7c3aed)' : 'rgba(255,255,255,0.08)' }} />
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.35 }} className="absolute top-52 left-0 w-64 glass-card rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-xs font-bold">A</div>
                <div><div className="text-sm font-medium text-white">Acme Corp</div><div className="text-xs text-white/40">Enterprise Plan</div></div>
                <div className="ml-auto w-2 h-2 rounded-full bg-emerald-400" />
              </div>
              <div className="text-xs text-white/40 mb-2">Active Projects</div>
              <div className="flex gap-2">{['Cloud', 'CRM', 'Analytics'].map(t => <span key={t} className="text-[10px] px-2 py-1 rounded bg-white/[0.05] border border-white/[0.08] text-white/60">{t}</span>)}</div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5 }} className="absolute bottom-16 right-8 w-72 glass-card rounded-2xl p-4">
              <div className="text-xs text-white/40 uppercase tracking-wider mb-3">Live Activity</div>
              {[{ e: 'Deployment successful', t: '2m ago', c: '#10b981' }, { e: 'New enterprise signup', t: '8m ago', c: '#0066ff' }, { e: 'Security scan passed', t: '15m ago', c: '#22d3ee' }].map((item, i) => (
                <div key={i} className="flex items-center gap-3 py-2 border-b border-white/[0.04] last:border-0">
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: item.c, boxShadow: `0 0 6px ${item.c}` }} />
                  <div className="flex-1 text-xs text-white/70">{item.e}</div>
                  <div className="text-[10px] text-white/30">{item.t}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#030712] to-transparent pointer-events-none" />
    </section>
  );
}

// ─── TRUSTED COMPANIES ────────────────────────────────
function TrustedCompanies() {
  return (
    <section className="py-16 border-y border-white/[0.05] overflow-hidden relative">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 80% at 50% 50%,rgba(0,102,255,.04) 0%,transparent 70%)' }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center text-xs text-white/30 uppercase tracking-widest">
          Trusted by the world's most innovative companies
        </motion.p>
      </div>
      <div className="relative flex overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-r from-[#030712] to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-l from-[#030712] to-transparent pointer-events-none" />
        <motion.div animate={{ x: ['0%', '-50%'] }} transition={{ repeat: Infinity, duration: 30, ease: 'linear' }} className="flex gap-10 items-center flex-shrink-0">
          {[...companies, ...companies].map((c, i) => (
            <div key={i} className="flex-shrink-0 px-6 py-3 rounded-xl glass border border-white/[0.05] hover:border-blue-500/20 transition-all group cursor-default">
              <span className="text-sm font-semibold text-white/30 group-hover:text-white/60 transition-colors whitespace-nowrap">{c}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── SERVICES ─────────────────────────────────────────
function Services() {
  const [activeId, setActiveId] = useState('saas');
  return (
    <section id="services" className="section-padding">
      <div className="container-enterprise">
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="inline-flex mb-6">
            <span className="badge-enterprise"><Code2 className="w-3 h-3" />Core Services</span>
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: .1 }}
            className="font-display text-4xl sm:text-5xl font-bold text-white mb-5">
            Everything you need to <span className="gradient-text">dominate your market</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: .2 }}
            className="text-lg text-white/50 max-w-2xl mx-auto">
            From strategy to execution — every dimension of your digital transformation journey.
          </motion.p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((s, i) => {
            const Icon = s.icon;
            const active = activeId === s.id;
            return (
              <motion.div key={s.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: .1 * i }}
                whileHover={{ y: -4 }} onClick={() => setActiveId(s.id === activeId ? '' : s.id)}
                className={cn('relative cursor-pointer rounded-2xl border transition-all duration-300 overflow-hidden', active ? 'border-white/[0.12] shadow-enterprise' : 'border-white/[0.06] hover:border-white/[0.1]')}
                style={{ background: active ? `linear-gradient(135deg,${s.color}10 0%,rgba(3,7,18,.98) 100%)` : 'rgba(255,255,255,.02)' }}>
                {active && <motion.div layoutId="svc-bar" className="absolute top-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg,transparent,${s.color},transparent)` }} />}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${s.color}15`, border: `1px solid ${s.color}25` }}>
                      <Icon className="w-5 h-5" style={{ color: s.color }} />
                    </div>
                    <ArrowRight className="w-4 h-4 text-white/20 transition-all duration-300" style={active ? { color: s.color, transform: 'rotate(-45deg)' } : {}} />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-white mb-2">{s.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed mb-4">{s.desc}</p>
                  <AnimatePresence>
                    {active && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: .25 }}>
                        <div className="pt-4 border-t border-white/[0.06] space-y-2">
                          {s.features.map(f => <div key={f} className="flex items-center gap-2 text-sm text-white/60"><CheckCircle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: s.color }} />{f}</div>)}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── SOLUTIONS ────────────────────────────────────────
function Solutions() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  return (
    <section id="solutions" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 80% at 80% 50%,rgba(0,102,255,.06) 0%,transparent 60%)' }} />
      <div className="container-enterprise">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="inline-flex mb-6">
              <span className="badge-enterprise"><Globe className="w-3 h-3" />Global Solutions</span>
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: .1 }}
              className="font-display text-4xl sm:text-5xl font-bold text-white mb-5">
              Built for every <span className="gradient-text">scale & stage</span>
            </motion.h2>
            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: .2 }} className="text-white/50 mb-10 leading-relaxed">
              Whether you're a startup hitting product-market fit or an enterprise orchestrating global operations — we have a solution engineered for your exact stage.
            </motion.p>
            <div className="space-y-4">
              {[
                { title: 'Startup Launchpad', desc: 'Zero to MVP in weeks with enterprise-grade architecture from day one.', color: '#0066ff' },
                { title: 'Enterprise Modernization', desc: 'Safely migrate legacy systems without disrupting operations.', color: '#7c3aed' },
                { title: 'Global Expansion', desc: 'Take your platform worldwide with multi-region and localization.', color: '#22d3ee' },
              ].map((s, i) => (
                <motion.div key={s.title} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: .1 * i }}
                  className="group flex gap-5 p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.1] hover:bg-white/[0.04] transition-all cursor-pointer">
                  <div className="w-1 rounded-full flex-shrink-0 self-stretch" style={{ background: `linear-gradient(to bottom,${s.color},transparent)` }} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1.5">
                      <h3 className="font-display font-semibold text-white">{s.title}</h3>
                      <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-white/60 group-hover:translate-x-1 transition-all" />
                    </div>
                    <p className="text-sm text-white/45">{s.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <motion.div initial={{ opacity: 0, scale: .9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: .8 }}
            className="relative h-[500px]">
            {mounted && <Suspense fallback={null}><Globe3D /></Suspense>}
            <div className="absolute top-8 left-4 glass-card rounded-xl p-4">
              <div className="text-xs text-white/40 mb-1">Active Deployments</div>
              <div className="font-display text-2xl font-bold text-white">847</div>
              <div className="text-xs text-emerald-400">↑ 23 new this week</div>
            </div>
            <div className="absolute bottom-8 right-4 glass-card rounded-xl p-4">
              <div className="text-xs text-white/40 mb-1">Countries</div>
              <div className="font-display text-2xl font-bold text-white">40+</div>
              <div className="text-xs text-blue-400">Global coverage</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── FEATURES ─────────────────────────────────────────
function Features() {
  return (
    <section id="features" className="section-padding relative overflow-hidden">
      <div className="container-enterprise">
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="inline-flex mb-6">
            <span className="badge-enterprise"><Sparkles className="w-3 h-3" />Platform Features</span>
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: .1 }}
            className="font-display text-4xl sm:text-5xl font-bold text-white mb-5">
            Built for the <span className="gradient-text">enterprise standard</span>
          </motion.h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div key={f.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * .07 }}
                whileHover={{ y: -6 }}
                className="group p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04] transition-all cursor-default relative overflow-hidden">
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `radial-gradient(circle at 30% 30%,${f.color}08 0%,transparent 60%)` }} />
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: `${f.color}15`, border: `1px solid ${f.color}25` }}>
                  <Icon className="w-5 h-5" style={{ color: f.color }} />
                </div>
                <h3 className="font-display text-base font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-white/45 leading-relaxed">{f.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── INDUSTRIES ───────────────────────────────────────
function Industries() {
  return (
    <section id="industries" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 animated-grid opacity-30" />
      <div className="container-enterprise">
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="inline-flex mb-6">
            <span className="badge-enterprise"><Building2 className="w-3 h-3" />Industries</span>
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: .1 }}
            className="font-display text-4xl sm:text-5xl font-bold text-white mb-5">
            Deep expertise across <span className="gradient-text">every vertical</span>
          </motion.h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {industries.map((ind, i) => {
            const Icon = ind.icon;
            return (
              <motion.div key={ind.name} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * .07 }}
                whileHover={{ y: -6 }}
                className="group p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04] transition-all cursor-default relative overflow-hidden">
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `radial-gradient(circle at 30% 30%,${ind.color}08 0%,transparent 60%)` }} />
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: `${ind.color}15`, border: `1px solid ${ind.color}25` }}>
                  <Icon className="w-5 h-5" style={{ color: ind.color }} />
                </div>
                <h3 className="font-display font-semibold text-white text-sm mb-1">{ind.name}</h3>
                <div className="text-xs font-mono mb-3" style={{ color: ind.color }}>{ind.count}</div>
                <p className="text-xs text-white/40 leading-relaxed">{ind.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── ANALYTICS SHOWCASE ───────────────────────────────
function AnalyticsShowcase() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: .2 });
  const TT = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
    if (!active || !payload?.length) return null;
    return <div className="glass-card rounded-xl px-4 py-3 text-xs border border-white/[0.1]"><div className="text-white/40 mb-1">{label}</div><div className="text-white font-semibold">${payload[0].value}K</div></div>;
  };
  return (
    <section id="analytics" className="section-padding relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0 pointer-events-none">
        <div style={{ background: 'radial-gradient(ellipse 70% 50% at 20% 50%,rgba(0,102,255,.07) 0%,transparent 60%)' }} className="absolute inset-0" />
        <div style={{ background: 'radial-gradient(ellipse 60% 50% at 80% 50%,rgba(124,58,237,.06) 0%,transparent 60%)' }} className="absolute inset-0" />
      </div>
      <div className="container-enterprise">
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="inline-flex mb-6">
            <span className="badge-enterprise"><BarChart3 className="w-3 h-3" />Analytics Platform</span>
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: .1 }}
            className="font-display text-4xl sm:text-5xl font-bold text-white mb-5">
            Data-driven decisions at <span className="gradient-text">enterprise velocity</span>
          </motion.h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {[
            { icon: DollarSign, label: 'ARR', value: 2.4, suffix: 'B', prefix: '$', color: '#0066ff' },
            { icon: Users, label: 'Enterprise Clients', value: 500, suffix: '+', color: '#7c3aed' },
            { icon: TrendingUp, label: 'Avg. Growth Rate', value: 312, suffix: '%', color: '#22d3ee' },
            { icon: BarChart3, label: 'Platform Uptime', value: 99.99, suffix: '%', color: '#10b981' },
          ].map(({ icon: Icon, label, value, suffix, prefix = '', color }, i) => (
            <motion.div key={label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * .1 }}
              className="glass-card rounded-2xl p-5 text-center">
              <div className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <div className="font-display text-2xl font-bold text-white">
                {prefix}{inView && <CountUp end={value} decimals={value % 1 !== 0 ? 2 : 0} duration={2} delay={i * .15} />}{suffix}
              </div>
              <div className="text-xs text-white/40 mt-1">{label}</div>
            </motion.div>
          ))}
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div><div className="text-xs text-white/40 uppercase tracking-wider mb-1">Annual Revenue</div><div className="font-display text-2xl font-bold text-white">$1.58M</div><div className="text-xs text-emerald-400 mt-1 flex items-center gap-1"><TrendingUp className="w-3 h-3" />+34.2% YoY</div></div>
              <div className="text-xs text-white/30">2024</div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={revData}>
                <defs><linearGradient id="rG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#0066ff" stopOpacity={.3} /><stop offset="95%" stopColor="#0066ff" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.04)" />
                <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip content={<TT />} />
                <Area type="monotone" dataKey="v" stroke="#0066ff" strokeWidth={2} fill="url(#rG)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div><div className="text-xs text-white/40 uppercase tracking-wider mb-1">Client Growth</div><div className="font-display text-2xl font-bold text-white">1,520</div><div className="text-xs text-violet-400 mt-1 flex items-center gap-1"><TrendingUp className="w-3 h-3" />+192% since 2022</div></div>
              <div className="text-xs text-white/30">All time</div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={usersData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.04)" />
                <XAxis dataKey="q" tick={{ fill: 'rgba(255,255,255,.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={{ background: '#060d1f', border: '1px solid rgba(255,255,255,.08)', borderRadius: '12px', fontSize: '12px' }} labelStyle={{ color: 'rgba(255,255,255,.5)' }} itemStyle={{ color: '#a78bfa' }} />
                <Bar dataKey="u" fill="url(#bG)" radius={[4, 4, 0, 0]}>
                  <defs><linearGradient id="bG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7c3aed" /><stop offset="100%" stopColor="#4c1d95" /></linearGradient></defs>
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── CASE STUDIES ─────────────────────────────────────
function CaseStudies() {
  const [active, setActive] = useState(0);
  const cur = cases[active];
  return (
    <section id="case-studies" className="section-padding">
      <div className="container-enterprise">
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="inline-flex mb-6">
            <span className="badge-enterprise"><Building2 className="w-3 h-3" />Case Studies</span>
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: .1 }}
            className="font-display text-4xl sm:text-5xl font-bold text-white mb-5">
            Results that speak <span className="gradient-text">for themselves</span>
          </motion.h2>
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="space-y-3">
            {cases.map((c, i) => (
              <button key={c.id} onClick={() => setActive(i)}
                className={cn('w-full text-left p-5 rounded-2xl border transition-all duration-300', i === active ? 'border-white/[0.12] bg-white/[0.05]' : 'border-white/[0.05] bg-white/[0.02] hover:border-white/[0.09]')}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded" style={{ background: `${c.color}15`, color: c.color, border: `1px solid ${c.color}25` }}>{c.industry}</span>
                  <span className="text-[10px] text-white/30">{c.tag}</span>
                </div>
                <div className="text-sm font-medium text-white leading-snug">{c.client}</div>
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={cur.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: .35 }}
              className="lg:col-span-2 rounded-2xl border border-white/[0.08] overflow-hidden p-8"
              style={{ background: `linear-gradient(135deg,${cur.color}10 0%,rgba(3,7,18,.98) 100%)` }}>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full" style={{ background: `${cur.color}15`, color: cur.color, border: `1px solid ${cur.color}25` }}>{cur.industry}</span>
                <span className="text-xs text-white/30">{cur.tag}</span>
              </div>
              <h3 className="font-display text-2xl font-bold text-white mb-4 leading-snug">{cur.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed mb-8">{cur.desc}</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                {cur.metrics.map(m => (
                  <div key={m.l} className="glass-card rounded-xl p-4 text-center">
                    <div className="font-display text-xl font-bold mb-1" style={{ color: cur.color }}>{m.v}</div>
                    <div className="text-[11px] text-white/40 uppercase tracking-wide">{m.l}</div>
                  </div>
                ))}
              </div>
              <button className="flex items-center gap-2 text-sm font-semibold text-white/70 hover:text-white transition-colors group">
                Read Full Case Study <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

// ─── TESTIMONIALS ─────────────────────────────────────
function Testimonials() {
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  useEffect(() => {
    if (!auto) return;
    const t = setInterval(() => setActive(p => (p + 1) % testimonials.length), 5000);
    return () => clearInterval(t);
  }, [auto]);
  const cur = testimonials[active];
  const next = () => { setActive(p => (p + 1) % testimonials.length); setAuto(false); };
  const prev = () => { setActive(p => (p - 1 + testimonials.length) % testimonials.length); setAuto(false); };
  return (
    <section id="testimonials" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%,rgba(124,58,237,.05) 0%,transparent 70%)' }} />
      <div className="container-enterprise">
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="inline-flex mb-6">
            <span className="badge-enterprise"><Star className="w-3 h-3" />Client Stories</span>
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: .1 }}
            className="font-display text-4xl sm:text-5xl font-bold text-white mb-5">
            Trusted by leaders who <span className="gradient-text">demand excellence</span>
          </motion.h2>
        </div>
        <div className="max-w-4xl mx-auto mb-12">
          <AnimatePresence mode="wait">
            <motion.div key={cur.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: .4 }}
              className="glass-card rounded-3xl p-8 sm:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-5 -translate-y-1/2 translate-x-1/2" style={{ background: cur.color, filter: 'blur(60px)' }} />
              <div className="w-12 h-12 rounded-2xl mb-8 flex items-center justify-center" style={{ background: `${cur.color}15`, border: `1px solid ${cur.color}25` }}>
                <Quote className="w-6 h-6" style={{ color: cur.color }} />
              </div>
              <p className="text-xl sm:text-2xl text-white/80 leading-relaxed font-light mb-8">"{cur.content}"</p>
              <div className="flex items-center gap-1 mb-6">{Array.from({ length: cur.rating }).map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}</div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: `linear-gradient(135deg,${cur.color},${cur.color}80)` }}>{cur.avatar}</div>
                  <div><div className="font-semibold text-white">{cur.name}</div><div className="text-sm text-white/50">{cur.role}, {cur.company}</div></div>
                </div>
                <div className="hidden sm:block"><div className="text-xs text-white/30 uppercase tracking-wider mb-1">Key result</div><div className="text-sm font-bold" style={{ color: cur.color }}>{cur.metric}</div></div>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="flex items-center justify-center gap-4 mt-8">
            <button onClick={prev} className="w-10 h-10 rounded-full glass border border-white/[0.08] flex items-center justify-center text-white/50 hover:text-white hover:border-white/20 transition-all"><ChevronLeft className="w-4 h-4" /></button>
            <div className="flex gap-2">{testimonials.map((_, i) => <button key={i} onClick={() => { setActive(i); setAuto(false); }} className="h-1.5 rounded-full transition-all duration-300" style={{ width: i === active ? '24px' : '6px', background: i === active ? '#0066ff' : 'rgba(255,255,255,0.2)' }} />)}</div>
            <button onClick={next} className="w-10 h-10 rounded-full glass border border-white/[0.08] flex items-center justify-center text-white/50 hover:text-white hover:border-white/20 transition-all"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── PRICING ──────────────────────────────────────────
function Pricing() {
  const [annual, setAnnual] = useState(true);
  return (
    <section id="pricing" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%,rgba(0,102,255,.06) 0%,transparent 60%)' }} />
      <div className="container-enterprise">
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="inline-flex mb-6">
            <span className="badge-enterprise"><DollarSign className="w-3 h-3" />Pricing</span>
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: .1 }}
            className="font-display text-4xl sm:text-5xl font-bold text-white mb-5">
            Investment that <span className="gradient-text">pays for itself</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: .2 }} className="text-lg text-white/50 max-w-xl mx-auto mb-8">No hidden fees. No lock-in. Pure value from day one.</motion.p>
          <div className="inline-flex items-center gap-3 glass-card rounded-full px-4 py-2">
            <span className={cn('text-sm transition-colors', !annual ? 'text-white' : 'text-white/40')}>Monthly</span>
            <button onClick={() => setAnnual(!annual)} className="relative w-12 h-6 rounded-full transition-all duration-300" style={{ background: annual ? '#0066ff' : 'rgba(255,255,255,.1)' }}>
              <motion.div animate={{ x: annual ? 24 : 2 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }} className="absolute top-1 w-4 h-4 rounded-full bg-white shadow" />
            </button>
            <span className={cn('text-sm transition-colors', annual ? 'text-white' : 'text-white/40')}>Annual <span className="text-emerald-400 text-xs ml-1">Save 20%</span></span>
          </div>
        </div>
        <div className="grid lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {pricingPlans.map((plan, i) => {
            const price = annual ? plan.annualPrice : plan.monthlyPrice;
            return (
              <motion.div key={plan.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * .1 }}
                className={cn('relative rounded-2xl border overflow-hidden', plan.popular ? 'border-violet-500/30' : 'border-white/[0.07]')}
                style={{ background: plan.popular ? 'linear-gradient(135deg,rgba(124,58,237,.12) 0%,rgba(3,7,18,.98) 100%)' : 'rgba(255,255,255,.02)' }}>
                {plan.popular && <>
                  <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: 'linear-gradient(90deg,transparent,#7c3aed,transparent)' }} />
                  <div className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded bg-violet-500/20 border border-violet-500/30 text-violet-300">Most Popular</div>
                </>}
                <div className="p-7">
                  <div className="font-display text-lg font-bold text-white mb-4">{plan.name}</div>
                  <div className="mb-4">
                    <AnimatePresence mode="wait">
                      <motion.div key={String(annual)} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: .2 }}>
                        {price === 'Custom'
                          ? <span className="font-display text-4xl font-bold text-white">Custom</span>
                          : <div className="flex items-end gap-1"><span className="font-display text-4xl font-bold text-white">${typeof price === 'number' ? price.toLocaleString() : price}</span><span className="text-white/40 text-sm mb-1.5">/mo</span></div>}
                      </motion.div>
                    </AnimatePresence>
                    <p className="text-xs text-white/40 mt-1.5">{plan.desc}</p>
                  </div>
                  <button className={cn('w-full py-3 rounded-xl text-sm font-semibold mb-7 transition-all flex items-center justify-center gap-2', plan.popular ? 'btn-primary' : 'btn-ghost')}>
                    {plan.cta} <ArrowRight className="w-4 h-4" />
                  </button>
                  <div className="space-y-3">
                    {plan.features.map(f => <div key={f} className="flex items-start gap-2.5 text-sm"><CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: plan.color }} /><span className="text-white/60">{f}</span></div>)}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center text-sm text-white/30 mt-10">
          All plans include 30-day satisfaction guarantee · No setup fees · Cancel anytime
        </motion.p>
      </div>
    </section>
  );
}

// ─── PROCESS ──────────────────────────────────────────
function Process() {
  return (
    <section id="process" className="section-padding">
      <div className="container-enterprise">
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="inline-flex mb-6">
            <span className="badge-enterprise"><RefreshCw className="w-3 h-3" />Our Process</span>
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: .1 }}
            className="font-display text-4xl sm:text-5xl font-bold text-white mb-5">
            Designed for <span className="gradient-text">speed & certainty</span>
          </motion.h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {processSteps.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div key={s.n} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * .08 }}
                className="relative group p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04] transition-all duration-300">
                <div className="flex items-center justify-between mb-5">
                  <span className="font-display text-5xl font-bold text-white/[0.05] select-none">{s.n}</span>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${s.color}15`, border: `1px solid ${s.color}25` }}>
                    <Icon className="w-5 h-5" style={{ color: s.color }} />
                  </div>
                </div>
                <h3 className="font-display font-semibold text-white mb-2">{s.title}</h3>
                <p className="text-sm text-white/45 leading-relaxed mb-4">{s.desc}</p>
                <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full" style={{ background: s.color }} /><span className="text-xs text-white/30 font-mono">{s.dur}</span></div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ──────────────────────────────────────────────
function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="faq" className="section-padding">
      <div className="container-enterprise">
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="inline-flex mb-6">
            <span className="badge-enterprise"><HelpCircle className="w-3 h-3" />FAQ</span>
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: .1 }}
            className="font-display text-4xl sm:text-5xl font-bold text-white mb-5">
            Questions we <span className="gradient-text">get asked most</span>
          </motion.h2>
        </div>
        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * .05 }}
              className={cn('border rounded-xl overflow-hidden transition-all duration-300', open === i ? 'border-blue-500/25 bg-blue-500/05' : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.1]')}>
              <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left gap-4">
                <span className="font-medium text-white text-sm sm:text-base">{faq.q}</span>
                <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300', open === i ? 'bg-blue-500/20 text-blue-400' : 'bg-white/[0.05] text-white/40')}>
                  {open === i ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                </div>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: .25 }}>
                    <div className="px-5 pb-5 text-sm text-white/50 leading-relaxed">{faq.a}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA ──────────────────────────────────────────────
function CTA() {
  return (
    <section id="cta" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0">
        <div style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%,rgba(0,102,255,.1) 0%,transparent 60%)' }} className="absolute inset-0" />
        <div className="animated-grid opacity-30 absolute inset-0" />
      </div>
      <div className="container-enterprise relative z-10">
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .7 }}
          className="relative max-w-4xl mx-auto text-center">
          <div className="relative p-12 sm:p-16 rounded-3xl overflow-hidden gradient-border">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-violet-500/5 rounded-3xl" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-blue-500/60 to-transparent" />
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center mx-auto mb-8 shadow-glow-blue">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h2 className="font-display text-4xl sm:text-6xl font-bold text-white mb-6 leading-tight">Ready to launch <span className="gradient-text">in days</span>?</h2>
            <p className="text-lg text-white/50 mb-10 max-w-xl mx-auto">Join 500+ enterprises that trust 4UCS to build, scale, and secure their most critical platforms.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/portal" className="btn-primary text-base py-4 px-8 group">Start Free Consultation <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></Link>
              <button className="btn-ghost text-base py-4 px-8 gap-3"><Calendar className="w-4 h-4" />Schedule a Demo</button>
            </div>
            <div className="flex items-center justify-center gap-8 mt-10 pt-8 border-t border-white/[0.06]">
              {['✓ No credit card required', '✓ 30-day guarantee', '✓ Cancel anytime'].map(t => <span key={t} className="text-xs text-white/35">{t}</span>)}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────
function Footer() {
  const footerLinks = {
    Services: ['SaaS Strategy', 'Cloud Architecture', 'Security & Compliance', 'Analytics & BI', 'AI & Automation'],
    Solutions: ['Startup Launchpad', 'Enterprise Modernization', 'Global Expansion', 'Compliance Automation'],
    Company: ['About Us', 'Case Studies', 'Careers', 'Partners', 'Blog'],
    Resources: ['Documentation', 'Playbook Library', 'Webinars', 'Status Page'],
  };
  return (
    <footer className="border-t border-white/[0.06] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-5 gap-12 mb-16">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-5">
              <div className="relative w-9 h-9"><div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-violet-600 rounded-xl" /><div className="absolute inset-0.5 bg-[#030712] rounded-[10px] flex items-center justify-center"><Sparkles className="w-4 h-4 text-blue-400" /></div></div>
              <div><div className="text-sm font-bold text-white font-display">4UCS</div><div className="text-[10px] text-white/30 tracking-widest uppercase mt-0.5">Enterprise</div></div>
            </Link>
            <p className="text-sm text-white/40 leading-relaxed mb-6">Launch in Days. Scale Globally. The enterprise SaaS partner for ambitious organizations.</p>
            <div className="flex gap-3">
              {[Twitter, Linkedin, Github, Youtube].map((Icon, i) => <Link key={i} href="#" className="w-9 h-9 rounded-lg glass border border-white/[0.06] flex items-center justify-center text-white/40 hover:text-white hover:border-white/[0.15] transition-all"><Icon className="w-4 h-4" /></Link>)}
            </div>
          </div>
          {Object.entries(footerLinks).map(([cat, links]) => (
            <div key={cat}>
              <h4 className="text-xs font-semibold text-white uppercase tracking-widest mb-5">{cat}</h4>
              <ul className="space-y-3">
                {links.map(l => <li key={l}><Link href="#" className="text-sm text-white/40 hover:text-white/80 transition-colors flex items-center gap-1 group">{l}<ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-60 transition-opacity" /></Link></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-6 mb-10 pb-10 border-b border-white/[0.06]">
          {[{ icon: Mail, t: 'hello@4ucs.com' }, { icon: Globe, t: '+1 (800) 4UCS-NOW' }, { icon: MapPin, t: 'New York · London · Singapore' }].map(({ icon: Icon, t }) => (
            <div key={t} className="flex items-center gap-2 text-sm text-white/40"><Icon className="w-4 h-4 text-blue-500/60" />{t}</div>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">© {new Date().getFullYear()} 4U Consultancy Services. All rights reserved.</p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Security'].map(l => <Link key={l} href="#" className="text-xs text-white/30 hover:text-white/60 transition-colors">{l}</Link>)}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────
export default function HomePage() {
  return (
    <main className="relative bg-[#030712] text-white overflow-hidden">
      <Navbar />
      <Hero />
      <TrustedCompanies />
      <Services />
      <Solutions />
      <Features />
      <Industries />
      <AnalyticsShowcase />
      <CaseStudies />
      <Testimonials />
      <Pricing />
      <Process />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}
