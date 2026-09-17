import React, { useState } from "react";
import { HelpCircle, Check, X, Award, RotateCcw } from "lucide-react";
import confetti from "canvas-confetti";
import { QuizQuestion, AppLanguage } from "../types";

interface InteractiveQuizCardProps {
  questions: QuizQuestion[];
  lang?: AppLanguage;
}

export const InteractiveQuizCard: React.FC<InteractiveQuizCardProps> = ({ questions, lang = "ar" }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});
  const isEn = lang === "en";

  if (!questions || questions.length === 0) return null;

  const handleSelectOption = (questionId: string, optionId: string) => {
    if (submitted[questionId]) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleCheckAnswer = (question: QuizQuestion) => {
    const selected = selectedAnswers[question.questionId];
    if (!selected) return;

    setSubmitted((prev) => ({ ...prev, [question.questionId]: true }));

    if (selected === question.correctOptionId) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch {
        // confetti fallback
      }
    }
  };

  const handleResetQuiz = (questionId: string) => {
    setSelectedAnswers((prev) => {
      const next = { ...prev };
      delete next[questionId];
      return next;
    });
    setSubmitted((prev) => {
      const next = { ...prev };
      delete next[questionId];
      return next;
    });
  };

  return (
    <div
      id="interactive-quiz-card"
      className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200/80 space-y-5"
    >
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
            <Award className="w-5 h-5" />
          </span>
          <div>
            <h3 className="text-lg font-bold text-slate-800">
              {isEn ? "7. Lesson Interactivity: Quick Concept Quiz" : "7. تفاعلية الدرس: اختبار قصير للتحقق من الفهم"}
            </h3>
            <p className="text-xs text-slate-500">
              {isEn
                ? "Answer this quick challenge to verify your understanding of the derivation and rule"
                : "أجب عن السؤال السريع لتتأكد من استيعابك للمسألة وطريقة حلها"}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        {questions.map((q, idx) => {
          const isSubmitted = submitted[q.questionId];
          const selected = selectedAnswers[q.questionId];
          const isCorrect = selected === q.correctOptionId;

          return (
            <div
              key={q.questionId || idx}
              className="bg-slate-50/70 rounded-xl p-5 border border-slate-200 space-y-4"
            >
              {/* Question title */}
              <div className="flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <h4 className="font-bold text-slate-900 text-sm md:text-base leading-relaxed">
                  {q.questionText}
                </h4>
              </div>

              {/* Options */}
              <div className={`grid grid-cols-1 sm:grid-cols-2 gap-2.5 ${isEn ? "ml-8" : "mr-8"}`}>
                {q.options.map((opt) => {
                  const isSelected = selected === opt.id;
                  const isOptionCorrect = opt.id === q.correctOptionId;

                  let optionStyle = "bg-white text-slate-800 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30";

                  if (isSubmitted) {
                    if (isOptionCorrect) {
                      optionStyle = "bg-emerald-50 border-emerald-500 text-emerald-950 font-bold";
                    } else if (isSelected && !isOptionCorrect) {
                      optionStyle = "bg-rose-50 border-rose-400 text-rose-950 line-through";
                    } else {
                      optionStyle = "bg-white border-slate-200 opacity-60 text-slate-600";
                    }
                  } else if (isSelected) {
                    optionStyle = "bg-emerald-50 border-emerald-600 text-emerald-900 font-semibold shadow-xs ring-1 ring-emerald-500";
                  }

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectOption(q.questionId, opt.id)}
                      disabled={isSubmitted}
                      className={`p-3 rounded-xl border text-xs md:text-sm ${isEn ? "text-left" : "text-right"} flex items-center justify-between transition-all ${optionStyle}`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-mono text-xs flex items-center justify-center font-bold">
                          {opt.id}
                        </span>
                        <span>{opt.text}</span>
                      </div>

                      {isSubmitted && isOptionCorrect && (
                        <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mx-2" />
                      )}
                      {isSubmitted && isSelected && !isOptionCorrect && (
                        <X className="w-4 h-4 text-rose-600 flex-shrink-0 mx-2" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Action buttons & feedback */}
              <div className={`${isEn ? "ml-8" : "mr-8"} flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2`}>
                {!isSubmitted ? (
                  <button
                    onClick={() => handleCheckAnswer(q)}
                    disabled={!selected}
                    className="text-xs font-bold px-4 py-2 rounded-lg bg-emerald-600 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-emerald-700 transition-colors shadow-xs"
                  >
                    {isEn ? "Check Answer ✅" : "تحقق من الإجابة ✅"}
                  </button>
                ) : (
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 ${
                        isCorrect
                          ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                          : "bg-rose-100 text-rose-900 border border-rose-300"
                      }`}
                    >
                      {isCorrect
                        ? (isEn ? "Excellent job! Correct answer 🌟" : "أحسنت يا بطل! إجابة صحيحة 🌟")
                        : (isEn ? "Incorrect. Review the explanation below:" : "إجابة غير دقيقة، راجع التعليل التالي:")}
                    </span>

                    <button
                      onClick={() => handleResetQuiz(q.questionId)}
                      className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 p-1 hover:bg-slate-200/60 rounded"
                      title={isEn ? "Try again" : "إعادة المحاولة"}
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{isEn ? "Retry" : "إعادة"}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Explanation upon submission */}
              {isSubmitted && q.explanation && (
                <div className={`${isEn ? "ml-8" : "mr-8"} p-3 bg-white rounded-lg border border-slate-200 text-xs text-slate-700 leading-relaxed space-y-1`}>
                  <div className="flex items-center gap-1 font-bold text-slate-900">
                    <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{isEn ? "Teacher Explanation:" : "توضيح الأستاذ:"}</span>
                  </div>
                  <p>{q.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
