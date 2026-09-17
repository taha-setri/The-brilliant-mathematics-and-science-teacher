import React, { useState, useEffect } from "react";
import {
  X,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Volume2,
  VolumeX,
  Sparkles,
  Layers,
  BookOpen,
  Award,
} from "lucide-react";
import confetti from "canvas-confetti";
import { RuleTheorem, AppLanguage } from "../types";
import { MathRenderer } from "./MathRenderer";
import { translations } from "../utils/translations";

interface FlashcardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  rules: RuleTheorem[];
  problemTitle?: string;
  lang?: AppLanguage;
}

interface FlashcardItem {
  id: string;
  title: string;
  categoryBadge?: string;
  prompt: string;
  formula?: string;
  explanation: string;
  variables?: { symbol: string; meaning: string; unit?: string }[];
  hint?: string;
}

export const FlashcardsModal: React.FC<FlashcardsModalProps> = ({
  isOpen,
  onClose,
  rules,
  problemTitle,
  lang = "ar",
}) => {
  const [cards, setCards] = useState<FlashcardItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredIds, setMasteredIds] = useState<Set<string>>(new Set());
  const [reviewIds, setReviewIds] = useState<Set<string>>(new Set());
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const t = translations[lang].flashcards;
  const isEn = lang === "en";

  // Build card deck whenever rules change
  useEffect(() => {
    if (!rules || rules.length === 0) return;

    const generatedCards: FlashcardItem[] = [];

    rules.forEach((rule, idx) => {
      // Main concept card
      generatedCards.push({
        id: `rule-${idx}`,
        title: rule.name,
        categoryBadge: isEn ? "Core Theorem" : "قاعدة أساسية",
        prompt: isEn
          ? `What is the formula and definition for: "${rule.name}"?`
          : `ما هي الصيغة الرياضية والمفهوم العلمي لقاعدة: "${rule.name}"؟`,
        formula: rule.formula,
        explanation: rule.explanation,
        variables: rule.variablesExplained,
        hint: isEn
          ? "Think about the main equation, scientific units, and when this theorem applies."
          : "تذكر المعادلة الأساسية، والوحدات الفيزيائية ومجال تطبيق المبرهنة.",
      });

      // If there are detailed variables, optionally add a variable drill card if deck is small
      if (rules.length === 1 && rule.variablesExplained && rule.variablesExplained.length > 1) {
        generatedCards.push({
          id: `vars-${idx}`,
          title: isEn ? `Units & Symbols in ${rule.name}` : `دلالات الرموز والوحدات في ${rule.name}`,
          categoryBadge: isEn ? "Units & Variables" : "رموز ووحدات قياس",
          prompt: isEn
            ? `What do the physical symbols and units represent in: ${rule.name}?`
            : `ما دلالات الرموز الفيزيائية ووحدات قياسها في قانون: ${rule.name}؟`,
          formula: rule.formula,
          explanation: isEn
            ? `Proper unit conversion and symbol identification are vital for getting accurate numerical solutions.`
            : `التمييز الدقيق بين الرموز ومطابقة الوحدات الفيزيائية هو الركيزة الأساسية للتعويض الصحيح والوصول للناتج النهائي بدقة.`,
          variables: rule.variablesExplained,
          hint: isEn
            ? "Recall standard SI metric units (e.g., m/s, Joules, kg, Ohm, Volts)."
            : "تذكر الوحدات الدولية SI مثل (المتر، الثانية، الجول، كغم، الأوم، الفولت).",
        });
      }
    });

    setCards(generatedCards);
    setCurrentIndex(0);
    setIsFlipped(false);
    setMasteredIds(new Set());
    setReviewIds(new Set());
    setIsFinished(false);
  }, [rules, isEn]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === " " || e.key === "Enter") {
        // Space / Enter flips card
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        if (isEn) {
          handleNext();
        } else {
          handlePrev();
        }
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (isEn) {
          handlePrev();
        } else {
          handleNext();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex, cards.length, isEn]);

  if (!isOpen || cards.length === 0) return null;

  const currentCard = cards[currentIndex];

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsFlipped(false);
      stopSpeaking();
    } else {
      setIsFinished(true);
      try {
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      } catch {
        // fallback
      }
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setIsFlipped(false);
      stopSpeaking();
    }
  };

  const handleShuffle = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    stopSpeaking();
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setMasteredIds(new Set());
    setReviewIds(new Set());
    setIsFinished(false);
    stopSpeaking();
  };

  const markMastered = () => {
    if (!currentCard) return;
    setMasteredIds((prev) => {
      const next = new Set(prev);
      next.add(currentCard.id);
      return next;
    });
    setReviewIds((prev) => {
      const next = new Set(prev);
      next.delete(currentCard.id);
      return next;
    });
    handleNext();
  };

  const markNeedsReview = () => {
    if (!currentCard) return;
    setReviewIds((prev) => {
      const next = new Set(prev);
      next.add(currentCard.id);
      return next;
    });
    setMasteredIds((prev) => {
      const next = new Set(prev);
      next.delete(currentCard.id);
      return next;
    });
    handleNext();
  };

  const stopSpeaking = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (isSpeaking) {
      stopSpeaking();
      return;
    }

    const textToSpeak = `${currentCard.title}. ${currentCard.explanation}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = isEn ? "en-US" : "ar-SA";
    utterance.rate = 0.95;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const progressPercent = Math.round(((currentIndex + 1) / cards.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
      <div
        className={`bg-white text-slate-900 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] ${
          isEn ? "text-left" : "text-right"
        }`}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-xs flex items-center justify-center shadow-inner">
              <Layers className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg leading-tight flex items-center gap-2">
                <span>{t.modalTitle}</span>
                <span className="hidden sm:inline-block text-[10px] bg-amber-400/20 text-amber-200 px-2 py-0.5 rounded-full border border-amber-300/30">
                  {cards.length} {isEn ? "Cards" : "بطاقات"}
                </span>
              </h3>
              <p className="text-xs text-blue-100/90 line-clamp-1">
                {problemTitle ? `"${problemTitle}"` : t.modalSubtitle}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              stopSpeaking();
              onClose();
            }}
            className="p-2 rounded-xl hover:bg-white/10 text-blue-100 hover:text-white transition-colors"
            title={t.close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Deck Progress Bar */}
        <div className="bg-slate-100 h-1.5 w-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full transition-all duration-300"
            style={{ width: `${isFinished ? 100 : progressPercent}%` }}
          />
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-6 flex-1 overflow-y-auto space-y-4">
          {!isFinished ? (
            <>
              {/* Card Meta Bar */}
              <div className="flex items-center justify-between text-xs text-slate-500 pb-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
                    {isEn
                      ? `Card ${currentIndex + 1} of ${cards.length}`
                      : `البطاقة ${currentIndex + 1} من ${cards.length}`}
                  </span>
                  {currentCard.categoryBadge && (
                    <span className="hidden sm:inline-block px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium">
                      {currentCard.categoryBadge}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {/* TTS Speech Button */}
                  <button
                    type="button"
                    onClick={handleSpeak}
                    className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-colors ${
                      isSpeaking
                        ? "bg-amber-100 border-amber-300 text-amber-800 animate-pulse"
                        : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700"
                    }`}
                    title={isSpeaking ? (isEn ? "Stop Audio" : "إيقاف الصوت") : t.listen}
                  >
                    {isSpeaking ? (
                      <VolumeX className="w-3.5 h-3.5 text-amber-700" />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5 text-indigo-600" />
                    )}
                    <span className="hidden sm:inline">{isSpeaking ? (isEn ? "Stop" : "إيقاف") : (isEn ? "Audio" : "صوت")}</span>
                  </button>

                  {/* Shuffle button */}
                  <button
                    type="button"
                    onClick={handleShuffle}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 flex items-center gap-1 transition-colors"
                    title={t.shuffle}
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{t.shuffle}</span>
                  </button>
                </div>
              </div>

              {/* 3D Interactive Flip Card */}
              <div
                id="interactive-digital-flashcard"
                onClick={() => setIsFlipped(!isFlipped)}
                role="button"
                tabIndex={0}
                className="relative min-h-[300px] sm:min-h-[340px] w-full rounded-2xl cursor-pointer select-none transition-all duration-500 transform hover:scale-[1.01] shadow-md group"
                style={{ perspective: "1200px" }}
              >
                <div
                  className={`w-full h-full rounded-2xl transition-transform duration-500 border [transform-style:preserve-3d] ${
                    isFlipped ? "[transform:rotateY(180deg)] border-indigo-200" : "border-slate-200 hover:border-indigo-300"
                  }`}
                >
                  {/* FRONT OF CARD */}
                  <div
                    className={`absolute inset-0 w-full h-full rounded-2xl p-6 sm:p-8 flex flex-col justify-between bg-gradient-to-br from-white via-indigo-50/20 to-blue-50/40 [backface-visibility:hidden] ${
                      isFlipped ? "pointer-events-none" : ""
                    }`}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 uppercase tracking-wide bg-indigo-50 px-2.5 py-1 rounded-full">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{isEn ? "Prompt & Concept" : "سؤال الاستذكار"}</span>
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          #{currentIndex + 1}
                        </span>
                      </div>

                      <div className="pt-2">
                        <h4 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                          {currentCard.title}
                        </h4>
                        <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed font-medium">
                          {currentCard.prompt}
                        </p>
                      </div>

                      {currentCard.hint && (
                        <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/70 text-xs text-amber-900">
                          <strong>{isEn ? "Hint: " : "تلميح: "}</strong>
                          <span>{currentCard.hint}</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                      <span className="flex items-center gap-1 text-indigo-600 font-bold group-hover:text-indigo-800 transition-colors">
                        <RotateCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: "6s" }} />
                        <span>{t.clickToFlip}</span>
                      </span>
                      <span className="text-[11px] font-mono hidden sm:inline text-slate-400">
                        {isEn ? "Space / Enter to flip" : "مسافة / إدخال للقلب"}
                      </span>
                    </div>
                  </div>

                  {/* BACK OF CARD */}
                  <div
                    className={`absolute inset-0 w-full h-full rounded-2xl p-6 sm:p-8 flex flex-col justify-between bg-gradient-to-br from-indigo-900 via-slate-900 to-blue-950 text-white [transform:rotateY(180deg)] [backface-visibility:hidden] overflow-y-auto ${
                      !isFlipped ? "pointer-events-none" : ""
                    }`}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 uppercase tracking-wide bg-white/10 px-2.5 py-1 rounded-full border border-white/10">
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>{isEn ? "Answer & Law" : "القاعدة والشرح"}</span>
                        </span>
                        <h4 className="text-sm font-bold text-slate-200 truncate max-w-[200px]">
                          {currentCard.title}
                        </h4>
                      </div>

                      {/* Formula KaTeX block */}
                      {currentCard.formula && (
                        <div
                          className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl border border-white/20 text-center font-mono text-emerald-300 text-base sm:text-lg overflow-x-auto shadow-inner"
                          dir="ltr"
                        >
                          <MathRenderer content={currentCard.formula} block />
                        </div>
                      )}

                      {/* Scientific Explanation */}
                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-indigo-200 block">
                          {t.explanationLabel}
                        </span>
                        <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-normal">
                          {currentCard.explanation}
                        </p>
                      </div>

                      {/* Variables breakdown */}
                      {currentCard.variables && currentCard.variables.length > 0 && (
                        <div className="space-y-1.5 pt-1">
                          <span className="text-[11px] font-bold text-amber-200 block">
                            {t.variablesLabel}
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                            {currentCard.variables.map((v, vIdx) => (
                              <div
                                key={vIdx}
                                className="bg-white/10 px-2 py-1 rounded-md text-[11px] flex items-center justify-between border border-white/10"
                              >
                                <span className="font-mono font-bold text-amber-300" dir="ltr">
                                  {v.symbol}
                                </span>
                                <span className="text-slate-200 truncate mx-1">
                                  {v.meaning} {v.unit ? `(${v.unit})` : ""}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-indigo-200">
                      <span className="flex items-center gap-1 text-amber-300 font-bold">
                        <RotateCw className="w-3.5 h-3.5" />
                        <span>{t.flipBack}</span>
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {isEn ? "Review and evaluate your recall below" : "قيّم استذكارك للمفهوم في الأسفل"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Self Evaluation & Navigation */}
              <div className="space-y-3 pt-2">
                {/* Self Evaluation Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={markNeedsReview}
                    className={`py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                      reviewIds.has(currentCard.id)
                        ? "bg-rose-50 border-rose-300 text-rose-800"
                        : "bg-white hover:bg-rose-50/50 border-slate-200 text-slate-700 hover:border-rose-200"
                    }`}
                  >
                    <AlertCircle className="w-4 h-4 text-rose-500" />
                    <span>{t.needsReviewBtn}</span>
                  </button>

                  <button
                    type="button"
                    onClick={markMastered}
                    className={`py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                      masteredIds.has(currentCard.id)
                        ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                        : "bg-white hover:bg-emerald-50/50 border-slate-200 text-slate-700 hover:border-emerald-200"
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{t.masteredBtn}</span>
                  </button>
                </div>

                {/* Navigation Arrows */}
                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold flex items-center gap-1 transition-colors text-slate-700"
                  >
                    {isEn ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    <span>{t.previous}</span>
                  </button>

                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <span>{currentIndex + 1}</span>
                    <span>/</span>
                    <span>{cards.length}</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1 transition-colors shadow-xs"
                  >
                    <span>{currentIndex === cards.length - 1 ? (isEn ? "Finish Deck" : "إنهاء المراجعة") : t.next}</span>
                    {isEn ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Completed Deck Summary View */
            <div className="text-center py-6 sm:py-8 space-y-6 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <Award className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h4 className="text-xl font-black text-slate-900">
                  {t.completedTitle}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  {t.completedDesc}
                </p>
              </div>

              {/* Stats badges */}
              <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                  <div className="text-2xl font-black">{masteredIds.size}</div>
                  <div className="text-xs font-bold text-emerald-800">{t.masteredCount}</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950">
                  <div className="text-2xl font-black">{reviewIds.size}</div>
                  <div className="text-xs font-bold text-amber-800">{t.needsReviewCount}</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleRestart}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{t.restart}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    stopSpeaking();
                    onClose();
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors"
                >
                  {t.close}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>{isEn ? "Sanad Interactive Flashcard Engine" : "محرك بطاقات سند التعليمية التفاعلية"}</span>
          <span className="font-semibold text-indigo-700">{translations[lang].founderLabel}</span>
        </div>
      </div>
    </div>
  );
};
