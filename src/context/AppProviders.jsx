import AuthProvider from './AuthContext.jsx';
import NotificationProvider from './NotificationContext.jsx';
import ThemeProvider from './ThemeContext.jsx';

export default function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <AuthProvider>{children}</AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}
