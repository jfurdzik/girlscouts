// src/components/Layout.tsx
import type { ReactNode } from 'react';
import { CalendarDays, QrCode, Bell, ShieldCheck } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  currentView: string;
  setView: (view: string) => void;
}

// Manager functionality intentionally does NOT live here — the public site
// must never expose it. Managers use the separate manager.html portal
// (linked subtly below), which has its own login gate and its own bundle.
const NAV_ITEMS = [
  { id: 'calendar', label: 'Calendar', icon: CalendarDays },
  { id: 'leads', label: 'QR Lead', icon: QrCode },
];

export function Layout({ children, currentView, setView }: LayoutProps) {
  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-[#f4f7f4] border-x border-gray-200 overflow-hidden">
      {/* Top Header */}
      <header className="shrink-0 bg-brand text-white px-4 py-3 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-base">
            ⚜
          </div>
          <div>
            <div className="font-semibold text-sm leading-none">GS Recruitment Event Tracker</div>
            <div className="text-green-100/90 text-xs mt-0.5">Open House &amp; event hub</div>
          </div>
        </div>
        <button
          className="relative p-1.5 rounded-full hover:bg-white/10 transition-colors"
          onClick={() => alert('No new notifications')}
          aria-label="Notifications"
        >
          <Bell size={20} />
          <span className="absolute top-0.5 right-0.5 block h-2 w-2 rounded-full bg-accent ring-2 ring-brand" />
        </button>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto">{children}</main>

      {/* Bottom Nav */}
      <nav className="shrink-0 bg-white border-t border-gray-200 px-2 py-1 shadow-[0_-4px_10px_rgba(0,0,0,0.04)]">
        <div className="flex justify-around items-center">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
            const active = currentView === id;
            return (
              <button
                key={id}
                onClick={() => setView(id)}
                className={`flex flex-col items-center gap-0.5 py-2 px-4 rounded-xl transition-colors min-w-[64px] ${
                  active ? 'text-brand' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Icon size={22} strokeWidth={active ? 2.4 : 2} />
                <span className={`text-xs ${active ? 'font-semibold' : ''}`}>{label}</span>
              </button>
            );
          })}
          {/* Just a link to the separate manager.html entry/bundle — no manager
              functionality or data is ever loaded into the public site itself. */}
          <a
            href="/manager.html"
            className="flex flex-col items-center gap-0.5 py-2 px-4 rounded-xl text-gray-300 hover:text-gray-500 transition-colors min-w-[64px]"
          >
            <ShieldCheck size={22} />
            <span className="text-xs">Staff</span>
          </a>
        </div>
      </nav>
    </div>
  );
}
