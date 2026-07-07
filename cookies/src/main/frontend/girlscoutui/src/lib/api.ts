import type {
  GirlScoutEvent,
  Contact,
  BackendEvent,
  BackendAssignment,
  BackendLeadCard,
  BackendUser,
  AuthUser,
  NotificationSettingsDTO,
  DashboardMetrics,
  LeadStatus,
} from '../types';
import { MOCK_EVENTS } from '../data/mockEvents';

const BASE_URL = '/api/events';

async function tryFetch<T>(url: string, options?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(url, { credentials: 'include', ...options });
    if (!res.ok) return null;
    if (res.status === 204) return {} as T; // no content (deletes)
    return (await res.json()) as T;
  } catch {
    // Backend not implemented yet / unreachable - caller falls back to mock data.
    return null;
  }
}

/** Same as tryFetch, but surfaces the real error message instead of silently
 *  returning null — used for manager actions where the user needs to know
 *  *why* something failed (e.g. "event is full", validation errors). */
async function fetchOrThrow<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, { credentials: 'include', ...options });
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      message = body.message ?? message;
    } catch {
      /* ignore parse failure, use default message */
    }
    throw new Error(message);
  }
  if (res.status === 204) return {} as T;
  return (await res.json()) as T;
}

function formatTime(time: string | null): string {
  if (!time) return '';
  const [h, m] = time.split(':');
  const hour = parseInt(h, 10);
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:${m} ${suffix}`;
}

/** Maps the raw backend Event + the volunteers assigned to it into the
 *  UI-friendly GirlScoutEvent shape the calendar/detail components expect.
 *  There's no capacity/slot count in this app — attendee count is just shown
 *  as-is, uncapped. */
function mapEvent(event: BackendEvent, attendees: Contact[]): GirlScoutEvent {
  return {
    id: String(event.eventId),
    title: event.eventName,
    date: event.eventDate,
    time: `${formatTime(event.startTime)} - ${formatTime(event.endTime)}`,
    location: event.location ?? '',
    zipCode: '',
    serviceUnit: '',
    description: event.description ?? '',
    contacts: [],
    attendees,
    status: event.status.toLowerCase() as GirlScoutEvent['status'],
  };
}

function buildAttendeesByEvent(
  assignments: BackendAssignment[],
  users: BackendUser[]
): Map<number, Contact[]> {
  const usersById = new Map(users.map(u => [u.id, u]));
  const map = new Map<number, Contact[]>();

  for (const a of assignments) {
    if (a.eventId == null || a.userId == null) continue;
    if (a.status?.toUpperCase() === 'CANCELLED') continue;

    const user = usersById.get(a.userId);
    const contact: Contact = {
      id: String(a.userId),
      name: user ? `${user.firstName} ${user.lastName}`.trim() : `Volunteer #${a.userId}`,
      role: 'Volunteer',
      email: user?.email ?? '',
    };

    const list = map.get(a.eventId) ?? [];
    list.push(contact);
    map.set(a.eventId, list);
  }

  return map;
}

// =========================
// Events (public)
// =========================

export async function getEvents(): Promise<GirlScoutEvent[]> {
  const [events, assignments, users] = await Promise.all([
    tryFetch<BackendEvent[]>(BASE_URL),
    tryFetch<BackendAssignment[]>('/api/assignments'),
    tryFetch<BackendUser[]>('/api/users'),
  ]);

  if (!events) return MOCK_EVENTS;

  const attendeesByEvent = buildAttendeesByEvent(assignments ?? [], users ?? []);

  return events.map(e => mapEvent(e, attendeesByEvent.get(e.eventId) ?? []));
}

export async function getEventById(id: string): Promise<GirlScoutEvent | undefined> {
  const [event, assignments, users] = await Promise.all([
    tryFetch<BackendEvent>(`${BASE_URL}/${id}`),
    tryFetch<BackendAssignment[]>(`/api/assignments`),
    tryFetch<BackendUser[]>('/api/users'),
  ]);

  if (!event) return MOCK_EVENTS.find(e => e.id === id);

  const attendeesByEvent = buildAttendeesByEvent(assignments ?? [], users ?? []);

  return mapEvent(event, attendeesByEvent.get(event.eventId) ?? []);
}

export async function signUpForEvent(
  eventId: string,
  volunteer: { name: string; email: string }
): Promise<{ success: boolean; message?: string }> {
  try {
    await fetchOrThrow(`${BASE_URL}/${eventId}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(volunteer),
    });
    return { success: true };
  } catch (err) {
    return { success: false, message: err instanceof Error ? err.message : 'Sign up failed' };
  }
}

// =========================
// Lead Capture (public submit)
// =========================

export interface LeadSubmission {
  parentName: string;
  email: string;
  phone: string;
  childName: string;
  school: string;
  grade: string;
  interest: string;
  notes: string;
}

export async function submitLead(
  lead: LeadSubmission,
  volunteerId?: string
): Promise<{ success: boolean }> {
  const query = volunteerId ? `?volunteerId=${encodeURIComponent(volunteerId)}` : '';
  const data = await tryFetch<BackendLeadCard>(`/api/leadcards${query}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(lead),
  });
  return { success: data != null };
}

export interface VolunteerContact {
  id: string;
  name: string;
  school: string;
  email: string;
}

export async function getVolunteer(id: string): Promise<VolunteerContact | null> {
  const user = await tryFetch<BackendUser>(`/api/users/${id}`);
  if (!user) return null;
  return {
    id: String(user.id),
    name: `${user.firstName} ${user.lastName}`.trim(),
    school: '',
    email: user.email ?? '',
  };
}

// =========================
// Auth
// =========================

export async function login(username: string, password: string): Promise<AuthUser> {
  return fetchOrThrow<AuthUser>('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
}

export async function logout(): Promise<void> {
  await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  return tryFetch<AuthUser>('/api/auth/me');
}

// =========================
// Manager: Events
// =========================

export async function getRawEvents(): Promise<BackendEvent[]> {
  return fetchOrThrow<BackendEvent[]>(BASE_URL);
}

export async function createEvent(event: Partial<BackendEvent>): Promise<BackendEvent> {
  return fetchOrThrow<BackendEvent>(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event),
  });
}

export async function updateEvent(eventId: number, event: Partial<BackendEvent>): Promise<BackendEvent> {
  return fetchOrThrow<BackendEvent>(`${BASE_URL}/${eventId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event),
  });
}

export async function deleteEvent(eventId: number): Promise<void> {
  await fetchOrThrow(`${BASE_URL}/${eventId}`, { method: 'DELETE' });
}

export async function boostEvent(
  eventId: number,
  audience: 'ALL' | 'SERVICE_UNIT' | 'SCHOOL' | 'PREVIOUS',
  value?: string
): Promise<{ sent: number }> {
  return fetchOrThrow(`${BASE_URL}/${eventId}/boost`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ audience, value }),
  });
}

export async function getAllAssignments(): Promise<BackendAssignment[]> {
  return fetchOrThrow<BackendAssignment[]>('/api/assignments');
}

// =========================
// Manager: Leads
// =========================

export async function getAllLeads(): Promise<BackendLeadCard[]> {
  return fetchOrThrow<BackendLeadCard[]>('/api/leadcards');
}

export async function updateLeadStatus(id: number, status: LeadStatus): Promise<BackendLeadCard> {
  return fetchOrThrow<BackendLeadCard>(`/api/leadcards/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
}

// =========================
// Manager: Users / Volunteers
// =========================

export async function getAllUsers(): Promise<BackendUser[]> {
  return fetchOrThrow<BackendUser[]>('/api/users');
}

// =========================
// Manager: Notification Settings
// =========================

export async function getNotificationSettings(): Promise<NotificationSettingsDTO> {
  return fetchOrThrow<NotificationSettingsDTO>('/api/notification-settings');
}

export async function updateNotificationSettings(
  settings: NotificationSettingsDTO
): Promise<NotificationSettingsDTO> {
  return fetchOrThrow<NotificationSettingsDTO>('/api/notification-settings', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings),
  });
}

// =========================
// Manager: Dashboard
// =========================

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  return fetchOrThrow<DashboardMetrics>('/api/dashboard/metrics');
}
