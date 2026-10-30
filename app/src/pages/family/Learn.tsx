import { EmptyState } from '../../components/EmptyState';
import { LEARN_CONTENT } from '../../data/sampleData';
import { useAppStore } from '../../store/useAppStore';

export function Learn() {
  const residents = useAppStore((s) => s.residents);
  const viewingFamilyResidentId = useAppStore((s) => s.viewingFamilyResidentId);
  const resident = residents.find((r) => r.id === viewingFamilyResidentId);
  const lc = resident ? LEARN_CONTENT[resident.id] : undefined;

  return (
    <div className="fam-page active">
      <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Learn & Support</div>
      <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
        {resident ? `Stage-specific education for ${resident.type} families` : 'Stage-specific education and family support resources'}
      </div>

      {!lc && <EmptyState icon="📚" title="Select a resident to see their education content" />}

      {lc && resident && (
        <>
          <div className="edu-card">
            <div className="edu-title">📋 What to expect at this stage — {resident.type}</div>
            {lc.whatToExpect.map((e, i) => (
              <div className="edu-item" key={i}>
                <div className="edu-dot" />
                <div>{e}</div>
              </div>
            ))}
            <div className="edu-myth">
              <div className="edu-myth-title">Common misconceptions — and what research actually shows</div>
              {lc.myths.map((m, i) => (
                <div key={i}>
                  <div className="myth-row" style={{ marginBottom: 8, paddingBottom: 8, borderBottom: '1px solid rgba(24,95,165,0.1)' }}>
                    <div style={{ flexShrink: 0 }}>
                      <span style={{ background: 'var(--coral-light)', color: 'var(--coral)', fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4, whiteSpace: 'nowrap' }}>
                        Myth
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic' }}>"{m.myth}"</div>
                  </div>
                  <div className="myth-row" style={{ marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid rgba(24,95,165,0.1)' }}>
                    <div style={{ flexShrink: 0 }}>
                      <span style={{ background: 'var(--teal-light)', color: 'var(--teal-dark)', fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4, whiteSpace: 'nowrap' }}>
                        Truth
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text)', lineHeight: 1.5 }}>{m.truth}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: 'var(--purple-light)', border: '1px solid var(--purple-mid)', borderRadius: 'var(--radius-lg)', padding: '16px 18px', marginBottom: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--purple)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
              💜 A note about what you may be feeling
            </div>
            <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.75 }}>{lc.griefNote}</div>
          </div>

          <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '16px 18px' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
              📞 Support resources for families
            </div>
            {lc.resources.map((res, i) => (
              <div key={i} style={{ fontSize: 12, color: 'var(--text)', padding: '5px 0', borderBottom: '1px solid var(--border)', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--blue)' }}>→</span>
                {res}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
