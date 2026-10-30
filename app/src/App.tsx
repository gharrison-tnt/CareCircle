import { useEffect } from 'react';
import { Navigate, Outlet, Route, HashRouter, Routes } from 'react-router-dom';
import { FamilyNav } from './components/FamilyTabs';
import { ModeBar } from './components/ModeBar';
import { StaffNav } from './components/StaffNav';
import { ToastProvider } from './components/Toast';
import { ActivityPlan } from './pages/family/ActivityPlan';
import { Learn } from './pages/family/Learn';
import { Messages } from './pages/family/Messages';
import { FamilyUpdates } from './pages/family/Updates';
import { Dashboard } from './pages/staff/Dashboard';
import { FamilyUpdatesPage } from './pages/staff/FamilyUpdates';
import { ImportFieldNotes } from './pages/staff/ImportFieldNotes';
import { LogObservation } from './pages/staff/LogObservation';
import { ResidentProfile } from './pages/staff/ResidentProfile';
import { useAppStore } from './store/useAppStore';

function StaffLayout() {
  return (
    <div id="staff-app">
      <StaffNav />
      <Outlet />
    </div>
  );
}

function FamilyLayout() {
  return (
    <div id="family-app">
      <FamilyNav />
      <Outlet />
    </div>
  );
}

function AutoSelectFamilyResident() {
  const residents = useAppStore((s) => s.residents);
  const viewingFamilyResidentId = useAppStore((s) => s.viewingFamilyResidentId);
  const setViewingFamilyResidentId = useAppStore((s) => s.setViewingFamilyResidentId);

  useEffect(() => {
    if (residents.length && viewingFamilyResidentId === null) {
      setViewingFamilyResidentId(residents[0].id);
    }
  }, [residents, viewingFamilyResidentId, setViewingFamilyResidentId]);

  return null;
}

function App() {
  return (
    <ToastProvider>
      <HashRouter>
        <AutoSelectFamilyResident />
        <ModeBar />
        <Routes>
          <Route path="/" element={<Navigate to="/staff/dashboard" replace />} />
          <Route path="/staff" element={<StaffLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="log" element={<LogObservation />} />
            <Route path="updates" element={<FamilyUpdatesPage />} />
            <Route path="profile" element={<ResidentProfile />} />
            <Route path="profile/:residentId" element={<ResidentProfile />} />
            <Route path="import" element={<ImportFieldNotes />} />
          </Route>
          <Route path="/family" element={<FamilyLayout />}>
            <Route path="updates" element={<FamilyUpdates />} />
            <Route path="activity" element={<ActivityPlan />} />
            <Route path="learn" element={<Learn />} />
            <Route path="messages" element={<Messages />} />
          </Route>
        </Routes>
      </HashRouter>
    </ToastProvider>
  );
}

export default App;
