// src/features/calendar/CalendarView.tsx
import React, { useState } from 'react';
import { GirlScoutEvent } from '../../types';

interface CalendarViewProps {
  events: GirlScoutEvent[];
  onSelectEvent: (eventId: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ events, onSelectEvent }) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Filter events for the day a user clicks on
  const eventsForSelectedDate = events.filter(event => event.date === selectedDate);

  // Sort all events chronologically for the "List view"
  const sortedEvents = [...events].sort((a, b) =>
    new Date(`${a.date} ${a.time.split(' - ')[0]}`).getTime() -
    new Date(`${b.date} ${b.time.split(' - ')[0]}`).getTime()
  );

  return (
    <div className="p-4 max-w-md mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-green-700">Girl Scouts Events</h1>

      {/* 1. Date Picker / Calendar Simulator */}
      <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select a Day to See Available Events
        </label>
        <input
          type="date"
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
          onChange={(e) => setSelectedDate(e.target.value)}
        />

        {selectedDate && (
          <div className="mt-4">
            <h3 className="font-semibold text-gray-800">Events on {selectedDate}:</h3>
            {eventsForSelectedDate.length === 0 ? (
              <p className="text-sm text-gray-500 mt-1">No events scheduled for this day.</p>
            ) : (
              <div className="space-y-2 mt-2">
                {eventsForSelectedDate.map(event => (
                  <button
                    key={event.id}
                    onClick={() => onSelectEvent(event.id)}
                    className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg transition text-sm font-medium flex justify-between items-center"
                  >
                    <span>{event.title}</span>
                    <span className="text-xs text-gray-500">{event.time}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 2. Chronological List View */}
      <div>
        <h2 className="text-lg font-bold text-gray-800 mb-3">All Upcoming Events (Time Order)</h2>
        <div className="space-y-3">
          {sortedEvents.map(event => (
            <div
              key={event.id}
              onClick={() => onSelectEvent(event.id)}
              className="p-4 bg-white rounded-xl shadow-sm border border-gray-200 cursor-pointer hover:border-green-500 transition"
            >
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-gray-900">{event.title}</h3>
                <span className="text-xs font-bold px-2 py-1 bg-green-100 text-green-800 rounded-full">
                  {event.slotsAvailable} slots left
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">{event.date} | {event.time}</p>
              <p className="text-sm text-gray-600 mt-2 line-clamp-1">📍 {event.location}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};