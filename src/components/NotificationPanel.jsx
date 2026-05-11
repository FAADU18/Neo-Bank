import { motion } from 'framer-motion';

const palette = {
  success: 'border-emerald-400/20 bg-emerald-400/10 text-emerald-100',
  warning: 'border-amber-400/20 bg-amber-400/10 text-amber-100',
  info: 'border-cyan-400/20 bg-cyan-400/10 text-cyan-100',
};

export default function NotificationPanel({ notifications = [] }) {
  return (
    <div className="glass-panel rounded-3xl p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-lg text-white">Notifications</h3>
        <span className="text-xs uppercase tracking-[0.28em] text-slate-500">Live</span>
      </div>
      <div className="space-y-3">
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl border px-4 py-3 ${palette[notification.level] || palette.info}`}
          >
            <div className="flex items-center justify-between gap-3">
              <h4 className="font-medium text-white">{notification.title}</h4>
              <span className="text-[11px] opacity-70">{notification.time}</span>
            </div>
            <p className="mt-1 text-sm text-slate-200/80">{notification.message}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
