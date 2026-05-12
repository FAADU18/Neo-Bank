import Navbar from '@/components/layout/Navbar';

export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(0,148,255,0.14),transparent_25%),linear-gradient(180deg,#060912_0%,#04050a_100%)] text-slate-100">
      <Navbar compact />
      <main>{children}</main>
      <footer className="border-t border-cyan-400/10 bg-night-950/60 px-4 py-8 text-center text-sm text-slate-500">
        NeoBankX is a frontend showcase built for futuristic banking experiences.
      </footer>
    </div>
  );
}
