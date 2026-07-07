import { Clock, MapPin, ChevronRight, Users } from 'lucide-react';
import type { GirlScoutEvent } from '../../types';
import Badge from '../../components/Badge';

interface EventTimeListProps {
  events: GirlScoutEvent[];
  onSelectEvent: (id: string) => void;
  emptyLabel?: string;
}

export function EventTimeList({ events, onSelectEvent, emptyLabel }: EventTimeListProps) {
  if (events.length === 0) {
    return (
      <div className="text-center py-10 text-gray-400">
        <Clock size={28} className="mx-auto mb-2 opacity-40" />
        <p className="text-sm">{emptyLabel ?? 'No events on this day'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {events.map(event => {
        const cancelled = event.status === 'cancelled';
        const full = event.status === 'full';
        return (
          <div
            key={event.id}
            onClick={() => onSelectEvent(event.id)}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 cursor-pointer hover:border-brand/30 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                  <Badge color="gray">{event.serviceUnit}</Badge>
                  {full && <Badge color="amber">Full</Badge>}
                  {cancelled && <Badge color="red">Cancelled</Badge>}
                </div>
                <h3 className="text-gray-900 font-semibold leading-snug truncate">{event.title}</h3>
                <p className="text-gray-400 text-xs mt-0.5 truncate">{event.location}</p>
              </div>
              <ChevronRight size={18} className="text-gray-300 shrink-0 mt-1" />
            </div>

            <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {event.time}
              </span>
              <span className="text-gray-300">·</span>
              <span className="flex items-center gap-1">
                <MapPin size={12} />
                {event.zipCode}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs text-gray-500">
                <Users size={13} />
                {event.attendees.length} volunteer{event.attendees.length === 1 ? '' : 's'}
              </span>
              <span className="text-brand text-xs font-semibold flex items-center gap-0.5">
                View details <ChevronRight size={13} />
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
