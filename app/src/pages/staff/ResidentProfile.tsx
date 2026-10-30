import { useNavigate, useParams } from 'react-router-dom';
import { Avatar } from '../../components/Avatar';
import { EmptyState } from '../../components/EmptyState';
import { RiskFlagCard } from '../../components/RiskFlagCard';
import { StageTracker } from '../../components/StageTracker';
import { useToast } from '../../components/Toast';
import { useAppStore } from '../../store/useAppStore';

export function ResidentProfile() {
  const { residentId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const residents = useAppStore((s) => s.residents);
  const observations = useAppStore((s) => s.observations);
  const dismissRiskFlag = useAppStore((s) => s.dismissRiskFlag);

  const resident = residents.find((r) => r.id === parseInt(residentId || '', 10));

  if (!resident) {
    return (
      <div className="page active">
        <div className="page-header">
          <div>
            <div className="section-title">Resident Profile</div>
            <div className="section-desc">Biographical history, care details, and progression tracking</div>
          </div>
          <select value="" onChange={(e) => navigate(`/staff/profile/${e.target.value}`)} style={{ minWidth: 200, width: 'auto' }}>
            <option value="">Select resident...</option>
            {residents.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: 48 }}>
          <EmptyState icon="👤" title="Select a resident" sub="Load sample data first" />
        </div>
      </div>
    );
  }

  const tc = resident.av.includes('teal') ? 'teal' : resident.av.includes('blue') ? 'blue' : resident.av.includes('amber') ? 'amber' : 'coral';
  const obs = observations.filter((o) => o.residentId === resident.id).slice(0, 4);

  return (
    <div className="page active">
      <div className="page-header">
        <div>
          <div className="section-title">Resident Profile</div>
          <div className="section-desc">Biographical history, care details, and progression tracking</div>
        </div>
        <select value={resident.id} onChange={(e) => navigate(`/staff/profile/${e.target.value}`)} style={{ minWidth: 200, width: 'auto' }}>
          <option value="">Select resident...</option>
          {residents.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: 14 }}>
        {resident.riskFlags.map((f, i) => (
          <RiskFlagCard
            key={i}
            flag={f}
            label={f.label}
            onAction={() => {
              dismissRiskFlag(resident.id, i);
              toast(`✓ ${f.action} — marked complete and cleared from active flags`);
            }}
          />
        ))}
      </div>

      <div className="grid-2" style={{ marginBottom: 14, alignItems: 'start' }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
            <Avatar initials={resident.initials} avClass={resident.av} size={52} />
            <div>
              <div style={{ fontSize: 17, fontWeight: 600 }}>{resident.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                Age {resident.age} · {resident.type}
              </div>
              <div style={{ marginTop: 5 }}>
                {resident.type === 'Cognitive Concerns — Not Yet Diagnosed' ? (
                  <span className={`tag tag-${tc}`}>Evaluation Pending</span>
                ) : (
                  <span className={`tag tag-${tc}`}>{resident.stage} Stage</span>
                )}
              </div>
            </div>
          </div>
          <div className="divider" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 12 }}>
            <div>
              <div style={{ color: 'var(--text-muted)', marginBottom: 2 }}>Room</div>
              <div style={{ fontWeight: 500 }}>{resident.room}</div>
            </div>
            <div>
              <div style={{ color: 'var(--text-muted)', marginBottom: 2 }}>Admitted</div>
              <div style={{ fontWeight: 500 }}>{resident.admitted}</div>
            </div>
            <div>
              <div style={{ color: 'var(--text-muted)', marginBottom: 2 }}>Primary Contact</div>
              <div style={{ fontWeight: 500 }}>{resident.contact}</div>
            </div>
            <div>
              <div style={{ color: 'var(--text-muted)', marginBottom: 2 }}>Physician</div>
              <div style={{ fontWeight: 500 }}>{resident.physician}</div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-title" style={{ marginBottom: 10 }}>
            Dementia Progression
          </div>
          <StageTracker stageIdx={resident.stageIdx} />
          <div className="divider" />
          <div className="card-title" style={{ marginBottom: 7 }}>
            Key Care Notes
          </div>
          <div style={{ fontSize: 12, color: 'var(--text)', lineHeight: 1.6 }}>{resident.care}</div>
        </div>
      </div>

      <div className="grid-2" style={{ alignItems: 'start' }}>
        <div className="card">
          <div className="card-title" style={{ marginBottom: 10 }}>
            Life Story & Preferences
          </div>
          <div style={{ fontSize: 12, color: 'var(--text)', lineHeight: 1.7, marginBottom: 12 }}>{resident.bio}</div>
          <div className="card-title" style={{ marginBottom: 7 }}>
            Known Preferences
          </div>
          <div>
            {resident.prefs.map((p) => (
              <span className="tag tag-teal" key={p}>
                {p}
              </span>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="card-title" style={{ marginBottom: 10 }}>
            Recent Observations
          </div>
          <div className="tl">
            {obs.length ? (
              obs.map((o) => {
                const t = o.neg.length === 0 ? 'pos' : o.sev === 'Significant' ? 'neg' : 'neu';
                return (
                  <div className="tl-item" key={o.id}>
                    <div className={`tl-dot tl-${t}`}>{t === 'pos' ? '✓' : t === 'neg' ? '!' : '~'}</div>
                    <div className="tl-box">
                      <div className="tl-date">
                        {o.date} · {o.shift}
                      </div>
                      <div className="tl-desc">
                        {o.notes.substring(0, 110)}
                        {o.notes.length > 110 ? '...' : ''}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>No observations recorded yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
