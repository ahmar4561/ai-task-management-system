"use client";

import { useState } from "react";
import { LayoutDashboard, CheckSquare, Settings, BrainCircuit, Menu, X } from "lucide-react";
import Link from "next/link"; 
import { usePathname } from "next/navigation"; 

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, href: "/" },
    { name: "My Tasks", icon: <CheckSquare size={20} />, href: "/tasks" },
    { name: "AI Insights", icon: <BrainCircuit size={20} />, href: "/insights" },
    { name: "Settings", icon: <Settings size={20} />, href: "/settings" },
  ];

  return (
    <>
      {/* --- Mobile Header (Cleaner Look) --- */}
      <nav className="md:hidden flex items-center justify-between px-6 py-4 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50 w-full fixed top-0 left-0 z-[50]">
        <div className="flex items-center gap-2.5">
          <div className="bg-blue-600 p-1.5 rounded-lg shadow-lg shadow-blue-500/20">
            <BrainCircuit size={20} className="text-white" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">TASKAI</span>
        </div>
        <button 
          onClick={() => setIsOpen(true)}
          className="p-2 text-slate-400 hover:text-white bg-slate-900/50 border border-slate-800 rounded-xl active:scale-95 transition-all"
        >
          <Menu size={24} />
        </button>
      </nav>

      {/* --- Smooth Overlay --- */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] md:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* --- Professional Sidebar --- */}
      <aside className={`
        fixed inset-y-0 left-0 z-[110] w-[280px] bg-slate-950 border-r border-slate-800/60 p-6 
        transform transition-all duration-300 ease-out flex flex-col shadow-2xl
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:static md:h-screen md:min-w-[260px]
      `}>
        
        {/* Sidebar Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3 px-2">
            <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-500/30">
              <BrainCircuit className="text-white" size={24} />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">TaskAI</span>
          </div>
          <button 
            onClick={() => setIsOpen(false)} 
            className="md:hidden text-slate-400 hover:text-white p-1 bg-slate-900 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Navigation Links */}
        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)} 
                className={`flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                  isActive 
                  ? "bg-blue-600 text-white shadow-xl shadow-blue-600/20" 
                  : "text-slate-400 hover:bg-slate-900/50 hover:text-white border border-transparent hover:border-slate-800"
                }`}
              >
                <span className={`${isActive ? "text-white" : "text-slate-500 group-hover:text-blue-400 transition-colors"}`}>
                  {item.icon}
                </span>
                <span className="font-semibold tracking-wide text-[15px]">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="pt-6 border-t border-slate-900/50">
           <div className="px-4 py-3 bg-slate-900/30 rounded-2xl border border-slate-800/40">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-mono text-slate-500 uppercase tracking-widest">v1.0.2 Stable</span>
              </div>
           </div>
        </div>
      </aside>
    </>
  );
}