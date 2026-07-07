import { useState } from 'react';
import type { FormEvent } from 'react';
import Button from '../../components/Button';

interface SignUpFormProps {
  onSubmit: (volunteer: { name: string; email: string }) => void;
  onCancel: () => void;
  submitting?: boolean;
  error?: string | null;
}

export function SignUpForm({ onSubmit, onCancel, submitting, error }: SignUpFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    onSubmit({ name: name.trim(), email: email.trim() });
  }

  return (
    <div className="fixed inset-0 z-30 flex items-end justify-center bg-black/40">
      <div className="w-full max-w-md bg-white rounded-t-3xl p-5 pb-6 animate-in slide-in-from-bottom">
        <div className="w-10 h-1.5 bg-gray-200 rounded-full mx-auto mb-4" />
        <h2 className="text-lg font-bold text-gray-900 mb-1">Sign Up to Volunteer</h2>
        <p className="text-sm text-gray-500 mb-4">We just need a couple of details to reserve your spot.</p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Full Name</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              type="text"
              placeholder="Jane Doe"
              required
              className="w-full px-3.5 py-2.5 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Email</label>
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              type="email"
              placeholder="jane@example.com"
              required
              className="w-full px-3.5 py-2.5 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" className="flex-1" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={submitting}>
              {submitting ? 'Signing up...' : 'Confirm Sign Up'}
            </Button>
          </div>
          {error && <p className="text-red-600 text-xs text-center">{error}</p>}
        </form>
      </div>
    </div>
  );
}
