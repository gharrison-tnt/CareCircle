import { CARES_DEF } from '../data/sampleData';
import { SAMPLE_UPDATES } from '../data/sampleUpdates';
import type { CaresLetter, FamilyUpdate, Observation, Resident } from '../types';

const CARES_ORDER: CaresLetter[] = ['C', 'A', 'R', 'E', 'S'];

/**
 * Resolves the family update for a resident.
 *
 * Seeded residents return their pre-written SAMPLE_UPDATES entry, matching the
 * original prototype. For imported residents, the prototype called an
 * unauthenticated client-side `fetch` to api.anthropic.com that only worked
 * inside a sandboxed environment — that's replaced here with an honest,
 * deterministic template built from the resident's own data. This function is
 * the seam where phase 2 swaps in a real server-side LLM call (e.g. a
 * Supabase Edge Function) without any UI changes.
 */
export function generateFamilyUpdate(resident: Resident, observations: Observation[]): FamilyUpdate {
  const preloaded = SAMPLE_UPDATES[resident.id];
  if (preloaded) return preloaded;
  return generateTemplateUpdate(resident, observations);
}

function firstName(name: string): string {
  return name.split(' ')[0];
}

function contactName(contact: string): string {
  return contact.split(' (')[0];
}

function generateTemplateUpdate(resident: Resident, observations: Observation[]): FamilyUpdate {
  const isUndiagnosed = resident.type === 'Cognitive Concerns — Not Yet Diagnosed';
  const fName = firstName(resident.name);
  const fieldNotes = observations.filter((o) => o.source === 'family-import');
  const careObs = observations.filter((o) => o.source !== 'family-import').slice(0, 5);
  const positives = careObs.flatMap((o) => o.pos);
  const negatives = careObs.flatMap((o) => o.neg);
  const pref = resident.prefs[0] || 'familiar routines';

  const whatWeObserved = careObs.length
    ? `This week's notes show ${positives.length ? positives.slice(0, 3).join(', ').toLowerCase() : 'a steady routine'}${negatives.length ? `, along with some ${negatives.slice(0, 2).join(' and ').toLowerCase()}` : ''}. ${careObs[0].notes}`
    : fieldNotes.length
      ? fieldNotes[0].notes
      : `We're still gathering observations for ${fName} — check back after the next few care notes are logged.`;

  const whatThisMeans = isUndiagnosed
    ? `${fName} doesn't have a formal diagnosis yet, so we're focused on documenting patterns rather than naming a condition. Consistent notes like these are exactly what a physician needs for an accurate evaluation.`
    : `These patterns are consistent with what's expected at the ${resident.stage.toLowerCase()} stage of ${resident.type}. ${resident.stageDesc}`;

  const activities: string[] = CARES_ORDER.map((letter) => {
    const step = CARES_DEF[letter];
    return `${step.word}: bring up ${pref.toLowerCase()} and follow ${fName}'s lead — this is the ${step.desc.split(',')[0].toLowerCase()}.`;
  });

  return {
    greeting: `Dear ${contactName(resident.contact)}, here is this week's update on ${fName}.`,
    whatWeObserved,
    whatThisMeans,
    brightMoment: fieldNotes.length
      ? fieldNotes[fieldNotes.length - 1].notes.slice(0, 220)
      : `${fName} responded well to ${pref.toLowerCase()} this week.`,
    howToConnect: `Lead with ${pref.toLowerCase()} when you visit — it's one of ${fName}'s most reliable comforts. ${resident.care}`,
    griefNote: "What you may be feeling right now — the ache of watching someone you love change, alongside your ongoing love for them — is real and valid. You are not alone in this.",
    caregiverActivities: activities,
    familyActivities: CARES_ORDER.map((letter) => {
      const step = CARES_DEF[letter];
      return {
        cares: letter,
        caresLabel: step.word,
        activity: `${step.word} with ${fName} using ${pref.toLowerCase()}`,
        tip: step.desc,
      };
    }),
    caregiverGuidance: `${fName} has ${observations.length} observation${observations.length === 1 ? '' : 's'} on file. ${negatives.length ? `Recent challenges: ${negatives.join(', ').toLowerCase()}.` : 'No significant behavioral concerns logged this week.'}`,
    physicianFlag: isUndiagnosed ? 'Recommend confirming the neurology/cognitive evaluation is scheduled.' : null,
    questionsForFamily: [
      `Are there specific songs, stories, or objects tied to ${pref.toLowerCase()} we should incorporate more often?`,
      `Has anything changed at home that would help us understand ${fName}'s recent patterns?`,
      `Is there a topic that reliably brings ${fName} energy that we should be leaning on more?`,
    ],
    closingNote: `${fName} is cared for and thought of every day — thank you for staying so connected.`,
    visitSignal: {
      type: negatives.length > positives.length ? 'amber' : 'green',
      title: negatives.length > positives.length ? 'Visit with a bit of preparation this week' : 'Good time to visit this week',
      body: `Based on this week's notes, ${fName} has been ${negatives.length > positives.length ? 'having a harder time' : 'doing well'}.`,
      windows: ['Best: mornings', 'Good: early afternoon', 'Check with staff first: evenings'],
      bring: pref,
      avoid: 'Rushed arrivals or memory quizzes',
    },
  };
}
