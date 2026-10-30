import { useNavigate } from 'react-router-dom';
import type { Resident } from '../types';
import { Avatar } from './Avatar';
import { StageBadge } from './StageBadge';

export function ResidentRow({ resident }: { resident: Resident }) {
  const navigate = useNavigate();
  return (
    <div className="rrow" onClick={() => navigate(`/staff/profile/${resident.id}`)}>
      <Avatar initials={resident.initials} avClass={resident.av} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500 }}>{resident.name}</div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
          {resident.type} · Room {resident.room}
        </div>
      </div>
      <StageBadge stage={resident.stage} />
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Last update</div>
        <div style={{ fontSize: 11, fontWeight: 500, color: resident.updateOverdue ? 'var(--red)' : 'var(--text-muted)' }}>
          {resident.lastUpdate || '—'}
        </div>
      </div>
    </div>
  );
}
