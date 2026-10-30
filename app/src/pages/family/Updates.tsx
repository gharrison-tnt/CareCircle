import { EmptyState } from '../../components/EmptyState';
import { StageTracker } from '../../components/StageTracker';
import { generateFamilyDocument } from '../../services/documentExport';
import { useAppStore } from '../../store/useAppStore';

const VS_ICON = { green: '✅', amber: '⚠️', blue: '💙' } as const;

export function FamilyUpdates() {
  const residents = useAppStore((s) => s.residents);
  const observations = useAppStore((s) => s.observations);
  const viewingFamilyResidentId = useAppStore((s) => s.viewingFamilyResidentId);
  const updatesByResidentId = useAppStore((s) => s.updatesByResidentId);

  const resident = residents.find((r) => r.id === viewingFamilyResidentId);
  const update = resident ? updatesByResidentId[resident.id] : null;

  if (!resident) {
    return (
      <div className="fam-page active">
        <EmptyState icon="👨‍👩‍👧" title="Select a resident in the mode bar" sub="Choose whose family you're viewing as" />
      </div>
    );
  }

  const obsCount = observations.filter((o) => o.residentId === resident.id).length;
  const days = Math.max(0, Math.round((Date.now() - new Date(resident.admitted).getTime()) / 86400000));
  const daysDisplay = isNaN(days) || days > 3000 ? '900+' : days;
  const vs = update?.visitSignal;

  return (
    <div className="fam-page active">
      {vs && (
        <div className={`visit-signal ${vs.type}`}>
          <div className="vs-icon">{VS_ICON[vs.type]}</div>
          <div style={{ flex: 1 }}>
            <div className="vs-title">{vs.title}</div>
            <div className="vs-body">{vs.body}</div>
            {vs.windows && (
              <div className="vs-windows">
                {vs.windows.map((w, i) => (
                  <span className="vs-window" key={i}>
                    {w}
                  </span>
                ))}
              </div>
            )}
            {vs.bring && (
              <div className="vs-bring">
                <strong>Bring:</strong> {vs.bring}
              </div>
            )}
            {vs.avoid && (
              <div className="vs-bring">
                <strong>Avoid:</strong> {vs.avoid}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="fam-hero">
        <div className="fam-hero-name">{resident.name}</div>
        <div className="fam-hero-detail">
          {resident.type} · Room {resident.room}
          {resident.type === 'Cognitive Concerns — Not Yet Diagnosed' ? '' : ` · ${resident.stage} Stage`}
        </div>
        <div className="fam-hero-stats">
          <div className="fam-stat">
            <div className="fam-stat-val">{daysDisplay}</div>
            <div className="fam-stat-label">Days in care</div>
          </div>
          <div className="fam-stat">
            <div className="fam-stat-val">4</div>
            <div className="fam-stat-label">Updates received</div>
          </div>
          <div className="fam-stat">
            <div className="fam-stat-val">{obsCount}</div>
            <div className="fam-stat-label">Observations this week</div>
          </div>
        </div>
      </div>

      <div className="fam-stage-bar">
        <div className="fam-stage-title">
          {resident.type === 'Cognitive Concerns — Not Yet Diagnosed' ? `Monitoring — ${resident.type}` : `${resident.stage} Stage — ${resident.type}`}
        </div>
        <div className="fam-stage-desc">{resident.stageDesc}</div>
        <StageTracker stageIdx={resident.stageIdx} />
      </div>

      {update ? (
        <div className="fam-update">
          <div className="fam-update-hdr">
            <div style={{ fontSize: 14, fontWeight: 600 }}>Weekly Update</div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <span className="fam-new">New</span>
              <span className="fam-update-date">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</span>
              <button className="btn btn-outline" style={{ padding: '4px 10px', fontSize: 11 }} onClick={() => generateFamilyDocument(resident, update)}>
                📄 Download
              </button>
            </div>
          </div>
          <div className="fam-greeting">{update.greeting}</div>
          <div className="fam-sec">
            <div className="fam-sec-label">This week</div>
            <div className="fam-sec-body">{update.whatWeObserved}</div>
          </div>
          <div className="fam-sec">
            <div className="fam-sec-label">Understanding the journey</div>
            <div className="fam-sec-body">{update.whatThisMeans}</div>
          </div>
          {update.brightMoment && (
            <div className="fam-bright">
              <div className="fam-bright-label">✨ A moment worth sharing</div>
              <div className="fam-bright-body">{update.brightMoment}</div>
            </div>
          )}
          <div className="fam-sec">
            <div className="fam-sec-label">Your next visit</div>
            <div className="fam-sec-body">{update.howToConnect}</div>
          </div>
          {update.griefNote && (
            <div className="fam-grief">
              <div className="fam-grief-label">💜 A note for your family</div>
              <div className="fam-grief-body">{update.griefNote}</div>
            </div>
          )}
          <div className="fam-sec">
            <div className="fam-sec-label">Questions for your next care conference</div>
            {update.questionsForFamily?.map((q, i) => (
              <div className="fam-q-item" style={{ padding: '3px 0', display: 'flex', gap: 7, fontSize: 13, color: 'var(--text)' }} key={i}>
                <span style={{ color: 'var(--purple)' }}>›</span>
                {q}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12, fontSize: 13, color: 'var(--text-muted)', fontStyle: 'italic' }}>{update.closingNote}</div>
          <div className="disclaimer">
            This update reflects caregiver observations and is not a medical assessment. For clinical concerns, please contact the care team
            directly.
          </div>
        </div>
      ) : (
        <EmptyState icon="💌" title="No update yet" sub="Go to Staff View → Family Updates → select resident → Generate Update" />
      )}
    </div>
  );
}
