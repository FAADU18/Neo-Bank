import { motion } from 'framer-motion';

const variants = {
  primary: 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-[0_0_24px_rgba(0,212,255,0.28)]',
  secondary: 'border border-cyan-400/25 bg-white/5 text-slate-100 hover:bg-white/10',
  ghost: 'text-cyan-100 hover:bg-cyan-400/10',
  danger: 'bg-gradient-to-r from-rose-500 to-red-500 text-white',
};

export default function Button({ className = '', variant = 'primary', children, ...props }) {
  return (
    <motion.button
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
