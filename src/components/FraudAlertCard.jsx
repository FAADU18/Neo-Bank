import { motion } from 'framer-motion';

export default function FraudAlertCard({ alert }) {
  return (
    <motion.div whileHover={{ y: -3 }} className="glass-panel rounded-3xl p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-slate-400">{alert.status}</p>
          <h3 className="mt-2 font-display text-lg text-white">{alert.title}</h3>
          <p className="mt-2 text-sm text-slate-400">{alert.detail}</p>
        </div>
        <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-center">
          <p className="text-xs text-cyan-200">Risk</p>
          <p className="font-display text-2xl text-white">{alert.risk}%</p>
        </div>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/5">
        <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" style={{ width: `${alert.risk}%` }} />
      </div>
    </motion.div>
  );
}
