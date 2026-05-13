import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import LoanCard from '@/components/LoanCard';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useDashboard } from '@/context/DashboardContext';
import { useNotifications } from '@/context/NotificationContext';
import { loanAPI } from '@/services/api';
import { useFormState } from '@/hooks/useFormState';

export default function LoansPage() {
  const { loans, addLoanApplication } = useDashboard();
  const { addNotification } = useNotifications();
  const { values, handleChange, reset } = useFormState({ 
    amount: 100000, 
    loan_term: 12 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [creditScore] = useState(82);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (parseFloat(values.amount) <= 0) {
        throw new Error('Loan amount must be greater than 0');
      }

      const response = await loanAPI.applyForLoan({
        amount: parseFloat(values.amount),
        loan_term: parseInt(values.loan_term) || 12
      });

      const newLoan = response.data.data;
      addLoanApplication(newLoan);

      addNotification({
        title: 'Loan application submitted',
        message: `Application for ₹${newLoan.amount.toLocaleString()} submitted successfully`,
        level: 'success',
        time: 'Now',
      });

      reset();
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      setError(message);
      addNotification({
        title: 'Application failed',
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
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Credit services</p>
        <h1 className="mt-2 font-display text-4xl text-white">Loan Management</h1>
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
            <label className="block text-sm font-medium text-slate-300 mb-2">Loan Amount (₹)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
              <input
                type="number"
                name="amount"
                value={values.amount}
                onChange={handleChange}
                min="10000"
                step="1000"
                className="w-full rounded-lg border border-cyan-400/20 bg-white/5 pl-8 pr-4 py-2 text-white backdrop-blur-md transition hover:border-cyan-400/40 focus:border-cyan-400/60 focus:outline-none"
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">Min ₹10,000 - Adjust amount using slider or input</p>
          </div>

          <Input 
            label="Loan Tenure (months)" 
            name="loan_term" 
            type="number" 
            min="6"
            max="60"
            value={values.loan_term} 
            onChange={handleChange} 
            placeholder="12"
          />

          <div className="rounded-3xl border border-cyan-400/15 bg-white/5 p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Estimated Monthly Payment</span>
              <span className="font-display text-2xl text-cyan-400">
                ₹{values.amount ? (parseFloat(values.amount) / parseInt(values.loan_term || 12)).toFixed(0).toLocaleString() : '0'}
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-500">Estimated payment for {values.loan_term} months</p>
          </div>

          <Button 
            className="w-full" 
            disabled={loading || !values.amount}
          >
            {loading ? 'Submitting application...' : 'Apply for loan'}
          </Button>
        </form>

        <div className="space-y-4">
          <div className="glass-panel rounded-3xl p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Eligibility score</p>
            <div className="mt-4 flex items-center justify-between gap-4">
              <div>
                <h3 className="font-display text-4xl text-white">{creditScore}</h3>
                <p className="text-sm text-slate-400">Pre-approved score</p>
              </div>
              <div className="h-24 w-24 rounded-full border border-cyan-400/15 bg-cyan-400/10 p-2">
                <div className="flex h-full items-center justify-center rounded-full bg-night-900 text-cyan-200 font-display text-2xl">A+</div>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400 mb-4">Loan benefits</p>
            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">✓</span>
                <span>Fast approval within 24 hours</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">✓</span>
                <span>Flexible repayment terms</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">✓</span>
                <span>Competitive interest rates</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">✓</span>
                <span>No hidden charges</span>
              </div>
            </div>
          </div>

          {loans.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Your loans</p>
              {loans.map((loan) => (
                <LoanCard key={loan.id} loan={loan} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

