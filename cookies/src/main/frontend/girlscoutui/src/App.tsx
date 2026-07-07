// src/App.tsx
import { useEffect, useState } from 'react';
import { Layout } from './components/Layout';
import PageHeader from './components/PageHeader';
import Card from './components/Card';
import { CalendarView } from './features/calendar/CalendarView';
import { EventDetail } from './features/events/EventDetail';
import { getEvents } from './lib/api';
import type { GirlScoutEvent } from './types';

type View = 'calendar' | 'leads' | 'manager';

function App() {
  const [currentView, setView] = useState<View>('calendar');
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
        setView(view as View);
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

      {/* VIEW 2: QR LEAD CARD FEATURE (Placeholder) */}
      {currentView === 'leads' && (
        <div>
          <PageHeader title="QR Lead Card" subtitle="Capture new-family leads on the spot" />
          <div className="px-4">
            <Card className="text-center py-10">
              <p className="text-gray-500 text-sm">Scan helper or direct inputs will display here.</p>
            </Card>
          </div>
        </div>
      )}

      {/* VIEW 3: MANAGER DASHBOARD (Placeholder) */}
      {currentView === 'manager' && (
        <div>
          <PageHeader title="Manager Control Panel" subtitle="Manage schools, volunteers, and notifications" />
          <div className="px-4">
            <Card className="text-center py-10">
              <p className="text-gray-500 text-sm">Input screens for schools, volunteers, and notifications will display here.</p>
            </Card>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default App;
