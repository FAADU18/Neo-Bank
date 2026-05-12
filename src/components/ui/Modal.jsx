import { AnimatePresence, motion } from 'framer-motion';
import Button from './Button';

export default function Modal({ open, onClose, title, children, actionLabel, onAction }) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center px-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ y: 24, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.97 }}
            className="relative z-10 w-full max-w-lg rounded-3xl border border-cyan-400/15 bg-night-850 p-6 shadow-2xl"
          >
            <div className="mb-5 flex items-center justify-between gap-4">
              <h3 className="font-display text-xl font-semibold text-white">{title}</h3>
              <button className="rounded-full border border-white/10 px-3 py-1 text-sm text-slate-300" onClick={onClose}>
                Close
              </button>
            </div>
            <div className="text-sm text-slate-300">{children}</div>
            {actionLabel ? (
              <div className="mt-6 flex justify-end gap-3">
                <Button variant="secondary" onClick={onClose}>
                  Cancel
                </Button>
                <Button onClick={onAction}>{actionLabel}</Button>
              </div>
            ) : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
