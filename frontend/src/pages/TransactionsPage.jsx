import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import BalanceCard from '@/components/BalanceCard';
import TransactionCard from '@/components/TransactionCard';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useDashboard } from '@/context/DashboardContext';

const statusOptions = ['All', 'completed', 'pending', 'failed', 'reversed'];
const typeOptions = ['All', 'transfer', 'deposit', 'withdrawal'];
const pageSize = 6;

export default function TransactionsPage() {
  const { transactions, loading } = useDashboard();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');
  const [type, setType] = useState('All');
  const [page, setPage] = useState(1);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const matchesQuery = [
        transaction.description || '',
        transaction.reference_id || '',
        transaction.status || ''
      ].join(' ').toLowerCase().includes(query.toLowerCase());
      
      const matchesStatus = status === 'All' || transaction.status === status;
      const matchesType = type === 'All' || transaction.transaction_type === type;
      
      return matchesQuery && matchesStatus && matchesType;
    });
  }, [transactions, query, status, type]);

  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / pageSize));
  const currentTransactions = filteredTransactions.slice((page - 1) * pageSize, page * pageSize);

  if (loading) {
    return <LoadingSpinner label="Loading transactions..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Records</p>
          <h1 className="mt-2 font-display text-4xl text-white">Transaction History</h1>
        </div>
        <BalanceCard 
          title="Total Transactions" 
          value={transactions.length.toString()} 
          trend="Live data" 
          caption="Synced from backend"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Input 
          label="Search transactions" 
          value={query} 
          onChange={(e) => { 
            setQuery(e.target.value); 
            setPage(1); 
          }} 
          placeholder="Search description or reference ID"
        />
        
        <div className="grid gap-4 grid-cols-2">
          <div>
            <span className="neo-label">Filter status</span>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-lg border border-cyan-400/20 bg-white/5 px-3 py-2 text-sm text-white transition hover:border-cyan-400/40 focus:border-cyan-400/60 focus:outline-none"
            >
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <span className="neo-label">Filter type</span>
            <select
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-lg border border-cyan-400/20 bg-white/5 px-3 py-2 text-sm text-white transition hover:border-cyan-400/40 focus:border-cyan-400/60 focus:outline-none"
            >
              {typeOptions.map((option) => (
                <option key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-3xl p-5">
        {filteredTransactions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-8 text-slate-400"
          >
            <p className="text-lg">No transactions found</p>
            <p className="text-sm mt-2">Try adjusting your filters</p>
          </motion.div>
        ) : (
          <>
            <div className="grid gap-3">
              {currentTransactions.map((transaction, idx) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <TransactionCard transaction={transaction} />
                </motion.div>
              ))}
            </div>
            
            <div className="mt-6 flex items-center justify-between gap-4">
              <p className="text-sm text-slate-400">
                {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''} 
                · Page {page} of {totalPages}
              </p>
              <div className="flex gap-2">
                <Button 
                  variant="secondary" 
                  disabled={page === 1} 
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                >
                  Previous
                </Button>
                <Button 
                  variant="secondary" 
                  disabled={page === totalPages} 
                  onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
