import type { RiskFlag } from '../types';

const ICONS: Record<RiskFlag['level'], string> = { red: '🔴', amber: '🟡', green: '🟢' };

interface RiskFlagCardProps {
  flag: RiskFlag;
  label: string;
  onAction: () => void;
}

export function RiskFlagCard({ flag, label, onAction }: RiskFlagCardProps) {
  return (
    <div className={`risk-flag ${flag.level}`}>
      <div className="risk-icon">{ICONS[flag.level]}</div>
      <div className="risk-text">
        <div className="risk-label">{label}</div>
        {flag.detail}
      </div>
      <button className="risk-action" onClick={onAction}>
        {flag.action}
      </button>
    </div>
  );
}
