import FraudAlertCard from '@/components/FraudAlertCard';
import BalanceCard from '@/components/BalanceCard';
import Button from '@/components/ui/Button';
import { useDashboard } from '@/context/DashboardContext';

export default function FraudMonitorPage() {
  const { alerts } = useDashboard();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Security center</p>
          <h1 className="mt-2 font-display text-4xl text-white">Fraud Monitoring</h1>
        </div>
        <Button variant="secondary">Run security scan</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <BalanceCard title="Threat score" value="84/100" trend="High risk" caption="System-wide security posture" />
        <BalanceCard title="Suspicious events" value={alerts.length.toString()} trend="Detected" caption="Needs attention" accent="emerald" />
        <BalanceCard title="Protected devices" value="12" trend="Trusted" caption="Known device registry" accent="emerald" />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {alerts.map((alert) => (
          <FraudAlertCard key={alert.id} alert={alert} />
        ))}
      </div>

      <div className="glass-panel rounded-3xl p-6">
        <h2 className="font-display text-2xl text-white">Warning protocol</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {['Force logout all sessions', 'Require re-verification', 'Freeze suspicious transfers'].map((item) => (
            <div key={item} className="rounded-2xl border border-rose-400/15 bg-rose-400/10 p-4 text-sm text-rose-100">
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
