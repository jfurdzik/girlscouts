import { useEffect, useState } from 'react';
import PageHeader from '../../components/PageHeader';
import Card from '../../components/Card';
import { getRawEvents, getAllAssignments, getAllUsers } from '../../lib/api';
import type { BackendEvent, BackendAssignment, BackendUser } from '../../types';

export default function VolunteerDashboard() {
  const [events, setEvents] = useState<BackendEvent[]>([]);
  const [assignments, setAssignments] = useState<BackendAssignment[]>([]);
  const [users, setUsers] = useState<BackendUser[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getRawEvents(), getAllAssignments(), getAllUsers()])
      .then(([e, a, u]) => {
        setEvents(e);
        setAssignments(a);
        setUsers(u);
      })
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load'));
  }, []);

  const usersById = new Map(users.map(u => [u.id, u]));

  return (
    <div>
      <PageHeader title="Volunteers" subtitle="Who's signed up for every event" />
      {error && <Card className="mb-4 text-sm text-red-600">{error}</Card>}

      <div className="space-y-3">
        {events.map(event => {
          const eventAssignments = assignments.filter(
            a => a.eventId === event.eventId && a.status?.toUpperCase() !== 'CANCELLED'
          );

          return (
            <Card key={event.eventId}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{event.eventName}</h3>
                <span className="text-sm font-medium text-brand-dark">
                  {eventAssignments.length} Volunteer{eventAssignments.length === 1 ? '' : 's'}
                </span>
              </div>
              <p className="text-xs text-gray-400 mb-3">{event.eventDate} · {event.location}</p>

              {eventAssignments.length === 0 ? (
                <p className="text-sm text-gray-400 italic">No volunteers signed up yet.</p>
              ) : (
                <ul className="space-y-1.5">
                  {eventAssignments.map(a => {
                    const user = a.userId != null ? usersById.get(a.userId) : undefined;
                    return (
                      <li key={a.assignmentId} className="text-sm text-gray-700 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand" />
                        {user ? `${user.firstName} ${user.lastName}` : `User #${a.userId}`}
                        {user?.email && <span className="text-xs text-gray-400">({user.email})</span>}
                      </li>
                    );
                  })}
                </ul>
              )}
            </Card>
          );
        })}
        {events.length === 0 && <p className="text-sm text-gray-400">No events yet.</p>}
      </div>
    </div>
  );
}
