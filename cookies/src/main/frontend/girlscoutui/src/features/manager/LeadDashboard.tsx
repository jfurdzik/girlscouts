import { useEffect, useState } from 'react';
import PageHeader from '../../components/PageHeader';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import { getAllLeads, updateLeadStatus } from '../../lib/api';
import type { BackendLeadCard, LeadStatus } from '../../types';

const STATUS_COLOR: Record<LeadStatus, 'gray' | 'green' | 'amber' | 'blue'> = {
  NEW: 'blue',
  CONTACTED: 'amber',
  JOINED_TROOP: 'green',
  CLOSED: 'gray',
};

export default function LeadDashboard() {
  const [leads, setLeads] = useState<BackendLeadCard[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [schoolFilter, setSchoolFilter] = useState('');

  useEffect(() => {
    getAllLeads()
      .then(setLeads)
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load leads'));
  }, []);

  async function handleStatusChange(id: number, status: LeadStatus) {
    const updated = await updateLeadStatus(id, status);
    setLeads(prev => prev.map(l => (l.id === id ? updated : l)));
  }

  const filtered = schoolFilter
    ? leads.filter(l => (l.school ?? '').toLowerCase().includes(schoolFilter.toLowerCase()))
    : leads;

  const bySchool = new Map<string, number>();
  for (const lead of leads) {
    const key = lead.school || 'Unknown';
    bySchool.set(key, (bySchool.get(key) ?? 0) + 1);
  }

  return (
    <div>
      <PageHeader title="Leads" subtitle={`${leads.length} total leads`} />
      {error && <Card className="mb-4 text-sm text-red-600">{error}</Card>}

      <div className="flex flex-wrap gap-2 mb-4">
        {[...bySchool.entries()].map(([school, count]) => (
          <button
            key={school}
            onClick={() => setSchoolFilter(schoolFilter === school ? '' : school)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              schoolFilter === school ? 'bg-brand text-white border-brand' : 'bg-white text-gray-600 border-gray-200'
            }`}
          >
            {school} ({count})
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map(lead => (
          <Card key={lead.id}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900 truncate">{lead.parentName}</h3>
                  <Badge color={STATUS_COLOR[lead.status]}>{lead.status.replace('_', ' ')}</Badge>
                </div>
                <p className="text-xs text-gray-500">{lead.email} {lead.phone ? `· ${lead.phone}` : ''}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {lead.childName ? `Child: ${lead.childName} · ` : ''}
                  {lead.school ? `${lead.school} · ` : ''}
                  {lead.interest}
                </p>
                {lead.notes && <p className="text-sm text-gray-600 mt-2">{lead.notes}</p>}
              </div>

              <select
                value={lead.status}
                onChange={e => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 shrink-0"
              >
                <option value="NEW">New</option>
                <option value="CONTACTED">Contacted</option>
                <option value="JOINED_TROOP">Joined Troop</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>
          </Card>
        ))}
        {filtered.length === 0 && <p className="text-sm text-gray-400">No leads found.</p>}
      </div>
    </div>
  );
}
