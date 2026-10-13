# HCI Quiz Web App — Agent Prompt & Specifications

Use the prompt below to generate a modern, responsive Quiz Web App using React and Tailwind CSS based on your `quizData.json` file.

---

## 📋 AI Agent Prompt

Copy and paste the prompt below directly into your AI coding assistant:

```text
Act as an expert Senior Frontend Engineer specializing in React, TypeScript/JavaScript, and Tailwind CSS.

### Objective
Create a responsive, production-ready Quiz Web Application using React and Tailwind CSS. The app will consume a quiz dataset structured by weeks (e.g., Week 1 to Week 12) from `quizData.json`.

---

### Core Requirements & Features

1. **Dataset Integration & Explanations:**
   - The JSON contains weeks with items having: `id`, `question`, `options`, `answer`, and `points`.
   - Add a detailed educational **explanation** for every single question. When the user submits an answer or completes a question, display this explanation explaining why the correct choice is right and context on the wrong options.
   - Maintain the data schema:
     ```typescript
     interface Question {
       id: number;
       question: string;
       options: string[];
       answer: string;
       points: string;
       explanation: string;
     }
     ```

2. **Quiz Modes:**
   - **Week-Wise Mode:**
     - User selects a specific week (e.g., Week 1 through Week 12).
     - Questions are loaded sequentially or optionally randomized within that week.
   - **Randomized / Comprehensive Mode:**
     - Option to draw a custom number of randomized questions across all available weeks (e.g., 10, 20, or 50 questions).
     - Implements the Fisher-Yates shuffle algorithm to ensure true randomness for questions and option orders.

3. **Scoring & Progress Tracking:**
   - Live score tracker (Points Earned / Total Available Points).
   - Dynamic visual progress bar (e.g., "Question 4 of 10").
   - Immediate feedback mode vs. Exam mode:
     - Allow an option to see instant feedback per question (showing the correct/incorrect state, highlight colors, and explanation immediately upon selection) OR view the explanation at the end.
   - Streak counter for consecutive correct answers to gamify the experience.

4. **Results & Summary Dashboard:**
   - Total score with percentage and performance tier (e.g., "Mastery", "Proficient", "Needs Review").
   - Summary breakdown showing:
     - Total Correct vs. Incorrect vs. Skipped.
     - Time taken (built-in timer).
   - "Review Quiz" section displaying all attempted questions, user-selected answers, correct answers, and full explanations.
   - Action buttons: "Retake Quiz", "Practice Missed Questions Only", and "Choose Another Week".

5. **Design & UI/UX (Tailwind CSS):**
   - Clean, modern layout (centered card design, soft slate/zinc neutrals, subtle gradients, polished borders, and shadows).
   - Clear state styles:
     - Default option: neutral border with subtle hover highlight.
     - Selected option: blue/indigo border.
     - Correct option on review: emerald/green badge with checkmark icon.
     - Incorrect option on review: red/rose badge with cross icon.
   - Dark mode toggle with persistent local storage support.
   - Fully accessible: keyboard navigable options (1-4 or A-D keys, Enter for next), high contrast ratios, and responsive on mobile, tablet, and desktop screens.

---

### Architecture & Tech Stack

- **Framework:** React 18+ (Vite or Next.js App Router).
- **Styling:** Tailwind CSS with Lucide-React icons (or Heroicons).
- **State Management:** Clean React hooks (`useState`, `useMemo`, `useCallback`, `useEffect`).
- **Data Source:** `src/data/quizData.json` (provide a populated version with the HCI questions and custom added explanations).

---

### Deliverables Expected

1. Provide the complete `quizData.json` with added `explanation` fields for each question.
2. Provide all necessary component files:
   - `QuizHeader.jsx`: Mode selector, dark mode switch, and stats.
   - `QuizCard.jsx`: Question rendering, selectable options, instant feedback state, and explanation accordion.
   - `ScoreSummary.jsx`: End-of-quiz analytics, score percentage, review list, and retry options.
   - `App.jsx`: Main routing/state orchestration (Start Screen -> Active Quiz -> Score Screen).
3. Ensure zero build errors, clean TypeScript/PropTypes definitions, and modular folder structure.