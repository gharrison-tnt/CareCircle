import { NavLink } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';

const TABS = [
  { to: '/family/updates', label: 'Updates' },
  { to: '/family/activity', label: 'Activity Plan' },
  { to: '/family/learn', label: 'Learn & Support' },
  { to: '/family/messages', label: 'Messages' },
];

export function FamilyNav() {
  const residents = useAppStore((s) => s.residents);
  const viewingFamilyResidentId = useAppStore((s) => s.viewingFamilyResidentId);
  const resident = residents.find((r) => r.id === viewingFamilyResidentId);

  return (
    <>
      <nav className="fam-nav">
        <div className="fam-brand">
          <div className="fam-brand-dot" />
          Care Companion
        </div>
        <div className="fam-nav-right">
          <span>Logged in as</span>
          <span className="fam-nav-name">{resident ? resident.contact.split(' (')[0] : 'Family Member'}</span>
        </div>
      </nav>
      <div className="fam-tabs-bar">
        {TABS.map((t) => (
          <NavLink key={t.to} to={t.to} className={({ isActive }) => `fam-tab${isActive ? ' active' : ''}`}>
            {t.label}
          </NavLink>
        ))}
      </div>
    </>
  );
}
