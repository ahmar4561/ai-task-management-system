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

  useEffect(() => {
    const savedPic = localStorage.getItem("profilePic");
    const savedZoom = localStorage.getItem("profileZoom");
    const savedPos = localStorage.getItem("profilePos");

    if (savedPic) setProfilePic(savedPic);
    if (savedZoom) setZoom(parseFloat(savedZoom));
    if (savedPos) setPosition(JSON.parse(savedPos));
  }, []);

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
    <div className="p-5 md:p-10 text-white min-h-screen font-sans select-none cursor-default">
      <header className="mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-3 tracking-tight">
          <Settings className="text-blue-400" size={24} /> Account Settings
        </h1>
        <p className="text-slate-400 mt-1.5 text-sm">Manage your professional profile preferences.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Compact Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-slate-900/40 border border-slate-800/60 p-6 rounded-3xl text-center relative overflow-hidden backdrop-blur-md">
            
            <div className="relative group w-fit mx-auto">
              {/* Profile Image - Size reduced for better look */}
              <div 
                ref={containerRef}
                className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-2 border-blue-500/30 shadow-2xl bg-slate-950 cursor-move"
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
                    <User size={40} className="text-slate-700" />
                  </div>
                )}
                
                {profilePic && !isDragging && (
                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-[8px] font-bold uppercase tracking-tighter">
                     <Move size={12} className="mb-1" /> Adjust
                   </div>
                )}
              </div>

              {/* Floating Zoom Control */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-40 z-30 opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100 pointer-events-none group-hover:pointer-events-auto">
                {profilePic && (
                  <div className="bg-slate-900 border border-slate-800 p-2 rounded-xl shadow-2xl">
                    <input 
                      type="range" 
                      min="0.5" max="3" step="0.05" 
                      value={zoom} 
                      onChange={(e) => setZoom(parseFloat(e.target.value))}
                      className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>
                )}
              </div>

              <label htmlFor="file-upload" className="absolute bottom-1 -right-1 bg-blue-600 p-1.5 rounded-full cursor-pointer hover:scale-110 transition-transform shadow-lg border border-slate-900 z-10">
                <Camera size={14} className="text-white" />
                <input id="file-upload" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
              </label>
            </div>

            <div className="mt-4">
              <h2 className="text-lg font-bold tracking-tight">{userProfile.name}</h2>
              <p className="text-blue-400 text-[11px] mb-4 font-bold uppercase tracking-[0.1em]">{userProfile.role}</p>
            </div>
            
            {/* Info Items - Compact look */}
            <div className="space-y-2 text-left border-t border-slate-800/50 pt-4">
              <div className="flex items-center gap-2.5 text-slate-400 text-xs">
                <Mail size={14} className="text-blue-500/50" /> 
                <span className="truncate">{userProfile.email}</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-400 text-xs">
                <Briefcase size={14} className="text-blue-500/50" /> 
                <span>{userProfile.status}</span>
              </div>
            </div>
          </div>
        </div>

        {/* System Stats Section */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-slate-900/40 border border-slate-800/60 p-6 rounded-3xl shadow-sm">
            <h3 className="text-sm font-bold mb-5 flex items-center gap-2 text-slate-300 uppercase tracking-widest">
              <ShieldCheck className="text-emerald-500" size={16} /> System Infrastructure
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex justify-between items-center p-3.5 bg-slate-800/20 rounded-2xl border border-slate-800/50 hover:border-slate-700/80 transition-all">
                <div className="min-w-0">
                  <p className="font-semibold text-xs truncate">AI Core v1.5</p>
                  <p className="text-[9px] text-slate-500 font-mono uppercase">Operational</p>
                </div>
                <span className="bg-emerald-500/10 text-emerald-500 text-[9px] px-2.5 py-1 rounded-full border border-emerald-500/20 font-bold uppercase tracking-wider">Online</span>
              </div>
              <div className="flex justify-between items-center p-3.5 bg-slate-800/20 rounded-2xl border border-slate-800/50 hover:border-slate-700/80 transition-all">
                <div className="min-w-0">
                  <p className="font-semibold text-xs truncate">Supabase Sync</p>
                  <p className="text-[9px] text-slate-500 font-mono uppercase">Live Data</p>
                </div>
                <span className="bg-emerald-500/10 text-emerald-500 text-[9px] px-2.5 py-1 rounded-full border border-emerald-500/20 font-bold uppercase tracking-wider">Active</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-800/60 p-6 rounded-3xl shadow-sm">
            <h3 className="text-sm font-bold mb-4 flex items-center gap-2 text-slate-300 uppercase tracking-widest">
              <Info className="text-blue-400" size={16} /> Software Build
            </h3>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
               <div className="px-4 py-2 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[9px] block font-bold mb-0.5 uppercase tracking-tighter">Version Control</span>
                  <span className="font-mono text-blue-400 text-xs font-bold tracking-widest italic">v1.0.2-RELEASE</span>
               </div>
               <p className="text-[11px] text-slate-500 leading-relaxed italic border-l-2 border-slate-800 pl-4">
                 Your system is running the latest deployment. Features are optimized for performance.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}