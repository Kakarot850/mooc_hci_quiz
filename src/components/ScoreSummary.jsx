import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  RotateCcw, 
  Target, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Home, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  Lightbulb, 
  Award,
  Sparkles,
  BookOpen
} from 'lucide-react';

export default function ScoreSummary({
  quizTitle,
  questions,
  userAnswers,
  secondsElapsed,
  onRetakeQuiz,
  onPracticeMissed,
  onChooseAnotherWeek,
}) {
  const [filterType, setFilterType] = useState('all'); // 'all' | 'incorrect' | 'correct'
  const [expandedId, setExpandedId] = useState(null);

  // Clean strings comparison helper
  const isMatch = (str1, str2) => {
    if (!str1 || !str2) return false;
    return str1.trim().toLowerCase() === str2.trim().toLowerCase();
  };

  // Metrics computation
  const totalQuestions = questions.length;
  let correctCount = 0;
  let incorrectCount = 0;
  let skippedCount = 0;

  const reviewList = questions.map((q, idx) => {
    const userSelected = userAnswers[idx];
    const isSkipped = userSelected === undefined || userSelected === null || userSelected === '';
    const isCorrect = !isSkipped && isMatch(userSelected, q.answer);
    
    if (isCorrect) correctCount++;
    else if (isSkipped) skippedCount++;
    else incorrectCount++;

    return {
      ...q,
      userSelected,
      isCorrect,
      isSkipped,
    };
  });

  const percentage = Math.round((correctCount / totalQuestions) * 100);

  // Performance tier
  let tier = {
    title: 'Needs Review',
    color: 'text-amber-500 dark:text-amber-400',
    bgColor: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60',
    badge: 'Keep practicing to master HCI principles!',
    icon: Target
  };

  if (percentage >= 90) {
    tier = {
      title: 'Mastery',
      color: 'text-emerald-500 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60',
      badge: 'Outstanding! Exceptional grasp of HCI principles!',
      icon: Trophy
    };
  } else if (percentage >= 70) {
    tier = {
      title: 'Proficient',
      color: 'text-indigo-500 dark:text-indigo-400',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800/60',
      badge: 'Great job! Strong foundation across core topics.',
      icon: Award
    };
  }

  // Trigger celebratory confetti on good score
  useEffect(() => {
    if (percentage >= 70) {
      try {
        confetti({
          particleCount: percentage >= 90 ? 120 : 60,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Fallback gracefully
      }
    }
  }, [percentage]);

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}m ${secs}s`;
  };

  const filteredQuestions = reviewList.filter(item => {
    if (filterType === 'correct') return item.isCorrect;
    if (filterType === 'incorrect') return !item.isCorrect;
    return true;
  });

  const hasMissedQuestions = incorrectCount > 0 || skippedCount > 0;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in-50 duration-300">
      {/* Hero Score Card */}
      <div className={`p-8 rounded-3xl border text-center shadow-xl shadow-slate-200/50 dark:shadow-none transition-all ${tier.bgColor}`}>
        <div className="inline-flex p-3 rounded-2xl bg-white dark:bg-slate-900 shadow-sm mb-4">
          <tier.icon className={`w-8 h-8 ${tier.color}`} />
        </div>

        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-white/80 dark:bg-slate-900/80 mb-2 border border-slate-200 dark:border-slate-800">
          Performance Tier: {tier.title}
        </span>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-heading tracking-tight mb-2">
          {percentage}% Score
        </h2>

        <p className="text-slate-600 dark:text-slate-300 text-sm max-w-md mx-auto mb-6">
          {tier.badge}
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-xs">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1 flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              Correct
            </div>
            <div className="text-xl font-bold text-slate-900 dark:text-white">
              {correctCount} <span className="text-xs text-slate-400 font-normal">/ {totalQuestions}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-xs">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1 flex items-center justify-center gap-1">
              <XCircle className="w-3.5 h-3.5 text-rose-500" />
              Incorrect
            </div>
            <div className="text-xl font-bold text-slate-900 dark:text-white">
              {incorrectCount}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-xs">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1 flex items-center justify-center gap-1">
              <Target className="w-3.5 h-3.5 text-amber-500" />
              Skipped
            </div>
            <div className="text-xl font-bold text-slate-900 dark:text-white">
              {skippedCount}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-xs">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1 flex items-center justify-center gap-1">
              <Clock className="w-3.5 h-3.5 text-indigo-500" />
              Time Spent
            </div>
            <div className="text-xl font-bold text-slate-900 dark:text-white">
              {formatTime(secondsElapsed)}
            </div>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onRetakeQuiz}
            className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-md shadow-indigo-600/20 flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Quiz</span>
          </button>

          {hasMissedQuestions && (
            <button
              onClick={() => onPracticeMissed(reviewList.filter(q => !q.isCorrect))}
              className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-rose-600 hover:bg-rose-700 text-white transition-all shadow-md shadow-rose-600/20 flex items-center gap-2 cursor-pointer"
            >
              <Target className="w-4 h-4" />
              <span>Practice Missed ({incorrectCount + skippedCount})</span>
            </button>
          )}

          <button
            onClick={onChooseAnotherWeek}
            className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Choose Another Week</span>
          </button>
        </div>
      </div>

      {/* Review Section */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white font-heading flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Comprehensive Question Review
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Inspect answer choices, correct answers, and pedagogical rationales
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-medium">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                filterType === 'all' 
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-semibold' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              All ({totalQuestions})
            </button>
            <button
              onClick={() => setFilterType('incorrect')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                filterType === 'incorrect' 
                  ? 'bg-rose-500 text-white shadow-xs font-semibold' 
                  : 'text-rose-600 dark:text-rose-400 hover:text-rose-700'
              }`}
            >
              Missed ({incorrectCount + skippedCount})
            </button>
            <button
              onClick={() => setFilterType('correct')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                filterType === 'correct' 
                  ? 'bg-emerald-500 text-white shadow-xs font-semibold' 
                  : 'text-emerald-600 dark:text-emerald-400 hover:text-emerald-700'
              }`}
            >
              Correct ({correctCount})
            </button>
          </div>
        </div>

        {/* Question Review Cards */}
        <div className="space-y-3">
          {filteredQuestions.map((item, idx) => {
            const isExpanded = expandedId === item.id;
            return (
              <div 
                key={idx}
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs transition-colors"
              >
                <div 
                  className="flex items-start justify-between gap-4 cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                >
                  <div className="flex items-start gap-3 grow">
                    <span className="mt-0.5 shrink-0">
                      {item.isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : item.isSkipped ? (
                        <Target className="w-5 h-5 text-amber-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-rose-500" />
                      )}
                    </span>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-400">Q{item.id}</span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          item.isCorrect 
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300' 
                            : item.isSkipped 
                              ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                              : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                        }`}>
                          {item.isCorrect ? 'Correct' : item.isSkipped ? 'Skipped' : 'Incorrect'}
                        </span>
                      </div>
                      <h4 className="text-sm sm:text-base font-medium text-slate-900 dark:text-white leading-snug">
                        {item.question}
                      </h4>
                    </div>
                  </div>

                  <button 
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 shrink-0"
                    aria-label="Toggle details"
                  >
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>

                {/* Details Accordion */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3 animate-in fade-in-50 duration-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                        <span className="font-semibold text-slate-500 dark:text-slate-400 block mb-0.5">Your Choice:</span>
                        <span className={item.isCorrect ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-rose-600 dark:text-rose-400 font-medium'}>
                          {item.userSelected || '(Skipped - No Answer Selected)'}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-800/50">
                        <span className="font-semibold text-emerald-700 dark:text-emerald-400 block mb-0.5">Accepted Correct Answer:</span>
                        <span className="text-emerald-800 dark:text-emerald-200 font-medium">
                          {item.answer}
                        </span>
                      </div>
                    </div>

                    {/* Educational Explanation */}
                    {item.explanation && (
                      <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                        <p className="font-semibold text-slate-900 dark:text-white mb-1 flex items-center gap-1.5">
                          <Lightbulb className="w-4 h-4 text-amber-500" />
                          Explanation & Pedagogical Rationale:
                        </p>
                        <p className="leading-relaxed">{item.explanation}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
