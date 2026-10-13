/**
 * Fisher-Yates true random shuffle algorithm.
 * Returns a new shuffled array without mutating the original.
 */
export function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Prepares questions for a quiz session.
 * Optionally shuffles question order and/or option order.
 */
export function prepareQuizQuestions(questions, { randomizeQuestions = false, randomizeOptions = false } = {}) {
  let processed = questions.map((q, idx) => ({
    ...q,
    originalIndex: idx,
    options: randomizeOptions ? shuffleArray(q.options) : [...q.options],
  }));

  if (randomizeQuestions) {
    processed = shuffleArray(processed);
  }

  return processed;
}

/**
 * Topic metadata for the 12 HCI weeks for rich display.
 */
export const WEEK_TOPICS = {
  week1: { title: "Introduction to HCI", subtitle: "Usability factors, affordance, feedback & design principles" },
  week2: { title: "UX & Inclusivity", subtitle: "Information architecture, accessibility, errors & IxD teams" },
  week3: { title: "Design Thinking", subtitle: "Empathize, double diamond, prototypes & activity-centered design" },
  week4: { title: "User Perspectives & Research", subtitle: "Empathy maps, personas, surveys & affinity mapping" },
  week5: { title: "Interaction Paradigms & Styles", subtitle: "Direct manipulation, conversing, CLI & interface metaphors" },
  week6: { title: "Data Gathering & Analysis", subtitle: "Quantitative vs qualitative, interviews, focus groups & metrics" },
  week7: { title: "Prototyping Techniques", subtitle: "Lo-fi to hi-fi, storyboards, wizard-of-oz & horizontal prototyping" },
  week8: { title: "Usability Evaluation & Metrics", subtitle: "Heuristic evaluation, think-aloud, formative vs diagnostic" },
  week9: { title: "HCI in IoT & Wearables", subtitle: "Contextual data, cognitive overload, haptics & tangible interfaces" },
  week10: { title: "LLMs & Behavior Modeling", subtitle: "Zero/few-shot prompting, multimodal AI & adaptive learning" },
  week11: { title: "Privacy, Security & Ethics", subtitle: "2FA, dark patterns, GDPR, deepfakes, SHAP & Zero Trust" },
  week12: { title: "Conversational AI & Systems", subtitle: "NLU, dialogue management, multimodal analysis & 24/7 agents" },
};
