import { useMemo, useState } from 'react';
import LoanCard from '@/components/LoanCard';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useDashboard } from '@/context/DashboardContext';
import { useFormState } from '@/hooks/useFormState';

const calcEmi = (principal, annualRate, months) => {
  const monthlyRate = annualRate / 12 / 100;
  if (!principal || !months) return 0;
  if (monthlyRate === 0) return principal / months;
  return (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
};

export default function LoansPage() {
  const { loans, addLoanApplication } = useDashboard();
  const { values, handleChange, reset } = useFormState({ loanName: '', amount: 100000, rate: 8.5, tenure: 36 });
  const [score] = useState(82);

  const emi = useMemo(() => calcEmi(Number(values.amount), Number(values.rate), Number(values.tenure)), [values.amount, values.rate, values.tenure]);

  const handleSubmit = (event) => {
    event.preventDefault();
    addLoanApplication({
      name: values.loanName || 'Custom Loan',
      amount: Number(values.amount),
      rate: `${Number(values.rate).toFixed(1)}%`,
      tenure: `${values.tenure} months`,
      status: 'Submitted',
    });
    reset();
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Credit services</p>
        <h1 className="mt-2 font-display text-4xl text-white">Loan Management</h1>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <form onSubmit={handleSubmit} className="glass-panel rounded-3xl p-6 space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <Input label="Loan purpose" name="loanName" value={values.loanName} onChange={handleChange} placeholder="Home boost" />
            <Input label="Loan amount" name="amount" type="number" value={values.amount} onChange={handleChange} />
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <Input label="Interest rate (%)" name="rate" type="number" step="0.1" value={values.rate} onChange={handleChange} />
            <Input label="Tenure (months)" name="tenure" type="number" value={values.tenure} onChange={handleChange} />
          </div>
          <div className="rounded-3xl border border-cyan-400/15 bg-white/5 p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Estimated EMI</span>
              <span className="font-display text-2xl text-white">${emi.toFixed(2)}</span>
            </div>
            <p className="mt-2 text-sm text-slate-500">Calculated with a mock amortization formula for frontend demonstration only.</p>
          </div>
          <Button className="w-full">Apply for loan</Button>
        </form>

        <div className="space-y-4">
          <div className="glass-panel rounded-3xl p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Eligibility score</p>
            <div className="mt-4 flex items-center justify-between gap-4">
              <div>
                <h3 className="font-display text-4xl text-white">{score}</h3>
                <p className="text-sm text-slate-400">Pre-approved score</p>
              </div>
              <div className="h-24 w-24 rounded-full border border-cyan-400/15 bg-cyan-400/10 p-2">
                <div className="flex h-full items-center justify-center rounded-full bg-night-900 text-cyan-200">A+</div>
              </div>
            </div>
          </div>
          <div className="grid gap-4">
            {loans.map((loan) => (
              <LoanCard key={loan.id} loan={loan} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
