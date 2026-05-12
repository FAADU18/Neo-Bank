import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useDashboard } from '@/context/DashboardContext';
import { useNotifications } from '@/context/NotificationContext';
import { transactionAPI, accountAPI } from '@/services/api';
import { useFormState } from '@/hooks/useFormState';

export default function TransferPage() {
  const { accounts, addTransaction } = useDashboard();
  const { addNotification } = useNotifications();
  const { values, handleChange, reset } = useFormState({ 
    senderAccountId: '', 
    receiverAccountNumber: '', 
    amount: '', 
    description: '' 
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);

  // Set first account as default
  useEffect(() => {
    if (accounts.length > 0 && !values.senderAccountId) {
      const firstAccount = accounts[0];
      handleChange({ target: { name: 'senderAccountId', value: firstAccount.id.toString() } });
      setSelectedAccount(firstAccount);
    }
  }, [accounts]);

  const handleAccountChange = (e) => {
    const accountId = e.target.value;
    handleChange(e);
    const account = accounts.find(acc => acc.id.toString() === accountId);
    setSelectedAccount(account);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate inputs
      if (!values.senderAccountId || !values.receiverAccountNumber || !values.amount) {
        throw new Error('Please fill in all required fields');
      }

      if (parseFloat(values.amount) <= 0) {
        throw new Error('Amount must be greater than 0');
      }

      // Call transfer API
      const response = await transactionAPI.transfer({
        sender_account_id: parseInt(values.senderAccountId),
        receiver_account_number: values.receiverAccountNumber,
        amount: parseFloat(values.amount),
        description: values.description || 'Transfer'
      });

      const transaction = response.data.data;

      addTransaction({
        id: transaction.id,
        sender_account_id: transaction.sender_account_id,
        receiver_account_id: transaction.receiver_account_id,
        amount: transaction.amount,
        status: transaction.status,
        timestamp: transaction.timestamp,
        type: 'debit',
        description: transaction.description,
        reference_id: transaction.reference_id
      });

      addNotification({
        title: 'Transfer successful',
        message: `₹${transaction.amount.toLocaleString()} sent to ${values.receiverAccountNumber}`,
        level: 'success',
        time: 'Now',
      });

      setSuccess(true);
      reset();
      setSelectedAccount(null);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      setError(message);
      addNotification({
        title: 'Transfer failed',
        message: message,
        level: 'error',
        time: 'Now',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Payments</p>
        <h1 className="mt-2 font-display text-4xl text-white">Money Transfer</h1>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <form onSubmit={handleSubmit} className="glass-panel rounded-3xl p-6 space-y-5">
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg bg-red-500/20 p-3 text-sm text-red-200 border border-red-500/30"
            >
              {error}
            </motion.div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">From Account</label>
            <select
              name="senderAccountId"
              value={values.senderAccountId}
              onChange={handleAccountChange}
              className="w-full rounded-lg border border-cyan-400/20 bg-white/5 px-4 py-2 text-white backdrop-blur-md transition hover:border-cyan-400/40 focus:border-cyan-400/60 focus:outline-none"
            >
              <option value="">Select an account</option>
              {accounts.map(acc => (
                <option key={acc.id} value={acc.id}>
                  {acc.account_number} - ₹{acc.balance.toLocaleString()}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Input 
              label="Receiver Account Number" 
              name="receiverAccountNumber" 
              value={values.receiverAccountNumber} 
              onChange={handleChange} 
              placeholder="123456789012" 
            />
            <Input 
              label="Amount (₹)" 
              name="amount" 
              type="number" 
              step="0.01"
              value={values.amount} 
              onChange={handleChange} 
              placeholder="5000" 
            />
          </div>

          <Input 
            label="Description (Optional)" 
            name="description" 
            value={values.description} 
            onChange={handleChange} 
            placeholder="Rent payment" 
          />

          <Button 
            className="w-full" 
            disabled={loading || !values.senderAccountId || !values.receiverAccountNumber || !values.amount}
          >
            {loading ? 'Processing transfer...' : 'Send money instantly'}
          </Button>
        </form>

        <div className="space-y-4">
          {selectedAccount && (
            <div className="glass-panel rounded-3xl p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Account Details</p>
              <div className="mt-4 space-y-3 text-sm text-slate-300">
                <div className="flex justify-between">
                  <span>Account Number</span>
                  <span className="font-mono">{selectedAccount.account_number}</span>
                </div>
                <div className="flex justify-between">
                  <span>Current Balance</span>
                  <span className="text-cyan-400">₹{selectedAccount.balance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Account Type</span>
                  <span className="capitalize">{selectedAccount.account_type}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status</span>
                  <span className="capitalize text-emerald-400">{selectedAccount.status}</span>
                </div>
              </div>
            </div>
          )}

          <div className="glass-panel rounded-3xl p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Transfer Info</p>
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <div className="flex justify-between"><span>Network</span><span>NeoBankX</span></div>
              <div className="flex justify-between"><span>Transfer Mode</span><span>Instant</span></div>
              <div className="flex justify-between"><span>Fee</span><span>₹0.00</span></div>
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
