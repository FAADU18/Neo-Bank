import { motion } from 'framer-motion';
import AppRouter from '@/routes/AppRouter';

export default function App() {
  return (
    <motion.div className="min-h-screen bg-night-950 text-slate-100" initial={false} animate={{ opacity: 1 }}>
      <AppRouter />
    </motion.div>
  );
}
