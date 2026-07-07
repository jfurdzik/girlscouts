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
  status?: EventStatus;
}

// =========================
// Raw backend shapes (what the Spring Boot API actually returns/accepts).
// Kept separate from the UI-friendly GirlScoutEvent shape above so existing
// components don't need to change — see lib/api.ts for the mapping layer.
// =========================

export type BackendEventStatus = 'OPEN' | 'FULL' | 'CANCELLED';

export interface BackendEvent {
  eventId: number;
  eventName: string;
  eventDate: string; // 'YYYY-MM-DD'
  startTime: string; // 'HH:mm:ss'
  endTime: string;
  description: string;
  schoolId: number | null;
  location: string | null;
  capacity: number | null;
  status: BackendEventStatus;
  followUpInfo: string | null;
}

export interface BackendAssignment {
  assignmentId: number;
  userId: number | null;
  eventId: number | null;
  status: string | null;
}

export type LeadStatus = 'NEW' | 'CONTACTED' | 'JOINED_TROOP' | 'CLOSED';

export interface BackendLeadCard {
  id: number;
  parentName: string;
  email: string;
  phone: string | null;
  childName: string | null;
  school: string | null;
  grade: string | null;
  interest: string | null;
  notes: string | null;
  status: LeadStatus;
  submissionDate: string;
  user: { id: number; firstName: string; lastName: string } | null;
}

export interface BackendUser {
  id: number;
  firstName: string;
  lastName: string;
  serviceUnit: string | null;
  username: string | null;
  email: string | null;
  role: 'ADMIN' | 'STAFF' | 'VOLUNTEER';
  assignmentCount: number;
}

export interface AuthUser {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'STAFF' | 'VOLUNTEER';
}

export interface NotificationSettingsDTO {
  id: number;
  signupEmailsEnabled: boolean;
  boostEmailsEnabled: boolean;
  lowCoverageReminderEnabled: boolean;
  reminderDaysBefore: number;
  reminderThresholdPercent: number;
  signupEmailSubject: string;
  signupEmailBody: string;
  boostEmailSubject: string;
  boostEmailBody: string;
  reminderEmailSubject: string;
  reminderEmailBody: string;
}

export interface DashboardMetrics {
  upcomingEvents: number;
  openEvents: number;
  totalVolunteers: number;
  totalLeads: number;
  leadsThisMonth: number;
  averageCoveragePercent: number;
}
