import { useEffect, useState } from 'react';
import PageHeader from '../../components/PageHeader';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { getNotificationSettings, updateNotificationSettings } from '../../lib/api';
import type { NotificationSettingsDTO } from '../../types';

export default function NotificationSettingsPage() {
  const [settings, setSettings] = useState<NotificationSettingsDTO | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getNotificationSettings()
      .then(setSettings)
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load settings'));
  }, []);

  function field<K extends keyof NotificationSettingsDTO>(key: K, value: NotificationSettingsDTO[K]) {
    if (!settings) return;
    setSettings({ ...settings, [key]: value });
  }

  async function handleSave() {
    if (!settings) return;
    setSaving(true);
    setError(null);
    try {
      const updated = await updateNotificationSettings(settings);
      setSettings(updated);
      setSavedAt(Date.now());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  if (!settings) {
    return (
      <div>
        <PageHeader title="Notification Settings" />
        {error ? <Card className="text-sm text-red-600">{error}</Card> : <p className="text-sm text-gray-400">Loading...</p>}
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Notification Settings" subtitle="Control automatic emails sent by the system" />

      <div className="space-y-4">
        <Card className="space-y-4">
          <Toggle
            label="Volunteer Signup Emails"
            checked={settings.signupEmailsEnabled}
            onChange={v => field('signupEmailsEnabled', v)}
          />
          <Toggle
            label="Boost Emails"
            checked={settings.boostEmailsEnabled}
            onChange={v => field('boostEmailsEnabled', v)}
          />
          <Toggle
            label="Low Coverage Reminder"
            checked={settings.lowCoverageReminderEnabled}
            onChange={v => field('lowCoverageReminderEnabled', v)}
          />
        </Card>

        <Card className="space-y-3">
          <h3 className="font-semibold text-sm text-gray-900">Low Coverage Reminder Timing</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Send this many days before</label>
              <select
                value={settings.reminderDaysBefore}
                onChange={e => field('reminderDaysBefore', Number(e.target.value))}
                className="w-full px-3 py-2 bg-gray-100 rounded-xl text-sm"
              >
                <option value={1}>1 day</option>
                <option value={2}>2 days</option>
                <option value={3}>3 days</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">If coverage below</label>
              <select
                value={settings.reminderThresholdPercent}
                onChange={e => field('reminderThresholdPercent', Number(e.target.value))}
                className="w-full px-3 py-2 bg-gray-100 rounded-xl text-sm"
              >
                <option value={25}>25%</option>
                <option value={50}>50%</option>
                <option value={60}>60%</option>
                <option value={75}>75%</option>
              </select>
            </div>
          </div>
        </Card>

        <TemplateCard
          title="Signup Confirmation Email"
          subject={settings.signupEmailSubject}
          body={settings.signupEmailBody}
          onSubjectChange={v => field('signupEmailSubject', v)}
          onBodyChange={v => field('signupEmailBody', v)}
        />
        <TemplateCard
          title="Boost Email"
          subject={settings.boostEmailSubject}
          body={settings.boostEmailBody}
          onSubjectChange={v => field('boostEmailSubject', v)}
          onBodyChange={v => field('boostEmailBody', v)}
        />
        <TemplateCard
          title="Low Coverage Reminder Email"
          subject={settings.reminderEmailSubject}
          body={settings.reminderEmailBody}
          onSubjectChange={v => field('reminderEmailSubject', v)}
          onBodyChange={v => field('reminderEmailBody', v)}
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex items-center gap-3">
          <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Settings'}</Button>
          {savedAt && <span className="text-xs text-gray-400">Saved!</span>}
        </div>
      </div>
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center justify-between cursor-pointer">
      <span className="text-sm text-gray-700">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`w-11 h-6 rounded-full transition-colors relative ${checked ? 'bg-brand' : 'bg-gray-300'}`}
      >
        <span
          className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0.5'
          }`}
        />
      </button>
    </label>
  );
}

function TemplateCard({
  title, subject, body, onSubjectChange, onBodyChange,
}: {
  title: string; subject: string; body: string;
  onSubjectChange: (v: string) => void; onBodyChange: (v: string) => void;
}) {
  return (
    <Card className="space-y-2">
      <h3 className="font-semibold text-sm text-gray-900">{title}</h3>
      <p className="text-xs text-gray-400">
        Placeholders: {'{volunteerName} {eventName} {eventDate} {eventTime} {location}'}
      </p>
      <input
        value={subject}
        onChange={e => onSubjectChange(e.target.value)}
        className="w-full px-3 py-2 bg-gray-100 rounded-xl text-sm"
        placeholder="Subject"
      />
      <textarea
        value={body}
        onChange={e => onBodyChange(e.target.value)}
        rows={5}
        className="w-full px-3 py-2 bg-gray-100 rounded-xl text-sm"
        placeholder="Body"
      />
    </Card>
  );
}
