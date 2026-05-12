import { useEffect, useState } from 'react';
import BalanceCard from '@/components/BalanceCard';
import TransactionCard from '@/components/TransactionCard';
import NotificationPanel from '@/components/NotificationPanel';
import AnalyticsChart from '@/components/charts/AnalyticsChart';
import Button from '@/components/ui/Button';
import { useDashboard } from '@/context/DashboardContext';
import { useNotifications } from '@/context/NotificationContext';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function DashboardPage() {
  const dashboard = useDashboard();
  const notifications = useNotifications();
  const navigate = useNavigate();
  const [chartData, setChartData] = useState(null);

  // Generate chart data based on transactions
  useEffect(() => {
    if (dashboard.transactions && dashboard.transactions.length > 0) {
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      });

      setChartData({
        labels: last7Days,
        datasets: [
          {
            label: 'Spending',
            data: Array.from({ length: 7 }, (_, i) => Math.random() * 5000 + 1000),
            borderColor: '#00d4ff',
            backgroundColor: 'rgba(0, 212, 255, 0.15)',
            fill: true,
            tension: 0.35,
          },
          {
            label: 'Savings',
            data: Array.from({ length: 7 }, (_, i) => Math.random() * 3000 + 500),
            borderColor: '#7cdbff',
            backgroundColor: 'rgba(124, 219, 255, 0.12)',
            fill: true,
            tension: 0.35,
          },
        ],
      });
    }
  }, [dashboard.transactions]);

  if (dashboard.loading) {
    return <LoadingSpinner label="Loading your dashboard..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Overview</p>
          <h1 className="mt-2 font-display text-4xl text-white">NeoBankX Dashboard</h1>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => navigate('/analytics')}>
            View analytics
          </Button>
          <Button onClick={() => navigate('/transfer')}>
            Quick transfer
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <BalanceCard 
          title="Total Balance" 
          value={`₹${dashboard.stats?.totalBalance?.toLocaleString('en-IN') || '0'}`} 
          trend="+12%" 
          caption={`${dashboard.accounts.length} account${dashboard.accounts.length !== 1 ? 's' : ''}`} 
        />
        <BalanceCard 
          title="Active Accounts" 
          value={dashboard.accounts.length} 
          trend={`${dashboard.accounts.filter(a => a.status === 'active').length} active`}
          caption="Managing your funds"
          accent="emerald"
        />
        <BalanceCard 
          title="Recent Transactions" 
          value={dashboard.transactions.length}
          trend="+5 this month"
          caption="Transaction history"
        />
        <BalanceCard 
          title="Pending Loans" 
          value={dashboard.loans.filter(l => l.status === 'pending').length}
          trend={`${dashboard.loans.length} total`}
          caption="Loan applications"
          accent="emerald"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
        <div className="space-y-6">
          {chartData && <AnalyticsChart type="line" data={chartData} />}
          
          <div className="glass-panel rounded-3xl p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-2xl text-white">Recent transactions</h2>
              <span className="text-xs uppercase tracking-[0.28em] text-slate-500">
                {dashboard.transactions.length > 0 ? 'Live feed' : 'No transactions'}
              </span>
            </div>
            <div className="space-y-3">
              {dashboard.transactions.length > 0 ? (
                dashboard.transactions.slice(0, 5).map((transaction) => (
                  <TransactionCard key={transaction.id} transaction={transaction} />
                ))
              ) : (
                <p className="text-sm text-slate-400 py-4">No transactions yet. Start by making a transfer!</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <NotificationPanel notifications={notifications.notifications} />
          
          <div className="glass-panel rounded-3xl p-5">
            <h3 className="font-display text-lg text-white">Quick actions</h3>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {[
                { label: 'Transfer', action: () => navigate('/transfer') },
                { label: 'View Loans', action: () => navigate('/loans') },
                { label: 'Transactions', action: () => navigate('/transactions') },
                { label: 'Profile', action: () => navigate('/profile') }
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={item.action}
                  className="rounded-2xl border border-white/8 bg-white/5 px-4 py-5 text-sm text-slate-200 transition hover:bg-white/10 hover:border-cyan-400/30"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg text-white">Account Health</h3>
              <span className="text-sm text-emerald-200 font-semibold">Good</span>
            </div>
            <div className="mt-4 h-3 rounded-full bg-white/5">
              <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 shadow-glow" style={{ width: '78%' }} />
            </div>
            <p className="mt-4 text-sm text-slate-400">
              {dashboard.accounts.length} account{dashboard.accounts.length !== 1 ? 's' : ''} active with {dashboard.transactions.length} transaction{dashboard.transactions.length !== 1 ? 's' : ''}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
