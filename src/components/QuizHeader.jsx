import React from 'react';
import { 
  Flame, 
  Clock, 
  Award, 
  Moon, 
  Sun, 
  LogOut, 
  Zap, 
  FileText 
} from 'lucide-react';

export default function QuizHeader({
  quizTitle,
  currentIndex,
  totalQuestions,
  score,
  streak,
  secondsElapsed,
  isImmediateFeedback,
  darkMode,
  onToggleDarkMode,
  onExitQuiz,
}) {
  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Quiz Info & Back */}
        <div className="flex items-center gap-3">
          <button
            onClick={onExitQuiz}
            aria-label="Exit quiz to start menu"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm flex items-center gap-1.5 font-medium"
            title="Quit and return to Home"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Exit</span>
          </button>

          <div className="h-5 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white tracking-tight line-clamp-1">
                {quizTitle}
              </h1>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                isImmediateFeedback 
                  ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50' 
                  : 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50'
              }`}>
                {isImmediateFeedback ? <Zap className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                <span className="hidden xs:inline">{isImmediateFeedback ? 'Instant Feedback' : 'Exam Mode'}</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Question <span className="font-semibold text-indigo-600 dark:text-indigo-400">{currentIndex + 1}</span> of {totalQuestions}
            </p>
          </div>
        </div>

        {/* Right: Live Metrics & Dark Mode */}
        <div className="flex items-center gap-2 sm:gap-4 ml-auto">
          {/* Streak Counter */}
          <div 
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              streak > 1 
                ? 'bg-orange-100 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800 scale-105 shadow-xs' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
            title={`${streak} consecutive correct answers!`}
          >
            <Flame className={`w-3.5 h-3.5 ${streak > 1 ? 'animate-bounce text-orange-500 fill-orange-500' : ''}`} />
            <span>{streak}</span>
          </div>

          {/* Points Tracker */}
          <div 
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/50"
            title="Points earned"
          >
            <Award className="w-3.5 h-3.5 text-emerald-500" />
            <span>{score} pts</span>
          </div>

          {/* Timer */}
          <div 
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            title="Time elapsed"
          >
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{formatTime(secondsElapsed)}</span>
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            aria-label="Toggle dark mode theme"
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
        </div>
      </div>
    </header>
  );
}
