export interface LeadSubmission {
    volunteerId: string;

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
    try {
        const response = await fetch('/api/leads', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(lead),
        });

        return {
            success: response.ok,
        };
    } catch {
        return {
            success: false,
        };
    }
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

    const data = await tryFetch<VolunteerContact>(
        `/api/users/${id}`
    );

    return data;
}