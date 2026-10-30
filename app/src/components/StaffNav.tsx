import { NavLink } from 'react-router-dom';

const TABS = [
  { to: '/staff/dashboard', label: 'Dashboard' },
  { to: '/staff/log', label: 'Log Observation' },
  { to: '/staff/updates', label: 'Family Updates' },
  { to: '/staff/profile', label: 'Resident Profile' },
];

export function StaffNav() {
  return (
    <nav className="staff-nav">
      <div className="nav-brand">
        <div className="brand-dot" />
        Care Companion
      </div>
      <div className="nav-tabs">
        {TABS.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            className={({ isActive }) => `nav-tab${isActive ? ' active' : ''}`}
          >
            {t.label}
          </NavLink>
        ))}
        <NavLink
          to="/staff/import"
          className={({ isActive }) => `nav-tab${isActive ? ' active' : ''}`}
          style={{ color: 'var(--teal)', fontWeight: 500 }}
        >
          ⬆ Import Field Notes
        </NavLink>
      </div>
    </nav>
  );
}
