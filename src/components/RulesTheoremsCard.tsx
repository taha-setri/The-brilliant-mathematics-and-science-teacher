import React, { useState } from "react";
import { BookOpen, HelpCircle, Layers, Sparkles } from "lucide-react";
import { RuleTheorem, AppLanguage } from "../types";
import { MathRenderer } from "./MathRenderer";
import { FlashcardsModal } from "./FlashcardsModal";
import { translations } from "../utils/translations";

interface RulesTheoremsCardProps {
  rules: RuleTheorem[];
  problemTitle?: string;
  lang?: AppLanguage;
}

export const RulesTheoremsCard: React.FC<RulesTheoremsCardProps> = ({
  rules,
  problemTitle,
  lang = "ar",
}) => {
  const [isFlashcardsOpen, setIsFlashcardsOpen] = useState(false);

  if (!rules || rules.length === 0) return null;
  const isEn = lang === "en";
  const t = translations[lang];

  return (
    <div id="rules-theorems-card" className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200/80 space-y-4">
      {/* Header with Flashcard Generation Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
            <BookOpen className="w-5 h-5" />
          </span>
          <div>
            <h3 className="text-lg font-bold text-slate-800">
              {isEn ? "3. Rules & Scientific Theorems" : "3. قاعدة أو قانون الاستخدام"}
            </h3>
            <p className="text-xs text-slate-500">
              {isEn
                ? "Mathematical theorems and scientific formulas grounding the solution"
                : "القوانين الرياضية والمفاهيم العلمية المنهجية التي استندنا إليها في الحل"}
            </p>
          </div>
        </div>

        {/* Action Button to Generate Digital Flashcards */}
        <button
          id="generate-flashcards-btn"
          type="button"
          onClick={() => setIsFlashcardsOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all self-start sm:self-center cursor-pointer group"
          title={isEn ? "Generate digital flashcards from these rules" : "توليد بطاقات استذكار تفاعلية من هذه القوانين"}
        >
          <Layers className="w-4 h-4 text-amber-300 group-hover:scale-110 transition-transform" />
          <span>{t.flashcards.generateBtn}</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-200" />
        </button>
      </div>

      {/* Rules list */}
      <div className="space-y-4">
        {rules.map((rule, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50/40 to-slate-50 p-4 space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h4 className="font-bold text-blue-950 text-base flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                {rule.name}
              </h4>
            </div>

            {/* Formula Block */}
            {rule.formula && (
              <div
                className="bg-white px-4 py-3 rounded-lg border border-blue-200/80 shadow-xs text-center font-mono text-blue-900 text-base md:text-lg overflow-x-auto"
                dir="ltr"
              >
                <MathRenderer content={rule.formula} block />
              </div>
            )}

            {/* Explanation */}
            <p className="text-xs md:text-sm text-slate-700 leading-relaxed">
              {rule.explanation}
            </p>

            {/* Variables and units breakdown */}
            {rule.variablesExplained && rule.variablesExplained.length > 0 && (
              <div className="bg-white/80 rounded-lg p-3 border border-slate-200/70 space-y-2">
                <div className="flex items-center gap-1 text-xs font-bold text-slate-600">
                  <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
                  <span>{isEn ? "Variables and Units Breakdown:" : "دلالات الرموز والوحدات:"}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                  {rule.variablesExplained.map((v, vIdx) => (
                    <div
                      key={vIdx}
                      className="flex items-center justify-between bg-slate-50 px-2.5 py-1.5 rounded border border-slate-100"
                    >
                      <span className="font-mono font-bold text-indigo-700 dir-ltr">
                        {v.symbol}
                      </span>
                      <span className={`text-slate-700 font-medium ${isEn ? "ml-2 text-left" : "mr-2 text-right"}`}>
                        {v.meaning} {v.unit ? `(${v.unit})` : ""}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Digital Flashcards Modal */}
      <FlashcardsModal
        isOpen={isFlashcardsOpen}
        onClose={() => setIsFlashcardsOpen(false)}
        rules={rules}
        problemTitle={problemTitle}
        lang={lang}
      />
    </div>
  );
};
