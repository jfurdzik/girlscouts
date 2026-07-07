import { useEffect, useState } from 'react';
import LoginPage from './LoginPage';
import ManagerLayout, { type ManagerView } from './ManagerLayout';
import DashboardHome from '../features/manager/DashboardHome';
import EventEditor from '../features/manager/EventEditor';
import VolunteerDashboard from '../features/manager/VolunteerDashboard';
import LeadDashboard from '../features/manager/LeadDashboard';
import NotificationSettingsPage from '../features/manager/NotificationSettingsPage';
import { getCurrentUser, logout as apiLogout } from '../lib/api';
import type { AuthUser } from '../types';

/**
 * Auth gate for the whole manager portal (served from manager.html, a
 * separate Vite entry point — see vite.config.ts — rather than a router).
 * Unauthenticated visitors always see LoginPage; there is no client-side way
 * to bypass this because every manager API call is separately enforced by
 * Spring Security on the backend regardless of what this component does.
 */
export default function ManagerApp() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [view, setView] = useState<ManagerView>('dashboard');

  useEffect(() => {
    getCurrentUser()
      .then(setUser)
      .finally(() => setCheckingAuth(false));
  }, []);

  async function handleLogout() {
    await apiLogout();
    setUser(null);
  }

  if (checkingAuth) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">Loading...</div>;
  }

  if (!user) {
    return <LoginPage onLoginSuccess={setUser} />;
  }

  return (
    <ManagerLayout currentView={view} setView={setView} user={user} onLogout={handleLogout}>
      {view === 'dashboard' && <DashboardHome />}
      {view === 'events' && <EventEditor />}
      {view === 'volunteers' && <VolunteerDashboard />}
      {view === 'leads' && <LeadDashboard />}
      {view === 'settings' && <NotificationSettingsPage />}
    </ManagerLayout>
  );
}
