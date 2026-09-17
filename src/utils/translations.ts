import { AppLanguage } from "../types";

export interface Translations {
  appName: string;
  appBadge: string;
  appSubtitle: string;
  networkTitle: string;
  networkSubtitle: string;
  founderLabel: string;
  prevSiteLinkText: string;
  historyBtn: string;
  askTeacherBtn: string;
  shareBtn: string;
  levelSelectorTitle: string;
  paceSelectorTitle: string;
  subjectSelectorTitle: string;
  levels: {
    primary: { title: string; desc: string };
    middle: { title: string; desc: string };
    secondary: { title: string; desc: string };
    university: { title: string; desc: string };
  };
  paces: {
    simplified: { title: string; desc: string };
    standard: { title: string; desc: string };
    advanced: { title: string; desc: string };
  };
  subjects: {
    all: string;
    math: string;
    physics: string;
    chemistry: string;
    general_science: string;
  };
  inputHeading: string;
  inputSubheading: string;
  inputPlaceholder: string;
  clearText: string;
  quickSymbols: string;
  sampleModels: string;
  solveBtn: string;
  solvingBtn: string;
  loadingTitle: string;
  loadingDesc: string;
  errorAlert: string;
  retryBtn: string;
  emptyHeading: string;
  emptyDesc: string;
  solutionHeaderTitle: string;
  printBtn: string;
  askAboutThisBtn: string;
  shareModal: {
    title: string;
    subtitle: string;
    copyLink: string;
    copied: string;
    shareVia: string;
    copySummary: string;
    summaryCopied: string;
    close: string;
  };
  flashcards: {
    generateBtn: string;
    modalTitle: string;
    modalSubtitle: string;
    frontPrompt: string;
    clickToFlip: string;
    flipBack: string;
    formulaLabel: string;
    explanationLabel: string;
    variablesLabel: string;
    masteredBtn: string;
    needsReviewBtn: string;
    previous: string;
    next: string;
    shuffle: string;
    restart: string;
    listen: string;
    completedTitle: string;
    completedDesc: string;
    masteredCount: string;
    needsReviewCount: string;
    close: string;
  };
  footer: {
    description: string;
    networkColTitle: string;
    prevSiteLabel: string;
    interactivePlatformLabel: string;
    freeTeacherLabel: string;
    privacyColTitle: string;
    privacyColDesc: string;
    privacyPolicyLink: string;
    cookiesPolicyLink: string;
    copyright: string;
    developedBy: string;
  };
  cookieBanner: {
    title: string;
    desc: string;
    accept: string;
    details: string;
  };
}

export const translations: Record<AppLanguage, Translations> = {
  ar: {
    appName: "أستاذ الرياضيات والعلوم الذكي",
    appBadge: "خبير تربوي معتمد",
    appSubtitle: "شرح تفصيلي خطوة بخطوة وفق المعايير التربوية والمنهج الدراسي",
    networkTitle: "شبكة منصات سند الذكية",
    networkSubtitle: "المنصة التخصصية في الرياضيات والعلوم",
    founderLabel: "المؤسس والمشرف: Taha setri",
    prevSiteLinkText: "الانتقال إلى الموقع السابق (ai-sanad-setri-7)",
    historyBtn: "السجل",
    askTeacherBtn: "تواصل مع المعلم",
    shareBtn: "مشاركة",
    levelSelectorTitle: "المرحلة الدراسية",
    paceSelectorTitle: "وتيرة الشرح",
    subjectSelectorTitle: "المادة",
    levels: {
      primary: { title: "المرحلة الابتدائية", desc: "أسلوب مبسط، أمثلة حسية ورسومية" },
      middle: { title: "المرحلة المتوسطة / الإعدادية", desc: "تدرج مدرسي، تعليل منطقي" },
      secondary: { title: "المرحلة الثانوية", desc: "براهين وقوانين، تحليل متعمق" },
      university: { title: "المرحلة الجامعية", desc: "صيغ رياضية متقدمة، اشتقاقات شاملة" },
    },
    paces: {
      simplified: { title: "مبسطة وهادئة", desc: "شرح تفصيلي ممهد بدون استعجال" },
      standard: { title: "قياسية ومدرسية", desc: "توازن بين الشرح والخطوات الرسمية" },
      advanced: { title: "متقدمة ومكثفة", desc: "تركيز على النظريات العميقة والاستنتاج" },
    },
    subjects: {
      all: "جميع المواد",
      math: "رياضيات",
      physics: "فيزياء",
      chemistry: "كيمياء",
      general_science: "علوم عامة",
    },
    inputHeading: "اطرح مسألتك أو معادلتك الرياضية / العلمية",
    inputSubheading: "اكتب أي عملية حسابية، مسألة لفظية، مبرهنة هندسية، أو قانون فيزياء وكيمياء",
    inputPlaceholder: "مثال: أوجد حلول المعادلة 3x² - 12 = 0، أو: احسب الطاقة الحركية لجسم كتلته 4kg يتحرك بسرعة 5 m/s...",
    clearText: "مسح النص",
    quickSymbols: "رموز سريعة:",
    sampleModels: "أو جرب نماذج منهجية جاهزة:",
    solveBtn: "حل واشرح المسألة بالتفصيل 🚀",
    solvingBtn: "الأستاذ يقوم بالحل والتحليل...",
    loadingTitle: "الأستاذ يعالج مسألتك الآن بدقة علمية وتربوية...",
    loadingDesc: "يتم صياغة النتيجة النهائية، الخطوات المفصلة، القوانين العلمية، نصائح الأخطاء الشائعة، ونموذج التدريب مع الاختبار القصير.",
    errorAlert: "تنبيه:",
    retryBtn: "إعادة المحاولة",
    emptyHeading: "منهجية الأستاذ التربوية في الشرح",
    emptyDesc: "كل مسألة تطرحها تُقدّم بإجابة منهجية متكاملة تشمل: النتيجة النهائية، خطوات الحل بالتفصيل، القوانين الرياضية، تنبيه الأخطاء الشائعة، نموذج تدريب إضافي، خلاصة الدرس، واختبار قصير للتحقق من الفهم!",
    solutionHeaderTitle: "المسألة:",
    printBtn: "طباعة",
    askAboutThisBtn: "اسأل الأستاذ عنها",
    shareModal: {
      title: "مشاركة المسألة والحل",
      subtitle: "شارك المسألة والشرح المنهجي مع زملائك في الدراسة",
      copyLink: "نسخ رابط المسألة المباشر",
      copied: "تم النسخ بنجاح! ✓",
      shareVia: "مشاركة فورية عبر منصات التواصل:",
      copySummary: "نسخ ملخص المسألة كنص للمجموعات",
      summaryCopied: "تم نسخ الملخص ✓",
      close: "إغلاق",
    },
    flashcards: {
      generateBtn: "توليد بطاقات المراجعة الذكية 🎴",
      modalTitle: "بطاقات الاستذكار الرقمية للقواعد والمبرهنات",
      modalSubtitle: "راجع القوانين والمفاهيم العلمية بأسلوب البطاقات التعليمية التفاعلية مع خاصية القلب الصوتي والتقييم الذاتي",
      frontPrompt: "ما هو نص وصيغة هذا المفهوم الرياضي أو العلمي؟",
      clickToFlip: "انقر على البطاقة لكشف القانون والشرح 🔄",
      flipBack: "انقر للعودة إلى واجهة البطاقة 🔄",
      formulaLabel: "الصيغة الرياضية / القانون:",
      explanationLabel: "الشرح والتطبيق العلمي:",
      variablesLabel: "تفسير الرموز والوحدات الفيزيائية:",
      masteredBtn: "أتقنت المفهوم ✅",
      needsReviewBtn: "يحتاج مراجعة لاحقاً 🔄",
      previous: "السابق",
      next: "التالي",
      shuffle: "خلط البطاقات",
      restart: "إعادة البدء",
      listen: "استمع لنطق القانون 🔊",
      completedTitle: "أحسنت! أكملت مراجعة جميع بطاقات هذا الدرس 🎉",
      completedDesc: "لقد راجعت كافة القوانين والمبرهنات المستخلصة من حل هذه المسألة بدقة منهجية.",
      masteredCount: "المفاهيم المتقنة",
      needsReviewCount: "مفاهيم للمراجعة",
      close: "إغلاق البطاقات",
    },
    footer: {
      description: "منصة تعليمية وتربوية ذكية لحل وتفسير مسائل الرياضيات والعلوم خطوة بخطوة باللغة العربية الفصحى وفق المعايير المنهجية.",
      networkColTitle: "شبكة منصات سند",
      prevSiteLabel: "الموقع السابق: منصة سند الذكية (ai-sanad-setri-7)",
      interactivePlatformLabel: "منصة أستاذ الرياضيات والعلوم (الإصدار التفاعلي الشامل)",
      freeTeacherLabel: "خدمة 'اسأل المعلم' المجانية والمفتوحة بدون مفاتيح API",
      privacyColTitle: "الخصوصية والأمان وملفات الكوكيز",
      privacyColDesc: "نلتزم بأعلى معايير حماية خصوصية الطلاب والناشئة. لا نشارك أي بيانات شخصية، وجميع الحسابات والنتائج تتم بسرية وأمان تامين.",
      privacyPolicyLink: "سياسة الخصوصية",
      cookiesPolicyLink: "ملفات الكوكيز",
      copyright: "جميع الحقوق محفوظة © 2026 • أستاذ الرياضيات والعلوم الذكي",
      developedBy: "تطوير وإشراف المؤسس: Taha setri",
    },
    cookieBanner: {
      title: "ملفات الكوكيز والخصوصية",
      desc: "نستخدم التخزين المحلي الضروري فقط لحفظ سجل المسائل وتفضيلات وتيرة التعلم، بإشراف المؤسس Taha setri، دون أي تتبع إعلاني.",
      accept: "موافق ومتابعة",
      details: "التفاصيل",
    },
  },
  en: {
    appName: "Smart Math & Science Tutor",
    appBadge: "Certified AI Educator",
    appSubtitle: "Step-by-step pedagogical explanations tailored to student pace and curriculum",
    networkTitle: "Sanad Smart Platforms Network",
    networkSubtitle: "Specialized Mathematics & Sciences Platform",
    founderLabel: "Founder & Supervisor: Taha setri",
    prevSiteLinkText: "Visit Previous Platform (ai-sanad-setri-7)",
    historyBtn: "History",
    askTeacherBtn: "Ask the Teacher",
    shareBtn: "Share",
    levelSelectorTitle: "Academic Level",
    paceSelectorTitle: "Learning Pace",
    subjectSelectorTitle: "Subject",
    levels: {
      primary: { title: "Primary School", desc: "Intuitive, visual & real-world examples" },
      middle: { title: "Middle / Junior High", desc: "Stepwise logic & foundational curriculum" },
      secondary: { title: "High School", desc: "Rigorous proofs, laws & deep analysis" },
      university: { title: "University Level", desc: "Advanced math formulations & formal derivations" },
    },
    paces: {
      simplified: { title: "Simplified & Gentle", desc: "Deeply structured explanations without rushing" },
      standard: { title: "Standard & School", desc: "Balanced between concept clarity and exam standards" },
      advanced: { title: "Advanced & Intensive", desc: "Concise theoretical depth and derivations" },
    },
    subjects: {
      all: "All Subjects",
      math: "Mathematics",
      physics: "Physics",
      chemistry: "Chemistry",
      general_science: "General Science",
    },
    inputHeading: "Enter your math equation or scientific problem",
    inputSubheading: "Type any arithmetic calculation, word problem, geometric theorem, or physics/chemistry law",
    inputPlaceholder: "Example: Solve 3x² - 12 = 0, or: Calculate kinetic energy of a 4kg mass moving at 5 m/s...",
    clearText: "Clear text",
    quickSymbols: "Quick symbols:",
    sampleModels: "Or try curriculum sample problems:",
    solveBtn: "Solve & Explain Step-by-Step 🚀",
    solvingBtn: "Teacher is analyzing & solving...",
    loadingTitle: "The Teacher is analyzing your problem with pedagogical precision...",
    loadingDesc: "Drafting the final result, step-by-step logic, scientific rules, common pitfalls advice, and an interactive quiz.",
    errorAlert: "Notice:",
    retryBtn: "Retry",
    emptyHeading: "The Pedagogical Teaching Methodology",
    emptyDesc: "Every problem you submit is delivered with a complete curriculum format: Final result, step-by-step breakdown, scientific laws, mistake alerts, extra practice exercise, lesson review, and an interactive quiz!",
    solutionHeaderTitle: "Problem:",
    printBtn: "Print",
    askAboutThisBtn: "Ask Teacher about this",
    shareModal: {
      title: "Share Problem & Solution",
      subtitle: "Share the problem statement and structured lesson with your classmates",
      copyLink: "Copy Direct Link",
      copied: "Link copied to clipboard! ✓",
      shareVia: "Share directly via social platforms:",
      copySummary: "Copy Formatted Summary for Study Groups",
      summaryCopied: "Summary copied ✓",
      close: "Close",
    },
    flashcards: {
      generateBtn: "Generate Flashcards 🎴",
      modalTitle: "Digital Flashcards for Rules & Theorems",
      modalSubtitle: "Review key formulas, theorems, and scientific laws with 3D interactive flashcards and self-assessment",
      frontPrompt: "What is the formula and definition for this mathematical or scientific concept?",
      clickToFlip: "Click card to flip and reveal formula & explanation 🔄",
      flipBack: "Click to flip back to front 🔄",
      formulaLabel: "Mathematical Formula / Theorem:",
      explanationLabel: "Scientific Principle & Application:",
      variablesLabel: "Variables & Physical Units Breakdown:",
      masteredBtn: "Mastered Concept ✅",
      needsReviewBtn: "Needs Review Later 🔄",
      previous: "Previous",
      next: "Next",
      shuffle: "Shuffle Cards",
      restart: "Restart Deck",
      listen: "Listen to Rule 🔊",
      completedTitle: "Well Done! All Flashcards Reviewed 🎉",
      completedDesc: "You have reviewed all key rules and theorems extracted from this solved problem.",
      masteredCount: "Mastered Concepts",
      needsReviewCount: "Needs Review",
      close: "Close Flashcards",
    },
    footer: {
      description: "An intelligent educational platform for solving and explaining mathematics and science problems step-by-step following official pedagogical criteria.",
      networkColTitle: "Sanad Network",
      prevSiteLabel: "Previous Platform: Sanad Smart Platform (ai-sanad-setri-7)",
      interactivePlatformLabel: "Smart Math & Science Professor (Full Interactive Edition)",
      freeTeacherLabel: "'Ask the Teacher' free educational support without API key",
      privacyColTitle: "Privacy, Security & Cookies",
      privacyColDesc: "We adhere to the highest digital safety and privacy standards for students. No personal profiling, tracking, or selling of data.",
      privacyPolicyLink: "Privacy Policy",
      cookiesPolicyLink: "Cookies Policy",
      copyright: "All rights reserved © 2026 • Smart Math & Science Tutor",
      developedBy: "Engineered & Supervised by Founder: Taha setri",
    },
    cookieBanner: {
      title: "Privacy & Essential Cookies",
      desc: "We only use essential local storage to remember your solved problem history and learning pace, under the supervision of Founder Taha setri, with zero tracking ads.",
      accept: "Accept & Continue",
      details: "Details",
    },
  },
};
