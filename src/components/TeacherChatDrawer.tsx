import React, { useState, useRef, useEffect } from "react";
import { Send, X, GraduationCap, Loader2, Sparkles, MessageCircle } from "lucide-react";
import { ProblemSolution, ChatMessage, AppLanguage } from "../types";
import { getTeacherChatReply } from "../utils/pedagogicalEngine";

interface TeacherChatDrawerProps {
  currentSolution: ProblemSolution | null;
  isOpen: boolean;
  onClose: () => void;
  lang: AppLanguage;
}

export const TeacherChatDrawer: React.FC<TeacherChatDrawerProps> = ({
  currentSolution,
  isOpen,
  onClose,
  lang,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputQuery, setInputQuery] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isEn = lang === "en";

  // Initialize teacher greeting when problem changes or drawer opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const initialGreeting: ChatMessage = {
        id: "msg_init",
        sender: "teacher",
        text: isEn
          ? currentSolution
            ? `Hello! I am your teacher, here to guide you with any questions about "${currentSolution.problemQuery.slice(0, 45)}...". Which step would you like me to clarify further?`
            : "Hello! I am your AI Math & Science Teacher. How can I assist you with your studies today?"
          : currentSolution
          ? `مرحباً بك يا بني! أنا أستاذك لمساعدتك في أي استفسار أو غموض يخص مسألة "${currentSolution.problemQuery.slice(0, 40)}...". ما النقطة التي تود أن أشرحها لك بمزيد من التفصيل؟`
          : "أهلاً بك يا بطل! أنا أستاذك الذكي في الرياضيات والعلوم. هل لديك أي استفسار حول مسألتك الدراسية؟",
        timestamp: Date.now(),
      };
      setMessages([initialGreeting]);
    }
  }, [isOpen, currentSolution, isEn]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputQuery;
    if (!textToSend.trim() || isSending) return;

    const studentMsg: ChatMessage = {
      id: "student_" + Date.now(),
      sender: "student",
      text: textToSend.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, studentMsg]);
    setInputQuery("");
    setIsSending(true);

    try {
      const res = await fetch("/api/chat-teacher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemContext: currentSolution
            ? {
                problem: currentSolution.problemQuery,
                finalResult: currentSolution.finalResult,
                stepsSummary: currentSolution.detailedSteps.map((s) => `${s.stepNumber}. ${s.title}: ${s.explanation}`),
                rules: currentSolution.rulesAndTheorems.map((r) => `${r.name}: ${r.formula}`),
              }
            : null,
          studentQuestion: textToSend.trim(),
          conversationHistory: messages.slice(-6),
          lang,
        }),
      });

      if (!res.ok) {
        throw new Error(isEn ? "Failed to get teacher response" : "تعذر الرد من المعلم");
      }

      const data = await res.json();
      const teacherMsg: ChatMessage = {
        id: "teacher_" + Date.now(),
        sender: "teacher",
        text: data.reply || (isEn ? "Great question! Let me break it down simply..." : "أحسنت السؤال! دعني أوضح لك ذلك ببساطة..."),
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, teacherMsg]);
    } catch (err) {
      console.warn("API call unavailable, using local pedagogical teacher engine:", err);
      const fallbackReply = getTeacherChatReply(textToSend.trim(), currentSolution, lang);
      const teacherMsg: ChatMessage = {
        id: "teacher_" + Date.now(),
        sender: "teacher",
        text: fallbackReply,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, teacherMsg]);
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  const quickPrompts = isEn
    ? [
        "Explain step 1 in simpler terms",
        "Why did we pick this formula?",
        "What if the sign was negative?",
        "Is there a quicker alternative method?",
      ]
    : [
        "اشرح لي الخطوة الأولى بشكل أبسط",
        "لماذا اخترنا هذا القانون تحديداً؟",
        "ماذا لو كانت الإشارة سالبة بدلاً من موجبة؟",
        "هل هناك طريقة حل بديلة أو أسرع؟",
      ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
      <div
        className={`w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-slideLeft ${
          isEn ? "text-left" : "text-right"
        }`}
      >
        {/* Drawer Header */}
        <div className="p-4 bg-gradient-to-r from-indigo-700 via-indigo-800 to-indigo-900 text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-xs flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h3 className="font-bold text-sm md:text-base flex items-center gap-1.5">
                <span>{isEn ? "Live Virtual Tutor" : "المعلم الافتراضي المباشر"}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 font-normal">
                  {isEn ? "100% Free" : "مجاني 100%"}
                </span>
              </h3>
              <p className="text-[11px] text-indigo-200">
                {isEn ? "Always here to guide and explain (No API key needed)" : "متاح دائماً للإجابة وتوضيح أي صعوبة دراسية (بدون مفتاح API)"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-indigo-200 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/70">
          {messages.map((msg) => {
            const isTeacher = msg.sender === "teacher";
            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${isTeacher ? "justify-start" : "justify-end"}`}
              >
                {isTeacher && (
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold shadow-xs">
                    👨‍🏫
                  </div>
                )}
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-xs ${
                    isTeacher
                      ? "bg-white text-slate-800 border border-slate-200/90 rounded-tr-none"
                      : "bg-indigo-600 text-white rounded-tl-none font-medium"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })}

          {isSending && (
            <div className="flex items-center gap-2 text-xs text-indigo-600 font-semibold p-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{isEn ? "The Teacher is drafting an explanation..." : "الأستاذ يصيغ لك توضيحاً دقيقاً..."}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        <div className="p-2.5 bg-white border-t border-slate-100 space-y-1.5">
          <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>{isEn ? "Suggested questions:" : "أسئلة مقترحة وسريعة:"}</span>
          </span>
          <div className="flex gap-1.5 overflow-x-auto py-1 no-scrollbar">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 text-[11px] font-medium border border-slate-200/70 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Input Field */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder={isEn ? "Ask the teacher any question..." : "اكتب سؤالك أو النقطة غير المفهومة..."}
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white text-xs sm:text-sm focus:outline-hidden transition-all text-slate-800"
          />
          <button
            id="send-teacher-chat-btn"
            disabled={!inputQuery.trim() || isSending}
            onClick={() => handleSendMessage()}
            className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white disabled:text-slate-400 transition-colors shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
