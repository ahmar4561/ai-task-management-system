"use client";

import { useState, useEffect } from "react";
import { analyzeTask } from "../lib/gemini"; 
import { supabase } from "../lib/supabase"; 
import { 
  LayoutDashboard, CheckCircle, Clock, XCircle, Folder, 
  Target, Code2, Terminal, History as HistoryIcon, Sparkles, 
  Cpu, Zap, ChevronRight 
} from "lucide-react";

export default function Home() {
  const [task, setTask] = useState("");
  const [mode, setMode] = useState<"architect" | "developer">("architect");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [history, setHistory] = useState<any[]>([]); 
  
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0 });
  const [projectStats, setProjectStats] = useState<any[]>([]);

  useEffect(() => {
    fetchStats();
    fetchHistory();
  }, [result]);

  const fetchHistory = async () => {
    const { data } = await supabase.from("solutions").select("*").order("created_at", { ascending: false });
    if (data) setHistory(data);
  };

  const fetchStats = async () => {
    try {
      const { count: total } = await supabase.from("tasks").select("*", { count: 'exact', head: true });
      const { count: completed } = await supabase.from("tasks").select("*", { count: 'exact', head: true }).eq("status", "completed");
      const { count: pending } = await supabase.from("tasks").select("*", { count: 'exact', head: true }).eq("status", "pending");

      setStats({
        total: total || 0,
        completed: completed || 0,
        pending: pending || 0,
      });

      const { data: allTasks } = await supabase.from("tasks").select("project_name, status");
      if (allTasks) {
        const groups = allTasks.reduce((acc: any, t: any) => {
          const name = t.project_name || "Uncategorized";
          if (!acc[name]) acc[name] = { total: 0, done: 0 };
          acc[name].total++;
          if (t.status === "completed") acc[name].done++;
          return acc;
        }, {});

        const projectArray = Object.keys(groups).map(name => ({
          name,
          total: groups[name].total,
          done: groups[name].done,
          percent: Math.round((groups[name].done / groups[name].total) * 100)
        }));
        setProjectStats(projectArray);
      }
    } catch (err) {
      console.error("Stats Fetch Error:", err);
    }
  };

  const handleAiAnalyze = async () => {
    if (!task) return;
    setLoading(true);
    setResult(null);
    setErrorMessage(null);
    
    try {
      const aiResponse = await analyzeTask(task, mode);
      const parsedResult = JSON.parse(aiResponse); 
      
      if (parsedResult.error === "rejection") {
        setErrorMessage(parsedResult.message);
        setLoading(false);
        return;
      }

      setResult(parsedResult);

      if (mode === "architect" && parsedResult.subtasks) {
        const tasksToInsert = parsedResult.subtasks.map((item: any) => ({
          title: item.title,
          project_name: task, 
          priority: item.priority || "Medium",
          category: item.category || "General",
          description: `Project: ${task.substring(0, 30)}...`,
          status: "pending"
        }));
        await supabase.from("tasks").insert(tasksToInsert);
        fetchStats();
      }

      if (mode === "developer") {
        await supabase.from("solutions").insert([{
          project_name: "AI Solutions",
          task_title: task,
          code: parsedResult.code,
          explanation: parsedResult.explanation,
          language: parsedResult.language
        }]);
        fetchHistory();
      }
    } catch (error) {
      setErrorMessage("System encountered an error. Please refine your prompt.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-indigo-500/30">
      <main className="flex-1 p-6 md:p-12 overflow-y-auto max-w-7xl mx-auto w-full">
        
        {/* --- Updated Header (Fixed Duplication) --- */}
        <header className="mb-16 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold tracking-widest uppercase">
              <Zap size={12} className="fill-current" /> Professional Workspace
            </div>
            <div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-2">
                 <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">Ahmar Memon</span>
              </h1>
              <p className="text-slate-400 text-lg md:text-xl font-medium flex items-center gap-2">
                <Cpu size={20} className="text-slate-600" /> Full Stack Developer
              </p>
            </div>
          </div>
          
          <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 p-1.5 rounded-2xl flex items-center shadow-2xl">
            <button onClick={() => { setMode("architect"); setResult(null); }} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 ${mode === 'architect' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}><Target size={18} /> Architect</button>
            <button onClick={() => { setMode("developer"); setResult(null); }} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 ${mode === 'developer' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}><Code2 size={18} /> Developer</button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[ { label: "Total Insights", val: stats.total, icon: LayoutDashboard, color: "blue" }, { label: "Finalized", val: stats.completed, icon: CheckCircle, color: "emerald" }, { label: "In Pipeline", val: stats.pending, icon: Clock, color: "amber" } ].map((stat, i) => (
              <div key={i} className="bg-slate-900/40 border border-white/5 p-8 rounded-[2rem] flex items-center gap-6 hover:bg-slate-800/40 transition-all group">
                <div className={`p-4 rounded-2xl bg-${stat.color}-500/10 text-${stat.color}-400 group-hover:scale-110 transition-transform`}><stat.icon size={28}/></div>
                <div><p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</p><h3 className="text-3xl font-black text-white">{stat.val}</h3></div>
              </div>
            ))}
        </div>

        {/* --- Project Progress Tracking (New Feature Integrated) --- */}
        <div className="mb-16">
          <h3 className="text-sm font-black text-slate-500 uppercase tracking-[0.4em] mb-8 px-2 flex items-center gap-3">
            <Folder size={16} /> Live Project Progress
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projectStats.map((proj, idx) => (
              <div key={idx} className="bg-slate-900/30 border border-white/5 p-6 rounded-3xl">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold text-slate-200">{proj.name}</span>
                  <span className="text-indigo-400 font-black">{proj.percent}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full transition-all duration-1000" style={{ width: `${proj.percent}%` }} />
                </div>
                <p className="mt-3 text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Tasks: {proj.done} / {proj.total} Completed</p>
              </div>
            ))}
          </div>
        </div>

        {/* AI Input Section */}
        <div className={`p-10 rounded-[2.5rem] mb-12 border transition-all duration-700 shadow-2xl relative overflow-hidden ${mode === 'architect' ? 'bg-slate-900/60 border-white/5' : 'bg-indigo-950/20 border-indigo-500/20'}`}>
          <div className="relative z-10 flex flex-col gap-8">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${mode === 'architect' ? 'bg-blue-600/20 text-blue-400' : 'bg-indigo-600/20 text-indigo-400'}`}>
                {mode === 'architect' ? <Sparkles size={24}/> : <Terminal size={24}/>}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white leading-tight">{mode === 'architect' ? 'System Architecture' : 'Logic Synthesis'}</h2>
                <p className="text-slate-500 text-sm">Use natural language to define your technical requirements.</p>
              </div>
            </div>
            <textarea value={task} onChange={(e) => setTask(e.target.value)} placeholder={mode === 'architect' ? "What are we building today?" : "Paste your logic requirement..."} className="w-full bg-slate-950/50 border border-white/5 rounded-[1.5rem] px-6 py-5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all resize-none text-lg" rows={4} />
            {errorMessage && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3"><XCircle className="text-red-500" size={20} /><p className="text-red-400 text-sm">{errorMessage}</p></div>}
            <div className="flex justify-end"><button onClick={handleAiAnalyze} disabled={loading || !task} className={`px-10 py-4 rounded-2xl font-black text-white transition-all transform active:scale-95 ${mode === 'architect' ? 'bg-blue-600 hover:bg-blue-500' : 'bg-indigo-600 hover:bg-indigo-500'}`}>{loading ? "PROCESSING..." : "EXECUTE ANALYSIS"}</button></div>
          </div>
        </div>

        {/* Result Sections (Architect & Developer) */}
        {result && mode === "architect" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <h3 className="text-2xl font-black text-white px-2">STRATEGIC BLUEPRINT</h3>
            <div className="bg-slate-900/40 p-4 rounded-[2.5rem] border border-white/5">
              {result.subtasks?.map((item: any, index: number) => (
                <div key={index} className="flex items-center gap-6 p-6 rounded-[1.5rem] hover:bg-white/5 group">
                  <span className="shrink-0 w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-indigo-400 font-black">{index + 1}</span>
                  <div className="flex-1"><p className="text-xl text-slate-200 font-semibold">{item.title}</p><span className="text-xs uppercase text-slate-500 font-bold">{item.category}</span></div>
                  <ChevronRight className="text-slate-700 group-hover:text-indigo-400" />
                </div>
              ))}
            </div>
          </div>
        )}

        {result && mode === "developer" && (
          <div className="space-y-6 animate-in zoom-in-95 duration-500">
             <h3 className="text-2xl font-black text-white px-2">GENERATED SOLUTION</h3>
             <div className="bg-slate-950 border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl">
               <div className="bg-slate-900/80 px-8 py-4 flex justify-between items-center border-b border-white/5">
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{result.language || 'typescript'}</span>
                 <button onClick={() => navigator.clipboard.writeText(result.code)} className="text-xs font-bold text-indigo-400">COPY_SOURCE</button>
               </div>
               <pre className="p-8 text-sm font-mono text-indigo-100/90 overflow-x-auto"><code>{result.code}</code></pre>
             </div>
             <div className="bg-indigo-500/5 border border-indigo-500/10 p-10 rounded-[2rem]">
               <h4 className="text-indigo-400 font-black mb-4 uppercase text-xs">Technical Explanation</h4>
               <p className="text-slate-400 leading-relaxed text-lg">{result.explanation}</p>
             </div>
          </div>
        )}

        {/* History Log */}
        <div className="mt-32">
          <div className="flex items-center justify-between mb-10 px-2">
            <h2 className="text-sm font-black text-slate-500 uppercase tracking-[0.4em] flex items-center gap-3"><HistoryIcon size={16} /> Archive Logs</h2>
            <div className="h-[1px] flex-1 bg-slate-800 ml-8" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {history.map((h, i) => (
              <div key={i} className="bg-slate-900/20 border border-white/5 p-8 rounded-[2rem] hover:border-indigo-500/30 transition-all cursor-pointer group" onClick={() => { setTask(h.task_title); setMode("developer"); setResult({ code: h.code, explanation: h.explanation, language: h.language }); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                <h4 className="font-bold text-white mb-3 line-clamp-1 group-hover:text-indigo-400">{h.task_title}</h4>
                <p className="text-slate-500 text-sm line-clamp-2 mb-6">{h.explanation}</p>
                <div className="flex justify-between pt-4 border-t border-white/5">
                  <span className="text-[10px] font-black text-indigo-500/50 uppercase">{h.language}</span>
                  <span className="text-[10px] text-slate-700 font-bold">{new Date(h.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}