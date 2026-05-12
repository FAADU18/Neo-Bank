import { useMemo } from 'react';
import AnalyticsChart from '@/components/charts/AnalyticsChart';
import BalanceCard from '@/components/BalanceCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useDashboard } from '@/context/DashboardContext';

export default function AnalyticsPage() {
  const { transactions, accounts, loading } = useDashboard();

  // Calculate analytics from real transaction data
  const analytics = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return {
        totalSpending: 0,
        totalIncome: 0,
        avgTransaction: 0,
        categoryBreakdown: []
      };
    }

    let totalIncome = 0;
    let totalSpending = 0;
    const categories = {};

    transactions.forEach(t => {
      const amount = parseFloat(t.amount) || 0;
      const type = t.transaction_type;

      if (type === 'deposit') {
        totalIncome += amount;
      } else if (type === 'transfer' || type === 'withdrawal') {
        totalSpending += amount;
      }

      // Group by type for categories
      if (!categories[type]) {
        categories[type] = 0;
      }
      categories[type] += amount;
    });

    return {
      totalSpending,
      totalIncome,
      avgTransaction: transactions.length > 0 ? (totalSpending + totalIncome) / transactions.length : 0,
      categoryBreakdown: Object.entries(categories)
        .map(([type, amount]) => ({
          type: type.charAt(0).toUpperCase() + type.slice(1),
          amount,
          percentage: ((amount / (totalSpending + totalIncome)) * 100).toFixed(1)
        }))
        .sort((a, b) => b.amount - a.amount)
    };
  }, [transactions]);

  // Generate chart data for last 7 days
  const chartData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d;
    });

    const dailyData = last7Days.map(date => {
      const dayStr = date.toISOString().split('T')[0];
      const dayTransactions = transactions.filter(t => 
        t.timestamp?.split('T')[0] === dayStr
      );
      
      let spending = 0;
      let income = 0;
      
      dayTransactions.forEach(t => {
        const amount = parseFloat(t.amount) || 0;
        if (t.transaction_type === 'deposit') {
          income += amount;
        } else {
          spending += amount;
        }
      });

      return { spending, income };
    });

    return {
      labels: last7Days.map(d => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
      datasets: [
        {
          label: 'Spending',
          data: dailyData.map(d => d.spending),
          borderColor: '#00d4ff',
          backgroundColor: 'rgba(0, 212, 255, 0.15)',
          fill: true,
          tension: 0.35,
        },
        {
          label: 'Income',
          data: dailyData.map(d => d.income),
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.15)',
          fill: true,
          tension: 0.35,
        },
      ],
    };
  }, [transactions]);

  const barData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Income',
        data: [2400, 2600, 1900, 2800],
        backgroundColor: 'rgba(16, 185, 129, 0.7)',
      },
      {
        label: 'Expenses',
        data: [800, 900, 1200, 1100],
        backgroundColor: 'rgba(0, 212, 255, 0.7)',
      },
    ],
  };

  const doughnutData = {
    labels: analytics.categoryBreakdown.map(c => c.type),
    datasets: [
      {
        data: analytics.categoryBreakdown.map(c => c.amount),
        backgroundColor: ['#00d4ff', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'],
        borderWidth: 0,
      },
    ],
  };

  if (loading) {
    return <LoadingSpinner label="Loading analytics..." />;
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Insights</p>
        <h1 className="mt-2 font-display text-4xl text-white">Analytics Dashboard</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <BalanceCard 
          title="Total Spending" 
          value={`₹${analytics.totalSpending.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`} 
          trend={transactions.length > 0 ? '+12%' : 'No data'}
          caption={`${transactions.filter(t => t.transaction_type !== 'deposit').length} transactions`} 
        />
        <BalanceCard 
          title="Total Income" 
          value={`₹${analytics.totalIncome.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`} 
          trend={transactions.length > 0 ? '+8%' : 'No data'}
          caption={`${transactions.filter(t => t.transaction_type === 'deposit').length} deposits`}
          accent="emerald"
        />
        <BalanceCard 
          title="Average Transaction" 
          value={`₹${analytics.avgTransaction.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`} 
          trend="Per transaction"
          caption={`${transactions.length} total transactions`}
        />
        <BalanceCard 
          title="Active Accounts" 
          value={accounts.length}
          trend="In use"
          caption={accounts.filter(a => a.status === 'active').length + " active"} 
          accent="emerald"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <AnalyticsChart type="line" data={chartData} />
        <AnalyticsChart type="bar" data={barData} />
      </div>

      {analytics.categoryBreakdown.length > 0 && (
        <div className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
          <AnalyticsChart type="doughnut" data={doughnutData} />
          
          <div className="glass-panel rounded-3xl p-6">
            <h3 className="font-display text-xl text-white mb-4">Spending Breakdown</h3>
            <div className="space-y-3">
              {analytics.categoryBreakdown.map((category, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">{category.type}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-cyan-400 font-semibold">
                      ₹{category.amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </span>
                    <span className="text-xs text-slate-500">{category.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
