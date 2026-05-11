import { motion } from 'framer-motion';

export default function BalanceCard({ title, value, trend, caption, accent = 'cyan' }) {
  return (
    <motion.div whileHover={{ y: -4 }} className="glass-panel glow-border rounded-3xl p-5">
      <p className="text-xs uppercase tracking-[0.28em] text-slate-400">{title}</p>
      <div className="mt-4 flex items-end justify-between gap-4">
        <div>
          <h3 className="font-display text-3xl font-bold text-white">{value}</h3>
          <p className="mt-2 text-sm text-slate-400">{caption}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${accent === 'cyan' ? 'bg-cyan-400/10 text-cyan-100' : 'bg-emerald-400/10 text-emerald-100'}`}>
          {trend}
        </span>
      </div>
    </motion.div>
  );
}
