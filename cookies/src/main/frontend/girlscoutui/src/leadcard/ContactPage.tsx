import { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

import Card from '../components/Card';
import Button from '../components/Button';
import PageHeader from '../components/PageHeader';
import { getVolunteer, type VolunteerContact, submitLead } from '../lib/api';

export default function ContactPage() {
    const volunteerId =
        new URLSearchParams(window.location.search).get('volunteer') ?? '';

    const [form, setForm] = useState({
        parentName: '',
        email: '',
        phone: '',
        childName: '',
        school: '',
        grade: '',
        interest: 'Joining a Troop',
        notes: '',
    });

    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    function update<K extends keyof typeof form>(field: K, value: string) {
        setForm(prev => ({
            ...prev,
            [field]: value,
        }));
    }


    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        setLoading(true);

        const result = await submitLead(form);

        setLoading(false);

        if (result.success) {
            setSubmitted(true);
        } else {
            alert('Unable to submit. Please try again.');
        }
    }


    if (submitted) {
        return (
            <main className="min-h-screen bg-[#f4f7f4] flex items-center justify-center p-4">
                <Card className="max-w-md w-full text-center space-y-4">

                    <CheckCircle2
                        size={64}
                        className="mx-auto text-brand"
                    />

                    <PageHeader
                        title="Thank You!"
                        subtitle="Your information has been sent. A volunteer will reach out soon."
                    />

                </Card>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#f4f7f4] py-8 px-4">

            <div className="mx-auto max-w-md">

                <Card>

                    <PageHeader
                        title="Interested in Girl Scouts?"
                        subtitle="Fill out this quick form and we'll help you find a troop that's right for your family."
                    />

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-4 mt-6"
                    >

                        <Input
                            label="Parent Name"
                            value={form.parentName}
                            onChange={v => update('parentName', v)}
                        />

                        <Input
                            label="Email"
                            type="email"
                            value={form.email}
                            onChange={v => update('email', v)}
                        />

                        <Input
                            label="Phone"
                            value={form.phone}
                            onChange={v => update('phone', v)}
                        />

                        <Input
                            label="Girl's Name"
                            value={form.childName}
                            onChange={v => update('childName', v)}
                        />

                        <Input
                            label="School"
                            value={form.school}
                            onChange={v => update('school', v)}
                        />

                        <Input
                            label="Grade"
                            value={form.grade}
                            onChange={v => update('grade', v)}
                        />

                        <div>
                            <label className="text-sm font-medium">
                                Interested In
                            </label>

                            <select
                                className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2"
                                value={form.interest}
                                onChange={e =>
                                    update('interest', e.target.value)
                                }
                            >
                                <option>Joining a Troop</option>
                                <option>Volunteering</option>
                                <option>Both</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-sm font-medium">
                                Questions / Notes
                            </label>

                            <textarea
                                rows={4}
                                className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2"
                                value={form.notes}
                                onChange={e =>
                                    update('notes', e.target.value)
                                }
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? 'Submitting...' : 'Submit'}
                        </Button>

                    </form>

                </Card>

            </div>

        </main>
    );
}

interface InputProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    type?: string;
}

function Input({
    label,
    value,
    onChange,
    type = 'text',
}: InputProps) {
    return (
        <div>
            <label className="text-sm font-medium">
                {label}
            </label>

            <input
                type={type}
                className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2"
                value={value}
                onChange={e => onChange(e.target.value)}
                required
            />
        </div>
    );
}