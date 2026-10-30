export type AvatarClass = 'av-teal' | 'av-blue' | 'av-amber' | 'av-coral';

export const STAGES = ['Early', 'Mild', 'Moderate', 'Advanced', 'Late Stage'] as const;
export type Stage = (typeof STAGES)[number];

export type RiskLevel = 'red' | 'amber' | 'green';

export interface RiskFlag {
  level: RiskLevel;
  label: string;
  detail: string;
  action: string;
}

export interface Resident {
  id: number;
  name: string;
  initials: string;
  av: AvatarClass;
  age: number | string;
  room: string;
  type: string;
  stage: Stage;
  stageIdx: number;
  stageDesc: string;
  admitted: string;
  contact: string;
  physician: string;
  bio: string;
  prefs: string[];
  care: string;
  riskFlags: RiskFlag[];
  lastUpdate?: string;
  updateOverdue: boolean;
}

export type Severity = 'Mild' | 'Moderate' | 'Significant';
export type Shift = 'Morning' | 'Afternoon' | 'Evening' | 'Overnight' | 'Unspecified' | 'Family Field Notes';

export interface Observation {
  id: number;
  residentId: number;
  date: string;
  shift: Shift;
  pos: string[];
  neg: string[];
  sev: Severity;
  notes: string;
  source?: 'family-import';
}

export type CaresLetter = 'C' | 'A' | 'R' | 'E' | 'S';

export interface CaresStep {
  word: string;
  desc: string;
}

export type CaresDef = Record<CaresLetter, CaresStep>;

export interface FamilyActivity {
  cares: CaresLetter;
  caresLabel: string;
  activity: string;
  tip: string;
}

export interface VisitSignal {
  type: 'green' | 'amber' | 'blue';
  title: string;
  body: string;
  windows: string[];
  bring: string;
  avoid: string;
}

export interface FamilyUpdate {
  greeting: string;
  whatWeObserved: string;
  whatThisMeans: string;
  brightMoment: string;
  howToConnect: string;
  griefNote: string;
  caregiverActivities: string[];
  familyActivities: FamilyActivity[];
  caregiverGuidance: string;
  physicianFlag: string | null;
  questionsForFamily: string[];
  closingNote: string;
  visitSignal: VisitSignal;
}

export interface Message {
  id: number;
  residentId: number;
  from: 'family' | 'staff';
  text: string;
  timestamp: string;
}

export interface LearnMyth {
  myth: string;
  truth: string;
}

export interface LearnContent {
  whatToExpect: string[];
  myths: LearnMyth[];
  griefNote: string;
  resources: string[];
}

export interface FacilityBrand {
  name: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  license: string;
  primary: string;
  primaryDark: string;
  grove: string;
  groveLight: string;
  accentLight: string;
  logoText: string;
  logoUrl?: string;
}
