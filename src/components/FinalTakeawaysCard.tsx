import React from "react";
import { CheckCheck, Star } from "lucide-react";
import { AppLanguage } from "../types";

interface FinalTakeawaysCardProps {
  takeaways: string[];
  lang?: AppLanguage;
}

export const FinalTakeawaysCard: React.FC<FinalTakeawaysCardProps> = ({ takeaways, lang = "ar" }) => {
  if (!takeaways || takeaways.length === 0) return null;
  const isEn = lang === "en";

  return (
    <div
      id="final-takeaways-card"
      className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200/80 space-y-4"
    >
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <span className="p-1.5 rounded-lg bg-purple-50 text-purple-700">
          <CheckCheck className="w-5 h-5" />
        </span>
        <div>
          <h3 className="text-lg font-bold text-slate-800">
            {isEn ? "6. Final Review & Concept Key Takeaways" : "6. المراجعة النهائية وخلاصة المفهوم"}
          </h3>
          <p className="text-xs text-slate-500">
            {isEn
              ? "Core principles and essential takeaways to retain for your exams and future lessons"
              : "النقاط الجوهرية والأساسية التي يجب عليك حفظها وفهمها دائماً"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {takeaways.map((point, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3 bg-purple-50/40 border border-purple-100 p-3.5 rounded-xl text-slate-800 text-xs md:text-sm leading-relaxed"
          >
            <span className="p-1 bg-purple-100 rounded-md text-purple-700 mt-0.5 flex-shrink-0">
              <Star className="w-3.5 h-3.5 fill-purple-600 text-purple-600" />
            </span>
            <span className="font-medium">{point}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
