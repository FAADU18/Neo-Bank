import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import FinancialCityVisualization from '@/components/visuals/FinancialCityVisualization';
import { featureItems, testimonials } from '@/services/mockData';

export default function LandingPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="grid items-center gap-12 py-12 lg:grid-cols-[1.15fr_0.85fr] lg:py-16">
        <div>
          <span className="neo-chip mb-6">NeoBankX / Futuristic Banking Platform</span>
          <motion.h1 className="max-w-3xl font-display text-5xl font-bold leading-tight text-white sm:text-6xl" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            Banking that feels like a command center for the future.
          </motion.h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Manage balances, transfers, loans, fraud alerts, and analytics through a sleek glassmorphism dashboard designed for hackathons, internships, and portfolio showcases.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/dashboard"><Button>Open Dashboard</Button></Link>
            <Link to="/register"><Button variant="secondary">Create Account</Button></Link>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {['Dark futuristic theme', 'Responsive layout', 'Mock backend-ready architecture'].map((item) => (
              <div key={item} className="rounded-3xl border border-white/8 bg-white/5 p-4 text-sm text-slate-300">{item}</div>
            ))}
          </div>
        </div>

        <div className="grid gap-4">
          <div className="glass-panel rounded-[2rem] p-6">
            <p className="text-xs uppercase tracking-[0.32em] text-cyan-200/70">Global liquidity</p>
            <div className="mt-4 flex items-end justify-between gap-3">
              <div>
                <p className="text-sm text-slate-400">Active balance</p>
                <h2 className="font-display text-4xl text-white">$24,890</h2>
              </div>
              <span className="rounded-full bg-emerald-400/10 px-3 py-2 text-sm text-emerald-200">+12.4%</span>
            </div>
            <div className="mt-6 h-3 rounded-full bg-white/5">
              <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 shadow-glow" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {['Secure', 'Fast', 'Insightful', 'Adaptive'].map((item, index) => (
              <div key={item} className={`glass-panel rounded-3xl p-4 text-center ${index % 2 === 0 ? 'animate-float' : ''}`}>
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Feature</p>
                <p className="mt-2 font-display text-xl text-white">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="grid gap-4 md:grid-cols-3">
          {featureItems.map((feature) => (
            <motion.div key={feature.title} whileHover={{ y: -4 }} className="glass-panel glow-border rounded-3xl p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10 text-2xl text-cyan-200">{feature.icon}</div>
              <h3 className="mt-4 font-display text-xl text-white">{feature.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-8">
        <FinancialCityVisualization />
      </section>

      <section className="py-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Testimonials</p>
            <h2 className="mt-2 font-display text-3xl text-white">Built to impress from the first scroll</h2>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {testimonials.map((item) => (
            <div key={item.name} className="glass-panel rounded-3xl p-6">
              <p className="text-sm leading-7 text-slate-300">“{item.quote}”</p>
              <div className="mt-6">
                <p className="font-semibold text-white">{item.name}</p>
                <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/60">{item.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
