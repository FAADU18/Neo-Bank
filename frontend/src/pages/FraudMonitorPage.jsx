import { useState } from 'react';
import { motion } from 'framer-motion';
import FraudAlertCard from '@/components/FraudAlertCard';
import BalanceCard from '@/components/BalanceCard';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useDashboard } from '@/context/DashboardContext';
import { useAuth } from '@/context/AuthContext';
import { adminAPI } from '@/services/api';

export default function FraudMonitorPage() {
  const { alerts, loading } = useDashboard();
  const { isAdmin } = useAuth();
  const [reviewing, setReviewing] = useState(false);

  const highRiskAlerts = alerts.filter(a => a.risk_level === 'high' || a.risk_level === 'critical');
  const reviewedAlerts = alerts.filter(a => a.is_reviewed);
  const pendingAlerts = alerts.filter(a => !a.is_reviewed);

  const handleReviewAlert = async (alertId) => {
    setReviewing(true);
    try {
      await adminAPI.reviewFraudAlert(alertId, { action_taken: 'reviewed', status: 'safe' });
      // Alert will be removed from state via parent refresh
    } catch (err) {
      console.error('Failed to review alert:', err);
    } finally {
      setReviewing(false);
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading fraud alerts..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Security center</p>
          <h1 className="mt-2 font-display text-4xl text-white">Fraud Monitoring</h1>
        </div>
        {isAdmin && (
          <Button variant="secondary" onClick={() => window.location.reload()}>
            Refresh alerts
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <BalanceCard 
          title="Total Alerts" 
          value={alerts.length.toString()} 
          trend={highRiskAlerts.length > 0 ? '⚠ High risk' : '✓ Safe'} 
          caption={`${pendingAlerts.length} pending review`}
        />
        <BalanceCard 
          title="Pending Review" 
          value={pendingAlerts.length.toString()} 
          trend={pendingAlerts.length > 0 ? 'Action needed' : 'All reviewed'} 
          caption="Unreviewed alerts"
          accent={pendingAlerts.length > 0 ? 'rose' : 'emerald'}
        />
        <BalanceCard 
          title="Reviewed" 
          value={reviewedAlerts.length.toString()} 
          trend="Completed" 
          caption="Security check passed"
          accent="emerald"
        />
      </div>

      {highRiskAlerts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-rose-400/20 bg-rose-400/10 p-5"
        >
          <h3 className="font-display text-lg text-rose-100 flex items-center gap-2">
            ⚠ High-Risk Activity Detected
          </h3>
          <p className="text-sm text-rose-100/80 mt-2">
            {highRiskAlerts.length} alert{highRiskAlerts.length !== 1 ? 's' : ''} require{highRiskAlerts.length === 1 ? 's' : ''} immediate attention
          </p>
        </motion.div>
      )}

      <div className={`grid gap-4 ${alerts.length > 0 ? 'xl:grid-cols-2' : ''}`}>
        {alerts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="col-span-full rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-8 text-center"
          >
            <p className="text-2xl text-emerald-100">✓ No alerts</p>
            <p className="text-sm text-emerald-100/70 mt-2">Your account is secure and no suspicious activity detected</p>
          </motion.div>
        ) : (
          alerts.map((alert, idx) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <FraudAlertCard 
                alert={alert} 
                onReview={() => handleReviewAlert(alert.id)}
                isLoading={reviewing}
                isAdmin={isAdmin}
              />
            </motion.div>
          ))
        )}
      </div>

      {isAdmin && (
        <div className="glass-panel rounded-3xl p-6">
          <h2 className="font-display text-2xl text-white mb-4">Security Protocol</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { title: 'Force re-authentication', desc: 'Require user to log in again' },
              { title: 'Temporary freeze', desc: 'Block account transfers' },
              { title: 'Enhanced verification', desc: '2FA required for transactions' }
            ].map((item) => (
              <div 
                key={item.title} 
                className="rounded-2xl border border-rose-400/15 bg-rose-400/10 p-4"
              >
                <p className="font-semibold text-rose-100">{item.title}</p>
                <p className="text-sm text-rose-100/70 mt-2">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
