interface MetricTileProps {
  label: string;
  value: string | number;
  sub: string;
  tone?: 'teal' | 'red' | 'amber' | 'blue';
}

export function MetricTile({ label, value, sub, tone }: MetricTileProps) {
  return (
    <div className={`metric ${tone || ''}`}>
      <div className="metric-label">{label}</div>
      <div className="metric-value">{value}</div>
      <div className="metric-sub">{sub}</div>
    </div>
  );
}
