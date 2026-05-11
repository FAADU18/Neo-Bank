import { createContext, useContext, useMemo, useState } from 'react';
import { notificationsSeed } from '@/services/mockData';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(notificationsSeed);

  const addNotification = (notification) => {
    setNotifications((current) => [
      {
        id: Date.now(),
        time: 'Now',
        level: 'info',
        ...notification,
      },
      ...current,
    ]);
  };

  const dismissNotification = (id) => {
    setNotifications((current) => current.filter((item) => item.id !== id));
  };

  const value = useMemo(
    () => ({ notifications, addNotification, dismissNotification }),
    [notifications],
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export const useNotifications = () => useContext(NotificationContext);
