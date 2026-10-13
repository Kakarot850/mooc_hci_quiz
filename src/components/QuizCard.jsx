import React, { useEffect, useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  ArrowLeft, 
  HelpCircle, 
  Sparkles, 
  ChevronRight,
  Lightbulb,
  Check,
  SkipForward
} from 'lucide-react';

const OPTION_LABELS = ['A', 'B', 'C', 'D', 'E', 'F'];

export default function QuizCard({
  question,
  currentIndex,
  totalQuestions,
  selectedAnswer,
  onSelectAnswer,
  isImmediateFeedback,
  hasSubmittedCurrent,
  onSubmitCurrent,
  onNext,
  onPrevious,
  onSkip,
  isFirst,
  isLast,
}) {
  const [showExplanation, setShowExplanation] = useState(true);

  // Keyboard navigation listener (1-4 or A-D, Enter to submit/advance)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if typing inside input or textarea
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      const key = e.key.toLowerCase();
      
      // Numbers 1-4
      if (['1', '2', '3', '4'].includes(key)) {
        const index = parseInt(key, 10) - 1;
        if (question.options[index] && (!isImmediateFeedback || !hasSubmittedCurrent)) {
          onSelectAnswer(question.options[index]);
        }
      }
      // Letters A-D
      if (['a', 'b', 'c', 'd'].includes(key)) {
        const index = key.charCodeAt(0) - 97;
        if (question.options[index] && (!isImmediateFeedback || !hasSubmittedCurrent)) {
          onSelectAnswer(question.options[index]);
        }
      }

      // Enter key handler
      if (e.key === 'Enter') {
        if (isImmediateFeedback) {
          if (!hasSubmittedCurrent && selectedAnswer) {
            e.preventDefault();
            onSubmitCurrent();
          } else if (hasSubmittedCurrent) {
            e.preventDefault();
            onNext();
          }
        } else {
          // In exam mode, Enter advances if an answer is selected
          if (selectedAnswer && !isLast) {
            e.preventDefault();
            onNext();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    question.options, 
    selectedAnswer, 
    isImmediateFeedback, 
    hasSubmittedCurrent, 
    onSubmitCurrent, 
    onNext, 
    onSelectAnswer, 
    isLast
  ]);

  // Clean strings comparison helper
  const isMatch = (str1, str2) => {
    if (!str1 || !str2) return false;
    return str1.trim().toLowerCase() === str2.trim().toLowerCase();
  };

  const isCurrentCorrect = isMatch(selectedAnswer, question.answer);
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Progress Bar Container */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 font-medium">
          <span>Question Progress</span>
          <span>{progressPercent}% Complete</span>
        </div>
        <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
          <div 
            className="h-full bg-linear-to-r from-indigo-500 via-indigo-600 to-purple-600 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xl shadow-slate-200/40 dark:shadow-none p-6 sm:p-8 transition-colors">
        {/* Card Header: Tags & Points */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/40">
              Q{currentIndex + 1}
            </span>
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
              {question.points || '1 Point'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="hidden sm:inline">Shortcuts:</span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-[10px]">1-4</kbd>
            <span className="hidden sm:inline">or</span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-[10px]">A-D</kbd>
          </div>
        </div>

        {/* Question Text */}
        <h2 className="text-lg sm:text-xl font-medium text-slate-900 dark:text-white leading-relaxed mb-6 font-heading">
          {question.question}
        </h2>

        {/* Multiple Choice Options List */}
        <div className="space-y-3" role="radiogroup" aria-label="Question Options">
          {question.options.map((option, idx) => {
            const label = OPTION_LABELS[idx] || (idx + 1);
            const isSelected = isMatch(selectedAnswer, option);
            const isAnswerOption = isMatch(question.answer, option);
            
            // Determine styling states
            let optionStyles = "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 text-slate-800 dark:text-slate-200";
            let badgeStyles = "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400";
            let icon = null;

            if (isImmediateFeedback && hasSubmittedCurrent) {
              // Answer has been submitted
              if (isAnswerOption) {
                // Correct Answer
                optionStyles = "border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100 ring-2 ring-emerald-500/20";
                badgeStyles = "bg-emerald-500 text-white border-emerald-500";
                icon = <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 ml-auto shrink-0" />;
              } else if (isSelected && !isAnswerOption) {
                // Incorrect choice selected by user
                optionStyles = "border-rose-500 bg-rose-50/80 dark:bg-rose-950/40 text-rose-900 dark:text-rose-100 ring-2 ring-rose-500/20";
                badgeStyles = "bg-rose-500 text-white border-rose-500";
                icon = <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 ml-auto shrink-0" />;
              } else {
                optionStyles = "border-slate-200/50 dark:border-slate-800/50 opacity-50 bg-transparent text-slate-500";
              }
            } else {
              // Normal selectable state
              if (isSelected) {
                optionStyles = "border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-100 ring-2 ring-indigo-500/30 shadow-xs";
                badgeStyles = "bg-indigo-600 text-white border-indigo-600";
                icon = <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 ml-auto shrink-0" />;
              }
            }

            const isOptionDisabled = isImmediateFeedback && hasSubmittedCurrent;

            return (
              <button
                key={idx}
                type="button"
                disabled={isOptionDisabled}
                onClick={() => onSelectAnswer(option)}
                className={`w-full text-left p-4 rounded-xl border-2 flex items-center gap-3.5 transition-all duration-150 cursor-pointer disabled:cursor-default ${optionStyles}`}
                aria-checked={isSelected}
                role="radio"
              >
                {/* Option Letter Badge */}
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold border transition-colors shrink-0 ${badgeStyles}`}>
                  {label}
                </span>

                {/* Option Text */}
                <span className="text-sm sm:text-base font-normal leading-snug grow">
                  {option}
                </span>

                {/* Status Icon */}
                {icon}
              </button>
            );
          })}
        </div>

        {/* Immediate Feedback Explanation Card */}
        {isImmediateFeedback && hasSubmittedCurrent && (
          <div className={`mt-6 rounded-xl border p-5 transition-all animate-in fade-in-50 duration-200 ${
            isCurrentCorrect 
              ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-100' 
              : 'bg-rose-50/60 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/60 text-rose-900 dark:text-rose-100'
          }`}>
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2 font-semibold text-sm">
                {isCurrentCorrect ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Correct Answer!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                    <span>Incorrect Answer</span>
                  </>
                )}
              </div>

              <button
                onClick={() => setShowExplanation(!showExplanation)}
                className="text-xs font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white flex items-center gap-1 transition-colors"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                <span>{showExplanation ? 'Hide Explanation' : 'Show Explanation'}</span>
              </button>
            </div>

            {!isCurrentCorrect && (
              <p className="text-xs text-rose-800 dark:text-rose-300 mb-2 font-medium">
                Correct answer: <span className="font-semibold underline">{question.answer}</span>
              </p>
            )}

            {showExplanation && question.explanation && (
              <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-800/60 text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                <p className="font-medium text-slate-900 dark:text-slate-200 mb-1 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
                  Key Takeaway & Rationale:
                </p>
                <p>{question.explanation}</p>
              </div>
            )}
          </div>
        )}

        {/* Card Footer Actions */}
        <div className="mt-8 pt-5 border-t border-slate-100 dark:border-slate-800/70 flex flex-wrap items-center justify-between gap-3">
          {/* Previous Button (for exam mode) */}
          {!isImmediateFeedback ? (
            <button
              onClick={onPrevious}
              disabled={isFirst}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-colors flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
          ) : (
            <div>
              {/* Skip option in immediate feedback mode if not submitted */}
              {!hasSubmittedCurrent && (
                <button
                  onClick={onSkip}
                  className="px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <SkipForward className="w-4 h-4" />
                  <span>Skip Question</span>
                </button>
              )}
            </div>
          )}

          {/* Action buttons on the right */}
          <div className="flex items-center gap-2 ml-auto">
            {isImmediateFeedback ? (
              !hasSubmittedCurrent ? (
                <button
                  onClick={onSubmitCurrent}
                  disabled={!selectedAnswer}
                  className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:pointer-events-none transition-all shadow-md shadow-indigo-600/20 flex items-center gap-2 cursor-pointer"
                >
                  <span>Submit Answer</span>
                  <Check className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={onNext}
                  className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/20 flex items-center gap-2 cursor-pointer"
                >
                  <span>{isLast ? 'View Results' : 'Next Question'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )
            ) : (
              <button
                onClick={onNext}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/20 flex items-center gap-2 cursor-pointer"
              >
                <span>{isLast ? 'Finish & Submit Quiz' : 'Next Question'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
