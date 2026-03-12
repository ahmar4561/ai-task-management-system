"use client";

import { useState, useRef, useEffect } from "react";
import { User, Settings, ShieldCheck, Mail, Briefcase, Info, Camera, Move } from "lucide-react";

export default function SettingsPage() {
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const userProfile = {
    name: "Ahmar Ali Memon",
    role: "Full Stack Developer",
    email: "ahmar.dev@gmail.com", 
    status: "Professional Developer"
  };

  // 1. Load data once on mount
  useEffect(() => {
    const savedPic = localStorage.getItem("profilePic");
    const savedZoom = localStorage.getItem("profileZoom");
    const savedPos = localStorage.getItem("profilePos");

    if (savedPic) setProfilePic(savedPic);
    if (savedZoom) setZoom(parseFloat(savedZoom));
    if (savedPos) setPosition(JSON.parse(savedPos));
  }, []);

  // 2. Persistent Save Function
  useEffect(() => {
    if (profilePic) {
      localStorage.setItem("profilePic", profilePic);
      localStorage.setItem("profileZoom", zoom.toString());
      localStorage.setItem("profilePos", JSON.stringify(position));
    }
  }, [profilePic, zoom, position]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProfilePic(base64String);
        // Reset only for new image
        setZoom(1); 
        setPosition({ x: 0, y: 0 }); 
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!profilePic) return;
    setIsDragging(true);
    setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - startPos.x,
      y: e.clientY - startPos.y
    });
  };

  const stopDragging = () => setIsDragging(false);

  return (
    <div className="p-8 md:p-12 text-white min-h-screen font-sans select-none cursor-default">
      <header className="mb-10">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Settings className="text-blue-400" /> Account Settings
        </h1>
        <p className="text-slate-400 mt-2">Manage and customize your professional profile preferences.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl text-center relative overflow-hidden shadow-2xl">
            
            <div className="relative group w-fit mx-auto">
              <div 
                ref={containerRef}
                className="relative w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-blue-500/20 shadow-2xl bg-[#0f172a] cursor-move active:cursor-grabbing"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={stopDragging}
                onMouseLeave={stopDragging}
              >
                {profilePic ? (
                  <img 
                    src={profilePic} 
                    alt="Profile" 
                    className="absolute pointer-events-none select-none max-w-none origin-center"
                    style={{
                      transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                      transition: isDragging ? "none" : "transform 0.15s ease-out",
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User size={56} className="text-slate-600" />
                  </div>
                )}
                
                {profilePic && !isDragging && (
                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-[10px] pointer-events-none">
                     <Move size={16} className="mb-1" /> Drag to Adjust
                   </div>
                )}
              </div>

              {/* Floating Zoom Slider */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-48 h-0 z-30">
                {profilePic && (
                  <div className="transition-all duration-300 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 bg-slate-900/95 backdrop-blur-md py-3 px-4 rounded-2xl border border-slate-800 shadow-2xl">
                    <p className="text-[10px] text-slate-500 mb-2 uppercase font-bold tracking-widest text-center">Adjust Zoom</p>
                    <input 
                      type="range" 
                      min="0.5" max="4" step="0.05" 
                      value={zoom} 
                      onChange={(e) => setZoom(parseFloat(e.target.value))}
                      className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>
                )}
              </div>

              <label htmlFor="file-upload" className="absolute bottom-6 -right-2 bg-blue-600 p-2 rounded-full cursor-pointer hover:scale-110 transition-transform shadow-xl border-2 border-slate-900 z-10">
                <Camera size={16} className="text-white" />
                <input id="file-upload" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
              </label>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-bold">{userProfile.name}</h2>
              <p className="text-blue-400 text-sm mb-6 font-semibold uppercase tracking-wider">{userProfile.role}</p>
            </div>
            
            <div className="space-y-3 text-left border-t border-slate-800 pt-6">
              <div className="flex items-center gap-3 text-slate-400 text-sm">
                <Mail size={16} className="text-blue-400/50" /> {userProfile.email}
              </div>
              <div className="flex items-center gap-3 text-slate-400 text-sm">
                <Briefcase size={16} className="text-blue-400/50" /> {userProfile.status}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl shadow-lg">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <ShieldCheck className="text-green-400" size={20} /> Security & System Status
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-slate-800/30 rounded-2xl border border-slate-800/50 hover:bg-slate-800/50 transition-colors">
                <div>
                  <p className="font-medium text-sm">AI Processing Core</p>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Gemini v1.5 Flash (Operational)</p>
                </div>
                <span className="bg-green-500/10 text-green-500 text-[10px] px-3 py-1 rounded-full border border-green-500/20 font-bold uppercase tracking-widest">Online</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-slate-800/30 rounded-2xl border border-slate-800/50 hover:bg-slate-800/50 transition-colors">
                <div>
                  <p className="font-medium text-sm">Database Infrastructure</p>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Supabase Cloud Sync</p>
                </div>
                <span className="bg-green-500/10 text-green-500 text-[10px] px-3 py-1 rounded-full border border-green-500/20 font-bold uppercase tracking-widest">Active</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl shadow-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Info className="text-yellow-400" size={20} /> Software Information
            </h3>
            <div className="flex items-center gap-6">
               <div className="px-5 py-3 bg-slate-800 rounded-2xl border border-slate-700">
                  <span className="text-slate-400 text-[10px] block uppercase font-bold mb-1">Build Version</span>
                  <span className="font-mono text-blue-400 font-bold tracking-widest">v0.2 - STABLE</span>
               </div>
               <p className="text-xs text-slate-500 leading-relaxed italic border-l border-slate-800 pl-4">
                 Your system is running the latest deployment of TaskAI. All features are up-to-date and optimized.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}