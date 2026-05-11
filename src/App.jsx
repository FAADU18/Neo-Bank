import { AnimatePresence, motion } from 'framer-motion';
import AppRouter from '@/routes/AppRouter';

export default function App() {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="neobankx-app"
        className="min-h-screen bg-night-950 text-slate-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        <AppRouter />
      </motion.div>
    </AnimatePresence>
  );
}
