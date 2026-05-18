import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Toast from '@/components/ui/Toast';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useDashboard } from '@/context/DashboardContext';
import { accountAPI } from '@/services/api';

export default function AccountsPage() {
  const { accounts, loading } = useDashboard();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAccountNumber, setNewAccountNumber] = useState(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [formData, setFormData] = useState({
    account_type: 'savings',
    initial_balance: '0'
  });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    setError('');
    setCreating(true);

    try {
      const response = await accountAPI.createAccount({
        account_type: formData.account_type,
        initial_balance: parseFloat(formData.initial_balance) || 0
      });

      if (response.data.data?.account_number) {
        setNewAccountNumber(response.data.data.account_number);
        setShowSuccessToast(true);
        setFormData({ account_type: 'savings', initial_balance: '0' });
        
        // Refresh accounts list
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      setError(message);
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading accounts..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Banking</p>
          <h1 className="mt-2 font-display text-4xl text-white">My Accounts</h1>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          Create Account
        </Button>
      </div>

      {accounts.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center">
          <p className="text-slate-400 text-lg">No accounts yet. Create your first account to get started!</p>
          <Button onClick={() => setShowCreateModal(true)} className="mt-6">
            Create Your First Account
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {accounts.map((account) => (
            <motion.div
              key={account.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel rounded-3xl p-6"
            >
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Account Number</p>
                  <p className="font-mono text-xl text-white font-bold mt-2">{account.account_number}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  account.status === 'active'
                    ? 'bg-emerald-400/10 text-emerald-100'
                    : account.status === 'frozen'
                    ? 'bg-yellow-400/10 text-yellow-100'
                    : 'bg-red-400/10 text-red-100'
                }`}>
                  {account.status.charAt(0).toUpperCase() + account.status.slice(1)}
                </span>
              </div>

              <div className="space-y-4 mt-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Balance</p>
                  <p className="text-3xl font-bold text-white mt-2">₹{account.balance?.toLocaleString('en-IN') || '0'}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Type</p>
                    <p className="text-lg text-white font-semibold mt-2 capitalize">{account.account_type}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Created</p>
                    <p className="text-lg text-white font-semibold mt-2">
                      {new Date(account.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <Button variant="secondary" className="flex-1 text-sm">
                  View Details
                </Button>
                <Button variant="secondary" className="flex-1 text-sm">
                  Copy Number
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Account Modal */}
      <Modal open={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create New Account">
        <form onSubmit={handleCreateAccount} className="space-y-5">
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
            <label className="text-sm font-semibold text-slate-200 mb-2 block">Account Type</label>
            <select
              value={formData.account_type}
              onChange={(e) => setFormData({ ...formData, account_type: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 outline-none transition focus:border-cyan-400/50 focus:bg-white/10"
            >
              <option value="savings">Savings Account</option>
              <option value="checking">Checking Account</option>
              <option value="business">Business Account</option>
            </select>
          </div>

          <Input
            label="Initial Balance"
            name="initial_balance"
            type="number"
            min="0"
            step="0.01"
            value={formData.initial_balance}
            onChange={(e) => setFormData({ ...formData, initial_balance: e.target.value })}
            placeholder="0.00"
          />

          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowCreateModal(false)}
              className="flex-1"
              disabled={creating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={creating}
            >
              {creating ? 'Creating...' : 'Create Account'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Success Toast with Account Number */}
      {showSuccessToast && newAccountNumber && (
        <div className="fixed bottom-4 right-4 z-40">
          <Toast 
            type="success"
            title="Account created successfully!"
            message={`Account Number: ${newAccountNumber}`}
            onClose={() => setShowSuccessToast(false)}
            duration={5000}
          />
        </div>
      )}
    </div>
  );
}
