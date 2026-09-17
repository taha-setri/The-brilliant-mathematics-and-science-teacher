import React, { useState } from "react";
import {
  Share2,
  Copy,
  Check,
  X,
  MessageCircle,
  Send,
  ExternalLink,
  BookOpen,
} from "lucide-react";
import { ProblemSolution, AppLanguage } from "../types";
import { translations } from "../utils/translations";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  solution: ProblemSolution | null;
  currentQuery: string;
  lang: AppLanguage;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  solution,
  currentQuery,
  lang,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);

  if (!isOpen) return null;

  const t = translations[lang].shareModal;
  const isRtl = lang === "ar";

  // Build the shareable URL
  const baseUrl = window.location.origin + window.location.pathname;
  const problemToShare = solution?.problemQuery || currentQuery;
  const urlParams = new URLSearchParams();
  if (problemToShare) urlParams.set("q", problemToShare);
  if (solution?.level) urlParams.set("lvl", solution.level);
  if (solution?.pace) urlParams.set("pace", solution.pace);
  if (lang) urlParams.set("lang", lang);

  const fullShareUrl = `${baseUrl}?${urlParams.toString()}`;

  // Formatted Study Summary
  const shareTitle = lang === "ar"
    ? `حل مسألة عبر أستاذ الرياضيات والعلوم الذكي`
    : `Problem Solution via Smart Math & Science Tutor`;

  const summaryText = lang === "ar"
    ? `📐 مسألة رياضية / علمية:
"${problemToShare}"

🎯 النتيجة النهائية:
${solution?.finalResult?.summary || "تم الحل بالخطوات المفصلة والقوانين العلمية"}

🔗 راجع خطوات الحل الكاملة والاختبار التفاعلي هنا:
${fullShareUrl}

✨ بإشراف المؤسس: Taha setri`
    : `📐 Math / Science Problem:
"${problemToShare}"

🎯 Final Result:
${solution?.finalResult?.summary || "Solved with detailed steps and scientific laws"}

🔗 View full step-by-step lesson and quiz here:
${fullShareUrl}

✨ Supervised by Founder: Taha setri`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullShareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleCopySummary = async () => {
    try {
      await navigator.clipboard.writeText(summaryText);
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: summaryText,
          url: fullShareUrl,
        });
      } catch {
        // user cancelled or share failed
      }
    }
  };

  // Social Links
  const encodedUrl = encodeURIComponent(fullShareUrl);
  const encodedText = encodeURIComponent(`${shareTitle}\n\n${problemToShare}`);
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`;
  const telegramUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div
        className={`bg-white text-slate-900 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col ${
          isRtl ? "text-right" : "text-left"
        }`}
      >
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-indigo-700 via-indigo-800 to-indigo-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-xs flex items-center justify-center">
              <Share2 className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-bold text-base md:text-lg leading-tight">
                {t.title}
              </h3>
              <p className="text-xs text-indigo-200">{t.subtitle}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-indigo-200 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 text-sm">
          {/* Problem Preview */}
          {problemToShare && (
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider block">
                {lang === "ar" ? "المسألة المراد مشاركتها:" : "Problem to Share:"}
              </span>
              <p className="text-xs sm:text-sm text-slate-800 font-medium line-clamp-2">
                "{problemToShare}"
              </p>
            </div>
          )}

          {/* Direct Link Section */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">
              {t.copyLink}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={fullShareUrl}
                className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-100 border border-slate-200 text-slate-600 font-mono select-all focus:outline-hidden"
              />
              <button
                id="copy-share-link-btn"
                onClick={handleCopyLink}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs ${
                  copiedLink
                    ? "bg-emerald-600 text-white"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white"
                }`}
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>{t.copied}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{lang === "ar" ? "نسخ" : "Copy"}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Social Platforms Grid */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-slate-700 block">
              {t.shareVia}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {/* WhatsApp */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold transition-all"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>واتساب</span>
              </a>

              {/* Telegram */}
              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-800 text-xs font-bold transition-all"
              >
                <Send className="w-4 h-4 text-sky-600" />
                <span>تيليجرام</span>
              </a>

              {/* Twitter / X */}
              <a
                href={twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-900 text-xs font-bold transition-all"
              >
                <span className="font-mono text-sm font-black">𝕏</span>
                <span>تويتر / X</span>
              </a>

              {/* Facebook */}
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 text-xs font-bold transition-all"
              >
                <span className="font-bold text-sm text-blue-600">f</span>
                <span>فيسبوك</span>
              </a>
            </div>
          </div>

          {/* Copy Formatted Summary or Native Share */}
          <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleCopySummary}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                copiedSummary
                  ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                  : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700"
              }`}
            >
              {copiedSummary ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>{t.summaryCopied}</span>
                </>
              ) : (
                <>
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  <span>{t.copySummary}</span>
                </>
              )}
            </button>

            {typeof navigator !== "undefined" && typeof navigator.share === "function" && (
              <button
                onClick={handleNativeShare}
                className="py-2.5 px-4 rounded-xl text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 flex items-center justify-center gap-2 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span>{lang === "ar" ? "مشاركة من الجهاز" : "Native Share"}</span>
              </button>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>{translations[lang].networkSubtitle}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold transition-colors"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
