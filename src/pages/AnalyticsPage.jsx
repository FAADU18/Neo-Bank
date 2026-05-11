import AnalyticsChart from '@/components/charts/AnalyticsChart';
import BalanceCard from '@/components/BalanceCard';
import { useDashboard } from '@/context/DashboardContext';

export default function AnalyticsPage() {
  const { cashflow, categoryData } = useDashboard();

  const lineData = {
    labels: cashflow.labels,
    datasets: [
      {
        label: 'Savings growth',
        data: cashflow.savings,
        borderColor: '#00d4ff',
        backgroundColor: 'rgba(0,212,255,0.16)',
        fill: true,
        tension: 0.35,
      },
    ],
  };

  const barData = {
    labels: cashflow.labels,
    datasets: [
      {
        label: 'Income',
        data: cashflow.income,
        backgroundColor: 'rgba(0,212,255,0.7)',
      },
      {
        label: 'Expenses',
        data: cashflow.expenses,
        backgroundColor: 'rgba(124,219,255,0.45)',
      },
    ],
  };

  const doughnutData = {
    labels: categoryData.labels,
    datasets: [
      {
        data: categoryData.values,
        backgroundColor: ['#00d4ff', '#0094ff', '#60a5fa', '#22c55e', '#fbbf24', '#fb7185'],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Insights</p>
        <h1 className="mt-2 font-display text-4xl text-white">Analytics Dashboard</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <BalanceCard title="Monthly spending" value="$3,120" trend="-2.1%" caption="Compared to last month" />
        <BalanceCard title="Income vs expenses" value="$7,850 / $3,120" trend="Healthy" caption="Current cashflow balance" accent="emerald" />
        <BalanceCard title="Savings growth" value="$2,410" trend="+18.9%" caption="Month-to-date savings" />
        <BalanceCard title="Transaction categories" value="6" trend="Tracked" caption="Spending buckets monitored" accent="emerald" />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <AnalyticsChart type="bar" data={barData} />
        <AnalyticsChart type="line" data={lineData} />
        <AnalyticsChart type="doughnut" data={doughnutData} className="xl:col-span-2" />
      </div>
    </div>
  );
}
