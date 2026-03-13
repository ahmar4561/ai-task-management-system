"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { analyzeTask } from "../../lib/gemini";
import { Lightbulb, BrainCircuit, Loader2, Sparkles, Zap } from "lucide-react";

export default function AIInsights() {
  const [insight, setInsight] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const generateInsights = async () => {
    setLoading(true);
    try {
      const { data: pendingTasks } = await supabase
        .from("tasks")
        .select("title")
        .eq("status", "pending");

      if (!pendingTasks || pendingTasks.length === 0) {
        setInsight("Excellent! All your tasks are completed. You have no pending items at the moment. 😎");
        return;
      }

      const taskNames = pendingTasks.map(t => t.title).join(", ");
      
      const customPrompt = `I have these pending tasks: [${taskNames}]. 
      As a senior developer, give me a very short (2-3 sentences) strategy on which one I should do first and why. 
      Keep it motivational and professional. Give me ONLY plain text, no JSON, no keys, no symbols.`;
      
      const response = await analyzeTask(customPrompt);

      // --- IMPROVED CLEAN-UP LOGIC (To fix the "raw text" issue) ---
      let cleanResponse = response
        .replace(/```json|```/gi, "") 
        .replace(/[{}"[\]]/g, "")    
        .replace(/\b(strategy|priority|estimatedTime|subtasks|recommendation):/gi, "") 
        .replace(/\\n/g, " ")        
        .trim();

      setInsight(cleanResponse || response);
      
    } catch (error) {
      console.error("Insight Error:", error);
      setInsight("Our AI engine is temporarily unable to analyze tasks. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // P-8 ko P-5 (Mobile) kar diya taake bhara-bhara na lage
    <div className="p-5 md:p-12 text-white min-h-screen">
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
          <BrainCircuit className="text-blue-400" /> AI Smart Insights
        </h1>
        <p className="text-slate-400 mt-2 text-sm">Intelligent analysis and strategic suggestions for your workload.</p>
      </header>

      {/* Padding P-10 ko P-6 kar diya (Mobile) taake slim look aaye */}
      <div className="bg-slate-900/40 border border-slate-800/60 p-6 md:p-10 rounded-3xl shadow-2xl relative overflow-hidden text-center md:text-left backdrop-blur-sm">
        <div className="relative z-10">
          <h2 className="text-lg font-semibold mb-3 flex items-center justify-center md:justify-start gap-2">
            <Sparkles className="text-yellow-400" size={18} />
            Ready for a Productivity Boost?
          </h2>
          <p className="text-slate-400 mb-6 text-sm max-w-md mx-auto md:mx-0 leading-relaxed">
            Our AI engine will analyze your tasks to determine which project requires your immediate focus today.
          </p>

          <button 
            onClick={generateInsights}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-6 py-3.5 rounded-xl font-bold flex items-center justify-center gap-3 transition-all transform active:scale-95 mx-auto md:mx-0 shadow-lg shadow-blue-900/30 text-sm"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Zap size={20} className="text-yellow-300" />}
            {loading ? "Analyzing..." : "Generate AI Roadmap"}
          </button>
        </div>

        {insight && (
          <div className="mt-8 p-5 bg-blue-500/5 border border-blue-500/20 rounded-2xl animate-in fade-in slide-in-from-bottom-3 duration-500">
            <h3 className="text-blue-400 font-bold mb-2 uppercase tracking-widest text-[10px] flex items-center justify-center md:justify-start gap-2">
              <Lightbulb size={12} /> AI Recommendation
            </h3>
            <p className="text-slate-200 text-base leading-relaxed italic font-medium">
              "{insight}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}