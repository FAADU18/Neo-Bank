import { motion } from 'framer-motion';
import { useState } from 'react';

const tone = {
  completed: 'bg-emerald-400/10 text-emerald-200 border-emerald-400/20',
  pending: 'bg-amber-400/10 text-amber-200 border-amber-400/20',
  failed: 'bg-rose-400/10 text-rose-200 border-rose-400/20',
  Completed: 'bg-emerald-400/10 text-emerald-200 border-emerald-400/20',
  Pending: 'bg-amber-400/10 text-amber-200 border-amber-400/20',
  Failed: 'bg-rose-400/10 text-rose-200 border-rose-400/20',
};

const typeColor = {
  credit: 'text-emerald-300',
  debit: 'text-rose-300',
  transfer: 'text-cyan-300',
  sent: 'text-rose-300',
  received: 'text-emerald-300'
};

export default function TransactionCard({ transaction, onCopyId }) {
  const [copied, setCopied] = useState(false);

  const handleCopyId = () => {
    if (transaction.transaction_id) {
      navigator.clipboard.writeText(transaction.transaction_id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      onCopyId?.();
    }
  };

  const displayType = transaction.type || (transaction.is_debit ? 'sent' : 'received');
  const displayAmount = transaction.display_amount ?? transaction.amount;
  const statusKey = transaction.status?.toLowerCase() || 'completed';

  return (
    <motion.div 
      whileHover={{ x: 4 }} 
      className="flex flex-col gap-3 rounded-2xl border border-white/8 bg-white/5 px-4 py-3 hover:bg-white/8 transition-colors"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="font-medium text-white">
              {transaction.name || (transaction.is_debit ? 'Sent to' : 'Received from')} {transaction.counterparty_account || ''}
            </p>
            {transaction.transaction_id && (
              <button
                onClick={handleCopyId}
                className="text-xs px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
                title={transaction.transaction_id}
              >
                {copied ? '✓ Copied' : transaction.transaction_id}
              </button>
            )}
          </div>
          <p className="text-xs text-slate-400">
            {transaction.date || transaction.timestamp} {transaction.category || transaction.transaction_type}
          </p>
        </div>
        <div className="text-right">
          <p className={`text-sm font-semibold ${typeColor[displayType] || 'text-slate-100'}`}>
            {displayType === 'sent' || transaction.is_debit ? '-' : displayType === 'received' || transaction.is_credit ? '+' : ''}{Math.abs(displayAmount).toLocaleString('en-IN', { 
              style: 'currency', 
              currency: 'INR',
              minimumFractionDigits: 0,
              maximumFractionDigits: 2
            })}
          </p>
          <span className={`mt-1 inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold ${tone[statusKey] || tone.Completed}`}>
            {transaction.status || 'Completed'}
          </span>
        </div>
      </div>

      {transaction.description && (
        <p className="text-xs text-slate-400 border-t border-white/5 pt-2">
          {transaction.description}
        </p>
      )}
    </motion.div>
  );
}
