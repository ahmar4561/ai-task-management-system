"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase"; 
import { Trash2, CheckCircle, Clock, Calendar, Edit3, X, Save, Tag, Folder } from "lucide-react"; 

export default function MyTasks() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Editing States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [newTitle, setNewTitle] = useState("");

  const fetchTasks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) console.error("Error fetching:", error.message);
    else setTasks(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // --- Grouping Logic: Project ke hisaab se tasks ko alag karna ---
  const groupedTasks = tasks.reduce((groups: any, task) => {
    const projectName = task.project_name || "Uncategorized Projects";
    if (!groups[projectName]) {
      groups[projectName] = [];
    }
    groups[projectName].push(task);
    return groups;
  }, {});

  const calculateDuration = (start: string, end: string) => {
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    const diffInMs = endTime - startTime;
    const diffInMins = Math.floor(diffInMs / (1000 * 60));
    const hours = Math.floor(diffInMins / 60);
    const mins = diffInMins % 60;
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins} mins`;
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'low': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      default: return 'bg-slate-700/50 text-slate-300 border-slate-600';
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "pending" ? "completed" : "pending";
    const completedAt = newStatus === "completed" ? new Date().toISOString() : null;
    
    const { error } = await supabase
      .from("tasks")
      .update({ status: newStatus, completed_at: completedAt })
      .eq("id", id);

    if (!error) {
      setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus, completed_at: completedAt } : t));
    }
  };

  const deleteTask = async (id: string) => {
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (!error) setTasks(tasks.filter((t) => t.id !== id));
  };

  const openEditModal = (task: any) => {
    setEditingTask(task);
    setNewTitle(task.title);
    setIsEditModalOpen(true);
  };

  const handleUpdateTask = async () => {
    if (!newTitle.trim()) return;
    const { error } = await supabase
      .from("tasks")
      .update({ title: newTitle })
      .eq("id", editingTask.id);

    if (!error) {
      setTasks(tasks.map(t => t.id === editingTask.id ? { ...t, title: newTitle } : t));
      setIsEditModalOpen(false);
      setEditingTask(null);
    }
  };

  return (
    <div className="p-8 md:p-12 text-white min-h-screen relative">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">My Project Roadmap</h1>
        <p className="text-slate-400">Manage tasks grouped by project architecture.</p>
      </header>

      {loading ? (
        <p className="text-slate-500 animate-pulse">Loading your roadmaps...</p>
      ) : (
        <div className="space-y-12">
          {Object.keys(groupedTasks).map((projectName) => (
            <section key={projectName} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Project Header */}
              <div className="flex items-center gap-3 mb-6 pb-2 border-b border-slate-800">
                <div className="bg-blue-600/20 p-2 rounded-lg text-blue-400">
                  <Folder size={20} />
                </div>
                <h2 className="text-xl font-bold text-slate-200 capitalize">
                  {projectName}
                </h2>
                <span className="text-xs bg-slate-800 px-2 py-1 rounded-full text-slate-500 font-mono">
                  {groupedTasks[projectName].length} Tasks
                </span>
              </div>

              {/* Tasks List */}
              <div className="grid gap-4">
                {groupedTasks[projectName].map((task: any) => (
                  <div 
                    key={task.id} 
                    className={`bg-slate-800/50 border p-5 rounded-2xl flex justify-between items-center group transition-all ${
                      task.status === "completed" ? "border-green-500/30 bg-green-500/5" : "border-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => toggleStatus(task.id, task.status)}
                        className={`p-2 rounded-lg transition-colors ${
                          task.status === "completed" 
                          ? "bg-green-500/20 text-green-400" 
                          : "bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
                        }`}
                      >
                        {task.status === "completed" ? <CheckCircle size={22} /> : <Clock size={22} />}
                      </button>

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${getPriorityStyle(task.priority)}`}>
                            {task.priority || 'Medium'}
                          </span>
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded border border-slate-600 bg-slate-700/30 text-slate-400 flex items-center gap-1">
                            <Tag size={10} /> {task.category || 'General'}
                          </span>
                        </div>

                        <h3 className={`font-semibold text-lg transition-all ${
                          task.status === "completed" ? "text-slate-500 line-through" : "text-white"
                        }`}>
                          {task.title}
                        </h3>
                        <div className="flex gap-4 mt-1">
                          <p className="text-slate-500 text-xs flex items-center gap-1">
                            <Calendar size={12} /> {new Date(task.created_at).toLocaleDateString()}
                          </p>
                          {task.status === "completed" && task.completed_at && (
                            <p className="text-green-400 text-xs font-bold flex items-center gap-1 bg-green-500/10 px-2 py-0.5 rounded-full">
                              <Clock size={12} /> Efficiency: {calculateDuration(task.created_at, task.completed_at)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => openEditModal(task)}
                        className="text-slate-500 hover:text-blue-400 transition-colors p-2 opacity-0 group-hover:opacity-100"
                      >
                        <Edit3 size={20} />
                      </button>
                      <button 
                        onClick={() => deleteTask(task.id)}
                        className="text-slate-500 hover:text-red-400 transition-colors p-2 opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
          
          {tasks.length === 0 && (
            <div className="text-center py-20 bg-slate-800/20 rounded-3xl border border-dashed border-slate-700">
              <p className="text-slate-500 text-lg font-medium">No tasks found.</p>
              <p className="text-slate-600">Go to Dashboard to generate your next AI roadmap!</p>
            </div>
          )}
        </div>
      )}

      {/* EDIT MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-3xl p-8 shadow-2xl animate-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                <Edit3 className="text-blue-400" size={20} /> Edit Task
              </h2>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <label className="text-sm text-slate-400 mb-2 block font-medium">Task Title</label>
            <textarea 
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 mb-6 resize-none"
              rows={3}
            />

            <div className="flex gap-3">
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-2xl"
              >
                Cancel
              </button>
              <button 
                onClick={handleUpdateTask}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-2xl flex items-center justify-center gap-2"
              >
                <Save size={18} /> Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}