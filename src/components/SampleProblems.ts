import { EducationalLevel, AppLanguage } from "../types";

export interface SampleProblem {
  title: string;
  category: string;
  level: EducationalLevel;
  query: string;
}

export const SAMPLE_PROBLEMS_AR: SampleProblem[] = [
  {
    title: "حل معادلة تربيعية",
    category: "رياضيات",
    level: "secondary",
    query: "أوجد حلول المعادلة التربيعية الآتية: 2x² - 8x + 6 = 0 باستخدام المميز (دلتا).",
  },
  {
    title: "حساب السرعة والتسارع",
    category: "فيزياء",
    level: "middle",
    query: "انطلقت سيارة من السكون بتسارع منتظم قدره 3 m/s² لمدة 10 ثوانٍ. احسب السرعة النهائية للسيارة والمسافة التي قطعتها.",
  },
  {
    title: "مبرهنة فيثاغورس",
    category: "رياضيات",
    level: "middle",
    query: "مثلث قائم الزاوية طول ضلعي القائمة هما 6 cm و 8 cm. احسب طول الوتر ومساحة المثلث.",
  },
  {
    title: "موازنة تفاعل كيميائي",
    category: "كيمياء",
    level: "secondary",
    query: "وازن معادلة تفاعل احتراق غاز الميثان بالأكسجين: CH₄ + O₂ → CO₂ + H₂O مع توضيح عدد المولات وقانون حفظ الكتلة.",
  },
  {
    title: "جمع وطرح الكسور العادية",
    category: "رياضيات",
    level: "primary",
    query: "احسب ناتج العملية التالية مع توحيد المقامات وتبسيط الكسر إلى أبسط صورة: (3/4) + (2/5) - (1/10)",
  },
  {
    title: "قانون أوم والقدرة الكهربائية",
    category: "فيزياء",
    level: "secondary",
    query: "مصباح كهربائي مقاومته 44 أوم متصل بمصدر جهد 220 فولت. احسب شدة التيار المار فيه والقدرة الكهربائية المستهلكة.",
  },
];

export const SAMPLE_PROBLEMS_EN: SampleProblem[] = [
  {
    title: "Quadratic Equation",
    category: "Math",
    level: "secondary",
    query: "Solve the quadratic equation: 2x² - 8x + 6 = 0 using the discriminant method.",
  },
  {
    title: "Velocity & Acceleration",
    category: "Physics",
    level: "middle",
    query: "A car accelerates uniformly from rest at 3 m/s² for 10 seconds. Calculate its final velocity and total distance traveled.",
  },
  {
    title: "Pythagorean Theorem",
    category: "Math",
    level: "middle",
    query: "In a right triangle with legs of length 6 cm and 8 cm, calculate the hypotenuse length and the area.",
  },
  {
    title: "Balancing Chemical Reaction",
    category: "Chemistry",
    level: "secondary",
    query: "Balance the combustion reaction of methane: CH₄ + O₂ → CO₂ + H₂O and explain conservation of mass.",
  },
  {
    title: "Fractions Arithmetic",
    category: "Math",
    level: "primary",
    query: "Calculate with common denominator and simplify to simplest form: (3/4) + (2/5) - (1/10)",
  },
  {
    title: "Ohm's Law & Power",
    category: "Physics",
    level: "secondary",
    query: "An electric appliance with 44 Ω resistance is connected to a 220 V source. Calculate current and power consumed.",
  },
];

export const getSampleProblems = (lang: AppLanguage): SampleProblem[] => {
  return lang === "en" ? SAMPLE_PROBLEMS_EN : SAMPLE_PROBLEMS_AR;
};

// Default export for backward compatibility
export const SAMPLE_PROBLEMS = SAMPLE_PROBLEMS_AR;
