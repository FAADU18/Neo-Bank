import BalanceCard from '@/components/BalanceCard';
import TransactionCard from '@/components/TransactionCard';
import NotificationPanel from '@/components/NotificationPanel';
import AnalyticsChart from '@/components/charts/AnalyticsChart';
import Button from '@/components/ui/Button';
import { useDashboard } from '@/context/DashboardContext';
import { useNotifications } from '@/context/NotificationContext';

export default function DashboardPage() {
  const dashboard = useDashboard();
  const notifications = useNotifications();

  const chartData = {
    labels: dashboard.cashflow.labels,
    datasets: [
      {
        label: 'Income',
        data: dashboard.cashflow.income,
        borderColor: '#00d4ff',
        backgroundColor: 'rgba(0, 212, 255, 0.15)',
        fill: true,
        tension: 0.35,
      },
      {
        label: 'Expenses',
        data: dashboard.cashflow.expenses,
        borderColor: '#7cdbff',
        backgroundColor: 'rgba(124, 219, 255, 0.12)',
        fill: true,
        tension: 0.35,
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Overview</p>
          <h1 className="mt-2 font-display text-4xl text-white">NeoBankX Dashboard</h1>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary">Export report</Button>
          <Button>Quick transfer</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <BalanceCard title="Total Balance" value={`$${dashboard.stats.totalBalance.toLocaleString()}`} trend="+18.2%" caption="Across all connected accounts" />
        <BalanceCard title="Monthly Income" value={`$${dashboard.stats.monthlyIncome.toLocaleString()}`} trend="+7.3%" caption="Incoming cash flow" accent="emerald" />
        <BalanceCard title="Monthly Expenses" value={`$${dashboard.stats.monthlyExpenses.toLocaleString()}`} trend="-2.1%" caption="Spending this month" />
        <BalanceCard title="Savings Score" value={`${dashboard.stats.savingsProgress}%`} trend="Healthy" caption="Goal completion rate" accent="emerald" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
        <div className="space-y-6">
          <AnalyticsChart type="line" data={chartData} />
          <div className="glass-panel rounded-3xl p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-2xl text-white">Recent transactions</h2>
              <span className="text-xs uppercase tracking-[0.28em] text-slate-500">Live feed</span>
            </div>
            <div className="space-y-3">
              {dashboard.transactions.slice(0, 4).map((transaction) => (
                <TransactionCard key={transaction.id} transaction={transaction} />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <NotificationPanel notifications={notifications.notifications} />
          <div className="glass-panel rounded-3xl p-5">
            <h3 className="font-display text-lg text-white">Quick actions</h3>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {['Transfer', 'Pay bills', 'Freeze card', 'Apply loan'].map((action) => (
                <button key={action} className="rounded-2xl border border-white/8 bg-white/5 px-4 py-5 text-sm text-slate-200 transition hover:bg-white/10">
                  {action}
                </button>
              ))}
            </div>
          </div>
          <div className="glass-panel rounded-3xl p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg text-white">Savings progress</h3>
              <span className="text-sm text-cyan-200">{dashboard.stats.savingsProgress}%</span>
            </div>
            <div className="mt-4 h-3 rounded-full bg-white/5">
              <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 shadow-glow" style={{ width: `${dashboard.stats.savingsProgress}%` }} />
            </div>
            <p className="mt-4 text-sm text-slate-400">Your financial momentum is ahead of target by 12 days.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
