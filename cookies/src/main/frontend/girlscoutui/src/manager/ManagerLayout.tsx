import type { ReactNode } from 'react';
import { LayoutDashboard, CalendarDays, Users, Contact, Settings, LogOut } from 'lucide-react';
import type { AuthUser } from '../types';

export type ManagerView = 'dashboard' | 'events' | 'volunteers' | 'leads' | 'settings';

interface ManagerLayoutProps {
  children: ReactNode;
  currentView: ManagerView;
  setView: (view: ManagerView) => void;
  user: AuthUser;
  onLogout: () => void;
}

const NAV_ITEMS: { id: ManagerView; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'events', label: 'Events', icon: CalendarDays },
  { id: 'volunteers', label: 'Volunteers', icon: Users },
  { id: 'leads', label: 'Leads', icon: Contact },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function ManagerLayout({ children, currentView, setView, user, onLogout }: ManagerLayoutProps) {
  return (
    <div className="min-h-screen bg-[#f4f7f4] flex flex-col md:flex-row">
      {/* Sidebar (desktop) / top bar (mobile) */}
      <aside className="md:w-56 bg-brand text-white flex md:flex-col shrink-0">
        <div className="px-4 py-4 flex items-center gap-2.5 border-b border-white/10 md:border-b-0">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-base">⚜</div>
          <div>
            <div className="font-semibold text-sm leading-none">Manager Portal</div>
            <div className="text-green-100/80 text-xs mt-0.5">{user.firstName} {user.lastName}</div>
          </div>
        </div>

        <nav className="flex md:flex-col overflow-x-auto md:overflow-visible flex-1 md:mt-2">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
            const active = currentView === id;
            return (
              <button
                key={id}
                onClick={() => setView(id)}
                className={`flex items-center gap-2.5 px-4 py-3 text-sm whitespace-nowrap transition-colors ${
                  active ? 'bg-white/15 font-semibold' : 'text-green-100 hover:bg-white/10'
                }`}
              >
                <Icon size={17} />
                {label}
              </button>
            );
          })}
        </nav>

        <button
          onClick={onLogout}
          className="hidden md:flex items-center gap-2.5 px-4 py-3 text-sm text-green-100 hover:bg-white/10 transition-colors border-t border-white/10"
        >
          <LogOut size={17} />
          Log Out
        </button>
      </aside>

      <main className="flex-1 min-w-0">
        <div className="max-w-5xl mx-auto p-4 md:p-6">{children}</div>
        <button
          onClick={onLogout}
          className="md:hidden flex items-center gap-2 mx-4 mb-6 px-4 py-2.5 text-sm text-gray-500 hover:text-gray-700"
        >
          <LogOut size={16} /> Log Out
        </button>
      </main>
    </div>
  );
}
