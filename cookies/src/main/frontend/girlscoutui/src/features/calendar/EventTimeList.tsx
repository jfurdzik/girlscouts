import { Clock, MapPin, ChevronRight } from 'lucide-react';
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
        const full = event.slotsAvailable <= 0;
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
                  {full && <Badge color="gray">Full</Badge>}
                  {!full && event.slotsAvailable <= 1 && <Badge color="amber">Almost full</Badge>}
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
              {!full ? (
                <div className="flex items-center gap-1">
                  {Array.from({ length: event.slotsTotal ?? event.slotsAvailable }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-2.5 h-2.5 rounded-full ${
                        i < (event.slotsTotal ?? event.slotsAvailable) - event.slotsAvailable
                          ? 'bg-brand'
                          : 'bg-gray-200'
                      }`}
                    />
                  ))}
                  <span className="text-xs text-gray-500 ml-1.5">{event.slotsAvailable} left</span>
                </div>
              ) : (
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">Full</span>
              )}
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
