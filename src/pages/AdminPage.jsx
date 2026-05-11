import Button from '@/components/ui/Button';
import BalanceCard from '@/components/BalanceCard';
import { useDashboard } from '@/context/DashboardContext';

export default function AdminPage() {
  const { users, freezeUser, transactions, alerts } = useDashboard();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Operations</p>
        <h1 className="mt-2 font-display text-4xl text-white">Admin Dashboard</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <BalanceCard title="Managed users" value={users.length.toString()} trend="Live" caption="Accounts in scope" />
        <BalanceCard title="Monitored transactions" value={transactions.length.toString()} trend="Continuous" caption="Behavior review active" accent="emerald" />
        <BalanceCard title="Fraud alerts" value={alerts.length.toString()} trend="Priority" caption="Requires review" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
        <div className="glass-panel rounded-3xl p-6 overflow-x-auto scrollbar-thin">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-display text-2xl text-white">User management</h2>
            <Button variant="secondary">Invite admin</Button>
          </div>
          <table className="mt-6 w-full min-w-[720px] border-separate border-spacing-y-3 text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.28em] text-slate-500">
              <tr>
                <th className="pb-2">User</th>
                <th className="pb-2">Role</th>
                <th className="pb-2">Balance</th>
                <th className="pb-2">Status</th>
                <th className="pb-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="rounded-2xl bg-white/5">
                  <td className="rounded-l-2xl px-4 py-4">
                    <div className="font-medium text-white">{user.name}</div>
                    <div className="text-xs text-slate-400">{user.email}</div>
                  </td>
                  <td className="px-4 py-4 text-slate-300">{user.role}</td>
                  <td className="px-4 py-4 text-slate-300">{user.balance}</td>
                  <td className="px-4 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${user.status === 'Frozen' ? 'bg-rose-400/10 text-rose-200' : 'bg-emerald-400/10 text-emerald-200'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="rounded-r-2xl px-4 py-4">
                    <button onClick={() => freezeUser(user.id)} className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-xs text-cyan-100">
                      {user.status === 'Frozen' ? 'Unfreeze' : 'Freeze'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-4">
          <div className="glass-panel rounded-3xl p-6">
            <h2 className="font-display text-2xl text-white">Transaction monitoring</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              {transactions.slice(0, 4).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/5 px-4 py-3">
                  <span>{transaction.name}</span>
                  <span>{transaction.status}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="glass-panel rounded-3xl p-6">
            <h2 className="font-display text-2xl text-white">Fraud alert queue</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              {alerts.map((alert) => (
                <div key={alert.id} className="rounded-2xl border border-rose-400/15 bg-rose-400/10 px-4 py-3">
                  <p className="font-medium text-white">{alert.title}</p>
                  <p className="text-slate-300/80">Risk {alert.risk}%</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
