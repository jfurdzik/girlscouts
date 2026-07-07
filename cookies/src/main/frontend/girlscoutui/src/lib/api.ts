import type { GirlScoutEvent } from '../types';
import { MOCK_EVENTS } from '../data/mockEvents';

const BASE_URL = '/api/events';

async function tryFetch<T>(
  url: string,
  options?: RequestInit
): Promise<T | null> {
  try {
    const res = await fetch(url, options);

    if (!res.ok) return null;

    return (await res.json()) as T;
  } catch {
    return null;
  }
}

// =========================
// Events
// =========================

export async function getEvents(): Promise<GirlScoutEvent[]> {
  const data = await tryFetch<GirlScoutEvent[]>(BASE_URL);
  return data ?? MOCK_EVENTS;
}

export async function getEventById(
  id: string
): Promise<GirlScoutEvent | undefined> {
  const data = await tryFetch<GirlScoutEvent>(
    `${BASE_URL}/${id}`
  );

  return data ?? MOCK_EVENTS.find(e => e.id === id);
}

export async function signUpForEvent(
  eventId: string,
  volunteer: {
    name: string;
    email: string;
  }
): Promise<{ success: boolean }> {
  const data = await tryFetch<{ success: boolean }>(
    `${BASE_URL}/${eventId}/signup`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(volunteer),
    }
  );

  return data ?? { success: true };
}

// =========================
// Lead Capture
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
  lead: LeadSubmission
): Promise<{ success: boolean }> {
  const data = await tryFetch<{ success: boolean }>(
    '/api/leads',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(lead),
    }
  );

  return data ?? { success: true };
}

export interface VolunteerContact {
  id: string;
  name: string;
  school: string;
  email: string;
}

export async function getVolunteer(
  id: string
): Promise<VolunteerContact | null> {
  return await tryFetch<VolunteerContact>(
    `/api/users/${id}`
  );
}