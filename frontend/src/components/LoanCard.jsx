import { motion } from 'framer-motion';

export default function LoanCard({ loan }) {
  return (
    <motion.div whileHover={{ y: -4 }} className="glass-panel rounded-3xl p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-slate-400">{loan.status}</p>
          <h3 className="mt-2 font-display text-xl text-white">{loan.name}</h3>
          <p className="mt-2 text-sm text-slate-400">Loan amount: ${loan.amount.toLocaleString()}</p>
        </div>
        <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-100">{loan.rate}</span>
      </div>
      <div className="mt-4 flex items-center justify-between text-sm text-slate-300">
        <span>Tenure</span>
        <span>{loan.tenure}</span>
      </div>
    </motion.div>
  );
}
