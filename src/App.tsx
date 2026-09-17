import React, { useState, useEffect } from "react";
import {
  GraduationCap,
  Sparkles,
  Send,
  History,
  Trash2,
  MessageCircle,
  Printer,
  RotateCcw,
  BookOpen,
  Calculator,
  Compass,
  Share2,
} from "lucide-react";
import { EducationalLevel, LearningPace, SubjectCategory, ProblemSolution, AppLanguage } from "./types";
import { getSampleProblems, SampleProblem } from "./components/SampleProblems";
import { LevelPaceSelector } from "./components/LevelPaceSelector";
import { FinalResultCard } from "./components/FinalResultCard";
import { StepsSection } from "./components/StepsSection";
import { RulesTheoremsCard } from "./components/RulesTheoremsCard";
import { AdviceAndMistakesCard } from "./components/AdviceAndMistakesCard";
import { PracticeExerciseCard } from "./components/PracticeExerciseCard";
import { FinalTakeawaysCard } from "./components/FinalTakeawaysCard";
import { InteractiveQuizCard } from "./components/InteractiveQuizCard";
import { TeacherChatDrawer } from "./components/TeacherChatDrawer";
import { NetworkBar } from "./components/NetworkBar";
import { FooterPrivacy } from "./components/FooterPrivacy";
import { ShareModal } from "./components/ShareModal";
import { solvePedagogically } from "./utils/pedagogicalEngine";
import { translations } from "./utils/translations";

const STORAGE_KEY = "smart_tutor_history_v1";
const LANG_STORAGE_KEY = "tutor_lang_v1";

export default function App() {
  // Initialize language from URL or LocalStorage
  const [lang, setLang] = useState<AppLanguage>(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const urlLang = urlParams.get("lang");
      if (urlLang === "en" || urlLang === "ar") {
        return urlLang;
      }
      const savedLang = localStorage.getItem(LANG_STORAGE_KEY);
      if (savedLang === "en" || savedLang === "ar") {
        return savedLang;
      }
    } catch {
      // ignore
    }
    return "ar";
  });

  const [problemInput, setProblemInput] = useState("");
  const [level, setLevel] = useState<EducationalLevel>("middle");
  const [pace, setPace] = useState<LearningPace>("standard");
  const [subject, setSubject] = useState<SubjectCategory>("all");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentSolution, setCurrentSolution] = useState<ProblemSolution | null>(null);

  const [history, setHistory] = useState<ProblemSolution[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const t = translations[lang];
  const isEn = lang === "en";

  // Sync document direction, language, and title
  useEffect(() => {
    try {
      document.documentElement.lang = lang;
      document.documentElement.dir = isEn ? "ltr" : "rtl";
      document.title = t.appName;
      localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch {
      // ignore
    }
  }, [lang, isEn, t.appName]);

  // Handle shared URL parameters on initial load
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const queryParam = params.get("q");
      const lvlParam = params.get("lvl") as EducationalLevel | null;
      const paceParam = params.get("pace") as LearningPace | null;

      if (lvlParam && ["primary", "middle", "secondary", "university"].includes(lvlParam)) {
        setLevel(lvlParam);
      }
      if (paceParam && ["simplified", "standard", "advanced"].includes(paceParam)) {
        setPace(paceParam);
      }
      if (queryParam) {
        setProblemInput(queryParam);
        // Auto-solve the shared problem
        handleSolve(queryParam, lvlParam || undefined, paceParam || undefined);
      }
    } catch {
      // ignore
    }
  }, []);

  // Save history
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, 15)));
    } catch {
      // ignore
    }
  }, [history]);

  const handleSolve = async (
    overrideProblem?: string,
    overrideLevel?: EducationalLevel,
    overridePace?: LearningPace
  ) => {
    const query = overrideProblem || problemInput;
    if (!query.trim() || isLoading) return;

    const currentLvl = overrideLevel || level;
    const currentPce = overridePace || pace;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/solve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problem: query.trim(),
          level: currentLvl,
          pace: currentPce,
          subject: subject === "all" ? "math" : subject,
          lang,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || (isEn ? "Failed to solve problem." : "تعذر على الأستاذ حل المسألة حالياً."));
      }

      const solution: ProblemSolution = await res.json();
      setCurrentSolution(solution);
      setHistory((prev) => [solution, ...prev.filter((p) => p.id !== solution.id)].slice(0, 15));

      // Scroll smoothly to results
      setTimeout(() => {
        const resultEl = document.getElementById("solution-view-container");
        resultEl?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err: unknown) {
      console.warn("API solve failed or static environment, falling back to local pedagogical engine:", err);
      // Seamless free fallback for Vercel static deployments
      try {
        const fallbackSolution = solvePedagogically(
          query.trim(),
          currentLvl,
          currentPce,
          subject === "all" ? "math" : subject,
          lang
        );
        setCurrentSolution(fallbackSolution);
        setHistory((prev) => [fallbackSolution, ...prev.filter((p) => p.id !== fallbackSolution.id)].slice(0, 15));
        setTimeout(() => {
          const resultEl = document.getElementById("solution-view-container");
          resultEl?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } catch (fallbackErr) {
        console.error(fallbackErr);
        setErrorMessage(
          err instanceof Error
            ? err.message
            : isEn
            ? "An unexpected error occurred while processing the problem."
            : "حدث خطأ غير متوقع أثناء معالجة المسألة."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSample = (sample: SampleProblem) => {
    setProblemInput(sample.query);
    setLevel(sample.level);
    handleSolve(sample.query, sample.level);
  };

  const handleInsertSymbol = (symbol: string) => {
    setProblemInput((prev) => prev + symbol);
  };

  const mathSymbols = ["+", "-", "×", "÷", "=", "√", "x²", "π", "≤", "≥", "≠", "±", "∫", "Δ", "θ"];
  const sampleProblems = getSampleProblems(lang);

  return (
    <div className={`min-h-screen bg-slate-50/70 text-slate-900 flex flex-col font-['Cairo',sans-serif] ${isEn ? "text-left" : "text-right"}`}>
      {/* 1. Top Network Bar linking to previous site & Language Switcher */}
      <NetworkBar lang={lang} onToggleLang={(newLang) => setLang(newLang)} />

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-800 text-white flex items-center justify-center shadow-md shadow-indigo-200">
              <GraduationCap className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black text-slate-900 leading-tight flex items-center gap-2">
                <span>{t.appName}</span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {t.appBadge}
                </span>
              </h1>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                {t.appSubtitle}
              </p>
            </div>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2">
            {/* Share Platform / Problem Button */}
            <button
              id="top-share-btn"
              onClick={() => setIsShareOpen(true)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title={t.shareBtn}
            >
              <Share2 className="w-4 h-4 text-indigo-600" />
              <span className="hidden sm:inline">{t.shareBtn}</span>
            </button>

            <button
              id="open-history-btn"
              onClick={() => setIsHistoryOpen(!isHistoryOpen)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title={t.historyBtn}
            >
              <History className="w-4 h-4 text-indigo-600" />
              <span className="hidden md:inline">{t.historyBtn}</span>
              {history.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 text-[10px] flex items-center justify-center font-bold">
                  {history.length}
                </span>
              )}
            </button>

            <button
              id="open-teacher-chat-btn"
              onClick={() => setIsChatOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all hover:shadow"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">{t.askTeacherBtn}</span>
              <span className="sm:hidden">{isEn ? "Teacher" : "المعلم"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 flex-1 w-full space-y-6">
        {/* Customization & Pace Selector */}
        <LevelPaceSelector
          level={level}
          setLevel={setLevel}
          pace={pace}
          setPace={setPace}
          subject={subject}
          setSubject={setSubject}
          lang={lang}
        />

        {/* Problem Input Section */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
                <Calculator className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-800">
                  {t.inputHeading}
                </h2>
                <p className="text-xs text-slate-500">
                  {t.inputSubheading}
                </p>
              </div>
            </div>

            {problemInput && (
              <button
                onClick={() => setProblemInput("")}
                className="text-xs text-slate-400 hover:text-rose-600 flex items-center gap-1 self-end sm:self-center transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t.clearText}</span>
              </button>
            )}
          </div>

          {/* Quick Virtual Math Symbols Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 text-xs border-y border-slate-100 no-scrollbar">
            <span className={`text-[11px] text-slate-400 font-semibold ${isEn ? "mr-1" : "ml-1"} whitespace-nowrap`}>
              {t.quickSymbols}
            </span>
            {mathSymbols.map((sym) => (
              <button
                key={sym}
                type="button"
                onClick={() => handleInsertSymbol(sym)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 font-mono font-bold text-xs transition-colors border border-slate-200/60"
              >
                {sym}
              </button>
            ))}
          </div>

          {/* Textarea Input */}
          <div className="relative">
            <textarea
              id="problem-input-field"
              rows={3}
              value={problemInput}
              onChange={(e) => setProblemInput(e.target.value)}
              placeholder={t.inputPlaceholder}
              className="w-full p-4 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm md:text-base leading-relaxed text-slate-800 placeholder:text-slate-400 resize-none transition-all"
            />
          </div>

          {/* Solve Button & Fast Examples */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{t.sampleModels}</span>
              </span>
            </div>

            <button
              id="submit-problem-btn"
              onClick={() => handleSolve()}
              disabled={!problemInput.trim() || isLoading}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold flex items-center justify-center gap-2 shadow-md shadow-indigo-200 hover:shadow-lg transition-all"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>{t.solvingBtn}</span>
                </>
              ) : (
                <>
                  <span>{t.solveBtn}</span>
                  <Send className={`w-4 h-4 ${isEn ? "" : "rotate-180"}`} />
                </>
              )}
            </button>
          </div>

          {/* Sample Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar pt-1">
            {sampleProblems.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectSample(sample)}
                disabled={isLoading}
                className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-800 border border-slate-200/80 text-slate-700 text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5"
              >
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200/60 font-normal">
                  {sample.category}
                </span>
                <span>{sample.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl text-sm flex items-center justify-between">
            <div>
              <p className="font-bold">{t.errorAlert}</p>
              <p>{errorMessage}</p>
            </div>
            <button
              onClick={() => handleSolve()}
              className="px-3 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-700"
            >
              {t.retryBtn}
            </button>
          </div>
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="bg-white rounded-2xl p-10 border border-indigo-100 shadow-xs text-center space-y-4 animate-pulse">
            <div className="w-16 h-16 mx-auto rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Compass className="w-8 h-8 animate-spin" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-800">
                {t.loadingTitle}
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                {t.loadingDesc}
              </p>
            </div>
          </div>
        )}

        {/* Solution View Container */}
        {currentSolution && !isLoading && (
          <div id="solution-view-container" className="space-y-6 pt-2">
            {/* Header bar with Print, Share, and Ask Teacher */}
            <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200/80 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700">{t.solutionHeaderTitle}</span>
                <span className="text-slate-600 truncate max-w-xs sm:max-w-md font-medium">
                  "{currentSolution.problemQuery}"
                </span>
              </div>
              <div className="flex items-center gap-2">
                {/* Share Button */}
                <button
                  id="share-solution-btn"
                  onClick={() => setIsShareOpen(true)}
                  className="px-2.5 py-1.5 rounded-lg border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold flex items-center gap-1.5 transition-colors"
                  title={t.shareBtn}
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{t.shareBtn}</span>
                </button>

                <button
                  onClick={() => window.print()}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 flex items-center gap-1 transition-colors"
                  title={t.printBtn}
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t.printBtn}</span>
                </button>

                <button
                  onClick={() => setIsChatOpen(true)}
                  className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-1 transition-colors shadow-xs"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>{t.askAboutThisBtn}</span>
                </button>
              </div>
            </div>

            {/* 1. Final Result Card */}
            <FinalResultCard
              summary={currentSolution.finalResult.summary}
              highlightValue={currentSolution.finalResult.highlightValue}
              units={currentSolution.finalResult.units}
              category={currentSolution.category}
              difficulty={currentSolution.difficulty}
              lang={lang}
            />

            {/* 2. Detailed Steps Section */}
            <StepsSection steps={currentSolution.detailedSteps} lang={lang} />

            {/* 3. Rules and Theorems Card */}
            <RulesTheoremsCard
              rules={currentSolution.rulesAndTheorems}
              problemTitle={currentSolution.problemQuery}
              lang={lang}
            />

            {/* 4. Pedagogical Advice and Pitfalls Card */}
            <AdviceAndMistakesCard
              encouragement={currentSolution.pedagogicalAdvice?.encouragement}
              commonMistakes={currentSolution.pedagogicalAdvice?.commonMistakes}
              lang={lang}
            />

            {/* 5. Additional Practice Exercise Card */}
            <PracticeExerciseCard exercise={currentSolution.practiceExercise} lang={lang} />

            {/* 6. Final Review and Takeaways Card */}
            <FinalTakeawaysCard takeaways={currentSolution.finalTakeaways} lang={lang} />

            {/* 7. Interactive Concept Quiz */}
            <InteractiveQuizCard questions={currentSolution.interactiveQuiz} lang={lang} />
          </div>
        )}

        {/* Empty state when no solution yet and not loading */}
        {!currentSolution && !isLoading && (
          <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center">
              <BookOpen className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-800">
                {t.emptyHeading}
              </h3>
              <p className="text-xs text-slate-500 max-w-lg mx-auto leading-relaxed">
                {t.emptyDesc}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto pt-2 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-slate-700 font-semibold">
                {isEn ? "1. Final Result 🎯" : "1. النتيجة النهائية 🎯"}
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-slate-700 font-semibold">
                {isEn ? "2. Step-by-Step 🪜" : "2. خطوات الحل 🪜"}
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-slate-700 font-semibold">
                {isEn ? "3. Rules & Flashcards 🎴" : "3. القوانين والبطاقات 🎴"}
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-slate-700 font-semibold">
                {isEn ? "7. Interactive Quizzes 🏆" : "7. اختبارات تفاعلية 🏆"}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer with Privacy, Cookies, and Founder Taha setri */}
      <FooterPrivacy lang={lang} />

      {/* History Drawer Modal */}
      {isHistoryOpen && (
        <div className="fixed inset-0 z-50 flex justify-start bg-slate-900/30 backdrop-blur-xs animate-fadeIn">
          <div className={`w-full max-w-sm bg-white h-full shadow-xl flex flex-col border-l border-slate-200 animate-slideInLeft p-4 space-y-4 ${isEn ? "text-left" : "text-right"}`}>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-indigo-600" />
                <h3 className="font-bold text-sm text-slate-800">{isEn ? "Problem History" : "سجل المسائل السابقة"}</h3>
              </div>
              <button
                onClick={() => setIsHistoryOpen(false)}
                className="text-xs text-slate-500 hover:text-slate-800 p-1"
              >
                {isEn ? "Close" : "إغلاق"}
              </button>
            </div>

            {history.length === 0 ? (
              <div className="text-center py-10 text-xs text-slate-400">
                {isEn ? "No problems saved yet" : "لا توجد مسائل محفوظة بعد"}
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto space-y-2">
                {history.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentSolution(item);
                      setIsHistoryOpen(false);
                    }}
                    className={`w-full ${isEn ? "text-left" : "text-right"} p-3 rounded-xl border text-xs transition-all ${
                      currentSolution?.id === item.id
                        ? "bg-indigo-50 border-indigo-400 text-indigo-900 font-bold"
                        : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700"
                    }`}
                  >
                    <div className="line-clamp-1 font-medium">{item.problemQuery}</div>
                    <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
                      <span>{item.category || (isEn ? "General" : "عام")}</span>
                      <span>{new Date(item.timestamp).toLocaleDateString(isEn ? "en-US" : "ar-SA")}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {history.length > 0 && (
              <button
                onClick={() => {
                  setHistory([]);
                  localStorage.removeItem(STORAGE_KEY);
                }}
                className="text-xs text-rose-600 hover:bg-rose-50 p-2 rounded-lg flex items-center justify-center gap-1 border border-rose-200 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isEn ? "Clear All History" : "مسح كل السجل"}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Floating Ask-The-Teacher Button */}
      <div className={`fixed bottom-6 ${isEn ? "right-6" : "left-6"} z-30`}>
        <button
          id="floating-chat-trigger"
          onClick={() => setIsChatOpen(true)}
          className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-600/30 font-bold text-sm transition-all hover:scale-105"
        >
          <div className="relative">
            <MessageCircle className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-indigo-600" />
          </div>
          <span>{isEn ? "Ask the Teacher 💬" : "اسأل المعلم 💬"}</span>
        </button>
      </div>

      {/* Direct Teacher Chat Drawer */}
      <TeacherChatDrawer
        currentSolution={currentSolution}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        lang={lang}
      />

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        solution={currentSolution}
        currentQuery={problemInput}
        lang={lang}
      />
    </div>
  );
}
