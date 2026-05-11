import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useDashboard } from '@/context/DashboardContext';
import { useNotifications } from '@/context/NotificationContext';
import { mockApi } from '@/services/api';
import { useFormState } from '@/hooks/useFormState';

export default function TransferPage() {
  const { addTransaction } = useDashboard();
  const { addNotification } = useNotifications();
  const { values, handleChange, reset } = useFormState({ recipient: '', account: '', amount: '', note: '' });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const response = await mockApi.transfer(values);
    addTransaction({
      id: response.data.transaction.id,
      name: values.recipient,
      amount: Number(values.amount),
      status: response.data.transaction.status,
      date: response.data.transaction.date,
      type: 'debit',
      category: 'Transfer',
    });
    addNotification({
      title: 'Transfer completed',
      message: `${values.amount} sent to ${values.recipient}.`,
      level: 'success',
      time: 'Now',
    });
    setLoading(false);
    setSuccess(true);
    reset();
    setTimeout(() => setSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Payments</p>
        <h1 className="mt-2 font-display text-4xl text-white">Money Transfer</h1>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <form onSubmit={handleSubmit} className="glass-panel rounded-3xl p-6 space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <Input label="Recipient name" name="recipient" value={values.recipient} onChange={handleChange} placeholder="Ariana Ray" />
            <Input label="Account / UPI" name="account" value={values.account} onChange={handleChange} placeholder="ariana@bank" />
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <Input label="Amount" name="amount" type="number" value={values.amount} onChange={handleChange} placeholder="5000" />
            <Input label="Note" name="note" value={values.note} onChange={handleChange} placeholder="Rent payment" />
          </div>
          <Button className="w-full" disabled={loading}>{loading ? 'Processing transfer...' : 'Send money instantly'}</Button>
        </form>

        <div className="space-y-4">
          <div className="glass-panel rounded-3xl p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Recipient details</p>
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <div className="flex justify-between"><span>Bank</span><span>NeoBankX Premium</span></div>
              <div className="flex justify-between"><span>Transfer mode</span><span>Instant</span></div>
              <div className="flex justify-between"><span>Fee</span><span>$0.00</span></div>
            </div>
          </div>
          <AnimatePresence>
            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="rounded-[2rem] border border-emerald-400/20 bg-emerald-400/10 p-6 text-center text-emerald-100 shadow-glow"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-400/15 text-3xl">✓</div>
                <h3 className="mt-4 font-display text-2xl text-white">Transfer successful</h3>
                <p className="mt-2 text-sm text-emerald-100/80">The transaction has been recorded in your history.</p>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
