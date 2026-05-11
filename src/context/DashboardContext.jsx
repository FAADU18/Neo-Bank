import { createContext, useContext, useMemo, useState } from 'react';
import {
  adminUsers,
  dashboardStats,
  fraudAlerts,
  initialTransactions,
  loanCards,
  monthlyCashflow,
  transactionCategoryData,
} from '@/services/mockData';

const DashboardContext = createContext(null);

export function DashboardProvider({ children }) {
  const [stats] = useState(dashboardStats);
  const [transactions, setTransactions] = useState(initialTransactions);
  const [loans, setLoans] = useState(loanCards);
  const [alerts, setAlerts] = useState(fraudAlerts);
  const [users, setUsers] = useState(adminUsers);
  const [cashflow] = useState(monthlyCashflow);
  const [categoryData] = useState(transactionCategoryData);

  const addTransaction = (transaction) => {
    setTransactions((current) => [transaction, ...current]);
  };

  const freezeUser = (id) => {
    setUsers((current) =>
      current.map((user) => (user.id === id ? { ...user, status: user.status === 'Frozen' ? 'Active' : 'Frozen' } : user)),
    );
  };

  const acknowledgeAlert = (id) => {
    setAlerts((current) => current.filter((alert) => alert.id !== id));
  };

  const addLoanApplication = (loan) => {
    setLoans((current) => [{ id: Date.now(), ...loan }, ...current]);
  };

  const value = useMemo(
    () => ({
      stats,
      transactions,
      loans,
      alerts,
      users,
      cashflow,
      categoryData,
      addTransaction,
      freezeUser,
      acknowledgeAlert,
      addLoanApplication,
    }),
    [stats, transactions, loans, alerts, users, cashflow, categoryData],
  );

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

export const useDashboard = () => useContext(DashboardContext);
