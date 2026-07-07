// src/features/events/EventDetail.tsx
import { useState } from 'react';
import { ArrowLeft, MapPin, Clock, Mail, Users, CalendarDays, Check } from 'lucide-react';
import type { GirlScoutEvent } from '../../types';
import { signUpForEvent } from '../../lib/api';
import { SignUpForm } from './SignUpForm';

interface EventDetailProps {
  event: GirlScoutEvent;
  onBack: () => void;
  onSignUpSuccess: (eventId: string) => void;
}

export function EventDetail({ event, onBack, onSignUpSuccess }: EventDetailProps) {
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const slotsTotal = event.slotsTotal ?? event.slotsAvailable;
  const full = event.slotsAvailable <= 0;

  async function handleConfirmSignUp(volunteer: { name: string; email: string }) {
    setSubmitting(true);
    const result = await signUpForEvent(event.id, volunteer);
    setSubmitting(false);
    setShowForm(false);
    if (result.success) {
      setIsSignedUp(true);
      onSignUpSuccess(event.id);
    }
  }

  return (
    <div className="pb-8 max-w-md mx-auto">
      {/* Hero */}
      <div className="bg-brand px-4 pt-4 pb-8">
        <button onClick={onBack} className="flex items-center gap-1.5 text-green-100 hover:text-white transition-colors mb-4">
          <ArrowLeft size={18} />
          <span className="text-sm">Back to Calendar</span>
        </button>

        <span className="inline-block bg-white/20 text-white text-xs px-2.5 py-1 rounded-full mb-3">
          {event.serviceUnit}
        </span>

        <h1 className="text-white text-xl font-bold leading-tight mb-1">{event.title}</h1>
        <p className="text-green-100 text-sm">{event.location}</p>

        <div className="mt-3 inline-flex items-center gap-2 bg-white/20 rounded-full px-3 py-1.5">
          <CalendarDays size={13} className="text-green-100" />
          <span className="text-green-100 text-sm">{event.date}</span>
        </div>
      </div>

      {/* Slots counter */}
      <div className="mx-4 -mt-4 bg-white rounded-2xl shadow-md border border-gray-100 px-5 py-4 flex items-center justify-between">
        <div>
          <div className="text-gray-500 text-xs mb-1">Volunteer Slots</div>
          <div className="flex gap-1.5 items-center flex-wrap">
            {Array.from({ length: slotsTotal }).map((_, i) => (
              <div
                key={i}
                className={`w-4 h-4 rounded-full border-2 ${
                  i < slotsTotal - event.slotsAvailable ? 'bg-brand border-brand' : 'bg-gray-50 border-gray-300'
                }`}
              />
            ))}
            <span className="text-gray-700 font-semibold text-sm ml-1">
              {event.slotsAvailable} of {slotsTotal} open
            </span>
          </div>
        </div>
        {full ? (
          <span className="bg-gray-100 text-gray-500 px-3 py-1.5 rounded-xl text-xs font-medium">Full</span>
        ) : (
          <span className="bg-brand-light text-brand-dark px-3 py-1.5 rounded-xl text-xs font-semibold">Open</span>
        )}
      </div>

      {/* Details */}
      <div className="px-4 mt-4 space-y-3">
        <DetailCard title="Date &amp; Time">
          <DetailRow icon={<CalendarDays size={16} className="text-brand" />} label="Date" value={event.date} />
          <DetailRow icon={<Clock size={16} className="text-brand" />} label="Time" value={event.time} />
        </DetailCard>

        <DetailCard title="Location">
          <DetailRow icon={<MapPin size={16} className="text-brand" />} label="Address" value={event.location} />
          <DetailRow icon={<MapPin size={16} className="text-blue-400" />} label="Zip Code" value={event.zipCode} />
        </DetailCard>

        <DetailCard title="Event Leads &amp; Contacts">
          <div className="space-y-3">
            {event.contacts.map(contact => (
              <div key={contact.id} className="flex items-center gap-3">
                <div className="w-9 h-9 bg-brand-light rounded-full flex items-center justify-center shrink-0">
                  <span className="text-brand-dark font-semibold text-xs">
                    {contact.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="min-w-0">
                  <div className="text-gray-900 font-medium text-sm truncate">
                    {contact.name} <span className="text-xs text-gray-400 font-normal">({contact.role})</span>
                  </div>
                  <div className="text-gray-400 text-xs truncate flex items-center gap-1">
                    <Mail size={11} /> {contact.email}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DetailCard>

        <DetailCard title="People Signed Up">
          <p className="text-xs text-gray-500 mb-3 flex items-center gap-1.5">
            <Users size={13} /> {event.slotsAvailable} remaining shift{event.slotsAvailable === 1 ? '' : 's'} available
          </p>
          {event.attendees.length === 0 ? (
            <p className="text-sm text-gray-400 italic">No volunteers assigned yet. Be the first!</p>
          ) : (
            <ul className="space-y-1.5">
              {event.attendees.map(attendee => (
                <li key={attendee.id} className="text-sm text-gray-700 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand" />
                  {attendee.name} <span className="text-xs text-gray-400">({attendee.role})</span>
                </li>
              ))}
            </ul>
          )}
        </DetailCard>

        {event.description && (
          <DetailCard title="Details">
            <p className="text-gray-600 text-sm leading-relaxed">{event.description}</p>
          </DetailCard>
        )}
      </div>

      {/* CTA */}
      <div className="px-4 mt-5">
        {isSignedUp ? (
          <div className="flex items-center justify-center gap-2 bg-brand-light text-brand-dark py-3.5 rounded-xl font-semibold text-sm border border-brand/20">
            <Check size={18} />
            You're Signed Up!
          </div>
        ) : full ? (
          <div className="bg-gray-100 text-gray-400 py-3.5 rounded-xl text-sm font-semibold text-center">
            This event is full
          </div>
        ) : (
          <button
            onClick={() => setShowForm(true)}
            className="w-full bg-brand hover:bg-brand-dark text-white py-3.5 rounded-xl font-semibold text-sm shadow-sm transition-colors"
          >
            Sign Up For Event
          </button>
        )}
      </div>

      {showForm && (
        <SignUpForm
          submitting={submitting}
          onCancel={() => setShowForm(false)}
          onSubmit={handleConfirmSignUp}
        />
      )}
    </div>
  );
}

function DetailCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
      <h3 className="text-gray-900 font-semibold text-sm mb-3">{title}</h3>
      {children}
    </div>
  );
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 py-1">
      <div className="shrink-0">{icon}</div>
      <div className="text-gray-400 text-xs w-16 shrink-0">{label}</div>
      <div className="text-gray-700 text-sm flex-1">{value}</div>
    </div>
  );
}
