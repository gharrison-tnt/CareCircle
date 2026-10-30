import { STAGES } from '../types';

export function StageTracker({ stageIdx }: { stageIdx: number }) {
  return (
    <div className="stage-track">
      {STAGES.map((label, i) => {
        const cls = i < stageIdx ? 'st-done' : i === stageIdx ? 'st-current' : 'st-future';
        return (
          <div key={label} style={{ display: 'contents' }}>
            <div className={`st-step ${cls}`}>
              <div className="st-dot">{i < stageIdx ? '✓' : i + 1}</div>
              <div className="st-label">{label}</div>
            </div>
            {i < STAGES.length - 1 && <div className={`st-line ${i < stageIdx ? 'done' : ''}`} />}
          </div>
        );
      })}
    </div>
  );
}
