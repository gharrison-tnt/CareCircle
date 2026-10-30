import { CARES_DEF } from '../data/sampleData';
import type { CaresLetter, FamilyActivity } from '../types';

export function CaresPanel() {
  return (
    <div className="cares-panel">
      <div className="cares-title">★ CARES® Dementia 5-Step Method — your visit framework</div>
      <div className="cares-steps">
        {(Object.entries(CARES_DEF) as [CaresLetter, (typeof CARES_DEF)[CaresLetter]][]).map(([letter, step]) => (
          <div className="cares-step" key={letter}>
            <div className="cares-letter">{letter}</div>
            <div className="cares-word">{step.word}</div>
            <div className="cares-desc">{step.desc}</div>
          </div>
        ))}
      </div>
      <div className="cares-ref">
        CARES® is a person-centered dementia care framework developed by Healthcare Interactive, supported by the
        National Institute on Aging and developed in conjunction with the Alzheimer's Association. Each visit
        suggestion maps to a CARES step to make your time together purposeful and connected.
      </div>
    </div>
  );
}

export function CaresActivities({ activities }: { activities: FamilyActivity[] | undefined }) {
  if (!activities || !activities.length) return null;
  return (
    <>
      {activities.map((a, i) => {
        const letter = (a.cares || 'C').toString().toUpperCase().charAt(0) as CaresLetter;
        const step = CARES_DEF[letter] || CARES_DEF.C;
        return (
          <div className="cares-act" key={i}>
            <div className="cares-badge">
              {letter} — {a.caresLabel || step.word}
            </div>
            <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)', lineHeight: 1.4, marginBottom: 3 }}>
              {a.activity}
            </div>
            {a.tip && <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5 }}>{a.tip}</div>}
          </div>
        );
      })}
    </>
  );
}
