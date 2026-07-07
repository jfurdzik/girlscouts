import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Plus, Pencil, Trash2, Megaphone, X } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import {
  getRawEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  boostEvent,
  getAllAssignments,
} from '../../lib/api';
import type { BackendEvent } from '../../types';

const emptyForm: Partial<BackendEvent> = {
  eventName: '',
  eventDate: '',
  startTime: '09:00',
  endTime: '12:00',
  description: '',
  location: '',
  capacity: 4,
  status: 'OPEN',
};

export default function EventEditor() {
  const [events, setEvents] = useState<BackendEvent[]>([]);
  const [volunteerCounts, setVolunteerCounts] = useState<Map<number, number>>(new Map());
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<BackendEvent> | null>(null);
  const [boosting, setBoosting] = useState<BackendEvent | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    setLoading(true);
    try {
      const [rawEvents, assignments] = await Promise.all([getRawEvents(), getAllAssignments()]);
      setEvents(rawEvents);
      const counts = new Map<number, number>();
      for (const a of assignments) {
        if (a.eventId == null || a.status?.toUpperCase() === 'CANCELLED') continue;
        counts.set(a.eventId, (counts.get(a.eventId) ?? 0) + 1);
      }
      setVolunteerCounts(counts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load events');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setError(null);
    try {
      if (editing.eventId) {
        await updateEvent(editing.eventId, editing);
      } else {
        await createEvent(editing);
      }
      setEditing(null);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this event? This cannot be undone.')) return;
    try {
      await deleteEvent(id);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <PageHeader title="Events" subtitle="Create, edit, and manage cookie booth events" />
        <Button onClick={() => setEditing({ ...emptyForm })} className="flex items-center gap-1.5 h-fit mt-5">
          <Plus size={16} /> New Event
        </Button>
      </div>

      {error && <Card className="mb-4 text-sm text-red-600">{error}</Card>}

      {loading ? (
        <p className="text-sm text-gray-400">Loading events...</p>
      ) : (
        <div className="space-y-3">
          {events.map(event => {
            const count = volunteerCounts.get(event.eventId) ?? 0;
            return (
              <Card key={event.eventId}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 truncate">{event.eventName}</h3>
                      <Badge color={event.status === 'OPEN' ? 'green' : event.status === 'FULL' ? 'amber' : 'gray'}>
                        {event.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500">
                      {event.eventDate} · {event.startTime}–{event.endTime} · {event.location || 'No location set'}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {count}/{event.capacity ?? '∞'} volunteers
                    </p>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <IconButton onClick={() => setBoosting(event)} title="Boost">
                      <Megaphone size={15} />
                    </IconButton>
                    <IconButton onClick={() => setEditing(event)} title="Edit">
                      <Pencil size={15} />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(event.eventId)} title="Delete">
                      <Trash2 size={15} className="text-red-500" />
                    </IconButton>
                  </div>
                </div>
              </Card>
            );
          })}
          {events.length === 0 && <p className="text-sm text-gray-400">No events yet — create one to get started.</p>}
        </div>
      )}

      {editing && (
        <EventFormModal
          value={editing}
          onChange={setEditing}
          onCancel={() => setEditing(null)}
          onSubmit={handleSave}
        />
      )}

      {boosting && (
        <BoostModal event={boosting} onClose={() => setBoosting(null)} />
      )}
    </div>
  );
}

function IconButton({ children, onClick, title }: { children: React.ReactNode; onClick: () => void; title: string }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
    >
      {children}
    </button>
  );
}

function EventFormModal({
  value,
  onChange,
  onCancel,
  onSubmit,
}: {
  value: Partial<BackendEvent>;
  onChange: (v: Partial<BackendEvent>) => void;
  onCancel: () => void;
  onSubmit: (e: FormEvent) => void;
}) {
  function field<K extends keyof BackendEvent>(key: K, v: BackendEvent[K]) {
    onChange({ ...value, [key]: v });
  }

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 p-4">
      <Card className="max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900">{value.eventId ? 'Edit Event' : 'New Event'}</h2>
          <button onClick={onCancel}><X size={18} className="text-gray-400" /></button>
        </div>

        <form onSubmit={onSubmit} className="space-y-3">
          <LabeledInput label="Event Name" value={value.eventName ?? ''} onChange={v => field('eventName', v)} required />
          <LabeledInput label="Description" value={value.description ?? ''} onChange={v => field('description', v)} />
          <LabeledInput label="Location" value={value.location ?? ''} onChange={v => field('location', v)} />
          <div className="grid grid-cols-2 gap-3">
            <LabeledInput label="Date" type="date" value={value.eventDate ?? ''} onChange={v => field('eventDate', v)} required />
            <LabeledInput label="Capacity" type="number" value={String(value.capacity ?? '')} onChange={v => field('capacity', Number(v))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <LabeledInput label="Start Time" type="time" value={value.startTime ?? ''} onChange={v => field('startTime', v)} required />
            <LabeledInput label="End Time" type="time" value={value.endTime ?? ''} onChange={v => field('endTime', v)} required />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Status</label>
            <select
              value={value.status ?? 'OPEN'}
              onChange={e => field('status', e.target.value as BackendEvent['status'])}
              className="w-full px-3.5 py-2.5 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            >
              <option value="OPEN">Open</option>
              <option value="FULL">Full</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" className="flex-1" onClick={onCancel}>Cancel</Button>
            <Button type="submit" className="flex-1">{value.eventId ? 'Save Changes' : 'Create Event'}</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

function LabeledInput({
  label, value, onChange, type = 'text', required,
}: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="text-xs font-medium text-gray-500 mb-1 block">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        required={required}
        className="w-full px-3.5 py-2.5 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand"
      />
    </div>
  );
}

function BoostModal({ event, onClose }: { event: BackendEvent; onClose: () => void }) {
  const [audience, setAudience] = useState<'ALL' | 'SERVICE_UNIT' | 'SCHOOL' | 'PREVIOUS'>('ALL');
  const [value, setValue] = useState('');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function handleSend() {
    setSending(true);
    setResult(null);
    try {
      const res = await boostEvent(event.eventId, audience, value || undefined);
      setResult(`Sent to ${res.sent} volunteer${res.sent === 1 ? '' : 's'}.`);
    } catch (err) {
      setResult(err instanceof Error ? err.message : 'Failed to send');
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 p-4">
      <Card className="max-w-sm w-full">
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-bold text-gray-900">Boost "{event.eventName}"</h2>
          <button onClick={onClose}><X size={18} className="text-gray-400" /></button>
        </div>
        <p className="text-xs text-gray-500 mb-4">Send an encouraging email to volunteers to boost signups.</p>

        <label className="text-xs font-medium text-gray-500 mb-1 block">Audience</label>
        <select
          value={audience}
          onChange={e => setAudience(e.target.value as typeof audience)}
          className="w-full px-3.5 py-2.5 bg-gray-100 rounded-xl text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-brand"
        >
          <option value="ALL">All Volunteers</option>
          <option value="SERVICE_UNIT">By Service Unit</option>
          <option value="SCHOOL">By School (ID)</option>
          <option value="PREVIOUS">Previous Volunteers</option>
        </select>

        {(audience === 'SERVICE_UNIT' || audience === 'SCHOOL') && (
          <input
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder={audience === 'SERVICE_UNIT' ? 'e.g. SU-402' : 'School ID'}
            className="w-full px-3.5 py-2.5 bg-gray-100 rounded-xl text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-brand"
          />
        )}

        {result && <p className="text-sm text-gray-600 mb-3">{result}</p>}

        <Button className="w-full" onClick={handleSend} disabled={sending}>
          {sending ? 'Sending...' : 'Send Boost Email'}
        </Button>
      </Card>
    </div>
  );
}
