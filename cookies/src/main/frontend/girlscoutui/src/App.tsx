// src/App.tsx
import { useEffect, useState } from 'react';
import { Layout } from './components/Layout';
import PageHeader from './components/PageHeader';
import QRCodeCard from './components/QRCodeCard';
import { CalendarView } from './features/calendar/CalendarView';
import { EventDetail } from './features/events/EventDetail';
import { getEvents } from './lib/api';
import type { GirlScoutEvent } from './types';

// Manager functionality lives entirely in the separate manager.html bundle
// (see src/manager/) — the public site only ever knows about these two views.
type View = 'calendar' | 'leads';

function App() {
  const [currentView, setCurrentView] = useState<View>('calendar');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [events, setEvents] = useState<GirlScoutEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getEvents().then(data => {
      if (!cancelled) {
        setEvents(data);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const selectedEvent = events.find(e => e.id === selectedEventId);

  return (
    <Layout
      currentView={currentView}
      setView={view => {
        setCurrentView(view as View);
        setSelectedEventId(null);
      }}
    >
      {/* VIEW 1: CALENDAR FEATURE */}
      {currentView === 'calendar' &&
        (selectedEvent ? (
          <EventDetail
            event={selectedEvent}
            onBack={() => setSelectedEventId(null)}
            onSignUpSuccess={id => console.log(`Successfully signed up for event: ${id}`)}
          />
        ) : loading ? (
          <div className="flex items-center justify-center py-24 text-gray-400 text-sm">Loading events...</div>
        ) : (
          <CalendarView events={events} onSelectEvent={id => setSelectedEventId(id)} />
        ))}

      {/* VIEW 2: QR LEAD CARD FEATURE */}
      {currentView === 'leads' && (
        <div>
          <PageHeader title="Lead Card Form" />
          <div className="px-4">
            <QRCodeCard></QRCodeCard>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default App;
