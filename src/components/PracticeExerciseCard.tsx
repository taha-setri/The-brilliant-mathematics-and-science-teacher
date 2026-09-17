import React, { useState } from "react";
import { Dumbbell, Eye, EyeOff, CheckCircle2, HelpCircle } from "lucide-react";
import { PracticeExercise, AppLanguage } from "../types";
import { MathRenderer } from "./MathRenderer";

interface PracticeExerciseCardProps {
  exercise: PracticeExercise;
  lang?: AppLanguage;
}

export const PracticeExerciseCard: React.FC<PracticeExerciseCardProps> = ({ exercise, lang = "ar" }) => {
  const [showSolution, setShowSolution] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const isEn = lang === "en";

  if (!exercise || !exercise.problemStatement) return null;

  return (
    <div
      id="practice-exercise-card"
      className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200/80 space-y-4"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-teal-50 text-teal-700">
            <Dumbbell className="w-5 h-5" />
          </span>
          <div>
            <h3 className="text-lg font-bold text-slate-800">
              {isEn ? "5. Additional Self-Practice Exercise" : "5. أمثلة إضافية للتدريب الذاتي"}
            </h3>
            <p className="text-xs text-slate-500">
              {isEn
                ? "Similar practice problem to test your understanding and solidify the concept"
                : "مسألة مشابهة لتختبر مهاراتك بنفسك وتثبت فهمك للقاعدة"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {exercise.hint && (
            <button
              onClick={() => setShowHint(!showHint)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200/80 flex items-center gap-1 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{showHint ? (isEn ? "Hide Hint" : "إخفاء التلميح") : (isEn ? "Helpful Hint 💡" : "تلميح ذكي 💡")}</span>
            </button>
          )}

          <button
            id="toggle-model-solution-btn"
            onClick={() => setShowSolution(!showSolution)}
            className={`text-xs font-bold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shadow-xs ${
              showSolution
                ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                : "bg-teal-600 text-white hover:bg-teal-700"
            }`}
          >
            {showSolution ? (
              <>
                <EyeOff className="w-3.5 h-3.5" />
                <span>{isEn ? "Hide Model Solution" : "إخفاء الحل النموذجي"}</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span>{isEn ? "Reveal Model Solution 📝" : "كشف الحل النموذجي 📝"}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Exercise statement */}
      <div className="bg-teal-50/60 border border-teal-100/90 rounded-xl p-4 text-slate-800">
        <h4 className="font-bold text-teal-950 text-sm mb-1.5">
          {isEn ? "Proposed Practice Problem:" : "المسألة المقترحة للتدريب:"}
        </h4>
        <p className="text-sm md:text-base leading-relaxed">
          {exercise.problemStatement}
        </p>

        {showHint && exercise.hint && (
          <div className="mt-3 p-3 bg-amber-100/80 rounded-lg text-xs text-amber-900 border border-amber-200 animate-fadeIn">
            <strong>{isEn ? "Guiding Hint:" : "تلميح المساعدة:"}</strong> {exercise.hint}
          </div>
        )}
      </div>

      {/* Model Solution Revealed */}
      {showSolution && (
        <div className="bg-slate-50 border border-teal-200/80 rounded-xl p-4 space-y-3 animate-fadeIn">
          <div className="flex items-center gap-2 text-teal-900 font-bold text-sm">
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
            <span>{isEn ? "Detailed Model Solution:" : "الحل النموذجي والتفصيلي:"}</span>
          </div>

          {/* Model Final Result */}
          {exercise.modelSolution?.finalResult && (
            <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs md:text-sm font-semibold text-slate-900 flex items-center justify-between">
              <span>{isEn ? "Verified Final Result:" : "الناتج النهائي الصحيح:"}</span>
              <span className="font-bold text-teal-700 font-mono bg-teal-50 px-2 py-0.5 rounded" dir="ltr">
                <MathRenderer content={exercise.modelSolution.finalResult} />
              </span>
            </div>
          )}

          {/* Solution steps */}
          {exercise.modelSolution?.solutionSteps && (
            <div className="space-y-2 pt-1">
              {exercise.modelSolution.solutionSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="bg-white p-3 rounded-lg border border-slate-100 text-xs md:text-sm space-y-1.5"
                >
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {step.stepNumber || idx + 1}
                    </span>
                    <p className="text-slate-700 leading-relaxed">
                      {step.explanation}
                    </p>
                  </div>
                  {step.mathExpression && (
                    <div className={`bg-slate-900 text-emerald-300 p-2 rounded text-xs font-mono text-center overflow-x-auto ${isEn ? "ml-7" : "mr-7"}`} dir="ltr">
                      <MathRenderer content={step.mathExpression} block />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
