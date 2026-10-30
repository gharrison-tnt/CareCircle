import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { useToast } from './Toast';

export function ModeBar() {
  const navigate = useNavigate();
  const toast = useToast();
  const mode = useAppStore((s) => s.mode);
  const setMode = useAppStore((s) => s.setMode);
  const residents = useAppStore((s) => s.residents);
  const viewingFamilyResidentId = useAppStore((s) => s.viewingFamilyResidentId);
  const setViewingFamilyResidentId = useAppStore((s) => s.setViewingFamilyResidentId);
  const loadSampleData = useAppStore((s) => s.loadSampleData);

  function goMode(next: 'staff' | 'family') {
    setMode(next);
    navigate(next === 'staff' ? '/staff/dashboard' : '/family/updates');
  }

  function handleLoadSample() {
    loadSampleData();
    toast('Sample data loaded — explore Staff and Family views');
  }

  return (
    <div className="mode-bar">
      <span className="mode-label">View as</span>
      <div className="mode-toggle">
        <button className={`mode-btn${mode === 'staff' ? ' active-staff' : ''}`} onClick={() => goMode('staff')}>
          🏥 Care Staff
        </button>
        <button className={`mode-btn${mode === 'family' ? ' active-family' : ''}`} onClick={() => goMode('family')}>
          👨‍👩‍👧 Family Member
        </button>
      </div>
      {mode === 'family' && (
        <div className="fam-who">
          <label>Viewing as:</label>
          <select
            value={viewingFamilyResidentId ?? ''}
            onChange={(e) => setViewingFamilyResidentId(e.target.value ? parseInt(e.target.value, 10) : null)}
          >
            <option value="">Select resident's family...</option>
            {residents.map((r) => (
              <option key={r.id} value={r.id}>
                {r.contact.split(' (')[0]} — {r.name.split(' ')[0]}
              </option>
            ))}
          </select>
        </div>
      )}
      <button className="sample-pill" onClick={handleLoadSample}>
        ⚡ Load Sample Data
      </button>
    </div>
  );
}
