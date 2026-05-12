export default function LoadingSpinner({ label = 'Loading NeoBankX' }) {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center gap-4 rounded-3xl border border-cyan-400/15 bg-white/5 p-8 text-center">
      <div className="h-14 w-14 animate-spin rounded-full border-4 border-cyan-400/20 border-t-cyan-300" />
      <p className="text-sm text-slate-300">{label}</p>
    </div>
  );
}
