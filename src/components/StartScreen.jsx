import React, { useState } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  Shuffle, 
  Layers, 
  Zap, 
  FileText, 
  CheckCircle, 
  ArrowRight,
  Sun,
  Moon,
  Compass,
  GraduationCap
} from 'lucide-react';
import { WEEK_TOPICS } from '../utils/shuffle';

export default function StartScreen({
  weeksData,
  onStartWeekQuiz,
  onStartComprehensiveQuiz,
  darkMode,
  onToggleDarkMode,
}) {
  const [activeTab, setActiveTab] = useState('week'); // 'week' | 'comprehensive'
  const [selectedWeek, setSelectedWeek] = useState('week1');
  const [randomizeWeekQuestions, setRandomizeWeekQuestions] = useState(false);
  const [comprehensiveCount, setComprehensiveCount] = useState(20);
  const [isImmediateFeedback, setIsImmediateFeedback] = useState(true);
  const [randomizeOptions, setRandomizeOptions] = useState(false);

  const handleStart = () => {
    if (activeTab === 'week') {
      onStartWeekQuiz({
        weekKey: selectedWeek,
        randomizeQuestions: randomizeWeekQuestions,
        randomizeOptions,
        isImmediateFeedback,
      });
    } else {
      onStartComprehensiveQuiz({
        count: comprehensiveCount,
        randomizeOptions,
        isImmediateFeedback,
      });
    }
  };

  const totalAllQuestions = Object.values(weeksData).reduce((acc, qList) => acc + qList.length, 0);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-in fade-in-50 duration-300">
      {/* Top Banner / Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white p-8 sm:p-12 shadow-2xl border border-indigo-700/40">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-72 h-72 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 backdrop-blur-xs">
              <GraduationCap className="w-3.5 h-3.5 text-indigo-300" />
              <span>NPTEL / MOOC Course Companion</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-heading leading-tight text-white">
              Human-Computer Interaction
              <span className="block text-transparent bg-clip-text bg-linear-to-r from-indigo-200 via-purple-200 to-pink-200">
                Interactive Quiz Master
              </span>
            </h1>

            <p className="text-indigo-200/90 text-sm sm:text-base leading-relaxed">
              Test your understanding across all 12 course modules with verified answers, instant feedback, and in-depth pedagogical explanations for every single question.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-indigo-300/90">
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle className="w-4 h-4 text-emerald-400" /> 12 Complete Weeks
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle className="w-4 h-4 text-emerald-400" /> {totalAllQuestions} Verified Questions
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle className="w-4 h-4 text-emerald-400" /> 100% Comprehensive Explanations
              </span>
            </div>
          </div>

          {/* Theme switcher on Hero */}
          <button
            onClick={onToggleDarkMode}
            className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/10 backdrop-blur-md transition-all self-start sm:self-center cursor-pointer"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-300" /> : <Moon className="w-5 h-5 text-indigo-200" />}
          </button>
        </div>
      </div>

      {/* Mode Selection Tabs */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/40 dark:shadow-none space-y-6">
        <div className="flex border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('week')}
            className={`pb-4 px-4 font-heading font-semibold text-sm sm:text-base border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'week'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Week-Wise Mode</span>
          </button>

          <button
            onClick={() => setActiveTab('comprehensive')}
            className={`pb-4 px-4 font-heading font-semibold text-sm sm:text-base border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'comprehensive'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Shuffle className="w-4 h-4" />
            <span>Randomized Comprehensive Exam</span>
          </button>
        </div>

        {/* Tab 1: Week-Wise Mode */}
        {activeTab === 'week' && (
          <div className="space-y-6 animate-in fade-in-50 duration-200">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-1 font-heading">
                Select a Module (Week 1 to Week 12)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Choose any specific week to review its 10 module questions and concepts.
              </p>
            </div>

            {/* 12-Week Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Array.from({ length: 12 }, (_, i) => {
                const wkKey = `week${i + 1}`;
                const info = WEEK_TOPICS[wkKey] || { title: `Week ${i + 1}`, subtitle: 'HCI Topics' };
                const isSelected = selectedWeek === wkKey;

                return (
                  <button
                    key={wkKey}
                    type="button"
                    onClick={() => setSelectedWeek(wkKey)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all duration-150 cursor-pointer flex flex-col justify-between h-full ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                          isSelected 
                            ? 'bg-indigo-600 text-white' 
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}>
                          Week {i + 1}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">10 Questions</span>
                      </div>
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-1 mb-1">
                        {info.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                        {info.subtitle}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Week Option Controls */}
            <div className="flex items-center gap-3 pt-2">
              <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={randomizeWeekQuestions}
                  onChange={(e) => setRandomizeWeekQuestions(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                />
                <span>Randomize question order within this week (Fisher-Yates)</span>
              </label>
            </div>
          </div>
        )}

        {/* Tab 2: Comprehensive Mode */}
        {activeTab === 'comprehensive' && (
          <div className="space-y-6 animate-in fade-in-50 duration-200">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-1 font-heading">
                Comprehensive Exam Simulation
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Draw questions at random from all 12 weeks to simulate mid-term and final exam scenarios.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[10, 20, 50, 120].map((count) => {
                const isSelected = comprehensiveCount === count;
                return (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setComprehensiveCount(count)}
                    className={`p-4 rounded-2xl border-2 text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20 text-indigo-900 dark:text-indigo-100 font-bold'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="text-2xl font-extrabold mb-1 font-heading">
                      {count === 120 ? 'All 120' : count}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {count === 120 ? 'Complete Bank' : 'Questions'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Universal Mode Settings */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">
            Quiz Preferences & Feedback Mode
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Instant Feedback Card */}
            <div
              onClick={() => setIsImmediateFeedback(true)}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                isImmediateFeedback
                  ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/30'
                  : 'border-slate-200 dark:border-slate-800 opacity-60'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5 font-semibold text-slate-900 dark:text-white text-sm">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Instant Feedback Mode (Recommended)</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Receive immediate validation, color-coded answers, and detailed educational explanations as soon as you answer each question.
              </p>
            </div>

            {/* Exam Mode Card */}
            <div
              onClick={() => setIsImmediateFeedback(false)}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                !isImmediateFeedback
                  ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/30'
                  : 'border-slate-200 dark:border-slate-800 opacity-60'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5 font-semibold text-slate-900 dark:text-white text-sm">
                <FileText className="w-4 h-4 text-blue-500" />
                <span>Standard Exam Mode</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Take the quiz continuously without interruptions. Review your total score and all comprehensive explanations at the end.
              </p>
            </div>
          </div>

          {/* Option Shuffle Checkbox */}
          <div className="pt-2">
            <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={randomizeOptions}
                onChange={(e) => setRandomizeOptions(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
              />
              <span>Shuffle multiple-choice option choices (A/B/C/D) to prevent spatial pattern memorization</span>
            </label>
          </div>
        </div>

        {/* Start Button */}
        <div className="pt-4">
          <button
            onClick={handleStart}
            className="w-full py-4 rounded-2xl font-bold text-base sm:text-lg text-white bg-linear-to-r from-indigo-600 via-indigo-700 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-xl shadow-indigo-500/25 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <span>Start HCI Assessment</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
