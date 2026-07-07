import { useEffect, useState } from 'react';
import { CalendarDays, DoorOpen, Users, Contact, TrendingUp, Gauge } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import Card from '../../components/Card';
import { getDashboardMetrics } from '../../lib/api';
import type { DashboardMetrics } from '../../types';

const TILES: { key: keyof DashboardMetrics; label: string; icon: typeof CalendarDays; suffix?: string }[] = [
  { key: 'upcomingEvents', label: 'Upcoming Events', icon: CalendarDays },
  { key: 'openEvents', label: 'Open Events', icon: DoorOpen },
  { key: 'totalVolunteers', label: 'Volunteers', icon: Users },
  { key: 'totalLeads', label: 'Total Leads', icon: Contact },
  { key: 'leadsThisMonth', label: 'Leads This Month', icon: TrendingUp },
  { key: 'averageCoveragePercent', label: 'Avg. Coverage', icon: Gauge, suffix: '%' },
];

export default function DashboardHome() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDashboardMetrics()
      .then(setMetrics)
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load metrics'));
  }, []);

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="A quick snapshot of what's happening" />

      {error && (
        <Card className="mb-4 text-sm text-red-600">Couldn't load metrics: {error}</Card>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {TILES.map(({ key, label, icon: Icon, suffix }) => (
          <Card key={key} className="flex flex-col gap-2">
            <div className="w-8 h-8 rounded-full bg-brand-light flex items-center justify-center">
              <Icon size={16} className="text-brand-dark" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {metrics ? Math.round((metrics[key] as number) * 10) / 10 : '—'}
                {suffix ?? ''}
              </div>
              <div className="text-xs text-gray-500">{label}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
