import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../components/Toast';
import { useFileUpload } from '../../hooks/useFileUpload';
import { useAppStore } from '../../store/useAppStore';
import { STAGES } from '../../types';

const DIAGNOSIS_TYPES = [
  "Alzheimer's Disease",
  'Vascular Dementia',
  'Lewy Body Dementia',
  'Frontotemporal Dementia',
  'Mixed Dementia',
  'Other Diagnosed Dementia',
  'Cognitive Concerns — Not Yet Diagnosed',
];

const PREF_CHIPS = [
  'Music from their era',
  'Family photos',
  'Gardening / nature',
  'Religious practice',
  'Cooking smells',
  'Animals / pets',
  'Sports / news',
  'Quiet / low stimulation',
  'Storytelling',
  'Handholding / touch',
];

type ImpTab = 'paste' | 'upload';

export function ImportFieldNotes() {
  const navigate = useNavigate();
  const toast = useToast();
  const addResident = useAppStore((s) => s.addResident);
  const { file, readFile, clear: clearFile } = useFileUpload();

  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [age, setAge] = useState('');
  const [room, setRoom] = useState('');
  const [type, setType] = useState('');
  const [stageIdx, setStageIdx] = useState(-1);
  const [contact, setContact] = useState('');
  const [relationship, setRelationship] = useState('');
  const [bio, setBio] = useState('');
  const [selectedPrefs, setSelectedPrefs] = useState<string[]>([]);
  const [otherPref, setOtherPref] = useState('');
  const [tab, setTab] = useState<ImpTab>('paste');
  const [dragOver, setDragOver] = useState(false);
  const [pasteNotes, setPasteNotes] = useState('');
  const [careContext, setCareContext] = useState('');
  const [successName, setSuccessName] = useState<string | null>(null);
  const [lastImportedId, setLastImportedId] = useState<number | null>(null);

  function togglePref(p: string) {
    setSelectedPrefs((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));
  }

  function getNotes(): string {
    return pasteNotes.trim() || file?.text || '';
  }

  function handleSubmit() {
    if (!fname.trim() || !lname.trim()) {
      toast("Please enter the resident's first and last name");
      return;
    }
    if (!contact.trim()) {
      toast('Please enter a family contact name');
      return;
    }
    if (stageIdx < 0) {
      toast('Please select a stage');
      return;
    }
    const notes = getNotes();
    if (!notes) {
      toast('Please add at least some field notes in the Paste tab or upload a file');
      return;
    }

    const prefs = [...selectedPrefs];
    if (otherPref.trim()) prefs.push(otherPref.trim());

    const id = addResident({
      firstName: fname.trim(),
      lastName: lname.trim(),
      age: parseInt(age, 10) || '—',
      room: room.trim(),
      type: type || 'Cognitive Concerns — Not Yet Diagnosed',
      stageIdx,
      contact: contact.trim(),
      relationship: relationship.trim(),
      bio: bio.trim(),
      prefs,
      careContext: careContext.trim(),
      fieldNotes: notes,
    });

    setLastImportedId(id);
    setSuccessName(`${fname.trim()} ${lname.trim()} added successfully`);
    toast(`${fname.trim()} added — go to Family Updates to generate their first update`);
  }

  function handleGoToUpdates() {
    if (lastImportedId) navigate(`/staff/updates?resident=${lastImportedId}`);
    else navigate('/staff/updates');
  }

  function handleClear() {
    setFname('');
    setLname('');
    setAge('');
    setRoom('');
    setType('');
    setStageIdx(-1);
    setContact('');
    setRelationship('');
    setBio('');
    setSelectedPrefs([]);
    setOtherPref('');
    setPasteNotes('');
    setCareContext('');
    clearFile();
    setSuccessName(null);
  }

  return (
    <div className="page active">
      <div className="page-header">
        <div>
          <div className="section-title">Import Field Notes</div>
          <div className="section-desc">Add a resident and their family's visit observations — takes about 3 minutes</div>
        </div>
      </div>

      <div className="grid-2" style={{ alignItems: 'start', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="card">
            <div className="card-title" style={{ marginBottom: 14 }}>
              1 — Resident identity
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
              <div>
                <label>First name</label>
                <input className="import-field-input" value={fname} onChange={(e) => setFname(e.target.value)} placeholder="e.g. Margaret" />
              </div>
              <div>
                <label>Last name</label>
                <input className="import-field-input" value={lname} onChange={(e) => setLname(e.target.value)} placeholder="e.g. Hoffman" />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
              <div>
                <label>Age</label>
                <input className="import-field-input" type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="82" />
              </div>
              <div>
                <label>Room / Location</label>
                <input className="import-field-input" value={room} onChange={(e) => setRoom(e.target.value)} placeholder="114A or Home" />
              </div>
            </div>
            <div style={{ marginBottom: 10 }}>
              <label>Diagnosis type</label>
              <select className="import-field-input" value={type} onChange={(e) => setType(e.target.value)} style={{ width: '100%' }}>
                <option value="">Select...</option>
                {DIAGNOSIS_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Stage</label>
              <div className="stage-select-row">
                {STAGES.map((s, i) => (
                  <button key={s} className={`stage-sel-btn${stageIdx === i ? ' sel' : ''}`} onClick={() => setStageIdx(i)}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-title" style={{ marginBottom: 14 }}>
              2 — Family contact
            </div>
            <div style={{ marginBottom: 10 }}>
              <label>Family member name(s)</label>
              <input className="import-field-input" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="e.g. David and Linda Hoffman" />
            </div>
            <div style={{ marginBottom: 10 }}>
              <label>Relationship</label>
              <input className="import-field-input" value={relationship} onChange={(e) => setRelationship(e.target.value)} placeholder="e.g. Son and daughter-in-law" />
            </div>
          </div>

          <div className="card">
            <div className="card-title" style={{ marginBottom: 6 }}>
              3 — Life story & preferences
            </div>
            <div className="card-sub" style={{ marginBottom: 12 }}>
              This feeds the AI — the more you share, the more personal the updates
            </div>
            <div style={{ marginBottom: 10 }}>
              <label>Life story (work, hobbies, family, identity)</label>
              <textarea
                className="import-field-textarea"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="e.g. Retired schoolteacher from Denver. Loved roses and gardening. Taught 3rd grade for 32 years. Married to Robert for 54 years. Devout Methodist."
              />
            </div>
            <div>
              <label>Known preferences & comforts</label>
              <div style={{ marginBottom: 8 }}>
                {PREF_CHIPS.map((p) => (
                  <span key={p} className={`pref-chip${selectedPrefs.includes(p) ? ' sel' : ''}`} onClick={() => togglePref(p)}>
                    {p}
                  </span>
                ))}
              </div>
              <input className="import-field-input" value={otherPref} onChange={(e) => setOtherPref(e.target.value)} placeholder="Add anything else (optional)" />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="card">
            <div className="card-title" style={{ marginBottom: 4 }}>
              4 — Field notes
            </div>
            <div className="card-sub" style={{ marginBottom: 14 }}>
              Paste, type, or upload what the family has shared — visit observations, phone call notes, emails, anything
            </div>
            <div className="input-tabs" style={{ marginBottom: 14 }}>
              <button className={`input-tab${tab === 'paste' ? ' active' : ''}`} onClick={() => setTab('paste')}>
                Paste / Type
              </button>
              <button className={`input-tab${tab === 'upload' ? ' active' : ''}`} onClick={() => setTab('upload')}>
                Upload File
              </button>
            </div>

            {tab === 'paste' && (
              <div>
                <label>Family field notes</label>
                <textarea
                  className="import-field-textarea"
                  style={{ minHeight: 200 }}
                  value={pasteNotes}
                  onChange={(e) => setPasteNotes(e.target.value)}
                  placeholder={`Paste anything here — visit notes, texts from family, email summaries, voice memo transcripts, or your own handwritten notes typed up.\n\nExamples:\n— 'Mom recognized me when I came in Tuesday. She kept asking about the garden.'\n— 'Dad was agitated most of the visit but calmed down when we played Sinatra.'\n— 'She didn't eat much. Seemed tired. Held my hand the whole time though.'\n\nNo format required. Write naturally.`}
                />
              </div>
            )}

            {tab === 'upload' && (
              <div>
                <div
                  className={`import-zone${dragOver ? ' drag' : ''}`}
                  onClick={() => document.getElementById('imp-file-input')?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                    if (e.dataTransfer.files[0]) readFile(e.dataTransfer.files[0]);
                  }}
                >
                  <div className="import-zone-icon">📋</div>
                  <div className="import-zone-title">Drop a file or click to browse</div>
                  <div className="import-zone-sub">Accepts .txt, .pdf, .docx — or paste text directly in the other tab</div>
                </div>
                <input
                  type="file"
                  id="imp-file-input"
                  accept=".txt,.pdf,.docx,.doc"
                  style={{ display: 'none' }}
                  onChange={(e) => e.target.files?.[0] && readFile(e.target.files[0])}
                />
                {file && (
                  <div style={{ background: 'var(--white)', border: '1px solid var(--teal-mid)', borderRadius: 8, padding: '10px 14px', marginTop: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 18 }}>📄</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{file.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{file.sizeKb}</div>
                    </div>
                    <button onClick={clearFile} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: 'var(--text-muted)' }}>
                      ✕
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="card">
            <div className="card-title" style={{ marginBottom: 6 }}>
              5 — Additional care context <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--text-muted)' }}>(optional)</span>
            </div>
            <div className="card-sub" style={{ marginBottom: 12 }}>
              Anything the care team or you have observed — patterns, challenges, what works
            </div>
            <textarea
              className="import-field-textarea"
              value={careContext}
              onChange={(e) => setCareContext(e.target.value)}
              placeholder="e.g. Sundowning starts around 4pm. Responds well to music. Refuses baths on Tuesdays. Physician flagged weight loss."
            />
          </div>

          <div className="btn-row">
            <button className="btn btn-primary" onClick={handleSubmit}>
              Add Resident & Notes
            </button>
            <button className="btn btn-outline" onClick={handleClear}>
              Clear
            </button>
          </div>

          {successName && (
            <div className="import-success show">
              <div style={{ fontSize: 22, marginBottom: 8 }}>✅</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--teal-dark)', marginBottom: 4 }}>{successName}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>
                Field notes saved. You can now generate a family update from the Family Updates tab.
              </div>
              <button className="btn btn-primary" onClick={handleGoToUpdates}>
                Generate Family Update →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
