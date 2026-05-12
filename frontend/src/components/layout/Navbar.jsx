import { motion } from 'framer-motion';
import { Link, NavLink } from 'react-router-dom';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';

const navLinkClass = ({ isActive }) =>
  `rounded-full px-4 py-2 text-sm transition ${isActive ? 'bg-cyan-400/15 text-cyan-100 shadow-glow' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`;

export default function Navbar({ onMenuClick, compact = false }) {
  const auth = useAuth();

  return (
    <motion.header
      className="sticky top-0 z-40 border-b border-cyan-400/10 bg-night-950/75 backdrop-blur-xl"
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35 }}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          {onMenuClick ? (
            <button
              onClick={onMenuClick}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/15 bg-white/5 text-cyan-100 lg:hidden"
            >
              ☰
            </button>
          ) : null}
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 to-blue-500 text-slate-950 shadow-glow">
              N
            </div>
            <div>
              <p className="font-display text-lg font-bold tracking-wide text-white">NeoBankX</p>
              <p className="text-[11px] uppercase tracking-[0.35em] text-cyan-200/70">Future finance</p>
            </div>
          </Link>
        </div>

        {!compact ? (
          <nav className="hidden items-center gap-2 lg:flex">
            <NavLink to="/dashboard" className={navLinkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/analytics" className={navLinkClass}>
              Analytics
            </NavLink>
            <NavLink to="/transactions" className={navLinkClass}>
              Transactions
            </NavLink>
            <NavLink to="/fraud-monitor" className={navLinkClass}>
              Security
            </NavLink>
          </nav>
        ) : null}

        <div className="flex items-center gap-3">
          {auth?.isAuthenticated ? <span className="hidden text-sm text-slate-300 sm:inline">Hi, {auth.user?.name}</span> : null}
          {auth?.isAuthenticated ? (
            <Button variant="secondary" onClick={auth.logout}>
              Sign out
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="secondary">Login</Button>
              </Link>
              <Link to="/register" className="hidden sm:block">
                <Button>Get Started</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </motion.header>
  );
}
