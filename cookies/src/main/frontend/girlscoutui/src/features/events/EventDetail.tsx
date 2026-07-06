// src/features/events/EventDetail.tsx
import React, { useState } from 'react';
import type { GirlScoutEvent } from '../../types';

interface EventDetailProps {
  event: GirlScoutEvent;
  onBack: () => void;
  onSignUpSuccess: (eventId: string) => void;
}

export const EventDetail: React.FC<EventDetailProps> = ({ event, onBack, onSignUpSuccess }) => {
  const [isSignedUp, setIsSignedUp] = useState(false);

  const handleSignUp = () => {
    // In production, this would call your backend API
    setIsSignedUp(true);
    onSignUpSuccess(event.id);
  };

  return (
    <div className="p-4 max-w-md mx-auto space-y-6 bg-gray-50 min-h-screen">
      <button onClick={onBack} className="text-sm text-green-700 font-medium flex items-center gap-1">
        ← Back to Calendar
      </button>

      {/* Event Header Information */}
      <div className="bg-white p-5 rounded-2xl shadow-sm space-y-3">
        <h1 className="text-2xl font-bold text-gray-900">{event.title}</h1>
        <p className="text-sm text-gray-600">{event.description}</p>

        <div className="border-t pt-3 space-y-2 text-sm text-gray-700">
          <p>📅 <strong>Date:</strong> {event.date}</p>
          <p>⏰ <strong>Time:</strong> {event.time}</p>
          <p>📍 <strong>Location:</strong> {event.location} (SU: {event.serviceUnit}, Zip: {event.zipCode})</p>
        </div>

        {/* Dynamic Action Button */}
        <button
          onClick={handleSignUp}
          disabled={isSignedUp || event.slotsAvailable === 0}
          className={`w-full py-3 rounded-xl font-bold text-white transition mt-4 ${
            isSignedUp
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 shadow-md'
          }`}
        >
          {isSignedUp ? '✓ You Are Signed Up!' : 'Sign Up For Event'}
        </button>
      </div>

      {/* Contacts / Staff Section */}
      <div className="bg-white p-5 rounded-2xl shadow-sm">
        <h2 className="text-md font-bold text-gray-800 mb-3">Event Leads & Contacts</h2>
        <div className="space-y-2">
          {event.contacts.map(contact => (
            <div key={contact.id} className="text-sm border-b pb-2 last:border-b-0 last:pb-0">
              <p className="font-medium text-gray-900">{contact.name} <span className="text-xs text-gray-500">({contact.role})</span></p>
              <p className="text-xs text-gray-600">{contact.email}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Attendance Tracking Section */}
      <div className="bg-white p-5 rounded-2xl shadow-sm">
        <h2 className="text-md font-bold text-gray-800 mb-2">People Signed Up</h2>
        <p className="text-xs text-gray-500 mb-3">{event.slotsAvailable} remaining shifts available.</p>

        {event.attendees.length === 0 ? (
          <p className="text-sm text-gray-400 italic">No volunteers assigned yet. Be the first!</p>
        ) : (
          <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
            {event.attendees.map(attendee => (
              <li key={attendee.id}>{attendee.name} ({attendee.role})</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};