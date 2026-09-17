import React from "react";
import { ExternalLink, Globe, Layers, Languages } from "lucide-react";
import { AppLanguage } from "../types";
import { translations } from "../utils/translations";

interface NetworkBarProps {
  lang: AppLanguage;
  onToggleLang: (lang: AppLanguage) => void;
}

export const NetworkBar: React.FC<NetworkBarProps> = ({ lang, onToggleLang }) => {
  const t = translations[lang];

  return (
    <div
      id="network-bar"
      className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 text-slate-200 text-xs py-2 px-4 border-b border-indigo-900/50 shadow-xs"
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        {/* Left / Start: Network Info & Founder */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 font-bold text-white tracking-wide">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>{t.networkTitle}</span>
          </div>

          <span className="hidden sm:inline-block text-slate-600">|</span>

          <span className="text-[11px] text-slate-300 hidden md:inline">
            {t.networkSubtitle}
          </span>

          <span className="hidden lg:inline-block text-slate-600">•</span>

          <span className="text-[11px] text-amber-300 font-medium hidden lg:inline">
            {t.founderLabel}
          </span>
        </div>

        {/* Right / End: Language Switcher & Link to Previous Site */}
        <div className="flex items-center gap-2.5 self-end sm:self-center">
          {/* Language Switcher Button */}
          <button
            id="network-lang-switcher"
            type="button"
            onClick={() => onToggleLang(lang === "ar" ? "en" : "ar")}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-[11px] font-bold border border-slate-700 transition-colors"
            title={lang === "ar" ? "Switch to English" : "التبديل إلى العربية"}
          >
            <Languages className="w-3 h-3 text-amber-300" />
            <span>{lang === "ar" ? "English" : "العربية"}</span>
          </button>

          {/* Link to Previous Site */}
          <a
            href="https://ai-sanad-setri-7.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            id="prev-site-link"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-600/80 hover:bg-indigo-600 text-white text-[11px] font-bold border border-indigo-400/40 transition-all hover:shadow-xs group"
          >
            <Globe className="w-3 h-3 text-indigo-200 group-hover:rotate-12 transition-transform" />
            <span>{t.prevSiteLinkText}</span>
            <ExternalLink className="w-3 h-3 text-indigo-300 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </div>
  );
};
