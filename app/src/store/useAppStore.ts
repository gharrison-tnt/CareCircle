import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SEED_OBSERVATIONS, SEED_RESIDENTS } from '../data/sampleData';
import { SAMPLE_UPDATES } from '../data/sampleUpdates';
import { generateFamilyUpdate } from '../services/updateGeneration';
import type { FamilyUpdate, Message, Observation, Resident, Severity, Shift } from '../types';

const AV_CLASSES: Resident['av'][] = ['av-teal', 'av-blue', 'av-amber', 'av-coral', 'av-teal'];

const STAGE_DESCRIPTIONS: Record<string, string> = {
  Early: 'Early-stage dementia — meaningful communication is still possible; routines and familiar environments are key anchors.',
  Mild: 'Mid-stage dementia — memory gaps are more frequent but emotional connections remain strong.',
  Moderate: 'Moderate-stage dementia — long-term memories and emotional responses remain; sensory approaches work best.',
  Advanced: 'Advanced-stage dementia — verbal communication has faded but presence, touch, and familiar sound still reach them.',
  'Late Stage': 'Late-stage dementia — comfort, dignity, and loving presence are the primary goals of every interaction.',
};

export interface NewResidentInput {
  firstName: string;
  lastName: string;
  age: number | string;
  room: string;
  type: string;
  stageIdx: number;
  contact: string;
  relationship: string;
  bio: string;
  prefs: string[];
  careContext: string;
  fieldNotes: string;
}

export interface LogObservationInput {
  residentId: number;
  shift: Shift;
  pos: string[];
  neg: string[];
  severity: Severity;
  notes: string;
}

interface AppState {
  residents: Resident[];
  observations: Observation[];
  updatesByResidentId: Record<number, FamilyUpdate>;
  messagesByResidentId: Record<number, Message[]>;

  mode: 'staff' | 'family';
  viewingFamilyResidentId: number | null;
  lastImportedId: number | null;

  setMode: (mode: 'staff' | 'family') => void;
  setViewingFamilyResidentId: (id: number | null) => void;

  loadSampleData: () => void;
  addObservation: (input: LogObservationInput) => void;
  addResident: (input: NewResidentInput) => number;
  generateUpdate: (residentId: number) => FamilyUpdate;
  dismissRiskFlag: (residentId: number, flagIndex: number) => void;
  sendMessage: (residentId: number, text: string) => void;

  observationsFor: (residentId: number) => Observation[];
  updateFor: (residentId: number) => FamilyUpdate | null;
}

let obsIdCounter = 1000;
let msgIdCounter = 1000;

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      residents: [],
      observations: [],
      updatesByResidentId: {},
      messagesByResidentId: {},
      mode: 'staff',
      viewingFamilyResidentId: null,
      lastImportedId: null,

      setMode: (mode) => set({ mode }),
      setViewingFamilyResidentId: (id) => set({ viewingFamilyResidentId: id }),

      loadSampleData: () =>
        set({
          residents: SEED_RESIDENTS,
          observations: SEED_OBSERVATIONS,
          updatesByResidentId: { ...SAMPLE_UPDATES },
        }),

      addObservation: (input) => {
        const obs: Observation = {
          id: ++obsIdCounter,
          residentId: input.residentId,
          date: 'Just now',
          shift: input.shift,
          pos: input.pos,
          neg: input.neg,
          sev: input.severity,
          notes: input.notes || 'Observation logged',
        };
        set((state) => ({ observations: [obs, ...state.observations] }));
      },

      addResident: (input) => {
        const id = Date.now();
        const initials = (input.firstName[0] + (input.lastName[0] || '')).toUpperCase();
        const state = get();
        const avIdx = state.residents.length % AV_CLASSES.length;
        const stage = (['Early', 'Mild', 'Moderate', 'Advanced', 'Late Stage'] as const)[input.stageIdx];
        const newResident: Resident = {
          id,
          name: `${input.firstName} ${input.lastName}`,
          initials,
          av: AV_CLASSES[avIdx],
          age: input.age,
          room: input.room || '—',
          type: input.type,
          stage,
          stageIdx: input.stageIdx,
          stageDesc: STAGE_DESCRIPTIONS[stage] || '',
          contact: input.contact + (input.relationship ? ` (${input.relationship})` : ''),
          physician: '—',
          admitted: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          bio: input.bio || 'Life story not yet entered.',
          care: input.careContext || 'Care notes not yet entered.',
          prefs: input.prefs.length ? input.prefs : ['Familiar routines', 'Family presence'],
          updateOverdue: true,
          riskFlags: [],
        };

        const newObs: Observation | null = input.fieldNotes
          ? {
              id: ++obsIdCounter,
              residentId: id,
              shift: 'Family Field Notes',
              date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              pos: [],
              neg: [],
              sev: 'Mild',
              notes: input.fieldNotes.slice(0, 8000),
              source: 'family-import',
            }
          : null;

        set((s) => ({
          residents: [...s.residents, newResident],
          observations: newObs ? [...s.observations, newObs] : s.observations,
          lastImportedId: id,
        }));

        return id;
      },

      generateUpdate: (residentId) => {
        const state = get();
        const resident = state.residents.find((r) => r.id === residentId);
        if (!resident) throw new Error('Resident not found');
        const existing = state.updatesByResidentId[residentId];
        if (existing) return existing;
        const update = generateFamilyUpdate(
          resident,
          state.observations.filter((o) => o.residentId === residentId)
        );
        set((s) => ({ updatesByResidentId: { ...s.updatesByResidentId, [residentId]: update } }));
        return update;
      },

      dismissRiskFlag: (residentId, flagIndex) => {
        set((state) => ({
          residents: state.residents.map((r) =>
            r.id === residentId ? { ...r, riskFlags: r.riskFlags.filter((_, i) => i !== flagIndex) } : r
          ),
        }));
      },

      sendMessage: (residentId, text) => {
        const msg: Message = { id: ++msgIdCounter, residentId, from: 'family', text, timestamp: 'Just now' };
        set((state) => ({
          messagesByResidentId: {
            ...state.messagesByResidentId,
            [residentId]: [...(state.messagesByResidentId[residentId] || []), msg],
          },
        }));
        setTimeout(() => {
          const reply: Message = {
            id: ++msgIdCounter,
            residentId,
            from: 'staff',
            text: 'Thank you for reaching out. A member of the care team will follow up with you shortly. For urgent matters, please call the facility directly.',
            timestamp: 'Just now',
          };
          set((state) => ({
            messagesByResidentId: {
              ...state.messagesByResidentId,
              [residentId]: [...(state.messagesByResidentId[residentId] || []), reply],
            },
          }));
        }, 1200);
      },

      observationsFor: (residentId) => get().observations.filter((o) => o.residentId === residentId),
      updateFor: (residentId) => get().updatesByResidentId[residentId] || null,
    }),
    { name: 'carecircle_local_data' }
  )
);
