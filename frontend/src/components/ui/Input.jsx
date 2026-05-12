export default function Input({ label, error, className = '', hint, ...props }) {
  return (
    <label className="block">
      {label ? <span className="neo-label">{label}</span> : null}
      <input className={`neo-input ${className}`} {...props} />
      {error ? <span className="mt-2 block text-xs text-rose-300">{error}</span> : hint ? <span className="mt-2 block text-xs text-slate-500">{hint}</span> : null}
    </label>
  );
}
