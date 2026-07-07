import type { GirlScoutEvent } from '../types';
import { MOCK_EVENTS } from '../data/mockEvents';

// Mirrors the convention already used by the Spring Boot backend
// (see UsersController -> /api/users). Once an EventsController is added
// on the backend with the same shape, this file needs no changes -
// it will stop silently falling back to mock data.
const BASE_URL = '/api/events';

async function tryFetch<T>(url: string, options?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(url, options);
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    // Backend not implemented yet / unreachable - caller falls back to mock data.
    return null;
  }
}

export async function getEvents(): Promise<GirlScoutEvent[]> {
  const data = await tryFetch<GirlScoutEvent[]>(BASE_URL);
  return data ?? MOCK_EVENTS;
}

export async function getEventById(id: string): Promise<GirlScoutEvent | undefined> {
  const data = await tryFetch<GirlScoutEvent>(`${BASE_URL}/${id}`);
  return data ?? MOCK_EVENTS.find(e => e.id === id);
}

export async function signUpForEvent(
  eventId: string,
  volunteer: { name: string; email: string }
): Promise<{ success: boolean }> {
  const data = await tryFetch<{ success: boolean }>(`${BASE_URL}/${eventId}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(volunteer),
  });
  // Optimistic success if backend isn't wired up yet, so the demo flow still works.
  return data ?? { success: true };
}
