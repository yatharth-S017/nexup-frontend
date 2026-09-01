import { createContext, useCallback, useMemo, useState } from 'react';

export const NotificationContext = createContext(null);

export default function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const notify = useCallback((notification) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    const newNotification =
      typeof notification === 'string'
        ? { id, message: notification, type: 'success' }
        : { id, type: 'success', ...notification };

    setNotifications((current) => [...current, newNotification]);

    // Auto dismiss after 3 seconds
    setTimeout(() => {
      setNotifications((current) => current.filter((n) => n.id !== id));
    }, 3000);
  }, []);

  const clearNotifications = useCallback(() => setNotifications([]), []);

  const value = useMemo(
    () => ({ notifications, notify, clearNotifications }),
    [clearNotifications, notifications, notify]
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}
