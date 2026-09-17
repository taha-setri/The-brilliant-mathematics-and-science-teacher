import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { solvePedagogically, getTeacherChatReply } from "./src/utils/pedagogicalEngine";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Lazy GoogleGenAI client (returns null if key not configured)
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Resilient Gemini model generator with automatic fallback across models
async function generateWithModelFallback(
  ai: GoogleGenAI,
  params: {
    contents: string;
    config?: {
      systemInstruction?: string;
      responseMimeType?: string;
      temperature?: number;
    };
  }
) {
  const candidateModels = [
    "gemini-3.8-flash",
    "gemini-3.1-flash-lite",
    "gemini-3.1-pro-preview",
  ];

  let lastError: unknown = null;
  for (const model of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: params.contents,
        config: params.config,
      });
      return response;
    } catch (err: unknown) {
      lastError = err;
      console.warn(`Model ${model} busy or unavailable, trying fallback candidate...`);
    }
  }
  throw lastError;
}

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: Date.now() });
});

// 1. Solve Problem with Pedagogical 10 Criteria
app.post("/api/solve", async (req, res) => {
  try {
    const { problem, level = "middle", pace = "standard", subject = "math", lang = "ar" } = req.body;

    if (!problem || typeof problem !== "string" || !problem.trim()) {
      res.status(400).json({ error: lang === "en" ? "Please enter a problem or equation first." : "يرجى كتابة نص المسألة أو المعادلة أولاً." });
      return;
    }

    const ai = getGeminiClient();

    // If no API key configured (e.g., deployed free on Vercel), use pedagogical engine immediately
    if (!ai) {
      const offlineSol = solvePedagogically(problem, level, pace, subject, lang);
      res.json(offlineSol);
      return;
    }

    const isEn = lang === "en";

    const levelDescriptions: Record<string, string> = isEn
      ? {
          primary: "Primary School (intuitive, concrete examples, simple wording)",
          middle: "Middle School / Junior High (stepwise logic, curriculum standard)",
          secondary: "High School (formal proofs, rigor, scientific terminology)",
          university: "University Level (advanced derivations, theoretical rigor)",
        }
      : {
          primary: "المرحلة الابتدائية (أسلوب بسيط جداً، أمثلة حسية، شرح مباشر خالي من التعقيد)",
          middle: "المرحلة المتوسطة / الإعدادية (أسلوب متدرج يركز على المنهج المدرسي والتعليل المنطقي)",
          secondary: "المرحلة الثانوية (دقة رياضية وعلمية عالية، براهين، ومصطلحات تخصصية)",
          university: "المرحلة الجامعية (صرامة أكاديمية ورياضية متقدمة)",
        };

    const paceDescriptions: Record<string, string> = isEn
      ? {
          simplified: "Gentle & simplified pace: take extra steps, explain concepts thoroughly.",
          standard: "Standard curriculum pace: balanced between thoroughness and school textbook norms.",
          advanced: "Advanced & intensive: focus on deep theorems, general cases, and succinct proofs.",
        }
      : {
          simplified: "وتيرة مبسطة ومهدئة: اشرح بتدرج مفرط واستخدم تشبيهات تقريبية قبل الدخول في الحساب.",
          standard: "وتيرة مدرسية قياسية: متوازنة بين الإيجاز والدقة بما يطابق الكتب المدرسية الرسمية.",
          advanced: "وتيرة متقدمة ومكثفة: ركز على القوانين الشاملة والاستنتاجات العميقة وحالات الاستثناء.",
        };

    const targetLanguageInstruction = isEn
      ? "IMPORTANT: You MUST write the ENTIRE explanation, steps, rule explanations, advice, and quiz in clear, educational ENGLISH."
      : "تنبيه مهم: يجب أن تكون الإجابة كاملة باللغة العربية الفصحى السليمة والواضحة والدقيقة علمياً.";

    const prompt = `
${isEn ? "You are an expert Math and Science Professor and certified digital educator." : "أنت أستاذ رياضيات وعلوم ذكي، وخبير تربوي متمرس مخصص لمساعدة الطلاب والتلاميذ بمختلف مستوياتهم التعليمية."}
${targetLanguageInstruction}

${isEn ? "Problem or Equation:" : "المسألة أو المعادلة:"}
"""
${problem}
"""

${isEn ? "Student Academic Level:" : "المستوى الدراسي للطالب:"} ${levelDescriptions[level] || levelDescriptions.middle}
${isEn ? "Learning Pace:" : "وتيرة التعلم المطلوبة:"} ${paceDescriptions[pace] || paceDescriptions.standard}
${isEn ? "Subject Area:" : "التخصص:"} ${subject}

يجب أن تقوم بتوليد كائن JSON صالح بنسبة 100% يغطي بدقة العناصر التربوية التالية:
1. finalResult: النتيجة النهائية بوضوح تام، مع إبراز القيمة والوحدة (إن وجدت).
2. detailedSteps: خطوات الحل المفصلة خطوة بخطوة، توضح "كيف" و"لماذا" وصلنا إلى هذه النتيجة، مع كتابة المعادلات بوضوح تام (يمكن استخدام صيغة LaTeX أو رموز رياضية واضحة).
3. rulesAndTheorems: القوانين الرياضية أو القواعد العلمية المستخدمة مع تسميتها وشرح رموزها ووحداتها لتعميق الفهم.
4. pedagogicalAdvice: نصيحة تشجيعية دافئة، وقائمة بالأخطاء الشائعة (تنبيهات الأستاذ) التي يقع فيها الطلاب في هذا النوع من المسائل.
5. practiceExercise: مسألة إضافية مشابهة جداً ليتدرب الطالب عليها بمفرده، مع إرفاق الحل النموذجي المفصل وخطواته حتى يتمكن من مراجعة حله ذاتياً.
6. finalTakeaways: المراجعة النهائية التي تلخص أهم 3 إلى 5 نقاط جوهرية وأساسية يجب أن يتذكرها الطالب دائماً.
7. interactiveQuiz: اختبار قصير تفاعلي (سؤال إلى سؤالين اختيار من متعدد) للتأكد من فهم واستيعاب فكرة المسألة، مع بيان الإجابة الصحيحة وشرح السبب.
8. category: التصنيف الفرعي (مثل: الجبر، الهندسة، علم المثلثات، الميكانيكا، الكيمياء، الفيزياء، الحساب).
9. difficulty: 'سهل' أو 'متوسط' أو 'متقدم'.

أجب فقط بصيغة JSON مطابقة للهيكل الآتي دون أي نصوص إضافية خارج الـ JSON:
{
  "category": "تصنيف المسألة",
  "difficulty": "سهل أو متوسط أو متقدم",
  "finalResult": {
    "summary": "ملخص النتيجة النهائية بصياغة واضحة وبارزة",
    "highlightValue": "القيمة المحسوبة أو الناتجة (مثلاً: x = 5 أو 25 m/s)",
    "units": "الوحدة إن وجدت أو فارغة"
  },
  "detailedSteps": [
    {
      "stepNumber": 1,
      "title": "عنوان الخطوة التربوية",
      "explanation": "شرح مفصل ومبسط لماذا نقوم بهذه الخطوة وكيف تنفذ",
      "mathExpression": "الصيغة الرياضية أو المعادلة في هذه الخطوة (مثال: 2x + 4 = 10)",
      "note": "ملاحظة توضيحية إضافية للطالب"
    }
  ],
  "rulesAndTheorems": [
    {
      "name": "اسم القاعدة أو القانون",
      "formula": "الصيغة الرمزية للقانون",
      "explanation": "شرح القانون وأهميته في الحل",
      "variablesExplained": [
        { "symbol": "الرمز", "meaning": "المعنى", "unit": "الوحدة" }
      ]
    }
  ],
  "pedagogicalAdvice": {
    "encouragement": "كلمة تشجيعية أبوية وتحفيزية للطالب تزيد ثقته بنفسه",
    "commonMistakes": [
      "خطأ شائع يقع فيه التلاميذ وتنبيه لتفاديه",
      "تنبيه آخر حول الإشارات أو توحيد المقامات أو تحويل الوحدات"
    ]
  },
  "practiceExercise": {
    "problemStatement": "نص المسألة المشابهة للتدريب الفردي",
    "hint": "تلميح ذكي لمساعدة الطالب على البدء",
    "modelSolution": {
      "finalResult": "الناتج النهائي للتدريب",
      "solutionSteps": [
        {
          "stepNumber": 1,
          "explanation": "خطوة الحل الأولى للتدريب",
          "mathExpression": "المعادلة المقابلة"
        }
      ]
    }
  },
  "finalTakeaways": [
    "النقطة الجوهرية الأولى لتتذكرها دائماً",
    "النقطة الجوهرية الثانية"
  ],
  "interactiveQuiz": [
    {
      "questionId": "q1",
      "questionText": "نص سؤال الاختبار القصير المتعلق بالمفهوم الأساسي",
      "options": [
        { "id": "a", "text": "الخيار الأول" },
        { "id": "b", "text": "الخيار الثاني" },
        { "id": "c", "text": "الخيار الثالث" },
        { "id": "d", "text": "الخيار الرابع" }
      ],
      "correctOptionId": "a",
      "explanation": "تعليل الإجابة الصحيحة تربوياً"
    }
  ]
}
`;

    const response = await generateWithModelFallback(ai, {
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.2, // Low temperature for high mathematical accuracy
      },
    });

    const responseText = response.text || "{}";
    const cleanedText = responseText.replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim();
    const solutionData = JSON.parse(cleanedText);

    res.json({
      id: "sol_" + Date.now(),
      timestamp: Date.now(),
      problemQuery: problem,
      level,
      pace,
      subject,
      ...solutionData,
    });
  } catch (err: unknown) {
    console.warn("Notice: Gemini service busy or unavailable, utilizing pedagogical engine:", (err as Error)?.message || err);
    try {
      const { problem, level = "middle", pace = "standard", subject = "math", lang = "ar" } = req.body;
      const fallbackSol = solvePedagogically(problem || "", level, pace, subject, lang);
      res.json(fallbackSol);
    } catch {
      const errorMessage = err instanceof Error ? err.message : "حدث خطأ أثناء معالجة المسألة";
      res.status(500).json({ error: errorMessage });
    }
  }
});

// 2. Direct Ask-the-Teacher / Follow-up Support (100% free, no API key needed)
app.post("/api/chat-teacher", async (req, res) => {
  try {
    const { problemContext, studentQuestion, conversationHistory = [], lang = "ar" } = req.body;

    if (!studentQuestion || typeof studentQuestion !== "string" || !studentQuestion.trim()) {
      res.status(400).json({ error: lang === "en" ? "Please enter your question for the teacher." : "يرجى كتابة استفسارك للمعلم أولاً." });
      return;
    }

    const ai = getGeminiClient();

    // If no API key configured (e.g., deployed free on Vercel), reply immediately using built-in teacher engine
    if (!ai) {
      const teacherReply = getTeacherChatReply(studentQuestion, problemContext, lang);
      res.json({
        reply: teacherReply,
        timestamp: Date.now(),
      });
      return;
    }

    const isEn = lang === "en";

    const systemInstruction = isEn
      ? `You are an expert Math and Science Teacher and a friendly, patient digital educator.
The student is reaching out with a question or difficulty about a math or science problem.
Your mission:
- Reply in clear, warm, encouraging, and supportive ENGLISH.
- Address the exact difficulty or step they are struggling with.
- Provide simple intuitive examples if helpful.
- End with a gentle encouraging question to ensure full clarity.`
      : `
أنت أستاذ رياضيات وعلوم ذكي وخبير تربوي ودود وصبور جداً.
الطالب يتواصل معك مباشرة لأن لديه صعوبة أو استفسار حول مسألة رياضية أو علمية تم حلها له.
مهمتك:
- الرد بلغة عربية فصحى مبسطة ودافئة تشجع الطالب ولا تحرجه أبداً.
- الإجابة بدقة بالغة على النقطة المحددة التي لم يفهمها.
- استخدام أمثلة توضيحية مبسطة إن لزم الأمر.
- إنهاء الرد بسؤال تفاعلي لطيف للتأكد من زوال اللبس.
      `;

    const contextPrompt = `
${isEn ? "Problem context:" : "سياق المسألة التي يدرسها الطالب:"}
${JSON.stringify(problemContext || {}, null, 2)}

${isEn ? "Conversation History:" : "محادثة سابقة:"}
${conversationHistory.map((m: { sender: string; text: string }) => `${m.sender === "student" ? (isEn ? "Student" : "الطالب") : (isEn ? "Teacher" : "الأستاذ")}: ${m.text}`).join("\n")}

${isEn ? "Current Student Question:" : "استفسار الطالب الحالي:"}
"${studentQuestion}"

${isEn ? "Provide your supportive pedagogical explanation in English." : "قدم ردك التربوي المباشر والمشجع."}
    `;

    const response = await generateWithModelFallback(ai, {
      contents: contextPrompt,
      config: {
        systemInstruction,
        temperature: 0.4,
      },
    });

    const reply = response.text || (isEn ? "Hello there! I will always be here to support you with any step you find challenging." : "أهلاً بك يا بني، سأكون دائماً بجانبك لشرح أي خطوة تشكل عليك!");

    res.json({
      reply,
      timestamp: Date.now(),
    });
  } catch (err: unknown) {
    console.warn("Notice: Gemini chat model busy or unavailable, providing response via pedagogical teacher engine:", (err as Error)?.message || err);
    const { studentQuestion, problemContext, lang = "ar" } = req.body;
    const fallbackReply = getTeacherChatReply(studentQuestion || "", problemContext, lang);
    res.json({
      reply: fallbackReply,
      timestamp: Date.now(),
    });
  }
});

// Setup Vite or static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
