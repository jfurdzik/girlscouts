import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import type { GirlScoutEvent } from '../../types';
import { EventTimeList } from './EventTimeList';

interface CalendarViewProps {
  events: GirlScoutEvent[];
  onSelectEvent: (id: string) => void;
}

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function toDateKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function CalendarView({ events, onSelectEvent }: CalendarViewProps) {
  const today = useMemo(() => new Date(), []);
  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const eventsByDate = useMemo(() => {
    const map = new Map<string, GirlScoutEvent[]>();
    for (const event of events) {
      if (search && !event.title.toLowerCase().includes(search.toLowerCase()) && !event.location.toLowerCase().includes(search.toLowerCase())) {
        continue;
      }
      const list = map.get(event.date) ?? [];
      list.push(event);
      map.set(event.date, list);
    }
    return map;
  }, [events, search]);

  const monthLabel = cursor.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const cells = useMemo(() => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const firstOfMonth = new Date(year, month, 1);
    const startOffset = firstOfMonth.getDay(); // 0 = Sunday
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const result: { date: Date | null; key: string | null }[] = [];
    for (let i = 0; i < startOffset; i++) result.push({ date: null, key: null });
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      result.push({ date, key: toDateKey(date) });
    }
    return result;
  }, [cursor]);

  const selectedEvents = selectedDate ? eventsByDate.get(selectedDate) ?? [] : [];

  const upcoming = useMemo(() => {
    const todayKey = toDateKey(today);
    return [...events]
      .filter(e => e.date >= todayKey && (!search || eventsByDate.has(e.date)))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 8);
  }, [events, today, search, eventsByDate]);

  return (
    <div className="pb-6">
      {/* Search */}
      <div className="bg-white border-b border-gray-100 px-4 pt-4 pb-3 sticky top-0 z-10 shadow-sm">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search events or location..."
            className="w-full pl-9 pr-4 py-2.5 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>
      </div>

      <div className="px-4 pt-4 max-w-lg mx-auto space-y-5">
        {/* Month Calendar Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
              className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft size={18} />
            </button>
            <h2 className="text-gray-900 font-semibold text-sm">{monthLabel}</h2>
            <button
              onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
              className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              aria-label="Next month"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="grid grid-cols-7 mb-1">
            {WEEKDAYS.map((d, i) => (
              <div key={i} className="text-center text-[11px] font-medium text-gray-400 py-1">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-1">
            {cells.map((cell, i) => {
              if (!cell.date) return <div key={i} />;
              const isToday = cell.key === toDateKey(today);
              const isSelected = cell.key === selectedDate;
              const dayEvents = eventsByDate.get(cell.key!) ?? [];
              const hasEvents = dayEvents.length > 0;

              return (
                <button
                  key={i}
                  onClick={() => setSelectedDate(isSelected ? null : cell.key)}
                  className="flex flex-col items-center gap-0.5 py-1"
                >
                  <span
                    className={`w-8 h-8 flex items-center justify-center rounded-full text-sm transition-colors ${
                      isSelected
                        ? 'bg-brand text-white font-semibold'
                        : isToday
                        ? 'bg-brand-light text-brand-dark font-semibold'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {cell.date.getDate()}
                  </span>
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      hasEvents ? (isSelected ? 'bg-white' : 'bg-brand') : 'bg-transparent'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Agenda */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2
              className="text-gray-700"
              style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}
            >
              {selectedDate
                ? new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                  })
                : 'Upcoming Events'}
            </h2>
            {selectedDate && (
              <button onClick={() => setSelectedDate(null)} className="text-brand text-xs font-medium">
                Clear
              </button>
            )}
          </div>

          <EventTimeList
            events={selectedDate ? selectedEvents : upcoming}
            onSelectEvent={onSelectEvent}
            emptyLabel={selectedDate ? 'No events on this day' : 'No upcoming events'}
          />
        </section>
      </div>
    </div>
  );
}
