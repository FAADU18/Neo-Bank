import { NavLink } from 'react-router-dom';

const items = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/accounts', label: 'Accounts' },
  { to: '/transactions', label: 'Transactions' },
  { to: '/transfer', label: 'Transfer' },
  { to: '/loans', label: 'Loans' },
  { to: '/analytics', label: 'Analytics' },
  { to: '/fraud-monitor', label: 'Fraud Monitor' },
  { to: '/profile', label: 'Profile' },
  { to: '/admin', label: 'Admin' },
];

const linkClass = ({ isActive }) =>
  `flex items-center justify-between rounded-2xl px-4 py-3 text-sm transition ${
    isActive ? 'bg-cyan-400/15 text-cyan-100 shadow-glow' : 'text-slate-300 hover:bg-white/5 hover:text-white'
  }`;

export default function Sidebar({ open, onClose }) {
  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-cyan-400/10 bg-night-950/95 p-5 transition-transform duration-300 lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-6 rounded-3xl border border-cyan-400/10 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/60">Command Center</p>
          <h2 className="mt-2 font-display text-2xl text-white">NeoBankX Core</h2>
          <p className="mt-2 text-sm text-slate-400">Manage wealth, transactions, and risk from one futuristic cockpit.</p>
        </div>

        <nav className="space-y-2">
          {items.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass} onClick={onClose}>
              <span>{item.label}</span>
              <span className="text-xs text-cyan-300/70">↗</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {open ? <button className="fixed inset-0 z-30 bg-slate-950/70 lg:hidden" onClick={onClose} aria-label="Close sidebar" /> : null}
    </>
  );
}
