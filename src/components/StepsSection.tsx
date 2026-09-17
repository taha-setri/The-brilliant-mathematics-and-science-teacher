import React, { useState } from "react";
import { ListOrdered, ChevronDown, ChevronUp, ArrowLeft, ArrowRight, Lightbulb, CheckSquare } from "lucide-react";
import { StepItem, AppLanguage } from "../types";
import { MathRenderer } from "./MathRenderer";

interface StepsSectionProps {
  steps: StepItem[];
  lang?: AppLanguage;
}

export const StepsSection: React.FC<StepsSectionProps> = ({ steps, lang = "ar" }) => {
  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null);
  const [interactiveMode, setInteractiveMode] = useState<boolean>(false);
  const [currentInteractiveStep, setCurrentInteractiveStep] = useState<number>(0);
  const isEn = lang === "en";

  if (!steps || steps.length === 0) return null;

  return (
    <div id="detailed-steps-section" className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200/80 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700">
              <ListOrdered className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-bold text-slate-800">
              {isEn ? "2. Detailed Step-by-Step Solution" : "2. خطوات الحل المفصلة (Step-by-Step)"}
            </h3>
          </div>
          <p className={`text-xs text-slate-500 mt-1 ${isEn ? "ml-8" : "mr-8"}`}>
            {isEn
              ? "Sequential pedagogical explanation showing how and why each result is derived"
              : "شرح تربوي متسلسل يبين كيف ولماذا توصلنا إلى النتيجة خطوة بخطوة"}
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2">
          <button
            id="toggle-interactive-mode-btn"
            onClick={() => {
              setInteractiveMode(!interactiveMode);
              setCurrentInteractiveStep(0);
            }}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors border ${
              interactiveMode
                ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
            }`}
          >
            {interactiveMode
              ? (isEn ? "Show all steps" : "عرض كل الخطوات معاً")
              : (isEn ? "Interactive step mode 🎯" : "وضع التدرج خطوة بخطوة 🎯")}
          </button>
        </div>
      </div>

      {/* Interactive Single-Step Mode */}
      {interactiveMode ? (
        <div className="bg-slate-50 rounded-xl p-5 border border-indigo-100 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-700 bg-indigo-100/70 px-2.5 py-1 rounded-full">
              {isEn
                ? `Step ${currentInteractiveStep + 1} of ${steps.length}`
                : `الخطوة ${currentInteractiveStep + 1} من ${steps.length}`}
            </span>
            <div className="flex items-center gap-1.5">
              {steps.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentInteractiveStep(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    idx === currentInteractiveStep
                      ? "w-6 bg-indigo-600"
                      : idx < currentInteractiveStep
                      ? "bg-emerald-500"
                      : "bg-slate-300"
                  }`}
                  title={isEn ? `Go to step ${idx + 1}` : `الانتقال إلى خطوة ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Current Step Content */}
          {(() => {
            const step = steps[currentInteractiveStep];
            return (
              <div className="space-y-3 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                    {step.stepNumber}
                  </span>
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">
                      {step.title}
                    </h4>
                    <p className="text-slate-700 text-sm leading-relaxed mt-1">
                      {step.explanation}
                    </p>
                  </div>
                </div>

                {step.mathExpression && (
                  <div className="bg-slate-900 text-emerald-400 p-3.5 rounded-xl font-mono text-center text-base md:text-lg overflow-x-auto shadow-inner border border-slate-800" dir="ltr">
                    <MathRenderer content={step.mathExpression} block />
                  </div>
                )}

                {step.note && (
                  <div className="flex items-start gap-2 bg-amber-50/80 border border-amber-200/70 rounded-xl p-3 text-xs text-amber-900">
                    <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span><strong>{isEn ? "Teacher Insight:" : "إضاءة تربوية:"}</strong> {step.note}</span>
                  </div>
                )}
              </div>
            );
          })()}

          {/* Step Navigation Controls */}
          <div className="flex items-center justify-between pt-2">
            <button
              disabled={currentInteractiveStep === 0}
              onClick={() => setCurrentInteractiveStep((prev) => Math.max(0, prev - 1))}
              className="flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors"
            >
              {isEn ? (
                <>
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous step</span>
                </>
              ) : (
                <>
                  <ArrowRight className="w-4 h-4" />
                  <span>الخطوة السابقة</span>
                </>
              )}
            </button>

            <button
              disabled={currentInteractiveStep === steps.length - 1}
              onClick={() => setCurrentInteractiveStep((prev) => Math.min(steps.length - 1, prev + 1))}
              className="flex items-center gap-1 text-xs font-semibold px-4 py-2 rounded-lg bg-indigo-600 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors shadow-xs"
            >
              {isEn ? (
                <>
                  <span>Next step</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>الخطوة التالية</span>
                  <ArrowLeft className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        /* Full Sequential List Mode */
        <div className="space-y-4">
          {steps.map((step, idx) => {
            const isExpanded = activeStepIndex === null || activeStepIndex === idx;
            return (
              <div
                key={idx}
                className="group relative rounded-xl border border-slate-200 bg-white transition-all duration-200 hover:border-indigo-200 hover:shadow-xs"
              >
                {/* Step Header */}
                <div
                  className="flex items-start justify-between p-4 cursor-pointer select-none"
                  onClick={() =>
                    setActiveStepIndex(activeStepIndex === idx ? null : idx)
                  }
                >
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-indigo-600 group-hover:text-white text-slate-800 font-bold flex items-center justify-center text-sm transition-colors">
                      {step.stepNumber}
                    </span>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm md:text-base">
                        {step.title}
                      </h4>
                      <p className="text-slate-600 text-xs md:text-sm mt-1 leading-relaxed">
                        {step.explanation}
                      </p>
                    </div>
                  </div>

                  <button className="text-slate-400 group-hover:text-slate-600 p-1">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                {/* Math expression & notes */}
                {isExpanded && (
                  <div className={`px-4 pb-4 pt-1 space-y-3 ${isEn ? "ml-11" : "mr-11"}`}>
                    {step.mathExpression && (
                      <div
                        className="bg-slate-900 text-emerald-300 px-4 py-3 rounded-xl font-mono text-center text-sm md:text-base overflow-x-auto shadow-inner border border-slate-800"
                        dir="ltr"
                      >
                        <MathRenderer content={step.mathExpression} block />
                      </div>
                    )}

                    {step.subSteps && step.subSteps.length > 0 && (
                      <ul className="space-y-1.5 text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
                        {step.subSteps.map((sub, sIdx) => (
                          <li key={sIdx} className="flex items-center gap-2">
                            <CheckSquare className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
                            <span>{sub}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {step.note && (
                      <div className="flex items-start gap-2 bg-amber-50/70 border border-amber-200/60 rounded-xl p-2.5 text-xs text-amber-900">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <span><strong>{isEn ? "Teacher Guidance:" : "توجيه الأستاذ:"}</strong> {step.note}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
