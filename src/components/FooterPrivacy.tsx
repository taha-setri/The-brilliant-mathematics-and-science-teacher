import React, { useState, useEffect } from "react";
import { Shield, Cookie, ExternalLink, X } from "lucide-react";
import { AppLanguage } from "../types";
import { translations } from "../utils/translations";

interface FooterPrivacyProps {
  lang: AppLanguage;
}

export const FooterPrivacy: React.FC<FooterPrivacyProps> = ({ lang }) => {
  const [activeModal, setActiveModal] = useState<"privacy" | "cookies" | null>(null);
  const [showCookieBanner, setShowCookieBanner] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem("tutor_cookie_consent_v1");
      if (!consent) {
        setShowCookieBanner(true);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleAcceptCookies = () => {
    try {
      localStorage.setItem("tutor_cookie_consent_v1", "accepted");
    } catch {
      // ignore
    }
    setShowCookieBanner(false);
  };

  const isEn = lang === "en";
  const t = translations[lang].footer;
  const cb = translations[lang].cookieBanner;

  return (
    <>
      <footer id="main-footer" className="mt-16 bg-slate-900 text-slate-300 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-slate-800">
            {/* Col 1: Platform & Founder */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-black text-sm">
                  ∑
                </div>
                <h3 className="text-base font-bold text-white">
                  {translations[lang].appName}
                </h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t.description}
              </p>

              {/* Founder Highlight */}
              <div className="pt-2">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs">
                  <span className="text-indigo-400 font-semibold">{translations[lang].founderLabel.split(":")[0]}:</span>
                  <span className="text-white font-bold tracking-wide">Taha setri</span>
                </div>
              </div>
            </div>

            {/* Col 2: Network & Sites */}
            <div className="space-y-3 text-xs">
              <h4 className="font-bold text-white text-sm">{t.networkColTitle}</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://ai-sanad-setri-7.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-300 hover:text-indigo-400 flex items-center gap-1.5 transition-colors group"
                  >
                    <span>{t.prevSiteLabel}</span>
                    <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-indigo-400" />
                  </a>
                </li>
                <li className="text-slate-400">
                  {t.interactivePlatformLabel}
                </li>
                <li className="text-slate-400">
                  {t.freeTeacherLabel}
                </li>
              </ul>
            </div>

            {/* Col 3: Privacy & Cookies Section */}
            <div className="space-y-3 text-xs">
              <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>{t.privacyColTitle}</span>
              </h4>
              <p className="text-slate-400 leading-relaxed">
                {t.privacyColDesc}
              </p>
              <div className="flex items-center gap-3 pt-1">
                <button
                  id="open-privacy-policy-btn"
                  onClick={() => setActiveModal("privacy")}
                  className="text-indigo-400 hover:text-indigo-300 underline underline-offset-4 font-semibold transition-colors"
                >
                  {t.privacyPolicyLink}
                </button>
                <span className="text-slate-600">•</span>
                <button
                  id="open-cookies-policy-btn"
                  onClick={() => setActiveModal("cookies")}
                  className="text-indigo-400 hover:text-indigo-300 underline underline-offset-4 font-semibold transition-colors flex items-center gap-1"
                >
                  <Cookie className="w-3.5 h-3.5" />
                  <span>{t.cookiesPolicyLink}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Bar: Copyright and Founder */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span>{t.copyright}</span>
            </div>

            <div className="flex items-center gap-2">
              <span>{t.developedBy}</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Privacy Policy Modal */}
      {activeModal === "privacy" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
          <div className={`bg-white text-slate-900 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl flex flex-col border border-slate-200 ${isEn ? "text-left" : "text-right"}`}>
            <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-base sm:text-lg">
                  {isEn ? "Privacy Policy & Student Data Protection" : "سياسة الخصوصية وحماية بيانات الطلاب"}
                </h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-900">
                <strong>{isEn ? "Commitment from Founder Taha setri:" : "التزام المؤسس Taha setri:"}</strong>{" "}
                {isEn
                  ? "This educational platform is created to empower students completely free of charge, with a strict commitment to never collecting personal identifying information or tracking browsing habits."
                  : "تم تصميم هذه المنصة التعليمية لخدمة الطلاب والمتمدرسين مجاناً، مع الحرص التام على عدم جمع أي بيانات تعريفية شخصية أو تتبع أنشطة التصفح."}
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-sm">
                  {isEn ? "1. Data Collection & Processing:" : "1. جمع البيانات واستخدامها:"}
                </h4>
                <p>
                  {isEn
                    ? "The platform does not require account registration, email addresses, or phone numbers to solve problems or interact with 'Ask the Teacher'. Only the problem query is processed to generate the pedagogical solution."
                    : "لا تتطلب المنصة تسجيل حساب أو إدخال أي بريد إلكتروني أو رقم هاتف لحل المسائل أو استخدام ميزة 'اسأل المعلم'. يتم إرسال نص المسألة فقط لمعالجتها وإرجاع الحل التربوي."}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-sm">
                  {isEn ? "2. Student Safety & Content Integrity:" : "2. أمان الطلاب وحماية المحتوى:"}
                </h4>
                <p>
                  {isEn
                    ? "We strictly uphold digital educational safety standards. The platform contains zero third-party commercial advertisements, zero monetization popups, and zero tracking pixels."
                    : "نلتزم بالمعايير التربوية للسلامة الرقمية. لا يتضمن المحتوى أي إعلانات خارجية أو روابط تتبعية تجارية."}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-sm">
                  {isEn ? "3. Deployment & Availability:" : "3. النشر والاستضافة:"}
                </h4>
                <p>
                  {isEn
                    ? "The platform is fully optimized for cloud deployment (such as Vercel) providing an open, free educational utility without requiring personal API keys from users."
                    : "المنصة مهيأة للعمل والنشر السحابي (مثل Vercel) وتوفر تجربة تعليمية مجانية بالكامل ومفتوحة دون أي متطلبات مالية أو مفاتيح API من المستخدم."}
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors"
              >
                {isEn ? "Close and Return to Study" : "إغلاق والعودة للدراسة"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cookies Policy Modal */}
      {activeModal === "cookies" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
          <div className={`bg-white text-slate-900 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl flex flex-col border border-slate-200 ${isEn ? "text-left" : "text-right"}`}>
            <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cookie className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-base sm:text-lg">
                  {isEn ? "Cookies & Local Storage Policy" : "سياسة ملفات تعريف الارتباط (Cookies) والتخزين المحلي"}
                </h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl text-amber-900">
                <strong>{isEn ? "Cookie Transparency:" : "شفافية استخدام الكوكيز:"}</strong>{" "}
                {isEn
                  ? "We only use essential client-side LocalStorage to save your solved problem history, language, and preferred learning pace on your own device."
                  : "نحن نستخدم فقط التخزين المحلي الضروري (LocalStorage) لحفظ سجل مسائلك المحلولة وسرعة وتيرة التعلم المفضلة لديك على جهازك الشخصي."}
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-sm">
                  {isEn ? "What do we store locally?" : "ما هي الملفات التي نخزنها؟"}
                </h4>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  {isEn ? (
                    <>
                      <li><strong>Problem History:</strong> To allow you to revisit previously solved problems during your revision session.</li>
                      <li><strong>Pace & Grade Preferences:</strong> To remember your selected academic level and learning pace.</li>
                      <li><strong>Language Choice:</strong> To preserve your Arabic or English viewing preference.</li>
                    </>
                  ) : (
                    <>
                      <li><strong>سجل المسائل:</strong> لتتمكن من الرجوع إلى المسائل التي حللتها أثناء جلستك الحالية ومراجعتها متى شئت.</li>
                      <li><strong>إعدادات وتيرة التعلم والمرحلة:</strong> لتذكر خياراتك المفضلة (ابتدائي، متوسط، ثانوي، إلخ).</li>
                      <li><strong>حالة الموافقة:</strong> لتسجيل موافقتك على إشعار الكوكيز حتى لا يظهر لك باستمرار.</li>
                    </>
                  )}
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-sm">
                  {isEn ? "Zero Advertising Cookies:" : "عدم وجود كوكيز إعلانية:"}
                </h4>
                <p>
                  {isEn
                    ? "We strictly guarantee zero third-party advertising cookies, zero marketing trackers, and zero behavioral profiling."
                    : "نؤكد عدم استخدام أي ملفات كوكيز لأغراض إعلانية أو استهداف تسويقي أو مشاركتها مع أطراف ثالثة."}
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors"
              >
                {isEn ? "Understood & Agreed" : "فهمت وموافق"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Cookie Consent Banner */}
      {showCookieBanner && (
        <div
          id="cookie-consent-banner"
          className="fixed bottom-4 right-4 left-4 sm:left-auto sm:max-w-md z-40 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-slate-200 text-xs text-slate-700 animate-fadeIn"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700 flex-shrink-0">
              <Cookie className="w-5 h-5" />
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 text-sm">
                {cb.title}
              </h4>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                {cb.desc}
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={handleAcceptCookies}
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors shadow-xs"
                >
                  {cb.accept}
                </button>
                <button
                  onClick={() => setActiveModal("cookies")}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors"
                >
                  {cb.details}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
