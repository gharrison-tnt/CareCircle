import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Avatar } from '../../components/Avatar';
import { CaresActivities, CaresPanel } from '../../components/CaresPanel';
import { useToast } from '../../components/Toast';
import { generateFamilyDocument } from '../../services/documentExport';
import { useAppStore } from '../../store/useAppStore';
import type { FamilyUpdate } from '../../types';

type ItabName = 'narrative' | 'activity' | 'guidance';

export function FamilyUpdatesPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();
  const residents = useAppStore((s) => s.residents);
  const updatesByResidentId = useAppStore((s) => s.updatesByResidentId);
  const generateUpdate = useAppStore((s) => s.generateUpdate);
  const setMode = useAppStore((s) => s.setMode);
  const setViewingFamilyResidentId = useAppStore((s) => s.setViewingFamilyResidentId);

  const [residentId, setResidentId] = useState('');
  const [loading, setLoading] = useState(false);
  const [itab, setItab] = useState<ItabName>('narrative');

  useEffect(() => {
    const fromQuery = searchParams.get('resident');
    if (fromQuery) setResidentId(fromQuery);
  }, [searchParams]);

  const resident = residents.find((r) => r.id === parseInt(residentId, 10));
  const update: FamilyUpdate | null = resident ? updatesByResidentId[resident.id] || null : null;
  const isImported = resident ? resident.id > 1_000_000_000 : false;

  function handleGenerate() {
    if (!resident) return;
    setLoading(true);
    setItab('narrative');
    setTimeout(() => {
      generateUpdate(resident.id);
      setLoading(false);
    }, 700);
  }

  function handleApprove() {
    toast('Update approved and queued for delivery');
    if (resident) setViewingFamilyResidentId(resident.id);
  }

  function handlePreviewFamily() {
    if (!resident || !update) {
      toast('Generate an update first');
      return;
    }
    setViewingFamilyResidentId(resident.id);
    setMode('family');
    navigate('/family/updates');
  }

  function handleDownload() {
    if (!resident || !update) return;
    if (!generateFamilyDocument(resident, update)) toast('Please allow pop-ups to generate the document');
  }

  return (
    <div className="page active">
      <div className="page-header">
        <div>
          <div className="section-title">Family Updates</div>
          <div className="section-desc">AI drafts a personalized update — you review and approve before it's sent</div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <select value={residentId} onChange={(e) => setResidentId(e.target.value)} style={{ minWidth: 200, width: 'auto' }}>
            <option value="">Select resident...</option>
            {residents.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
          <button className="btn btn-primary" onClick={handleGenerate} disabled={!resident}>
            Generate Update
          </button>
        </div>
      </div>

      {!resident && (
        <div className="card" style={{ textAlign: 'center', padding: 48 }}>
          <div style={{ fontSize: 28, marginBottom: 10, opacity: 0.4 }}>💌</div>
          <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 6 }}>Select a resident to generate their family update</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            The AI draws on observations, care notes, biographical history, dementia research, and CARES methodology to write a
            compassionate, personalized report.
          </div>
        </div>
      )}

      {resident && (
        <div>
          {loading && (
            <div className="card">
              <div className="loading-bar">
                <div className="loading-fill" />
              </div>
              <div className="loading-msg">Reviewing care notes and observations...</div>
            </div>
          )}

          {!loading && (
            <div>
              <div className="grid-2" style={{ marginBottom: 14, alignItems: 'start' }}>
                <div className="card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <Avatar initials={resident.initials} avClass={resident.av} size={44} />
                    <div>
                      <div className="card-title">{resident.name}</div>
                      <div className="card-sub">
                        {resident.type}
                        {resident.type === 'Cognitive Concerns — Not Yet Diagnosed' ? '' : ` · ${resident.stage} Stage`} · Room {resident.room}
                      </div>
                    </div>
                  </div>
                  <div className="divider" />
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Current Stage</div>
                    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 3 }}>
                      {resident.stage} — {resident.type}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Contact: {resident.contact}</div>
                  </div>
                </div>
                <div className="card" style={{ background: 'var(--teal-light)', borderColor: 'var(--teal-mid)' }}>
                  <div className="card-title" style={{ color: 'var(--teal-dark)', marginBottom: 3 }}>
                    Draft Ready for Review
                  </div>
                  <div className="card-sub" style={{ marginBottom: 12 }}>
                    Week of {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                  <div className="btn-row">
                    <button className="btn btn-primary" onClick={handleApprove} disabled={!update}>
                      Approve & Send
                    </button>
                    <button className="btn btn-outline" onClick={handleDownload} disabled={!update}>
                      📄 Generate Document
                    </button>
                    <button className="btn btn-outline">Edit Draft</button>
                  </div>
                  <div style={{ marginTop: 8, fontSize: 11, color: 'var(--teal-dark)' }}>⚠ Staff review required before delivery</div>
                </div>
              </div>

              <div className="card">
                <div className="itabs">
                  <button className={`itab${itab === 'narrative' ? ' active' : ''}`} onClick={() => setItab('narrative')}>
                    Family Narrative
                  </button>
                  <button className={`itab${itab === 'activity' ? ' active' : ''}`} onClick={() => setItab('activity')}>
                    Activity Plan
                  </button>
                  <button className={`itab${itab === 'guidance' ? ' active' : ''}`} onClick={() => setItab('guidance')}>
                    Caregiver Briefing
                  </button>
                </div>

                {!update && (
                  <div>
                    {isImported ? (
                      <div style={{ color: 'var(--teal-dark)', padding: 16, fontSize: 13, background: 'var(--teal-light)', borderRadius: 8, lineHeight: 1.6 }}>
                        <strong>Ready to generate.</strong> Field notes for {resident.name.split(' ')[0]} have been imported. Click{' '}
                        <strong>Generate Update</strong> above to create their personalized family update.
                      </div>
                    ) : (
                      <div style={{ color: 'var(--text-muted)', padding: 12, fontSize: 13 }}>Select a resident and click Generate Update.</div>
                    )}
                  </div>
                )}

                {update && itab === 'narrative' && (
                  <div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: 14 }}>{update.greeting}</div>
                    <div className="u-section">
                      <div className="u-section-title">What we observed this week</div>
                      <div className="u-section-body">{update.whatWeObserved}</div>
                    </div>
                    <div className="u-section">
                      <div className="u-section-title">What this means for {resident.name.split(' ')[0]}'s journey</div>
                      <div className="u-section-body">{update.whatThisMeans}</div>
                    </div>
                    <div className="u-section warm">
                      <div className="u-section-title">A moment worth sharing</div>
                      <div className="u-section-body">{update.brightMoment}</div>
                    </div>
                    <div className="u-section">
                      <div className="u-section-title">How to connect on your next visit</div>
                      <div className="u-section-body">{update.howToConnect}</div>
                    </div>
                    {update.griefNote && (
                      <div className="u-section purple">
                        <div className="u-section-title">A note for your family</div>
                        <div className="u-section-body">{update.griefNote}</div>
                      </div>
                    )}
                    {update.questionsForFamily && (
                      <div style={{ marginTop: 14, padding: '12px 14px', background: 'var(--purple-light)', borderRadius: 8, border: '1px solid var(--purple-mid)' }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--purple)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 7 }}>
                          Questions to bring to your next care conference
                        </div>
                        {update.questionsForFamily.map((q, i) => (
                          <div key={i} style={{ fontSize: 12, color: 'var(--text)', padding: '3px 0', display: 'flex', gap: 7 }}>
                            <span style={{ color: 'var(--purple)' }}>›</span>
                            {q}
                          </div>
                        ))}
                      </div>
                    )}
                    <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic' }}>{update.closingNote}</div>
                    <div className="disclaimer">
                      This update reflects caregiver observations and is not a medical assessment. For clinical concerns, please contact the
                      care team directly.
                    </div>
                  </div>
                )}

                {update && itab === 'activity' && (
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 14 }}>
                      Personalized to {resident.name.split(' ')[0]}'s history, preferences, and current stage. Family visit activities use the{' '}
                      <strong style={{ color: 'var(--purple)' }}>CARES® Dementia 5-Step Method</strong> — developed with the Alzheimer's
                      Association and National Institute on Aging.
                    </div>
                    <div className="act-plan">
                      <div className="act-col staff">
                        <div className="act-col-hdr">🏥 Caregiver Activity Plan</div>
                        {update.caregiverActivities.map((a, i) => (
                          <div className="act-item" key={i}>
                            <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--teal)', flexShrink: 0, marginTop: 6 }} />
                            <div>{a}</div>
                          </div>
                        ))}
                      </div>
                      <div className="act-col family">
                        <div className="act-col-hdr">
                          👨‍👩‍👧 Family Visit Guide <span style={{ fontSize: 10, fontWeight: 400, opacity: 0.75 }}>— CARES® method</span>
                        </div>
                        <CaresActivities activities={update.familyActivities} />
                      </div>
                    </div>
                    <CaresPanel />
                  </div>
                )}

                {update && itab === 'guidance' && (
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>Clinical Briefing — Internal Only</div>
                    <div className="u-section">
                      <div className="u-section-title">This week's clinical context</div>
                      <div className="u-section-body">{update.caregiverGuidance}</div>
                    </div>
                    {update.physicianFlag && (
                      <div className="physician-flag">
                        <div style={{ fontSize: 20, flexShrink: 0 }}>⚕</div>
                        <div>
                          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--red)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                            Physician Flag
                          </div>
                          <div style={{ fontSize: 13, color: 'var(--text)' }}>{update.physicianFlag}</div>
                        </div>
                      </div>
                    )}
                    <div style={{ marginTop: 14, padding: '10px 14px', background: 'var(--gray-50)', borderRadius: 8, border: '1px solid var(--border)' }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                        Suggested Handoff Notes
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text)', lineHeight: 1.6 }}>
                        Review with oncoming shift: observation trends, active redirect strategies, family contact status, and any physician
                        flags above. Update the care plan if behavioral patterns have shifted this week.
                      </div>
                    </div>
                    <div style={{ marginTop: 10, fontSize: 11, color: 'var(--text-muted)' }}>This section is not included in the family update.</div>
                  </div>
                )}
              </div>

              <div style={{ marginTop: 12, textAlign: 'right' }}>
                <button className="btn btn-blue" onClick={handlePreviewFamily}>
                  👨‍👩‍👧 Preview Family View →
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
