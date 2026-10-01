export type CheckIn = { id: string; date: string; mood: number; stress: number; sleep: number; energy: number; activity: number; social: number; journal: string; triggers: Record<string, number> };
export const triggerNames = ['Academic pressure', 'Work pressure', 'Sleep deficit', 'Social isolation', 'Financial stress'] as const;
export const triggerWeights = [0.30, 0.25, 0.20, 0.15, 0.10];
export function ari(c: CheckIn) { return Math.round(.25*c.sleep*10 + .25*c.mood*10 + .20*c.activity*10 + .15*c.social*10 + .15*(100-c.stress*10)); }
export function rps(current: number, day1: number) { return day1 > 0 ? Math.round(((current-day1)/day1)*100) : 0; }
export function atpm(c: CheckIn) { return Math.round(triggerNames.reduce((sum, name, i) => sum + (c.triggers[name] || 0)*10*(triggerWeights[i] ?? 0), 0)); }
export function band(score: number) { return score <= 20 ? 'Critical risk' : score <= 40 ? 'High risk' : score <= 60 ? 'Moderate risk' : score <= 80 ? 'Stable' : 'Flourishing'; }
export const sample: CheckIn[] = Array.from({length: 14}, (_, i) => {
  const d = new Date(2026, 8, 14+i);
  return {id:`sample-${i}`, date:d.toISOString().slice(0,10), mood: 5+((i*3)%4), stress: 7-((i*2)%4), sleep: 5+((i*2)%4), energy: 5+(i%4), activity: 4+((i*3)%5), social: 5+((i*2)%4), journal: '', triggers: {'Academic pressure':4+(i%4),'Work pressure':5+(i%3),'Sleep deficit':3+(i%4),'Social isolation':2+(i%3),'Financial stress':2+(i%2)} };
});
const KEY='mindease-checkins-v1';
export function readCheckIns(): CheckIn[] { if (typeof window === 'undefined') return []; try { const raw=localStorage.getItem(KEY); return raw ? JSON.parse(raw) as CheckIn[] : []; } catch { return []; } }
export function saveCheckIn(entry: CheckIn) { const all=readCheckIns(); const next=[...all.filter(x=>x.date!==entry.date),entry].sort((a,b)=>a.date.localeCompare(b.date)); localStorage.setItem(KEY,JSON.stringify(next)); return next; }
export const categories = [
  {name:'Student anxiety', count:20, setting:'a demanding semester', trigger:'academic deadlines', habit:'a consistent study-and-rest schedule'},
  {name:'Workplace anxiety', count:20, setting:'a changing workplace', trigger:'shifting expectations', habit:'clear work boundaries'},
  {name:'Social anxiety', count:15, setting:'new social situations', trigger:'fear of negative evaluation', habit:'gradual, supported social practice'},
  {name:'Health anxiety', count:15, setting:'a period of health uncertainty', trigger:'frequent reassurance-seeking', habit:'limiting repeated symptom searches'},
  {name:'Relationship anxiety', count:10, setting:'an evolving relationship', trigger:'uncertainty in communication', habit:'open communication and reflection'},
  {name:'Financial anxiety', count:10, setting:'a tight monthly budget', trigger:'unpredictable expenses', habit:'a manageable financial plan'},
  {name:'Performance anxiety', count:10, setting:'a public performance', trigger:'high self-expectations', habit:'practice and grounding before events'},
];
const people = [
  "Avery",
  "Jordan",
  "Sam",
  "Taylor",
  "Morgan",
  "Riley",
  "Alex",
  "Casey",
  "Devin",
  "Robin",
];
const situations = [
  "a new routine",
  "an upcoming transition",
  "a busy week",
  "a period of uncertainty",
  "an important milestone",
];
const caseProfiles = [
  {
    stage: "their late twenties",
    role: "an early-career coordinator",
    home: "sharing a home with a friend",
    strength: "careful planning and a strong sense of responsibility",
    support: "a trusted sibling and one close friend",
    routine: "a changing work schedule and a long public-transit commute",
  },
  {
    stage: "their early thirties",
    role: "a graduate student balancing study and paid work",
    home: "living with family while saving for independent housing",
    strength: "curiosity, persistence, and a willingness to ask thoughtful questions",
    support: "a mentor, a cousin, and campus support services",
    routine: "evening classes, weekend shifts, and limited unstructured time",
  },
  {
    stage: "their mid-twenties",
    role: "a new parent returning to part-time work",
    home: "living with a partner and a young child",
    strength: "warmth toward others and an ability to notice small changes",
    support: "their partner and a relative who helps with childcare",
    routine: "broken sleep, caregiving, and a gradual return to professional responsibilities",
  },
  {
    stage: "their early forties",
    role: "an experienced team lead",
    home: "living independently near extended family",
    strength: "practical problem-solving and a long history of adapting through change",
    support: "a longtime friend and a supportive colleague",
    routine: "high responsibility at work alongside regular family commitments",
  },
  {
    stage: "their late teens",
    role: "a student preparing for an important next step",
    home: "living with family",
    strength: "creativity, persistence, and strong relationships with a few peers",
    support: "a family member, a school advisor, and a trusted friend",
    routine: "classes, travel between commitments, and uncertainty about the next year",
  },
  {
    stage: "their late thirties",
    role: "a self-employed creative professional",
    home: "sharing a home with their partner",
    strength: "resourcefulness and a capacity for reflective thinking",
    support: "their partner and a small professional network",
    routine: "variable work hours, project deadlines, and fluctuating income",
  },
  {
    stage: "their early fifties",
    role: "a caregiver and part-time administrator",
    home: "living with a partner while helping an older relative",
    strength: "patience, dependability, and a clear sense of personal values",
    support: "a friend, a sibling, and a community group",
    routine: "care responsibilities arranged around part-time work",
  },
  {
    stage: "their early thirties",
    role: "a recently promoted operations specialist",
    home: "living with a roommate in a new city",
    strength: "attention to detail and a sincere desire to do work well",
    support: "a former colleague and family members who live farther away",
    routine: "learning a new role while rebuilding familiar social routines",
  },
  {
    stage: "their mid-thirties",
    role: "a health-sector professional",
    home: "living with their spouse",
    strength: "empathy, steady follow-through, and an ability to reflect after difficult days",
    support: "their spouse and two long-standing friends",
    routine: "shifted work hours, household tasks, and planned time for rest",
  },
  {
    stage: "their late twenties",
    role: "a first-generation university graduate",
    home: "living with relatives while establishing a career",
    strength: "initiative, humor, and a strong commitment to the people they care about",
    support: "a friend from university and a supportive relative",
    routine: "work expectations, family responsibilities, and a developing independent routine",
  },
] as const;
const caseMoments = [
  "a last-minute change to a plan",
  "a conversation that felt difficult to interpret",
  "several demanding tasks arriving together",
  "an unfamiliar appointment or meeting",
  "a reminder of an earlier stressful period",
  "a day with less sleep and more demands than usual",
  "a moment when reassurance was not immediately available",
  "a small setback after a more settled week",
  "an expectation that had not been clearly discussed",
  "a transition that brought both opportunity and uncertainty",
] as const;
const copingExperiments = [
  "writing down a worry and returning to it at a planned time",
  "taking a brief pause before responding to an uncertain message",
  "breaking a large task into a first step that takes less than fifteen minutes",
  "noticing a body cue and naming it without immediately interpreting it as danger",
  "asking one specific question instead of seeking repeated broad reassurance",
  "setting a clear stopping point between work and personal time",
  "making a plan for rest before the week becomes crowded",
  "practising a manageable version of a situation they had been avoiding",
  "sharing one concrete need with a person they trust",
  "keeping a short record of what helped after a difficult moment",
] as const;

function buildCaseReport(
  person: string,
  category: (typeof categories)[number],
  situation: string,
  categoryIndex: number,
  caseIndex: number,
) {
  const profile = caseProfiles[(caseIndex + categoryIndex * 3) % caseProfiles.length]!;
  const moment = caseMoments[(caseIndex * 3 + categoryIndex) % caseMoments.length]!;
  const experiment = copingExperiments[(caseIndex + categoryIndex * 2) % copingExperiments.length]!;
  const baseline = 43 + ((caseIndex * 3 + categoryIndex) % 13);
  const laterScore = Math.min(78, baseline + 8 + ((caseIndex + categoryIndex * 2) % 9));

  const sections = [
    {
      heading: "Profile",
      paragraphs: [
        `${person} is an educational composite in ${profile.stage}. In this scenario, they work as ${profile.role} and are navigating ${category.setting}. They are also managing ${profile.routine}. The case is written as a coherent learning example, not as a record of an actual person, interview, or clinical assessment. Details are deliberately invented to show how anxiety can appear within an ordinary life that also contains responsibilities, relationships, preferences, and meaningful strengths. The central theme is ${category.name.toLowerCase()}, especially the way ${category.trigger} can make uncertainty feel more difficult to carry.`,
        `Outside the concern that brings them into the story, ${person} values ${profile.strength}. Their current sources of support include ${profile.support}. Those relationships are not presented as a cure or as always being available; they are part of the social context the person may draw on with consent and at a comfortable pace. The profile avoids reducing them to a symptom list. Work, home, rest, and personal interests all matter because distress changes with context.`,
      ],
    },
    {
      heading: "Background",
      paragraphs: [
        `The weeks before the story opens have been full rather than dramatic. ${person} is trying to keep up with ${situation} while maintaining familiar responsibilities in ${category.setting}. A few practical changes have narrowed the space between demands: plans are less predictable, recovery time is easier to postpone, and ordinary decisions require more effort than they did during a calmer period. None of these circumstances alone explains anxiety. Together, they provide context for why the person may have less capacity available when ${category.trigger} becomes salient. The case treats pressure as cumulative and uneven, rather than assuming a single event caused the whole experience.`,
        `Earlier experiences also shape what feels manageable now. ${person} has previously found that routine, preparation, or talking things through can be useful, but those strategies have not always been easy to access in a crowded week. Their environment offers some resources, including ${profile.support}, while also containing limits such as time, energy, privacy, or distance. A fair account notices both. The purpose of the background is not to search for a hidden defect or blame a family, workplace, school, or relationship. It is to understand what was happening around the person, what changed recently, and which existing strengths might support a gradual response.`,
      ],
    },
    {
      heading: "Presenting Concerns",
      paragraphs: [
        `${person} describes worry that becomes especially noticeable around ${category.trigger}. Their thoughts tend to move quickly from an unresolved question to several possible negative outcomes. The pattern is strongest after ${moment}, when it can be hard to distinguish a realistic next step from a demand to feel completely certain first. They notice tension, restlessness, and difficulty returning attention to the task in front of them.`,
        `The concern has begun to affect daily choices. At times ${person} delays a task, checks for reassurance, or keeps mentally rehearsing what might happen. These responses offer a short-lived sense of control, yet can take time away from sleep, concentration, or valued activities when they become the main way of coping. The case does not suggest that every instance of checking or postponing is pathological. It asks what the behavior is doing in this person’s context, how often it occurs, what relief follows, and whether the pattern is interfering with something important to them. That distinction keeps the story compassionate rather than judgmental.`,
      ],
    },
    {
      heading: "Assessment",
      paragraphs: [
        `In a real service, assessment would be a collaborative conversation with a qualified professional, shaped by the person's goals, culture, health history, and informed consent. This educational composite has no clinical interview and uses no standardized diagnostic measures. For learning purposes, a reviewer would want to ask when the worry began, how it changes across settings, what the person has already tried, and how sleep, physical health, medication, substance use, work, study, and relationships may be relevant. Any concerning or unfamiliar physical symptoms would warrant appropriate medical advice rather than an assumption that anxiety is the cause.`,
        `The illustrative review organizes information into situations, thoughts, body cues, actions, and short-term consequences. It also notes protective factors: ${profile.strength}, existing support from ${profile.support}, and the person’s own reason for wanting a different relationship with uncertainty. A useful assessment would distinguish the person’s observation from the observer’s interpretation, check whether the summary feels accurate, and invite corrections. Risk, impairment, and immediate safety would require direct, appropriate professional assessment; they cannot be inferred from this educational narrative. The material therefore supports mental-health literacy only and should never be treated as an individual clinical recommendation.`,
      ],
    },
    {
      heading: "Psychological Analysis",
      paragraphs: [
        `One possible learning formulation is that uncertainty is acting as a cue for threat monitoring. When thoughts about ${category.trigger} become prominent, ${person} may scan for what could go wrong, notice bodily activation, and interpret that activation as evidence that more checking or preparation is needed. The checking can reduce distress briefly, which makes it more likely to be repeated. If an activity is postponed, the immediate relief can similarly strengthen avoidance, even though the original task remains unresolved.`,
        `A balanced formulation also recognizes why the pattern may have developed. Preparing carefully, seeking information, or avoiding an overwhelming situation can be adaptive in some circumstances. The difficulty arises when a useful strategy becomes rigid, costly, or disconnected from the actual level of risk. For ${person}, the context of ${category.setting} and the recent experience of ${moment} may make a high-alert response understandable. The aim is not to eliminate all worry or to demand perfect calm. It is to increase choice: notice a signal, check the facts proportionately, and select an action connected to personal priorities while allowing some uncertainty to remain.`,
      ],
    },
    {
      heading: "Treatment Roadmap",
      paragraphs: [
        `The roadmap below is an educational illustration, not a treatment plan or prescription. In real care, goals and pace belong to the person and their qualified clinician. An initial step could be agreeing on one area that matters to ${person}, such as protecting sleep, returning to a valued task, or reducing the time spent in a reassurance loop. Together they might map one recent episode and choose a small experiment that feels challenging but manageable. Options could include ${experiment}, alongside a grounding practice or a brief record of the situation, thought, body cue, action, and result.`,
        `The next steps would be reviewed collaboratively rather than delivered as a fixed sequence. If the experiment is useful, it can be repeated in a slightly different setting; if it is too demanding, the task can be made smaller or paused. For avoidance patterns, a licensed professional might discuss gradual, supported practice that respects consent and safety. For practical pressures, a plan could include clarifying expectations or asking for an accommodation where appropriate. The existing habit most relevant here is ${category.habit}. Professional support should be tailored to the individual, and urgent or worsening concerns should be taken to qualified services rather than managed through this example.`,
      ],
    },
    {
      heading: "Progress Tracking",
      paragraphs: [
        `The timeline is illustrative, not evidence that a particular strategy produces a particular result. In week one, ${person} begins by noticing two or three recurring situations without trying to record every feeling. In weeks two and three, they test one small adjustment, such as ${experiment}, and note what happened before and after. Around week four, they review whether the experiment felt realistic, what got in the way, and whether the goal still matters. A difficult day is recorded as context, not failure. Tracking focuses on function and personal meaning rather than scoring every emotion as good or bad.`,
        `In later weeks, the person may repeat a helpful step, modify an unhelpful one, or decide that another kind of support is needed. A setback after ${moment} would be expected as part of ordinary change, not proof that nothing has improved. For demonstration only, an invented index might move from ${baseline} to ${laterScore} on the project’s illustrative ARI scale. That number is synthetic, unvalidated, and cannot demonstrate treatment effect, recovery, or clinical risk. In real life, measures should be interpreted cautiously alongside conversation, context, and the person’s own account.`,
      ],
    },
    {
      heading: "Final Outcome",
      paragraphs: [
        `By the end of this educational example, ${person} has not reached a permanently worry-free state. Instead, they are somewhat more able to notice when the old cycle is beginning, name what they need, and choose a next step without waiting for complete certainty. One change that feels meaningful is ${category.habit}. Another is using support from ${profile.support} more intentionally, with clear limits about what they want to share.`,
        `Some situations remain difficult, and the person may still postpone, seek reassurance, or have restless nights. Their response is to treat those moments as information and consider whether the plan needs adjustment. If distress persists, intensifies, or interferes substantially with daily life, the appropriate next step is individualized guidance from a qualified mental-health or medical professional. The outcome is therefore modest and realistic: more awareness, a few workable options, and a clearer understanding of when additional support could help. There is no promised timeline, universal endpoint, or single definition of success.`,
      ],
    },
    {
      heading: "Key Learnings",
      paragraphs: [
        `This case illustrates that anxiety can be both understandable and costly. ${person}’s pattern developed in the context of real demands, familiar strengths, and limited recovery time; it is not a sign of weakness or a personal failure. A behavior that offers quick relief may also keep a worry cycle going, but that possibility should be explored with curiosity rather than used to criticize someone. Small experiments are most useful when they connect to a goal the person chooses, fit the realities of their week, and can be revised when circumstances change.`,
        `For readers, the central lesson is not to compare their life with ${person}’s or to use the example to self-diagnose. Notice what happens in your own context, consider what support is available, and seek professional advice when symptoms are persistent, severe, unfamiliar, or disruptive. Different people need different approaches, and barriers such as cost, access, culture, disability, and safety matter. This educational composite is designed to prompt informed questions and compassionate reflection. Its invented details and scores should remain educational examples, never evidence about real patients or a substitute for assessment and care.`,
      ],
    },
  ];

  return sections;
}

export const cases = categories.flatMap((category, ci) =>
  Array.from({ length: category.count }, (_, i) => {
    const person = people[i % people.length]!;
    const situation = situations[(i + ci) % situations.length]!;
    const report = buildCaseReport(person, category, situation, ci, i);
    return {
      id: `${ci + 1}-${i + 1}`,
      category: category.name,
      title: `${person} and ${situation}`,
      background: `${person} was navigating ${category.setting} while trying to maintain everyday routines. This educational composite illustrates a common experience, not a real patient record.`,
      symptoms: `They noticed restless thoughts, tension, and difficulty concentrating. Experiences vary between individuals.`,
      triggers: `The most noticeable pattern was ${category.trigger}, particularly when rest or support was limited.`,
      explanation: `Stress can make the body's alert system more sensitive. Thoughts, sensations, and avoidance may reinforce one another without implying a diagnosis.`,
      patterns: `On challenging days, ${person} tended to postpone tasks and check for reassurance more often.`,
      coping: `They explored paced breathing, naming the worry, and ${category.habit}. These are educational examples, not a treatment plan.`,
      recovery: `Small, repeatable steps and reflection helped them notice patterns. A qualified professional can help tailor support when difficulties persist.`,
      improvement: `Illustrative ARI: ${43 + (i % 10)} → ${56 + (i % 12)}. These invented scores demonstrate the calculation only; they do not prove effectiveness.`,
      lesson: `Progress is individual; observing patterns and seeking support can be more helpful than aiming for perfect days.`,
      report,
      reportWordCount: report.reduce(
        (total, section) =>
          total + section.paragraphs.join(" ").split(/\s+/).filter(Boolean).length,
        0,
      ),
    };
  }),
);
export const disorderData = [
  {
    name: "Generalized Anxiety Disorder",
    summary: "Persistent worry across multiple areas of life.",
    symptoms: "Restlessness, muscle tension, fatigue, difficulty concentrating.",
    triggers: "Uncertainty, multiple responsibilities, major changes.",
    explanation:
      "A persistent threat-monitoring pattern may make everyday uncertainty feel harder to tolerate.",
    coping:
      "Worry time, grounding, sleep routines, and cognitive-behavioral approaches with a clinician.",
  },
  {
    name: "Social Anxiety Disorder",
    summary: "Strong fear of being judged or embarrassed in social situations.",
    symptoms: "Anticipatory worry, blushing, avoidance, self-consciousness.",
    triggers: "Presentations, unfamiliar groups, being observed.",
    explanation:
      "Attention may narrow toward perceived mistakes and overestimate others’ judgments.",
    coping: "Gradual supported practice, self-compassion, and cognitive-behavioral therapy.",
  },
  {
    name: "Panic Disorder",
    summary: "Repeated unexpected panic attacks and worry about future attacks.",
    symptoms: "Sudden fear, racing heart, dizziness, shortness of breath.",
    triggers: "Bodily sensations, stress, or sometimes no identifiable trigger.",
    explanation: "Normal body sensations can be misread as dangerous, amplifying alarm.",
    coping: "Paced breathing, learning about the panic cycle, and clinician-guided CBT.",
  },
  {
    name: "Health Anxiety",
    summary: "Distressing worry about having or developing a serious illness.",
    symptoms: "Body checking, repeated reassurance-seeking, symptom searching.",
    triggers: "New sensations, health stories, medical uncertainty.",
    explanation: "Checking may briefly reassure but can keep attention focused on threat.",
    coping:
      "Reduce repetitive checking, track patterns, and seek professional advice for concerns.",
  },
  {
    name: "Performance Anxiety",
    summary: "Worry tied to being evaluated during a task or event.",
    symptoms: "Shaking, self-doubt, concentration difficulty.",
    triggers: "Exams, auditions, public speaking.",
    explanation: "High stakes and self-focused attention can increase stress responses.",
    coping: "Practice, realistic preparation, grounding, and supportive feedback.",
  },
  {
    name: "Academic Anxiety",
    summary: "Stress and worry around learning, assessment, and achievement.",
    symptoms: "Procrastination, sleep disruption, overwhelm.",
    triggers: "Deadlines, grades, workload, comparisons.",
    explanation: "Pressure can make tasks feel threatening and avoidance temporarily appealing.",
    coping: "Break work into steps, plan rest, and contact campus support.",
  },
  {
    name: "Workplace Anxiety",
    summary: "Worry related to work expectations and professional relationships.",
    symptoms: "Rumination after work, tension, difficulty switching off.",
    triggers: "Unclear roles, workload, conflict, job uncertainty.",
    explanation: "Ongoing demands without recovery time can sustain stress arousal.",
    coping: "Clarify priorities, set boundaries, use breaks, and seek workplace support.",
  },
  {
    name: "Relationship Anxiety",
    summary: "Worry connected to closeness, communication, and uncertainty.",
    symptoms: "Overthinking messages, reassurance-seeking, emotional tension.",
    triggers: "Conflict, delayed replies, life changes.",
    explanation: "Uncertainty and past experiences can shape interpretations of interactions.",
    coping: "Communicate needs, reflect on assumptions, and consider counseling when needed.",
  },
];
