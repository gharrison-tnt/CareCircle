import { useState } from 'react';
import { useToast } from '../../components/Toast';
import { useFileUpload } from '../../hooks/useFileUpload';
import { useAppStore } from '../../store/useAppStore';
import type { Severity, Shift } from '../../types';

const POSITIVE_CHIPS = ['Joined activity', 'Recognized family', 'Full meal eaten', 'Social engagement', 'Cooperative care', 'Positive mood', 'Physical activity', 'Good sleep'];
const NEGATIVE_CHIPS = ['Agitation', 'Wandering', 'Sleep disturbance', 'Refused care', 'Poor appetite', 'Sundowning', 'Verbal outburst', 'Disorientation', 'Social withdrawal', 'Fall (no injury)'];
const SHIFTS: { value: Shift; label: string }[] = [
  { value: 'Morning', label: '🌅 Morning' },
  { value: 'Afternoon', label: '☀️ Afternoon' },
  { value: 'Evening', label: '🌆 Evening' },
  { value: 'Overnight', label: '🌙 Overnight' },
];
const SEVERITIES: Severity[] = ['Mild', 'Moderate', 'Significant'];

type InputTab = 'chips' | 'paste' | 'upload';

export function LogObservation() {
  const residents = useAppStore((s) => s.residents);
  const addObservation = useAppStore((s) => s.addObservation);
  const toast = useToast();
  const { file, readFile, clear: clearUpload } = useFileUpload();

  const [residentId, setResidentId] = useState('');
  const [shift, setShift] = useState<Shift | null>(null);
  const [severity, setSeverity] = useState<Severity | null>(null);
  const [tab, setTab] = useState<InputTab>('chips');
  const [pos, setPos] = useState<string[]>([]);
  const [neg, setNeg] = useState<string[]>([]);
  const [pasteNotes, setPasteNotes] = useState('');
  const [contextNotes, setContextNotes] = useState('');
  const [showSaved, setShowSaved] = useState(false);

  function toggleChip(list: string[], setList: (v: string[]) => void, chip: string) {
    setList(list.includes(chip) ? list.filter((c) => c !== chip) : [...list, chip]);
  }

  function handleSave() {
    if (!residentId) {
      toast('Please select a resident first');
      return;
    }
    const notes = [pasteNotes, contextNotes, file ? `[Uploaded: ${file.name}]\n${file.text}` : ''].filter(Boolean).join('\n\n');
    addObservation({
      residentId: parseInt(residentId, 10),
      shift: shift || 'Unspecified',
      pos,
      neg,
      severity: severity || 'Mild',
      notes,
    });
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 3000);
    handleClear();
  }

  function handleClear() {
    setShift(null);
    setSeverity(null);
    setPos([]);
    setNeg([]);
    setPasteNotes('');
    setContextNotes('');
    clearUpload();
  }

  return (
    <div className="page active">
      <div className="section-title">Log Observation</div>
      <div className="section-desc">Record care notes and behavioral observations — takes under 90 seconds</div>
      <div className="grid-2" style={{ alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="card">
            <label>Resident</label>
            <select value={residentId} onChange={(e) => setResidentId(e.target.value)}>
              <option value="">Select a resident...</option>
              {residents.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
          <div className="card">
            <label>Shift</label>
            <div className="shift-row">
              {SHIFTS.map((s) => (
                <button key={s.value} className={`shift-btn${shift === s.value ? ' sel' : ''}`} onClick={() => setShift(s.value)}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="input-tabs">
              <button className={`input-tab${tab === 'chips' ? ' active' : ''}`} onClick={() => setTab('chips')}>
                Quick Select
              </button>
              <button className={`input-tab${tab === 'paste' ? ' active' : ''}`} onClick={() => setTab('paste')}>
                Paste Care Notes
              </button>
              <button className={`input-tab${tab === 'upload' ? ' active' : ''}`} onClick={() => setTab('upload')}>
                Upload File
              </button>
            </div>

            {tab === 'chips' && (
              <div>
                <label style={{ marginBottom: 8 }}>Positive Outcomes</label>
                <div className="behavior-grid" style={{ marginBottom: 14 }}>
                  {POSITIVE_CHIPS.map((c) => (
                    <div key={c} className={`chip${pos.includes(c) ? ' sel' : ''}`} onClick={() => toggleChip(pos, setPos, c)}>
                      {c}
                    </div>
                  ))}
                </div>
                <label style={{ marginBottom: 8 }}>Behavioral Challenges</label>
                <div className="behavior-grid">
                  {NEGATIVE_CHIPS.map((c) => (
                    <div key={c} className={`chip neg${neg.includes(c) ? ' sel' : ''}`} onClick={() => toggleChip(neg, setNeg, c)}>
                      {c}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === 'paste' && (
              <div>
                <label>Paste shift notes or EHR export</label>
                <textarea
                  className="notes-area"
                  value={pasteNotes}
                  onChange={(e) => setPasteNotes(e.target.value)}
                  placeholder={`Paste care notes directly from your EHR, shift handoff, or any text source.\n\nExample:\n0730 — Resident cooperative with morning ADLs. Ate 80% of breakfast. Good mood.\n1430 — Agitation during afternoon activity. Redirected to music, calmed in 10 min.\n1800 — Sundowning began around 5:45pm.`}
                />
              </div>
            )}

            {tab === 'upload' && (
              <div>
                <label htmlFor="file-input" className="upload-zone" style={{ display: 'block' }}>
                  <div style={{ fontSize: 26, marginBottom: 8, opacity: 0.7 }}>📄</div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--teal-dark)', marginBottom: 4 }}>Drop a file or click to browse</div>
                  <div style={{ fontSize: 12, color: 'var(--teal-dark)', opacity: 0.8 }}>PDF, .txt, or .docx shift notes accepted</div>
                </label>
                {file && (
                  <div className="upload-file-info vis">
                    <span style={{ fontSize: 18 }}>📄</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{file.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{file.sizeKb}</div>
                    </div>
                    <button onClick={clearUpload} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: 'var(--text-muted)' }}>
                      ✕
                    </button>
                  </div>
                )}
                <input
                  type="file"
                  id="file-input"
                  accept=".pdf,.txt,.docx,.doc"
                  style={{ display: 'none' }}
                  onChange={(e) => e.target.files?.[0] && readFile(e.target.files[0])}
                />
              </div>
            )}
          </div>
          <div className="card">
            <label>Severity</label>
            <div className="sev-row">
              {SEVERITIES.map((s) => (
                <button key={s} className={`sev-btn${severity === s ? ' sel' : ''}`} onClick={() => setSeverity(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="card">
            <label>Additional Context</label>
            <textarea
              style={{ minHeight: 100 }}
              value={contextNotes}
              onChange={(e) => setContextNotes(e.target.value)}
              placeholder="Environmental factors, family interactions, what worked well, anything not captured above..."
            />
          </div>
          <div className="btn-row">
            <button className="btn btn-primary" onClick={handleSave}>
              Save Observation
            </button>
            <button className="btn btn-outline" onClick={handleClear}>
              Clear
            </button>
          </div>
          {showSaved && <div className="success-msg" style={{ display: 'block' }}>✓ Observation saved successfully</div>}
        </div>
      </div>
    </div>
  );
}
