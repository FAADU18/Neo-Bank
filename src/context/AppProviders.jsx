import { AuthProvider } from '@/context/AuthContext';
import { DashboardProvider } from '@/context/DashboardContext';
import { NotificationProvider } from '@/context/NotificationContext';

export function AppProviders({ children }) {
  return (
    <AuthProvider>
      <NotificationProvider>
        <DashboardProvider>{children}</DashboardProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}
