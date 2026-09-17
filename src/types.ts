export type EducationalLevel = 'primary' | 'middle' | 'secondary' | 'university';
export type LearningPace = 'simplified' | 'standard' | 'advanced';
export type SubjectCategory = 'all' | 'math' | 'physics' | 'chemistry' | 'general_science';
export type AppLanguage = 'ar' | 'en';

export interface StepItem {
  stepNumber: number;
  title: string;
  explanation: string;
  mathExpression?: string;
  subSteps?: string[];
  note?: string;
}

export interface RuleTheorem {
  name: string;
  formula: string;
  explanation: string;
  variablesExplained?: {
    symbol: string;
    meaning: string;
    unit?: string;
  }[];
}

export interface QuizQuestion {
  questionId: string;
  questionText: string;
  options: {
    id: string;
    text: string;
  }[];
  correctOptionId: string;
  explanation: string;
}

export interface PracticeExercise {
  problemStatement: string;
  hint?: string;
  modelSolution: {
    finalResult: string;
    solutionSteps: {
      stepNumber: number;
      explanation: string;
      mathExpression?: string;
    }[];
  };
}

export interface ProblemSolution {
  id: string;
  timestamp: number;
  problemQuery: string;
  subject: string;
  level: EducationalLevel;
  pace: LearningPace;
  category: string;
  difficulty: 'سهل' | 'متوسط' | 'متقدم' | 'Easy' | 'Medium' | 'Advanced';
  lang?: AppLanguage;
  
  // 1. Final Result
  finalResult: {
    summary: string;
    highlightValue: string;
    units?: string;
  };

  // 2. Detailed Steps
  detailedSteps: StepItem[];

  // 3. Rules and Theorems
  rulesAndTheorems: RuleTheorem[];

  // 4. Pedagogical Advice & Mistakes
  pedagogicalAdvice: {
    encouragement: string;
    commonMistakes: string[];
  };

  // 5. Practice Exercise
  practiceExercise: PracticeExercise;

  // 6. Final Takeaways
  finalTakeaways: string[];

  // 7. Interactive Quiz
  interactiveQuiz: QuizQuestion[];
}

export interface ChatMessage {
  id: string;
  sender: 'student' | 'teacher';
  text: string;
  timestamp: number;
}
