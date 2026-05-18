import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { accountAPI, transactionAPI, loanAPI, adminAPI } from '@/services/api';

const DashboardContext = createContext(null);

export function DashboardProvider({ children }) {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [stats, setStats] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loans, setLoans] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all dashboard data
  useEffect(() => {
    if (authLoading || !isAuthenticated) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const [accountRes, loansRes, alertRes] = await Promise.all([
          accountAPI.getAccounts(),
          loanAPI.getMyLoans(),
          adminAPI.getFraudAlerts().catch(() => ({ data: { data: [] } })), // Optional admin endpoint
        ]);

        setAccounts(accountRes.data.data?.accounts || []);
        setLoans(loansRes.data.data?.loans || []);
        setAlerts(alertRes.data.data?.alerts || []);

        // Fetch transactions for the first account
        if (accountRes.data.data?.accounts?.length > 0) {
          const firstAccountId = accountRes.data.data.accounts[0].id;
          const transRes = await transactionAPI.getTransactionHistory(firstAccountId);
          setTransactions(transRes.data.data?.transactions || []);
        }

        // Calculate stats from account data
        const totalBalance = (accountRes.data.data?.accounts || []).reduce((sum, acc) => sum + acc.balance, 0);
        setStats({
          totalBalance,
          monthlySpending: 0,
          savingsGoal: 0,
          accountCount: (accountRes.data.data?.accounts || []).length,
        });
      } catch (err) {
        setError(err.message);
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authLoading, isAuthenticated]);

  // Fetch users for admin
  useEffect(() => {
    if (authLoading || !isAuthenticated) {
      setUsers([]);
      return;
    }

    const fetchUsers = async () => {
      try {
        const res = await adminAPI.getUsers();
        setUsers(res.data.data?.users || []);
      } catch (err) {
        console.log('Non-admin user or admin endpoint not available');
      }
    };

    fetchUsers();
  }, [authLoading, isAuthenticated]);

  const addTransaction = (transaction) => {
    setTransactions((current) => [transaction, ...current]);
  };

  const freezeUser = async (userId) => {
    try {
      await adminAPI.deactivateUser(userId);
      setUsers((current) =>
        current.map((user) => (user.id === userId ? { ...user, is_active: !user.is_active } : user)),
      );
    } catch (err) {
      console.error('Error freezing user:', err);
    }
  };

  const acknowledgeAlert = (id) => {
    setAlerts((current) => current.filter((alert) => alert.id !== id));
  };

  const addLoanApplication = (loan) => {
    setLoans((current) => [loan, ...current]);
  };

  const value = useMemo(
    () => ({
      stats,
      accounts,
      transactions,
      loans,
      alerts,
      users,
      loading,
      error,
      addTransaction,
      freezeUser,
      acknowledgeAlert,
      addLoanApplication,
    }),
    [stats, accounts, transactions, loans, alerts, users, loading, error],
  );

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within DashboardProvider');
  }
  return context;
};
