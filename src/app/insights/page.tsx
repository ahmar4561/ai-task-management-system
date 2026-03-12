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
      // 1. Fetching pending tasks from database
      const { data: pendingTasks } = await supabase
        .from("tasks")
        .select("title")
        .eq("status", "pending");

      if (!pendingTasks || pendingTasks.length === 0) {
        setInsight("Excellent! All your tasks are completed. You have no pending items at the moment. 😎");
        return;
      }

      const taskNames = pendingTasks.map(t => t.title).join(", ");
      
      // 2. AI prompt in professional English
      const customPrompt = `I have these pending tasks: [${taskNames}]. 
      As a senior developer, give me a very short (2-3 sentences) strategy on which one I should do first and why. 
      Keep it motivational and professional. Do not use JSON formatting, just give plain text.`;
      
      const response = await analyzeTask(customPrompt);

      // --- ADVANCED CLEAN-UP LOGIC ---
      let cleanResponse = response
        .replace(/```json|```/gi, "") 
        .replace(/[{}"[\]]/g, "")    
        .replace(/\b(strategy|priority|estimatedTime|subtasks):/gi, "") 
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
    <div className="p-8 md:p-12 text-white min-h-screen">
      <header className="mb-10">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <BrainCircuit className="text-blue-400" /> AI Smart Insights
        </h1>
        <p className="text-slate-400 mt-2">Intelligent analysis and strategic suggestions for your pending workload.</p>
      </header>

      <div className="bg-slate-900/50 border border-slate-800 p-10 rounded-4xl shadow-2xl relative overflow-hidden text-center md:text-left">
        <div className="relative z-10">
          <h2 className="text-xl font-semibold mb-4 flex items-center justify-center md:justify-start gap-2">
            <Sparkles className="text-yellow-400" size={20} />
            Ready for a Productivity Boost?
          </h2>
          <p className="text-slate-400 mb-8 max-w-md mx-auto md:mx-0">
            Our AI engine will analyze your tasks to determine which project or task requires your immediate focus today.
          </p>

          <button 
            onClick={generateInsights}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all transform hover:scale-105 mx-auto md:mx-0 shadow-lg shadow-blue-900/40"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Zap size={22} className="text-yellow-300" />}
            {loading ? "Analyzing Workflow..." : "Generate AI Roadmap"}
          </button>
        </div>

        {insight && (
          <div className="mt-10 p-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl animate-in fade-in slide-in-from-bottom-5 duration-700">
            <h3 className="text-blue-400 font-bold mb-3 uppercase tracking-wider text-xs flex items-center gap-2">
              <Lightbulb size={14} /> AI Recommendation
            </h3>
            <p className="text-slate-200 text-lg leading-relaxed italic">
              "{insight}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}