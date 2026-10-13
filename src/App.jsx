import React, { useState, useEffect, useRef } from 'react';
import quizData from './data/quizData.json';
import StartScreen from './components/StartScreen';
import QuizHeader from './components/QuizHeader';
import QuizCard from './components/QuizCard';
import ScoreSummary from './components/ScoreSummary';
import { prepareQuizQuestions, shuffleArray, WEEK_TOPICS } from './utils/shuffle';

export default function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('hci_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('hci_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('hci_theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  // App Screen: 'start' | 'quiz' | 'summary'
  const [screen, setScreen] = useState('start');

  // Quiz configuration and active state
  const [quizTitle, setQuizTitle] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [isImmediateFeedback, setIsImmediateFeedback] = useState(true);
  const [hasSubmittedCurrent, setHasSubmittedCurrent] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  // Active timer
  const timerRef = useRef(null);

  useEffect(() => {
    if (screen === 'quiz') {
      timerRef.current = setInterval(() => {
        setSecondsElapsed(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [screen]);

  // Clean strings comparison helper
  const isMatch = (str1, str2) => {
    if (!str1 || !str2) return false;
    return str1.trim().toLowerCase() === str2.trim().toLowerCase();
  };

  // Start Week-wise Quiz
  const handleStartWeekQuiz = ({ weekKey, randomizeQuestions, randomizeOptions, isImmediateFeedback: immediate }) => {
    const rawQuestions = quizData[weekKey] || [];
    const prepared = prepareQuizQuestions(rawQuestions, {
      randomizeQuestions,
      randomizeOptions,
    });
    const topicInfo = WEEK_TOPICS[weekKey];
    const title = topicInfo ? `${weekKey.toUpperCase().replace('WEEK', 'Week ')}: ${topicInfo.title}` : `Week ${weekKey}`;

    setQuizTitle(title);
    setQuestions(prepared);
    setCurrentIndex(0);
    setUserAnswers({});
    setHasSubmittedCurrent(false);
    setScore(0);
    setStreak(0);
    setSecondsElapsed(0);
    setIsImmediateFeedback(immediate);
    setScreen('quiz');
  };

  // Start Comprehensive Exam Simulation
  const handleStartComprehensiveQuiz = ({ count, randomizeOptions, isImmediateFeedback: immediate }) => {
    let pool = [];
    Object.keys(quizData).forEach(w => {
      pool = pool.concat(quizData[w]);
    });

    const shuffled = shuffleArray(pool);
    const selectedSlice = shuffled.slice(0, Math.min(count, pool.length));
    const prepared = prepareQuizQuestions(selectedSlice, {
      randomizeQuestions: false,
      randomizeOptions,
    });

    setQuizTitle(`Comprehensive Exam (${prepared.length} Questions)`);
    setQuestions(prepared);
    setCurrentIndex(0);
    setUserAnswers({});
    setHasSubmittedCurrent(false);
    setScore(0);
    setStreak(0);
    setSecondsElapsed(0);
    setIsImmediateFeedback(immediate);
    setScreen('quiz');
  };

  // Select option for current question
  const handleSelectAnswer = (option) => {
    setUserAnswers(prev => ({
      ...prev,
      [currentIndex]: option
    }));
  };

  // In Immediate Feedback mode: Submit current answer to evaluate and reveal explanation
  const handleSubmitCurrent = () => {
    const currentQ = questions[currentIndex];
    const selected = userAnswers[currentIndex];
    if (!selected) return;

    setHasSubmittedCurrent(true);

    if (isMatch(selected, currentQ.answer)) {
      setScore(prev => prev + 1);
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }
  };

  // In Immediate Feedback mode: Skip question
  const handleSkip = () => {
    setUserAnswers(prev => ({
      ...prev,
      [currentIndex]: ''
    }));
    setHasSubmittedCurrent(true);
    setStreak(0);
  };

  // Advance to next question or complete quiz
  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      // In immediate feedback, check if next question was already submitted
      setHasSubmittedCurrent(false);
    } else {
      // Completed quiz! In exam mode, compute total score
      if (!isImmediateFeedback) {
        let totalScore = 0;
        questions.forEach((q, idx) => {
          if (isMatch(userAnswers[idx], q.answer)) {
            totalScore += 1;
          }
        });
        setScore(totalScore);
      }
      setScreen('summary');
    }
  };

  // Go to previous question (exam mode)
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  // Retake same quiz with same questions
  const handleRetakeQuiz = () => {
    setCurrentIndex(0);
    setUserAnswers({});
    setHasSubmittedCurrent(false);
    setScore(0);
    setStreak(0);
    setSecondsElapsed(0);
    setScreen('quiz');
  };

  // Practice only missed/skipped questions
  const handlePracticeMissed = (missedList) => {
    if (!missedList || missedList.length === 0) return;
    const prepared = prepareQuizQuestions(missedList, {
      randomizeQuestions: false,
      randomizeOptions: false,
    });
    setQuizTitle(`Targeted Practice (${prepared.length} Missed Questions)`);
    setQuestions(prepared);
    setCurrentIndex(0);
    setUserAnswers({});
    setHasSubmittedCurrent(false);
    setScore(0);
    setStreak(0);
    setSecondsElapsed(0);
    setIsImmediateFeedback(true);
    setScreen('quiz');
  };

  // Return to start menu
  const handleExitQuiz = () => {
    if (screen === 'quiz') {
      const confirmExit = window.confirm("Are you sure you want to exit? Your current quiz progress will be lost.");
      if (!confirmExit) return;
    }
    setScreen('start');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Quiz Header (Only visible during active quiz) */}
      {screen === 'quiz' && (
        <QuizHeader
          quizTitle={quizTitle}
          currentIndex={currentIndex}
          totalQuestions={questions.length}
          score={score}
          streak={streak}
          secondsElapsed={secondsElapsed}
          isImmediateFeedback={isImmediateFeedback}
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
          onExitQuiz={handleExitQuiz}
        />
      )}

      {/* Main Content Area */}
      <main className="grow flex flex-col justify-center px-4 sm:px-6 py-6 sm:py-10 max-w-7xl mx-auto w-full">
        {screen === 'start' && (
          <StartScreen
            weeksData={quizData}
            onStartWeekQuiz={handleStartWeekQuiz}
            onStartComprehensiveQuiz={handleStartComprehensiveQuiz}
            darkMode={darkMode}
            onToggleDarkMode={toggleDarkMode}
          />
        )}

        {screen === 'quiz' && questions.length > 0 && (
          <QuizCard
            question={questions[currentIndex]}
            currentIndex={currentIndex}
            totalQuestions={questions.length}
            selectedAnswer={userAnswers[currentIndex]}
            onSelectAnswer={handleSelectAnswer}
            isImmediateFeedback={isImmediateFeedback}
            hasSubmittedCurrent={hasSubmittedCurrent}
            onSubmitCurrent={handleSubmitCurrent}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onSkip={handleSkip}
            isFirst={currentIndex === 0}
            isLast={currentIndex === questions.length - 1}
          />
        )}

        {screen === 'summary' && (
          <ScoreSummary
            quizTitle={quizTitle}
            questions={questions}
            userAnswers={userAnswers}
            secondsElapsed={secondsElapsed}
            onRetakeQuiz={handleRetakeQuiz}
            onPracticeMissed={handlePracticeMissed}
            onChooseAnotherWeek={() => setScreen('start')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200/80 dark:border-slate-800/80 py-4 text-center text-xs text-slate-500 dark:text-slate-500">
        <p>Human-Computer Interaction (HCI) MOOC Practice Assessment Portal • 12 Weeks • 120 Questions with Explanations</p>
      </footer>
    </div>
  );
}
