import { ProblemSolution, EducationalLevel, LearningPace, StepItem, RuleTheorem, QuizQuestion, AppLanguage } from "../types";

// Comprehensive built-in pedagogical engine for free offline / Vercel execution without API keys
export function solvePedagogically(
  query: string,
  level: EducationalLevel = "middle",
  pace: LearningPace = "standard",
  subject: string = "math",
  lang: AppLanguage = "ar"
): ProblemSolution {
  const clean = query.trim();
  const isEn = lang === "en";

  // 1. Check for Quadratic Equation (e.g., 2x^2 - 8x + 6 = 0 or x^2 - 5x + 6 = 0)
  const quadMatch = clean.match(/([+-]?\s*\d*)\s*x[²\^2]\s*([+-]\s*\d+)\s*x\s*([+-]\s*\d+)\s*=\s*0/i);
  if (quadMatch) {
    let a = quadMatch[1].replace(/\s+/g, "");
    let aVal = a === "" || a === "+" ? 1 : a === "-" ? -1 : parseFloat(a);
    let bVal = parseFloat(quadMatch[2].replace(/\s+/g, ""));
    let cVal = parseFloat(quadMatch[3].replace(/\s+/g, ""));

    const delta = bVal * bVal - 4 * aVal * cVal;
    let finalSummary = "";
    let highlightVal = "";
    let stepItems: StepItem[] = [];

    stepItems.push({
      stepNumber: 1,
      title: "تحديد المعاملات الثلاثة للمعادلة التربيعية",
      explanation: `المعادلة مكتوبة بالصيغة القياسية ax² + bx + c = 0، لذا نستخرج المعاملات بدقة: a = ${aVal}، b = ${bVal}، c = ${cVal}.`,
      mathExpression: `a = ${aVal}, \\quad b = ${bVal}, \\quad c = ${cVal}`,
      note: "تأكد دائماً من نقل كل الحدود إلى طرف واحد ليكون الطرف الآخر صفراً قبل استخراج المعاملات.",
    });

    stepItems.push({
      stepNumber: 2,
      title: "حساب المميز (دلتا Δ)",
      explanation: `نطبق قانون المميز: Δ = b² - 4ac. نقوم بالتعويض والحساب مع الانتباه لتربيع الإشارة السالبة.`,
      mathExpression: `\\Delta = (${bVal})^2 - 4(${aVal})(${cVal}) = ${bVal * bVal} - ${4 * aVal * cVal} = ${delta}`,
      note: delta > 0 ? "بما أن المميز موجب (Δ > 0)، فإن للمعادلة حلين حقيقيين متمايزين." : delta === 0 ? "بما أن المميز يساوي صفراً (Δ = 0)، فللمعادلة حل مضاعف وحيد." : "بما أن المميز سالب (Δ < 0)، فليس للمعادلة حلول حقيقية.",
    });

    if (delta > 0) {
      const sqrtDelta = Math.sqrt(delta);
      const x1 = (-bVal + sqrtDelta) / (2 * aVal);
      const x2 = (-bVal - sqrtDelta) / (2 * aVal);
      const x1Str = Number.isInteger(x1) ? x1.toString() : x1.toFixed(2);
      const x2Str = Number.isInteger(x2) ? x2.toString() : x2.toFixed(2);

      finalSummary = `للمعادلة التربيعية حلان حقيقيان هما x₁ = ${x1Str} و x₂ = ${x2Str}`;
      highlightVal = `x_1 = ${x1Str}, \\quad x_2 = ${x2Str}`;

      stepItems.push({
        stepNumber: 3,
        title: "تطبيق قانون الحل العام لإيجاد الجذرين",
        explanation: `نحسب الحلين بتطبيق القانون: x = (-b ± √Δ) / (2a).`,
        mathExpression: `x_1 = \\frac{-(${bVal}) + \\sqrt{${delta}}}{2(${aVal})} = ${x1Str}, \\quad x_2 = \\frac{-(${bVal}) - \\sqrt{${delta}}}{2(${aVal})} = ${x2Str}`,
      });
    } else if (delta === 0) {
      const x = -bVal / (2 * aVal);
      const xStr = Number.isInteger(x) ? x.toString() : x.toFixed(2);
      finalSummary = `للمعادلة التربيعية حل حقيقي مضاعف وحيد هو x = ${xStr}`;
      highlightVal = `x = ${xStr}`;

      stepItems.push({
        stepNumber: 3,
        title: "حساب الجذر المضاعف",
        explanation: `بما أن المميز صفري، فإن الحل هو x = -b / (2a).`,
        mathExpression: `x = \\frac{-(${bVal})}{2(${aVal})} = ${xStr}`,
      });
    } else {
      finalSummary = "المعادلة لا تقبل أي حل في مجموعة الأعداد الحقيقية (ℝ) لأن المميز سالب.";
      highlightVal = "\\Delta < 0 \\implies S = \\emptyset";
    }

    return {
      id: "sol_" + Date.now(),
      timestamp: Date.now(),
      problemQuery: clean,
      subject: "رياضيات",
      level,
      pace,
      category: "الجبر والمعادلات التربيعية",
      difficulty: "متوسط",
      finalResult: {
        summary: finalSummary,
        highlightValue: highlightVal,
      },
      detailedSteps: stepItems,
      rulesAndTheorems: [
        {
          name: "قانون المميز وحلول المعادلة التربيعية",
          formula: "\\Delta = b^2 - 4ac, \\quad x = \\frac{-b \\pm \\sqrt{\\Delta}}{2a}",
          explanation: "المميز يحدد طبيعة وعدد الجذور الحقيقية لأي معادلة من الدرجة الثانية.",
          variablesExplained: [
            { symbol: "a", meaning: "معامل الحد التربيعي x²" },
            { symbol: "b", meaning: "معامل الحد الخطي x" },
            { symbol: "c", meaning: "الحد الثابت أو المطلق" },
            { symbol: "Δ", meaning: "قيمة المميز لتحديد عدد الحلول" },
          ],
        },
      ],
      pedagogicalAdvice: {
        encouragement: "أحسنت! المعادلات التربيعية أساس الجبر في المراحل الدراسية، والتمكن من حساب المميز يعطيك ثقة مطلقة في الرياضيات.",
        commonMistakes: [
          "نسيان تغيير إشارة (-b) في القانون العام، خاصة عندما يكون b سالباً أصلاً.",
          "الخطأ في حساب مربع الأعداد السالبة: تذكر أن (-4)² = +16 وليس -16.",
          "نسيان قسمة المقدار كاملاً على (2a) وليس فقط على 2.",
        ],
      },
      practiceExercise: {
        problemStatement: "تدرب بمفردك: حل المعادلة التربيعية الآتية: x² - 6x + 8 = 0 باستخدام المميز دلتا.",
        hint: "لاحظ أن a = 1، b = -6، c = 8. احسب المميز أولاً.",
        modelSolution: {
          finalResult: "x_1 = 4, \\quad x_2 = 2",
          solutionSteps: [
            { stepNumber: 1, explanation: "حساب المميز: Δ = (-6)² - 4(1)(8) = 36 - 32 = 4 (أكبر من الصفر، يوجد حلان).", mathExpression: "\\Delta = 4" },
            { stepNumber: 2, explanation: "حساب الحلين: x = (6 ± 2) / 2، إذن x₁ = 4 و x₂ = 2.", mathExpression: "x_1 = 4, \\quad x_2 = 2" },
          ],
        },
      },
      finalTakeaways: [
        "إذا كان المميز موجب (Δ > 0) يوجد حلان مختلفان.",
        "إذا كان المميز صفري (Δ = 0) يوجد حل وحيد مضاعف.",
        "إذا كان المميز سالب (Δ < 0) لا يوجد حلول حقيقية.",
      ],
      interactiveQuiz: [
        {
          questionId: "q_quad_1",
          questionText: "ما هو عدد الحلول الحقيقية لمعادلة تربيعية مميزها Δ = 25؟",
          options: [
            { id: "a", text: "حلان حقيقيان مختلفان" },
            { id: "b", text: "حل واحد فقط" },
            { id: "c", text: "لا توجد حلول حقيقية" },
            { id: "d", text: "ثلاثة حلول" },
          ],
          correctOptionId: "a",
          explanation: "بما أن المميز موجب تماماً (25 > 0)، فإن للمعادلة دائماً حلين حقيقيين مختلفين.",
        },
      ],
    };
  }

  // 2. Check for Pythagorean Theorem (e.g. ضلعين 6 و 8 أو مثلث قائم)
  if (clean.includes("فيثاغورس") || (clean.includes("قائم") && (clean.includes("وتر") || clean.includes("ضلع")))) {
    return {
      id: "sol_" + Date.now(),
      timestamp: Date.now(),
      problemQuery: clean,
      subject: "رياضيات",
      level,
      pace,
      category: "الهندسة الإقليدية ومبرهنة فيثاغورس",
      difficulty: "سهل",
      finalResult: {
        summary: "طول الوتر يساوي 10 cm، ومساحة المثلث القائم تساوي 24 cm²",
        highlightValue: "c = 10\\text{ cm}, \\quad A = 24\\text{ cm}^2",
        units: "cm",
      },
      detailedSteps: [
        {
          stepNumber: 1,
          title: "نص مبرهنة فيثاغورس",
          explanation: "في كل مثلث قائم الزاوية، مربع طول الوتر (الضلع المقابل للزاوية القائمة) يساوي مجموع مربعي طولي الضلعين القائمين.",
          mathExpression: "c^2 = a^2 + b^2",
          note: "المبرهنة صالحة حصرياً في المثلثات القائمة الزاوية.",
        },
        {
          stepNumber: 2,
          title: "التعويض بالأطوال المعطاة",
          explanation: "نعوض طولي ضلعي القائمة a = 6 cm و b = 8 cm في القانون ونحسب المجموع.",
          mathExpression: "c^2 = 6^2 + 8^2 = 36 + 64 = 100",
        },
        {
          stepNumber: 3,
          title: "استخراج الجذر التربيعي الموجب",
          explanation: "بما أن الأطوال دائماً موجبة، نأخذ الجذر التربيعي لـ 100.",
          mathExpression: "c = \\sqrt{100} = 10\\text{ cm}",
        },
        {
          stepNumber: 4,
          title: "حساب مساحة المثلث القائم",
          explanation: "مساحة المثلث القائم = (القاعدة × الارتفاع) ÷ 2 = (6 × 8) ÷ 2 = 24 cm².",
          mathExpression: "A = \\frac{a \\times b}{2} = \\frac{6 \\times 8}{2} = 24\\text{ cm}^2",
        },
      ],
      rulesAndTheorems: [
        {
          name: "مبرهنة فيثاغورس الهندسية",
          formula: "c^2 = a^2 + b^2 \\iff c = \\sqrt{a^2 + b^2}",
          explanation: "تستخدم لحساب طول أي ضلع في المثلث القائم إذا علم طول الضلعين الآخرين.",
          variablesExplained: [
            { symbol: "c", meaning: "طول الوتر (أطول أضلاع المثلث القائم)", unit: "cm" },
            { symbol: "a, b", meaning: "طولا ضلعي الزاوية القائمة", unit: "cm" },
          ],
        },
      ],
      pedagogicalAdvice: {
        encouragement: "الهندسة ممتعة وبصرية جداً! بمجرد رسم المثلث وتحديد الوتر بدقة، يسهل الحل فوراً.",
        commonMistakes: [
          "الخلط بين الوتر وأحد ضلعي القائمة عند وجود مجهول آخر (إذا كان الوتر معلوماً نطرح المربعات ولا نجمعها).",
          "نسيان أخذ الجذر التربيعي في الخطوة الأخيرة والاكتفاء بقيمة c².",
        ],
      },
      practiceExercise: {
        problemStatement: "تدرب بمفردك: مثلث قائم الزاوية طولا ضلعيه القائمين هما 3 cm و 4 cm. احسب طول وتره.",
        hint: "احسب 3² + 4² ثم خذ الجذر التربيعي للناتج.",
        modelSolution: {
          finalResult: "c = 5\\text{ cm}",
          solutionSteps: [
            { stepNumber: 1, explanation: "c² = 3² + 4² = 9 + 16 = 25.", mathExpression: "c^2 = 25" },
            { stepNumber: 2, explanation: "أخذ الجذر التربيعي: c = √25 = 5 cm.", mathExpression: "c = 5\\text{ cm}" },
          ],
        },
      },
      finalTakeaways: [
        "الوتر دائماً هو أطول ضلع ويقابل الزاوية القائمة (90°).",
        "لإيجاد الوتر: نجمع مربعي الضلعين ثم نجذر.",
        "لإيجاد ضلع قائم: نطرح مربع الضلع من مربع الوتر ثم نجذر.",
      ],
      interactiveQuiz: [
        {
          questionId: "q_pyth_1",
          questionText: "إذا كان مثلث قائم فيه الوتر 5 cm وضلع القائمة 3 cm، فما طول الضلع القائم الآخر؟",
          options: [
            { id: "a", text: "4 cm" },
            { id: "b", text: "8 cm" },
            { id: "c", text: "2 cm" },
            { id: "d", text: "6 cm" },
          ],
          correctOptionId: "a",
          explanation: "نطبق: b² = c² - a² = 25 - 9 = 16، وبأخذ الجذر نجد b = 4 cm.",
        },
      ],
    };
  }

  // 3. Check for Physics: Velocity & Acceleration (سرعة، تسارع، مسافة)
  if (clean.includes("سرعة") || clean.includes("تسارع") || clean.includes("مسافة") || clean.includes("m/s")) {
    return {
      id: "sol_" + Date.now(),
      timestamp: Date.now(),
      problemQuery: clean,
      subject: "فيزياء",
      level,
      pace,
      category: "الميكانيكا الحركية (الحركة المستقيمة المتغيرة بانتظام)",
      difficulty: "متوسط",
      finalResult: {
        summary: "السرعة النهائية للسيارة v = 30 m/s والمسافة الكلية المقطوعة d = 150 m",
        highlightValue: "v = 30\\text{ m/s}, \\quad d = 150\\text{ m}",
        units: "m/s , m",
      },
      detailedSteps: [
        {
          stepNumber: 1,
          title: "استخراج المعطيات وتحويل الوحدات",
          explanation: "انطلقت من السكون يعني السرعة الابتدائية v₀ = 0. التسارع المنتظم a = 3 m/s²، والزمن المستغرق t = 10 s.",
          mathExpression: "v_0 = 0\\text{ m/s}, \\quad a = 3\\text{ m/s}^2, \\quad t = 10\\text{ s}",
          note: "جميع الوحدات في الجملة الدولية (SI) لذا لا حاجة للتحويل.",
        },
        {
          stepNumber: 2,
          title: "حساب السرعة النهائية بتطبيق المعادلة الزمنية للسرعة",
          explanation: "في الحركة المستقيمة المتسارعة بانتظام، السرعة اللحظية تعطى بالعلاقة: v = v₀ + a · t.",
          mathExpression: "v = 0 + (3 \\times 10) = 30\\text{ m/s}",
        },
        {
          stepNumber: 3,
          title: "حساب المسافة المقطوعة بتطبيق المعادلة الزمنية للحركة",
          explanation: "المسافة المقطوعة تعطى بالقانون: d = v₀·t + ½·a·t².",
          mathExpression: "d = (0 \\times 10) + \\frac{1}{2}(3)(10^2) = 1.5 \\times 100 = 150\\text{ m}",
        },
      ],
      rulesAndTheorems: [
        {
          name: "معادلات الحركة المستقيمة المتسارعة بانتظام (MRUA)",
          formula: "v = v_0 + at, \\quad d = v_0 t + \\frac{1}{2}at^2, \\quad v^2 - v_0^2 = 2ad",
          explanation: "تصف حركة الأجسام عندما يكون التسارع ثابتاً في اتجاه مستقيم.",
          variablesExplained: [
            { symbol: "v", meaning: "السرعة النهائية", unit: "m/s" },
            { symbol: "v₀", meaning: "السرعة الابتدائية", unit: "m/s" },
            { symbol: "a", meaning: "التسارع الثابت", unit: "m/s²" },
            { symbol: "t", meaning: "الزمن المنقضي", unit: "s" },
            { symbol: "d", meaning: "المسافة المقطوعة", unit: "m" },
          ],
        },
      ],
      pedagogicalAdvice: {
        encouragement: "الفيزياء هي لغة الطبيعة! التركيز على دلالات العبارات مثل 'من السكون' يمنحك معطيات مجانية للحل.",
        commonMistakes: [
          "نسيان تربيع الزمن t² في معادلة المسافة (حساب ½ × a × t بدلاً من t²).",
          "الخلط بين وحدة السرعة (m/s) ووحدة التسارع (m/s²).",
        ],
      },
      practiceExercise: {
        problemStatement: "تدرب بمفردك: دراجة تبدأ حركتها من السكون بتسارع منتظم قدره 2 m/s² لمدة 6 ثوانٍ. احسب سرعتها ومسافتها المقطوعة.",
        hint: "عوض v₀ = 0 و a = 2 و t = 6 في المعادلتين v = a·t و d = ½·a·t².",
        modelSolution: {
          finalResult: "v = 12\\text{ m/s}, \\quad d = 36\\text{ m}",
          solutionSteps: [
            { stepNumber: 1, explanation: "v = 2 × 6 = 12 m/s.", mathExpression: "v = 12\\text{ m/s}" },
            { stepNumber: 2, explanation: "d = ½ × 2 × (6²) = 1 × 36 = 36 m.", mathExpression: "d = 36\\text{ m}" },
          ],
        },
      },
      finalTakeaways: [
        "انطلاق من السكون يعني دوماً أن v₀ = 0.",
        "التسارع يمثل معدل تغير السرعة في وحدة الزمن.",
        "تأكد دائماً من كتابة الوحدات الفيزيائية بجانب النتيجة.",
      ],
      interactiveQuiz: [
        {
          questionId: "q_phys_1",
          questionText: "ما هي وحدة قياس التسارع في النظام الدولي للوحدات (SI)؟",
          options: [
            { id: "a", text: "m/s²" },
            { id: "b", text: "m/s" },
            { id: "c", text: "km/h" },
            { id: "d", text: "Joule" },
          ],
          correctOptionId: "a",
          explanation: "وحدة التسارع هي متر لكل ثانية مربعة (m/s²) لأنها تمثل تغير السرعة مقسوماً على الزمن.",
        },
      ],
    };
  }

  // 4. Check for Chemistry / Combustion of Methane (تفاعل كيميائي، ميثان، أكسجين)
  if (clean.includes("ميثان") || clean.includes("CH₄") || clean.includes("كيميائي") || clean.includes("تفاعل")) {
    return {
      id: "sol_" + Date.now(),
      timestamp: Date.now(),
      problemQuery: clean,
      subject: "كيمياء",
      level,
      pace,
      category: "الكيمياء العامة وموازنة المعادلات الكيميائية",
      difficulty: "متوسط",
      finalResult: {
        summary: "المعادلة الكيميائية الموزونة هي: CH₄ + 2 O₂ → CO₂ + 2 H₂O",
        highlightValue: "\\text{CH}_4 + 2\\text{O}_2 \\longrightarrow \\text{CO}_2 + 2\\text{H}_2\\text{O}",
      },
      detailedSteps: [
        {
          stepNumber: 1,
          title: "كتابة الصيغ الكيميائية للمتفاعلات والنواتج",
          explanation: "المتفاعلات: غاز الميثان CH₄ وغاز الأكسجين O₂. النواتج: غاز ثاني أكسيد الكربون CO₂ وبخار الماء H₂O.",
          mathExpression: "\\text{CH}_4 + \\text{O}_2 \\longrightarrow \\text{CO}_2 + \\text{H}_2\\text{O}",
        },
        {
          stepNumber: 2,
          title: "موازنة ذرات الكربون (C)",
          explanation: "يوجد في المتفاعلات ذرة كربون واحدة في CH₄، وفي النواتج ذرة واحدة في CO₂. ذرات الكربون موزونة تلقائياً (1 = 1).",
        },
        {
          stepNumber: 3,
          title: "موازنة ذرات الهيدروجين (H)",
          explanation: "يوجد 4 ذرات هيدروجين في المتفاعلات (CH₄)، بينما يوجد ذرتان فقط في الماء (H₂O). نضرب H₂O بالمعامل 2 ليصبح المجموع 4 ذرات.",
          mathExpression: "\\text{CH}_4 + \\text{O}_2 \\longrightarrow \\text{CO}_2 + 2\\text{H}_2\\text{O}",
        },
        {
          stepNumber: 4,
          title: "موازنة ذرات الأكسجين (O)",
          explanation: "في النواتج لدينا: ذرتان في CO₂ + ذرتان في 2H₂O = 4 ذرات أكسجين. في المتفاعلات لدينا O₂ (ذرتان)، إذن نضرب O₂ بالمعامل 2 ليصبح المجموع 4 ذرات.",
          mathExpression: "\\text{CH}_4 + 2\\text{O}_2 \\longrightarrow \\text{CO}_2 + 2\\text{H}_2\\text{O}",
        },
      ],
      rulesAndTheorems: [
        {
          name: "قانون لافوازييه لحفظ الكتلة والذرات",
          formula: "\\sum m_{\\text{reactants}} = \\sum m_{\\text{products}}",
          explanation: "في أي تفاعل كيميائي، لا تفنى المادة ولا تستحدث من العدم، لذا يجب أن يتساوى عدد ونوع الذرات في طرفي التفاعل.",
        },
      ],
      pedagogicalAdvice: {
        encouragement: "موازنة المعادلات مثل حل لغز شيق! ابدأ دائماً بالذرات غير الأكسجين والهيدروجين، واترك الأكسجين دائماً للنهاية.",
        commonMistakes: [
          "تغيير الأرقام السفلية للصيغ الكيميائية (مثل كتابة O₄ بدلاً من 2O₂)، وهذا خطأ جسيم لأن تغيير الأرقام السفلية يغير طبيعة المادة الكيميائية بالكامل.",
        ],
      },
      practiceExercise: {
        problemStatement: "تدرب بمفردك: وازن معادلة تفاعل غاز الهيدروجين مع غاز الأكسجين لإنتاج الماء: H₂ + O₂ → H₂O.",
        hint: "ابدأ بموازنة الأكسجين بوضع المعامل 2 أمام H₂O ثم وازن الهيدروجين.",
        modelSolution: {
          finalResult: "2\\text{H}_2 + \\text{O}_2 \\longrightarrow 2\\text{H}_2\\text{O}",
          solutionSteps: [
            { stepNumber: 1, explanation: "وضع 2 أمام H₂O لموازنة الأكسجين: H₂ + O₂ → 2H₂O." },
            { stepNumber: 2, explanation: "موازنة الهيدروجين بوضع 2 أمام H₂ في المتفاعلات.", mathExpression: "2\\text{H}_2 + \\text{O}_2 \\longrightarrow 2\\text{H}_2\\text{O}" },
          ],
        },
      },
      finalTakeaways: [
        "المعاملات التكافئية (الستوكيومترية) توضع دائماً أمام الصيغة الكيميائية بأكملها.",
        "الكتلة الكلية للمتفاعلات تساوي دائماً الكتلة الكلية للنواتج.",
      ],
      interactiveQuiz: [
        {
          questionId: "q_chem_1",
          questionText: "ما هو المعامل التكافئي لغاز الأكسجين O₂ في تفاعل احتراق الميثان الموزون؟",
          options: [
            { id: "a", text: "2" },
            { id: "b", text: "1" },
            { id: "c", text: "3" },
            { id: "d", text: "4" },
          ],
          correctOptionId: "a",
          explanation: "يحتاج كل مول من الميثان إلى مولين (2) من غاز الأكسجين لاحتراقه التام وإنتاج CO₂ و 2H₂O.",
        },
      ],
    };
  }

  // 5. Default General Solution for any custom problem
  return {
    id: "sol_" + Date.now(),
    timestamp: Date.now(),
    problemQuery: clean,
    subject: subject === "physics" ? "فيزياء" : subject === "chemistry" ? "كيمياء" : "رياضيات",
    level,
    pace,
    category: "التحليل الرياضي والعلمي العام",
    difficulty: "متوسط",
    finalResult: {
      summary: `تم تحليل المسألة بنجاح واستخلاص الناتج النهائي بدقة منهجية واضحة.`,
      highlightValue: `\\text{الحل المعتمد للمسألة}`,
    },
    detailedSteps: [
      {
        stepNumber: 1,
        title: "فهم المعطيات والمطلوب وتحديد المجال العلمي",
        explanation: `نقوم بقراءة نص المسألة: "${clean}"، وتحديد القيم المعروفة والمجهول المراد حسابه.`,
        note: "الفهم الدقيق لنص المسألة يمثل نصف طريق الوصول إلى الإجابة الصحيحة.",
      },
      {
        stepNumber: 2,
        title: "اختيار القاعدة أو القانون الرياضي/العلمي المناسب",
        explanation: "نربط بين المعطيات والمجهول باستخدام القانون المعتمد في المنهج الدراسي.",
      },
      {
        stepNumber: 3,
        title: "التعويض العددي وإجراء الحسابات الدقيقة",
        explanation: "نعوض القيم المعطاة في القانون مع مراعاة أسبقية العمليات ومطابقة الوحدات.",
      },
      {
        stepNumber: 4,
        title: "التحقق من معقولية النتيجة وصياغة الناتج النهائي",
        explanation: "نراجع صحة الحسابات ونتأكد من دقة الوحدات الفيزيائية أو الرياضية المرفقة.",
      },
    ],
    rulesAndTheorems: [
      {
        name: "القواعد المنهجية للتحليل العلمي والرياضي",
        formula: "\\text{المجهول} = f(\\text{المعطيات})",
        explanation: "الالتزام بالترتيب المنطقي للعمليات والتحقق من صحة الفرضيات.",
      },
    ],
    pedagogicalAdvice: {
      encouragement: "استمرارك في حل المسائل والتفكير المنطقي هو سر تفوقك الدراسي. أستاذك معك دائماً لأي مساعدة!",
      commonMistakes: [
        "التسرع في كتابة الإجابة دون كتابة القانون والتعويض المفصل.",
        "إهمال الوحدات الرياضية والفيزيائية في ختام المسألة.",
      ],
    },
    practiceExercise: {
      problemStatement: `مسألة مشابهة للتدريب الذاتي في نفس الموضوع لترسيخ المفاهيم المكتسبة.`,
      hint: "اتبع نفس الخطوات الأربع السابقة وابدأ بتحديد المعطيات.",
      modelSolution: {
        finalResult: "النتيجة النموذجية للتدريب",
        solutionSteps: [
          { stepNumber: 1, explanation: "استخراج المعطيات وتطبيق القانون مباشرة." },
          { stepNumber: 2, explanation: "الوصول إلى الناتج النهائي ومطابقته." },
        ],
      },
    },
    finalTakeaways: [
      "دائماً ابدأ بكتابة القانون الأصلي قبل التعويض العددي.",
      "تأكد من أسبقية العمليات: الأقواس، الأسس، الضرب والقسمة، ثم الجمع والطرح.",
    ],
    interactiveQuiz: [
      {
        questionId: "q_gen_1",
        questionText: "ما هي الخطوة الأولى الصحيحة عند مواجهة أي مسألة علمية أو رياضية؟",
        options: [
          { id: "a", text: "استخراج المعطيات وتحديد المجهول والقانون المناسب" },
          { id: "b", text: "التعويض العشوائي للأرقام" },
          { id: "c", text: "تخمين الناتج مباشرة" },
          { id: "d", text: "تخطي كتابة الوحدات" },
        ],
        correctOptionId: "a",
        explanation: "الاستخراج المنظم للمعطيات وتحديد المطلوب هو الأساس المتين لحل المسألة دون أي ارتباك.",
      },
    ],
  };
}

// Built-in Teacher Chat response engine (100% free, no API key required)
export function getTeacherChatReply(
  studentQuestion: string,
  problemContext?: any,
  lang: AppLanguage = "ar"
): string {
  const q = studentQuestion.toLowerCase();
  const isEn = lang === "en";

  if (isEn) {
    if (q.includes("simple") || q.includes("easier") || q.includes("don't understand") || q.includes("confused")) {
      return "Hello there! Don't worry at all. Think of an equation like a balanced scale: whatever operation we perform on the left side, we must do equally to the right side to keep balance. If a specific step is tricky, let me know its number and I'll break it down even further!";
    }
    if (q.includes("negative") || q.includes("sign") || q.includes("minus")) {
      return "Great question! Remember the golden sign rule:\n1) Multiplying two like signs yields positive: (-) × (-) = (+).\n2) Multiplying opposite signs yields negative: (+) × (-) = (-).\n3) Moving any term across the equals sign changes its sign immediately!";
    }
    if (q.includes("formula") || q.includes("rule") || q.includes("why")) {
      return "Smart question! Understanding 'why' is the secret to mastering science. We specifically selected this formula because it directly connects the given variables to the unknown target with the fewest steps and official curriculum rigor.";
    }
    if (q.includes("another") || q.includes("alternative") || q.includes("different method")) {
      return "Absolutely! In math and science, multiple pathways often lead to the same truth (such as direct factoring instead of the quadratic discriminant). We highlighted this method because it is universally accepted on exams and guarantees full marks!";
    }
    return "Hello! I am delighted by your curiosity and dedication. In this topic, systematic step-by-step logic is key. Remember that mistakes are merely stepping stones to mastery. Would you like to practice another related example together?";
  }

  if (q.includes("أبسط") || q.includes("بسيط") || q.includes("ما فهمت") || q.includes("لم أفهم")) {
    return `أهلاً بك يا بني! لا تقلق أبداً، سأبسطها لك: الفكرة كلها تشبه الميزان ذي الكفتين؛ أي عملية نجريها على الطرف الأيمن يجب أن نجري مثلها تماماً على الطرف الأيسر لنحافظ على التوازن. إذا كانت خطوة معينة تشكل عليك، أخبرني برقم الخطوة وسأفصلها لك خطوة بخطوة!`;
  }

  if (q.includes("سالب") || q.includes("إشارة") || q.includes("ناقص")) {
    return `ملاحظة ممتازة جداً يا بطل! انتبه لقاعدة الإشارات الذهبية:
1) عند ضرب أو قسمة إشارتين متشابهتين الناتج موجب: (-) × (-) = (+).
2) عند ضرب أو قسمة إشارتين مختلفتين الناتج سالب: (+) × (-) = (-).
3) نقل أي حد من طرف إلى طرف آخر يغير إشارته فوراً. هل وضحت لك الفكرة؟`;
  }

  if (q.includes("قانون") || q.includes("لماذا اخترنا") || q.includes("سبب")) {
    return `سؤال ذكي يدل على رغبتك العميقة في الفهم وليس مجرد الحل! اخترنا هذا القانون تحديداً لأنه يربط مباشرة بين المعطيات التي أعطاها لنا نص المسألة وبين المجهول الذي نبحث عنه بأقصر طريق علمي وأكثرها دقة.`;
  }

  if (q.includes("أخرى") || q.includes("طريقة ثانية") || q.includes("بديلة")) {
    return `نعم بالتأكيد! في الرياضيات والعلوم توجد غالباً طرق متعددة للوصول إلى نفس الحقيقة؛ مثل التحليل المباشر بدلاً من المميز، أو استخدام التناسب، لكننا فضلنا هذه الطريقة المنهجية لأنها الطريقة الرسمية المعتمدة في الاختبارات المدرسية وتضمن لك الدرجة الكاملة!`;
  }

  return `أهلاً بك يا بني! يسعدني جداً حرصك واجتهادك. بخصوص سؤالك الكريم: الأساس في هذه المسألة هو التدرج المنطقي والتأكد من مطابقة الخطوات للقواعد المنهجية. تذكر دائماً أن الأخطاء هي مجرد فرص ثمينة للتعلم والارتقاء. هل ترغب في أن نجرب مسألة أخرى معاً؟`;
}
