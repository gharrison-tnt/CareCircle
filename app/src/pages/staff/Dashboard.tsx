import { useNavigate } from 'react-router-dom';
import { EmptyState } from '../../components/EmptyState';
import { MetricTile } from '../../components/MetricTile';
import { ResidentRow } from '../../components/ResidentRow';
import { RiskFlagCard } from '../../components/RiskFlagCard';
import { useAppStore } from '../../store/useAppStore';
import { useToast } from '../../components/Toast';

export function Dashboard() {
  const residents = useAppStore((s) => s.residents);
  const observations = useAppStore((s) => s.observations);
  const navigate = useNavigate();
  const toast = useToast();

  const redFlags = residents.filter((r) => r.riskFlags.some((f) => f.level === 'red')).length;
  const overdue = residents.filter((r) => r.updateOverdue).length;

  const allFlags = residents.flatMap((r) =>
    r.riskFlags.map((f) => ({ flag: f, resName: r.name.split(' ').slice(0, 2).join(' '), resId: r.id }))
  );

  const recentObs = observations.slice(0, 6);

  function handleFlagAction(resId: number, action: string) {
    const isUpdateAction = action.includes('update') || action.includes('Generate');
    if (isUpdateAction) {
      navigate(`/staff/updates?resident=${resId}`);
      toast(`${action} — navigating to Family Updates`);
      return;
    }
    const r = residents.find((x) => x.id === resId);
    navigate(`/staff/profile/${resId}`);
    toast(`${action} — review on ${r ? r.name.split(' ')[0] : 'the resident'}'s profile`);
  }

  return (
    <div className="page active">
      <div className="page-header">
        <div>
          <div className="section-title">Care Dashboard</div>
          <div className="section-desc">Real-time risk triage, resident wellbeing, and family communication status</div>
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      <div className="grid-4" style={{ marginBottom: 16 }}>
        <MetricTile label="Residents" value={residents.length || '—'} sub="In memory care" tone="teal" />
        <MetricTile label="Needs Attention" value={residents.length ? redFlags + overdue : '—'} sub="Action required" tone="red" />
        <MetricTile label="Updates Pending" value={residents.length ? 3 : '—'} sub="Awaiting review" tone="amber" />
        <MetricTile label="Family Reads" value={residents.length ? '84%' : '—'} sub="Open rate this month" tone="blue" />
      </div>

      <div className="grid-2" style={{ marginBottom: 16 }}>
        <div className="card">
          <div className="card-title" style={{ marginBottom: 12 }}>
            ⚠ Director Risk Triage
          </div>
          {allFlags.length ? (
            allFlags.map(({ flag, resName, resId }, i) => (
              <RiskFlagCard key={i} flag={flag} label={`${resName} — ${flag.label}`} onAction={() => handleFlagAction(resId, flag.action)} />
            ))
          ) : residents.length ? (
            <div style={{ fontSize: 13, color: 'var(--teal-dark)', padding: 8 }}>No active risk flags</div>
          ) : (
            <EmptyState icon="✓" title="No active flags" sub="Load sample data to see risk triage" />
          )}
        </div>
        <div className="card">
          <div className="card-title" style={{ marginBottom: 4 }}>
            Resident Status
          </div>
          <div className="card-sub" style={{ marginBottom: 12 }}>
            Click any resident to view their full profile
          </div>
          {residents.length ? (
            residents.map((r) => <ResidentRow key={r.id} resident={r} />)
          ) : (
            <EmptyState icon="🏥" title="No residents yet" sub="Click Load Sample Data to begin" />
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-title" style={{ marginBottom: 12 }}>
          Recent Observations
        </div>
        <div className="tl">
          {recentObs.length ? (
            recentObs.map((o) => {
              const r = residents.find((x) => x.id === o.residentId);
              const t = o.neg.length === 0 ? 'pos' : o.sev === 'Significant' ? 'neg' : 'neu';
              return (
                <div className="tl-item" key={o.id}>
                  <div className={`tl-dot tl-${t}`}>{t === 'pos' ? '✓' : t === 'neg' ? '!' : '~'}</div>
                  <div className="tl-box">
                    <div className="tl-date">
                      {o.date} · {o.shift}
                      {r ? ` · ${r.name.split(' ').slice(0, 2).join(' ')}` : ''}
                    </div>
                    <div className="tl-desc">
                      {o.notes.substring(0, 100)}
                      {o.notes.length > 100 ? '...' : ''}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <EmptyState icon="📋" title="No observations yet" />
          )}
        </div>
      </div>
    </div>
  );
}
