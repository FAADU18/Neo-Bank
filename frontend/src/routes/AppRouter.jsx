import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import PublicLayout from '@/layouts/PublicLayout';
import AuthLayout from '@/layouts/AuthLayout';
import DashboardLayout from '@/layouts/DashboardLayout';
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import DashboardPage from '@/pages/DashboardPage';
import TransactionsPage from '@/pages/TransactionsPage';
import TransferPage from '@/pages/TransferPage';
import LoansPage from '@/pages/LoansPage';
import AnalyticsPage from '@/pages/AnalyticsPage';
import FraudMonitorPage from '@/pages/FraudMonitorPage';
import ProfilePage from '@/pages/ProfilePage';
import AdminPage from '@/pages/AdminPage';

function PageMotion({ children }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.28 }}>
      {children}
    </motion.div>
  );
}

function AdminRoute({ children }) {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner label="Verifying admin access" />
      </div>
    );
  }

  return isAdmin ? children : <Navigate to="/dashboard" replace />;
}

export default function AppRouter() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PublicLayout>
              <PageMotion>
                <LandingPage />
              </PageMotion>
            </PublicLayout>
          }
        />
        <Route
          path="/login"
          element={
            <AuthLayout title="Sign in to the NeoBankX network" subtitle="A futuristic dashboard experience for modern banking, analytics, and secure transfers.">
              <LoginPage />
            </AuthLayout>
          }
        />
        <Route
          path="/register"
          element={
            <AuthLayout title="Create your NeoBankX account" subtitle="Join a premium digital banking experience built for speed, insight, and visual impact.">
              <RegisterPage />
            </AuthLayout>
          }
        />
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<PageMotion><DashboardPage /></PageMotion>} />
          <Route path="/transactions" element={<PageMotion><TransactionsPage /></PageMotion>} />
          <Route path="/transfer" element={<PageMotion><TransferPage /></PageMotion>} />
          <Route path="/loans" element={<PageMotion><LoansPage /></PageMotion>} />
          <Route path="/analytics" element={<PageMotion><AnalyticsPage /></PageMotion>} />
          <Route path="/fraud-monitor" element={<PageMotion><FraudMonitorPage /></PageMotion>} />
          <Route path="/profile" element={<PageMotion><ProfilePage /></PageMotion>} />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <PageMotion>
                  <AdminPage />
                </PageMotion>
              </AdminRoute>
            }
          />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}
