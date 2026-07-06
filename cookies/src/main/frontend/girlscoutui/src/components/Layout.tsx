// src/components/Layout.tsx
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: string;
  setView: (view: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, setView }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 max-w-md mx-auto shadow-xl border-x border-gray-200">

      {/* Global Header / Notification Bar */}
      <header className="sticky top-0 bg-green-700 text-white p-4 flex justify-between items-center z-10 shadow-md">
        <div className="flex items-center gap-2">
          <span className="text-xl">⚜️</span>
          <h1 className="font-bold tracking-wide text-lg">G.S. Cookie Tracker</h1>
        </div>
        {/* Simple Notification Dot Icon */}
        <button className="relative p-1 hover:bg-green-800 rounded-full transition" onClick={() => alert("No new notifications")}>
          🔔
          <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-green-700" />
        </button>
      </header>

      {/* Dynamic Content Area (Your pages render here) */}
      <main className="flex-1 pb-24 overflow-y-auto">
        {children}
      </main>

      {/* Mobile-Friendly Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 flex justify-around py-3 z-10 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        <button
          onClick={() => setView('calendar')}
          className={`flex flex-col items-center gap-1 text-xs ${currentView === 'calendar' ? 'text-green-700 font-bold' : 'text-gray-500'}`}
        >
          <span className="text-lg">📅</span>
          Calendar
        </button>

        <button
          onClick={() => setView('leads')}
          className={`flex flex-col items-center gap-1 text-xs ${currentView === 'leads' ? 'text-green-700 font-bold' : 'text-gray-500'}`}
        >
          <span className="text-lg">🔲</span>
          QR Lead
        </button>

        <button
          onClick={() => setView('manager')}
          className={`flex flex-col items-center gap-1 text-xs ${currentView === 'manager' ? 'text-green-700 font-bold' : 'text-gray-500'}`}
        >
          <span className="text-lg">💼</span>
          Manager
        </button>
      </nav>

    </div>
  );
};