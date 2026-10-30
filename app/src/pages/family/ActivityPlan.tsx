import { CaresActivities, CaresPanel } from '../../components/CaresPanel';
import { EmptyState } from '../../components/EmptyState';
import { useAppStore } from '../../store/useAppStore';

export function ActivityPlan() {
  const residents = useAppStore((s) => s.residents);
  const viewingFamilyResidentId = useAppStore((s) => s.viewingFamilyResidentId);
  const updatesByResidentId = useAppStore((s) => s.updatesByResidentId);

  const resident = residents.find((r) => r.id === viewingFamilyResidentId);
  const update = resident ? updatesByResidentId[resident.id] : null;

  return (
    <div className="fam-page active">
      <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Activity Plan{resident ? ` — ${resident.name.split(' ')[0]}` : ''}</div>
      <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
        What our team does daily, and how you can connect meaningfully on your next visit
      </div>
      {update && update.caregiverActivities && update.familyActivities ? (
        <div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 14 }}>
            Personalized to {resident!.name.split(' ')[0]}'s history and current stage. Family visit suggestions follow the{' '}
            <strong style={{ color: 'var(--purple)' }}>CARES® Dementia 5-Step Method</strong>.
          </div>
          <div className="fam-act-plan">
            <div className="fam-act-col staff-col">
              <div className="fam-act-hdr">🏥 What our care team does daily</div>
              {update.caregiverActivities.map((a, i) => (
                <div className="fam-act-item" key={i}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--teal)', flexShrink: 0, marginTop: 6 }} />
                  <div>{a}</div>
                </div>
              ))}
            </div>
            <div className="fam-act-col you-col">
              <div className="fam-act-hdr">
                👨‍👩‍👧 What you can do on your visit <span style={{ fontSize: 10, fontWeight: 400, opacity: 0.75 }}>CARES®</span>
              </div>
              <CaresActivities activities={update.familyActivities} />
            </div>
          </div>
          <CaresPanel />
        </div>
      ) : (
        <EmptyState icon="🌱" title="No activity plan yet" sub="Generate an update from the staff view" />
      )}
    </div>
  );
}
