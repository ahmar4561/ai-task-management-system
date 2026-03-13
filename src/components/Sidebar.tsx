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
      {/* --- Mobile Top Bar (Always Visible on Mobile) --- */}
      <div className="md:hidden flex items-center justify-between p-4 bg-slate-950 border-b border-slate-800 sticky top-0 z-[50] w-full">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <BrainCircuit size={18} className="text-white" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">TaskAI</span>
        </div>
        <button 
          onClick={() => setIsOpen(true)}
          className="p-2 text-slate-400 hover:text-white bg-slate-900 rounded-lg active:scale-95 transition-transform"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* --- Professional Overlay --- */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-md z-[998] md:hidden transition-all duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* --- Sidebar Main Container --- */}
      <aside className={`
        fixed left-0 top-0 h-screen bg-slate-950 border-r border-slate-800 p-6 flex flex-col transition-transform duration-300 ease-in-out z-[999]
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:sticky md:w-64 w-[280px]
      `}>
        
        {/* Header inside Sidebar */}
        <div className="flex items-center justify-between mb-10 px-2">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-600/20">
              <BrainCircuit className="text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">TaskAI</span>
          </div>
          {/* Close button for mobile */}
          <button 
            onClick={() => setIsOpen(false)}
            className="md:hidden p-2 text-slate-400 hover:text-white bg-slate-900/50 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Navigation Links */}
        <nav className="flex-1 space-y-1.5">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            
            return (
              <Link 
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)} 
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                  : "text-slate-400 hover:bg-slate-900/80 hover:text-white"
                }`}
              >
                <span className={`${isActive ? "text-white" : "group-hover:text-white transition-colors"}`}>
                  {item.icon}
                </span>
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-900 mt-auto">
          <div className="px-4 py-3 bg-slate-900/30 rounded-xl border border-slate-800/50">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">
              Status
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              v1.0.2 - Stable
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}