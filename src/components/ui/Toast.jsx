import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Toast({ title, message, type = 'info', duration = 4000, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = {
    success: 'bg-emerald-500/20 border-emerald-500/30',
    error: 'bg-red-500/20 border-red-500/30',
    warning: 'bg-yellow-500/20 border-yellow-500/30',
    info: 'bg-blue-500/20 border-blue-500/30',
  }[type];

  const textColor = {
    success: 'text-emerald-200',
    error: 'text-red-200',
    warning: 'text-yellow-200',
    info: 'text-blue-200',
  }[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={`rounded-lg border p-4 ${bgColor} ${textColor}`}
    >
      <h4 className="font-semibold">{title}</h4>
      <p className="text-sm mt-1 opacity-90">{message}</p>
    </motion.div>
  );
}
