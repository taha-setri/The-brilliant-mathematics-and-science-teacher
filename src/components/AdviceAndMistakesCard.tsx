import React from "react";
import { AlertTriangle, HeartHandshake, ShieldAlert } from "lucide-react";
import { AppLanguage } from "../types";

interface AdviceAndMistakesCardProps {
  encouragement: string;
  commonMistakes: string[];
  lang?: AppLanguage;
}

export const AdviceAndMistakesCard: React.FC<AdviceAndMistakesCardProps> = ({
  encouragement,
  commonMistakes,
  lang = "ar",
}) => {
  const isEn = lang === "en";

  return (
    <div id="advice-mistakes-section" className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Encouragement Card */}
      <div className="rounded-2xl p-5 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-amber-50 border border-amber-200/80 shadow-xs flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center gap-2 text-amber-800 font-bold text-base mb-2">
            <span className="p-1 rounded-lg bg-amber-100 text-amber-700">
              <HeartHandshake className="w-4 h-4" />
            </span>
            <h4>{isEn ? "4. Teacher's Pedagogical Encouragement" : "4. نصيحة الأستاذ التشجيعية"}</h4>
          </div>
          <p className="text-slate-800 text-xs md:text-sm leading-relaxed font-medium">
            "{encouragement || (isEn ? "You are doing wonderful work! Math and science are skills refined by continuous practice and curiosity, not rote memorization. Keep going!" : "أنت تبلي بلاءً حسناً! الرياضيات والعلوم مهارة تتطور بالتكرار وحل المسائل وليس بالحفظ المجرد. واصل تقدمك!")}"
          </p>
        </div>

        <div className="text-[11px] text-amber-700/80 flex items-center gap-1 font-semibold pt-2 border-t border-amber-200/40">
          <span>{isEn ? "🌟 Your teacher is proud of your effort and perseverance!" : "🌟 أستاذك فخور باجتهادك وسعيك للفهم!"}</span>
        </div>
      </div>

      {/* Common Pitfalls & Mistakes Card */}
      <div className="rounded-2xl p-5 bg-gradient-to-br from-rose-500/10 via-red-500/5 to-rose-50 border border-rose-200/80 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-rose-900 font-bold text-base">
          <span className="p-1 rounded-lg bg-rose-100 text-rose-700">
            <ShieldAlert className="w-4 h-4" />
          </span>
          <h4>{isEn ? "Notice: Common Pitfalls to Avoid" : "تنبيه: أخطاء شائعة احذر الوقوع فيها"}</h4>
        </div>

        <ul className="space-y-2">
          {commonMistakes && commonMistakes.length > 0 ? (
            commonMistakes.map((mistake, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 text-xs md:text-sm text-slate-800 bg-white/70 p-2 rounded-lg border border-rose-100"
              >
                <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                <span>{mistake}</span>
              </li>
            ))
          ) : (
            <li className="text-xs text-slate-600">
              {isEn
                ? "Always pay attention to order of operations (PEMDAS) and matching physical units before plugging into formulas."
                : "انتبه دائماً لأسبقية العمليات الحسابية ومطابقة الوحدات الفيزيائية قبل التعويض في القوانين."}
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};
