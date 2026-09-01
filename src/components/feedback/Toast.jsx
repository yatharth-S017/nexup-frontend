import { useContext } from 'react';
import { NotificationContext } from '../../context/NotificationContext.jsx';

export default function Toast() {
  const context = useContext(NotificationContext);

  if (!context) return null;

  const { notifications } = context;

  if (notifications.length === 0) return null;

  return (
    <div className="toast-container">
      {notifications.map((notif) => (
        <div key={notif.id} className={`toast ${notif.type || 'success'}`} role="status">
          {notif.type === 'error' ? (
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" style={{ color: '#EF4444' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          ) : (
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" style={{ color: '#A8E63D' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          <span>{notif.message}</span>
        </div>
      ))}
    </div>
  );
}
