// src/App.tsx
import { useState } from 'react';
import { Layout } from './components/Layout';
import { CalendarView } from './features/calendar/CalendarView';
import { EventDetail } from './features/events/EventDetail';
// import { GirlScoutEvent } from './types';

// Mock Data to get your front-end rendering cleanly
const MOCK_EVENTS: GirlScoutEvent[] = [
  {
    id: '1',
    title: 'Cookie Booth - Walmart Supercenter',
    date: '2026-07-11',
    time: '10:00 AM - 1:00 PM',
    location: '123 Main St, Buffalo, NY',
    zipCode: '14201',
    serviceUnit: 'SU-402',
    description: 'High traffic cookie sales booth. Two volunteers needed to handle inventory.',
    slotsAvailable: 2,
    contacts: [{ id: 'c1', name: 'CEO', role: 'Manager', email: 'ceo@example.com' }],
    attendees: []
  },
  {
    id: '2',
    title: 'School Open House Sign-Up Drive',
    date: '2026-07-15',
    time: '04:00 PM - 07:00 PM',
    location: 'St. Mary Private School Gym',
    zipCode: '14203',
    serviceUnit: 'SU-405',
    description: 'Recruitment event targeting new elementary families. Bring lead cards and QR codes!',
    slotsAvailable: 1,
    contacts: [{ id: 'c2', name: 'Sarah Jenkins', role: 'Staff', email: 'sarah@example.com' }],
    attendees: [{ id: 'v1', name: 'Dana Scully', role: 'Volunteer', email: 'dana@example.com' }]
  }
];

function App() {
  const [currentView, setView] = useState<string>('calendar'); // 'calendar' | 'leads' | 'manager'
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  // Find the details of the clicked event
  const selectedEvent = MOCK_EVENTS.find(e => e.id === selectedEventId);

  return (
    <Layout currentView={currentView} setView={(view) => { setView(view); setSelectedEventId(null); }}>
      
      {/* VIEW 1: CALENDAR FEATURE */}
      {currentView === 'calendar' && (
        !selectedEvent ? (
          <CalendarView 
            events={MOCK_EVENTS} 
            onSelectEvent={(id) => setSelectedEventId(id)} 
          />
        ) : (
          <EventDetail 
            event={selectedEvent} 
            onBack={() => setSelectedEventId(null)}
            onSignUpSuccess={(id) => console.log(`Successfully signed up for event: ${id}`)}
          />
        )
      )}

      {/* VIEW 2: LEAD CARD / QR CODE FEATURE (Placeholder) */}
      {currentView === 'leads' && (
        <div className="p-6 text-center">
          <h2 className="text-xl font-bold mb-2">QR Lead Card Input</h2>
          <p className="text-gray-500 text-sm">Scan helper or direct inputs will display here.</p>
        </div>
      )}

      {/* VIEW 3: MANAGER DASHBOARD (Placeholder) */}
      {currentView === 'manager' && (
        <div className="p-6 text-center">
          <h2 className="text-xl font-bold mb-2">Manager Control Panel</h2>
          <p className="text-gray-500 text-sm">Input screens for schools, volunteers, and notifications will display here.</p>
        </div>
      )}

    </Layout>
  );
}

export default App;