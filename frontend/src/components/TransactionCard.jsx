import { motion } from 'framer-motion';

const tone = {
  Completed: 'bg-emerald-400/10 text-emerald-200 border-emerald-400/20',
  Pending: 'bg-amber-400/10 text-amber-200 border-amber-400/20',
  Failed: 'bg-rose-400/10 text-rose-200 border-rose-400/20',
};

export default function TransactionCard({ transaction }) {
  return (
    <motion.div whileHover={{ x: 4 }} className="flex items-center justify-between gap-4 rounded-2xl border border-white/8 bg-white/5 px-4 py-3">
      <div>
        <p className="font-medium text-white">{transaction.name}</p>
        <p className="text-xs text-slate-400">{transaction.date} · {transaction.category}</p>
      </div>
      <div className="text-right">
        <p className={`text-sm font-semibold ${transaction.type === 'credit' ? 'text-emerald-300' : 'text-slate-100'}`}>
          {transaction.type === 'credit' ? '+' : '-'}${transaction.amount.toLocaleString()}
        </p>
        <span className={`mt-1 inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold ${tone[transaction.status] || tone.Completed}`}>
          {transaction.status}
        </span>
      </div>
    </motion.div>
  );
}
