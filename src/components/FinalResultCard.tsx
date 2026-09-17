import React, { useState } from "react";
import { CheckCircle, Volume2, Copy, Check } from "lucide-react";
import { MathRenderer } from "./MathRenderer";
import { AppLanguage } from "../types";

interface FinalResultCardProps {
  summary: string;
  highlightValue: string;
  units?: string;
  category?: string;
  difficulty?: string;
  lang?: AppLanguage;
}

export const FinalResultCard: React.FC<FinalResultCardProps> = ({
  summary,
  highlightValue,
  units,
  category,
  difficulty,
  lang = "ar",
}) => {
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const isEn = lang === "en";

  const handleCopy = () => {
    navigator.clipboard.writeText(`${summary} | ${highlightValue} ${units || ''}`.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    if (isPlayingAudio) {
      setIsPlayingAudio(false);
      return;
    }

    const textToSpeak = isEn
      ? `The final result is: ${summary}. Output value: ${highlightValue} ${units || ''}`
      : `النتيجة النهائية هي: ${summary}. الناتج: ${highlightValue} ${units || ''}`;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = isEn ? "en-US" : "ar-SA";
    utterance.rate = 0.95;

    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find((v) => v.lang.startsWith(isEn ? "en" : "ar"));
    if (voice) utterance.voice = voice;

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div
      id="final-result-card"
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-800 text-white p-6 shadow-xl border border-emerald-500/30 transition-all duration-300"
    >
      {/* Decorative background glow */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-xs">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-200" />
              {isEn ? "1. Final Verified Result" : "1. النتيجة النهائية المعتمدة"}
            </span>
            {category && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-900/40 text-emerald-100 border border-emerald-400/30">
                {category}
              </span>
            )}
            {difficulty && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-900/40 text-cyan-100 border border-cyan-400/30">
                {isEn ? `Level: ${difficulty}` : `مستوى ${difficulty}`}
              </span>
            )}
          </div>

          <h2 className="text-xl md:text-2xl font-black tracking-wide leading-relaxed text-emerald-50">
            {summary}
          </h2>
        </div>

        {/* Highlight Value Box */}
        <div className={`flex flex-col ${isEn ? "items-start md:items-end" : "items-start md:items-end"} gap-2`}>
          <div className={`bg-white/15 backdrop-blur-md px-5 py-3.5 rounded-xl border border-white/25 shadow-inner ${isEn ? "text-left" : "text-right"}`}>
            <span className="block text-xs text-emerald-100/80 font-medium mb-1">
              {isEn ? "Exact Numerical / Symbolic Result:" : "الناتج الحسابي الدقيق:"}
            </span>
            <div className="text-2xl md:text-3xl font-black text-white tracking-wide font-mono" dir="ltr">
              <MathRenderer content={highlightValue} />
              {units && <span className="text-emerald-200 text-lg mr-2 font-sans">{units}</span>}
            </div>
          </div>

          {/* Audio & Copy Controls */}
          <div className="flex items-center gap-2">
            <button
              id="speak-result-btn"
              onClick={handleSpeak}
              title={isEn ? "Listen to result" : "استمع للنتيجة بصوت المعلم"}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                isPlayingAudio
                  ? "bg-amber-400 text-amber-950 shadow-md animate-pulse"
                  : "bg-white/20 hover:bg-white/30 text-white"
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>{isPlayingAudio ? (isEn ? "Speaking..." : "جارِ القراءة...") : (isEn ? "Listen" : "استمع للناتج")}</span>
            </button>

            <button
              id="copy-result-btn"
              onClick={handleCopy}
              title={isEn ? "Copy result" : "نسخ النتيجة"}
              className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span className="text-emerald-200">{isEn ? "Copied" : "تم النسخ"}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>{isEn ? "Copy" : "نسخ"}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
