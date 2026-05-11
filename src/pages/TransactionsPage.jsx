import { useMemo, useState } from 'react';
import BalanceCard from '@/components/BalanceCard';
import TransactionCard from '@/components/TransactionCard';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useDashboard } from '@/context/DashboardContext';

const statusOptions = ['All', 'Completed', 'Pending', 'Failed'];
const pageSize = 4;

export default function TransactionsPage() {
  const { transactions } = useDashboard();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');
  const [page, setPage] = useState(1);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const matchesQuery = [transaction.name, transaction.category, transaction.status].join(' ').toLowerCase().includes(query.toLowerCase());
      const matchesStatus = status === 'All' || transaction.status === status;
      return matchesQuery && matchesStatus;
    });
  }, [transactions, query, status]);

  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / pageSize));
  const currentTransactions = filteredTransactions.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Records</p>
          <h1 className="mt-2 font-display text-4xl text-white">Transaction History</h1>
        </div>
        <BalanceCard title="Tracked entries" value={filteredTransactions.length.toString()} trend="Synced" caption="Searchable and filterable" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Input label="Search transactions" value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="Search name, status, or category" />
        <div>
          <span className="neo-label">Filter status</span>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {statusOptions.map((option) => (
              <button
                key={option}
                onClick={() => {
                  setStatus(option);
                  setPage(1);
                }}
                className={`rounded-2xl border px-4 py-3 text-sm transition ${status === option ? 'border-cyan-400/30 bg-cyan-400/15 text-cyan-100' : 'border-white/8 bg-white/5 text-slate-300 hover:bg-white/10'}`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-3xl p-5">
        <div className="grid gap-3">
          {currentTransactions.map((transaction) => (
            <TransactionCard key={transaction.id} transaction={transaction} />
          ))}
        </div>
        <div className="mt-6 flex items-center justify-between gap-4">
          <p className="text-sm text-slate-400">Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            <Button variant="secondary" disabled={page === 1} onClick={() => setPage((current) => Math.max(1, current - 1))}>
              Previous
            </Button>
            <Button variant="secondary" disabled={page === totalPages} onClick={() => setPage((current) => Math.min(totalPages, current + 1))}>
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
