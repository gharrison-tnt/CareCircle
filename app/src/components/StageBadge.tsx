import type { Stage } from '../types';

function slug(stage: Stage): string {
  return stage.toLowerCase().replace(/\s+/g, '-');
}

export function StageBadge({ stage }: { stage: Stage }) {
  return <span className={`badge b-${slug(stage)}`}>{stage}</span>;
}
