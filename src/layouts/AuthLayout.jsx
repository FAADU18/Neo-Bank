import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-night-950 text-slate-100">
      <Navbar compact />
      <div className="mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl gap-8 px-4 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <section className="flex flex-col justify-between rounded-[2rem] border border-cyan-400/10 bg-[linear-gradient(180deg,rgba(8,14,24,0.9),rgba(4,5,10,0.95))] p-8 shadow-2xl">
          <div>
            <span className="neo-chip">NeoBankX Authentication</span>
            <h1 className="mt-6 max-w-xl font-display text-5xl font-bold leading-tight text-white">
              {title}
            </h1>
            <p className="mt-5 max-w-xl text-lg text-slate-300">{subtitle}</p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {['Encrypted access', 'Instant onboarding', 'Smart risk checks'].map((item) => (
              <div key={item} className="rounded-3xl border border-white/8 bg-white/5 p-4 text-sm text-slate-300">
                {item}
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm text-slate-500">
            New here? <Link to="/register" className="text-cyan-200 hover:text-cyan-100">Create an account</Link>
          </p>
        </section>

        <section className="flex items-center justify-center">
          <div className="w-full max-w-xl rounded-[2rem] border border-cyan-400/15 bg-white/5 p-6 shadow-2xl backdrop-blur-2xl">
            {children}
          </div>
        </section>
      </div>
    </div>
  );
}
