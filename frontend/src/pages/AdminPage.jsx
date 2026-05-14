import { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import BalanceCard from '@/components/BalanceCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useDashboard } from '@/context/DashboardContext';
import { useAuth } from '@/context/AuthContext';
import { adminAPI } from '@/services/api';

export default function AdminPage() {
  const { transactions, alerts, loading } = useDashboard();
  const { isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [freezing, setFreezing] = useState(false);

  // Fetch admin dashboard stats
  const fetchAdminStats = async () => {
    try {
      const response = await adminAPI.getDashboard();
      setStats(response.data.data);
    } catch (err) {
      console.error('Failed to fetch admin stats:', err);
    }
  };

  const handleFreezeAccount = async (userId) => {
    setFreezing(true);
    try {
      await adminAPI.deactivateUser(userId);
      // Refresh the page to see updates
      window.location.reload();
    } catch (err) {
      console.error('Failed to freeze account:', err);
    } finally {
      setFreezing(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="glass-panel rounded-3xl p-8 text-center">
        <p className="text-xl text-rose-100">Access Denied</p>
        <p className="text-sm text-slate-400 mt-2">You do not have permission to access the admin dashboard</p>
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner label="Loading admin dashboard..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Operations</p>
          <h1 className="mt-2 font-display text-4xl text-white">Admin Dashboard</h1>
        </div>
        <Button onClick={fetchAdminStats} variant="secondary">
          Fetch Dashboard Stats
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <BalanceCard 
          title="Total Transactions" 
          value={transactions.length.toString()} 
          trend="Real-time"
          caption="All transfers" 
        />
        <BalanceCard 
          title="Total Alerts" 
          value={alerts.length.toString()} 
          trend="System-wide"
          caption="Fraud monitoring" 
        />
        <BalanceCard 
          title="Pending Loans" 
          value={(stats?.pending_loans || 0).toString()}
          trend="For review"
          caption="Loan applications"
          accent="emerald"
        />
        <BalanceCard 
          title="Total Users" 
          value={(stats?.total_users || 0).toString()} 
          trend="Accounts"
          caption="Registered users"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
        <div className="glass-panel rounded-3xl p-6 overflow-x-auto">
          <div className="flex items-center justify-between gap-4 mb-6">
            <h2 className="font-display text-2xl text-white">Recent Transactions</h2>
            <span className="text-xs uppercase tracking-[0.28em] text-slate-400">
              {transactions.length} total
            </span>
          </div>

          {transactions.length === 0 ? (
            <p className="text-slate-400 text-sm py-4">No transactions recorded yet</p>
          ) : (
            <div className="space-y-2">
              {transactions.slice(0, 8).map((transaction) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/5 px-4 py-3 hover:bg-white/10 transition-colors"
                >
                  <div className="flex-1">
                    <p className="text-sm text-slate-300 font-mono font-semibold">
                      {transaction.transaction_id || transaction.reference_id?.slice(0, 16)}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {transaction.description || 'Transfer'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-cyan-400 font-semibold">
                      ₹{parseFloat(transaction.amount).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </p>
                    <span className={`inline-block text-xs mt-1 px-2 py-1 rounded-full ${
                      transaction.status === 'completed' 
                        ? 'bg-emerald-400/20 text-emerald-300'
                        : transaction.status === 'pending'
                        ? 'bg-yellow-400/20 text-yellow-300'
                        : 'bg-red-400/20 text-red-300'
                    }`}>
                      {transaction.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="glass-panel rounded-3xl p-6">
            <h2 className="font-display text-lg text-white mb-4">Security Status</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">System Health</span>
                <span className="text-sm text-emerald-400 font-semibold">✓ Normal</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">Unreviewed Alerts</span>
                <span className="text-sm text-cyan-400 font-semibold">
                  {alerts.filter(a => !a.is_reviewed).length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">High-Risk Alerts</span>
                <span className="text-sm text-rose-400 font-semibold">
                  {alerts.filter(a => a.risk_level === 'critical' || a.risk_level === 'high').length}
                </span>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-6">
            <h2 className="font-display text-lg text-white mb-4">Pending Review</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/5 px-3 py-2">
                <span className="text-slate-300">Loan Applications</span>
                <span className="text-cyan-400 font-semibold">{stats?.pending_loans || 0}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/5 px-3 py-2">
                <span className="text-slate-300">Fraud Alerts</span>
                <span className="text-rose-400 font-semibold">
                  {alerts.filter(a => !a.is_reviewed).length}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/5 px-3 py-2">
                <span className="text-slate-300">Failed Transfers</span>
                <span className="text-yellow-400 font-semibold">
                  {transactions.filter(t => t.status === 'failed').length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-3xl p-6">
        <h2 className="font-display text-2xl text-white mb-6">High-Risk Alerts</h2>
        {alerts.length === 0 ? (
          <p className="text-slate-400 text-sm">No alerts at this time</p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {alerts.filter(a => a.risk_level === 'high' || a.risk_level === 'critical').map((alert, idx) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="rounded-2xl border border-rose-400/20 bg-rose-400/10 p-4"
              >
                <p className="text-sm font-semibold text-rose-100 mb-1">{alert.reason}</p>
                <p className="text-xs text-rose-100/70 mb-2">{alert.description || 'Suspicious activity detected'}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className={`px-2 py-1 rounded-full ${
                    alert.risk_level === 'critical'
                      ? 'bg-red-400/20 text-red-200'
                      : 'bg-orange-400/20 text-orange-200'
                  }`}>
                    {alert.risk_level?.toUpperCase()} RISK
                  </span>
                  <span className="text-rose-100/60">
                    {alert.is_reviewed ? '✓ Reviewed' : '⚠ Pending'}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <div className="glass-panel rounded-3xl p-6">
        <h2 className="font-display text-2xl text-white mb-4">Admin Actions</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { label: 'System Audit', desc: 'Review all activity logs' },
            { label: 'Force Logout', desc: 'Terminate all sessions' },
            { label: 'Security Update', desc: 'Apply security patches' }
          ].map((action) => (
            <div
              key={action.label}
              className="rounded-2xl border border-cyan-400/15 bg-cyan-400/10 p-4"
            >
              <p className="font-semibold text-cyan-100 text-sm">{action.label}</p>
              <p className="text-xs text-cyan-100/70 mt-2">{action.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
