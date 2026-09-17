import React from "react";
import { Sliders, Gauge, GraduationCap } from "lucide-react";
import { EducationalLevel, LearningPace, SubjectCategory, AppLanguage } from "../types";
import { translations } from "../utils/translations";

interface LevelPaceSelectorProps {
  level: EducationalLevel;
  setLevel: (lvl: EducationalLevel) => void;
  pace: LearningPace;
  setPace: (p: LearningPace) => void;
  subject: SubjectCategory;
  setSubject: (s: SubjectCategory) => void;
  lang: AppLanguage;
}

export const LevelPaceSelector: React.FC<LevelPaceSelectorProps> = ({
  level,
  setLevel,
  pace,
  setPace,
  subject,
  setSubject,
  lang,
}) => {
  const isEn = lang === "en";
  const t = translations[lang];

  const levelOptions: { id: EducationalLevel; label: string; subtext: string }[] = isEn
    ? [
        { id: "primary", label: t.levels.primary.title, subtext: t.levels.primary.desc },
        { id: "middle", label: t.levels.middle.title, subtext: t.levels.middle.desc },
        { id: "secondary", label: t.levels.secondary.title, subtext: t.levels.secondary.desc },
        { id: "university", label: t.levels.university.title, subtext: t.levels.university.desc },
      ]
    : [
        { id: "primary", label: "الابتدائي", subtext: "شرح حسي وبسيط" },
        { id: "middle", label: "المتوسط / الإعدادي", subtext: "منهج مدرسي متسلسل" },
        { id: "secondary", label: "الثانوي", subtext: "دقة وبراهين وقوانين" },
        { id: "university", label: "الجامعي", subtext: "عمق أكاديمي متقدم" },
      ];

  const paceOptions: { id: LearningPace; label: string; badge: string; desc: string }[] = isEn
    ? [
        { id: "simplified", label: t.paces.simplified.title, badge: "Step-by-step 🐢", desc: t.paces.simplified.desc },
        { id: "standard", label: t.paces.standard.title, badge: "Curriculum 📘", desc: t.paces.standard.desc },
        { id: "advanced", label: t.paces.advanced.title, badge: "Intensive ⚡", desc: t.paces.advanced.desc },
      ]
    : [
        { id: "simplified", label: "وتيرة مبسطة", badge: "خطوة خطوة 🐢", desc: "شرح هادئ وموسع مع أمثلة تقريبية" },
        { id: "standard", label: "وتيرة قياسية", badge: "مدرسية معتمدة 📘", desc: "توازن نموذجي يطابق الكتب المدرسية" },
        { id: "advanced", label: "وتيرة متقدمة", badge: "مكثفة وسريعة ⚡", desc: "استنتاجات شاملة وحالات خاصة" },
      ];

  const subjectOptions: { id: SubjectCategory; label: string }[] = [
    { id: "all", label: t.subjects.all },
    { id: "math", label: `${t.subjects.math} 📐` },
    { id: "physics", label: `${t.subjects.physics} ⚡` },
    { id: "chemistry", label: `${t.subjects.chemistry} 🧪` },
    { id: "general_science", label: `${t.subjects.general_science} 🔬` },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200/80 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded-lg bg-indigo-50 text-indigo-700">
            <Sliders className="w-4 h-4" />
          </span>
          <h3 className="font-bold text-slate-800 text-sm">
            {isEn ? "10. Customization & Learning Pace" : "10. التخصيص وتحديد وتيرة التعلم"}
          </h3>
        </div>
        <span className="text-[11px] text-slate-500 hidden sm:inline">
          {isEn
            ? "Tailor the explanation to your academic level and learning pace"
            : "تكييف الشرح بما يناسب مستواك وسرعتك الشخصية"}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Educational Level */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
            <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
            <span>{t.levelSelectorTitle}:</span>
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {levelOptions.map((opt) => {
              const active = level === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setLevel(opt.id)}
                  className={`p-2 rounded-xl transition-all border ${
                    isEn ? "text-left" : "text-right"
                  } ${
                    active
                      ? "bg-indigo-50 border-indigo-500 text-indigo-900 font-bold shadow-xs"
                      : "bg-slate-50/70 border-slate-200/80 text-slate-700 hover:bg-slate-100/70"
                  }`}
                >
                  <div className="text-xs">{opt.label}</div>
                  <div className="text-[10px] text-slate-500 font-normal">{opt.subtext}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Learning Pace */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
            <Gauge className="w-3.5 h-3.5 text-indigo-600" />
            <span>{t.paceSelectorTitle}:</span>
          </label>
          <div className="space-y-1.5">
            {paceOptions.map((opt) => {
              const active = pace === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setPace(opt.id)}
                  className={`w-full px-3 py-1.5 rounded-xl transition-all border flex items-center justify-between ${
                    isEn ? "text-left" : "text-right"
                  } ${
                    active
                      ? "bg-indigo-50 border-indigo-500 text-indigo-900 font-bold shadow-xs"
                      : "bg-slate-50/70 border-slate-200/80 text-slate-700 hover:bg-slate-100/70"
                  }`}
                >
                  <div>
                    <div className="text-xs">{opt.label}</div>
                    <div className="text-[10px] text-slate-500 font-normal">{opt.desc}</div>
                  </div>
                  <span className="text-[11px] font-semibold">{opt.badge}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Subject Category Filter */}
        <div className="space-y-1.5 md:col-span-2 lg:col-span-1">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
            <span>{t.subjectSelectorTitle}:</span>
          </label>
          <div className="flex flex-wrap gap-1.5">
            {subjectOptions.map((sub) => {
              const active = subject === sub.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => setSubject(sub.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
                    active
                      ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                      : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {sub.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
