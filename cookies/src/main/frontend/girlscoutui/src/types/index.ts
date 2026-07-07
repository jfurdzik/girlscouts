// src/types/index.ts

export type EventStatus = 'open' | 'full' | 'cancelled';

export interface Contact {
  id: string;
  name: string;
  role: 'Staff' | 'Volunteer' | 'Manager';
  email: string;
  phone?: string;
}

export interface GirlScoutEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g., "10:00 AM - 2:00 PM"
  location: string;
  zipCode: string;
  serviceUnit: string;
  description: string;
  contacts: Contact[]; // Staff/Volunteers managing it
  attendees: Contact[]; // People who already signed up
  slotsAvailable: number;
  slotsTotal?: number;
  status?: EventStatus;
}
