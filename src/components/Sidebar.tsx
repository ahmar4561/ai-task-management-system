"use client";

import { useState } from "react";
import { LayoutDashboard, CheckSquare, Settings, BrainCircuit, Menu, X } from "lucide-react";
import Link from "next/link"; 
import { usePathname } from "next/navigation"; 

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false); // Mobile menu toggle state

  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, href: "/" },
    { name: "My Tasks", icon: <CheckSquare size={20} />, href: "/tasks" },
    { name: "AI Insights", icon: <BrainCircuit size={20} />, href: "/insights" },
    { name: "Settings", icon: <Settings size={20} />, href: "/settings" },
  ];

  return (
    <>
      {/* --- Mobile Header (Sirf Mobile par dikhega) --- */}
      <div className="md:hidden flex items-center justify-between p-4 bg-slate-950 border-b border-slate-800 sticky top-0 z-[60]">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <BrainCircuit size={18} className="text-white" />
          </div>
          <span className="text-lg font-bold text-white">TaskAI</span>
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-slate-400 hover:text-white bg-slate-900 rounded-lg"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* --- Overlay (Mobile par sidebar khulne par background blur karne ke liye) --- */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[40] md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* --- Sidebar Main Container --- */}
      <div className={`
        fixed left-0 top-0 h-screen bg-slate-950 border-r border-slate-800 p-4 flex flex-col z-[50] transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:sticky md:w-64 w-[280px]
      `}>
        
        {/* Logo Section (Desktop par nazar aayega) */}
        <div className="hidden md:flex items-center gap-2 mb-10 px-2">
          <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-900/20">
            <BrainCircuit className="text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">TaskAI</span>
        </div>
        
        {/* Navigation Links */}
        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            
            return (
              <Link 
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)} // Mobile par click karne se menu band ho jaye
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                  ? "bg-blue-600/10 text-blue-400 border border-blue-500/20" 
                  : "text-slate-400 hover:bg-slate-900 hover:text-white"
                }`}
              >
                <span className={`${isActive ? "text-blue-400" : "group-hover:text-white"}`}>
                  {item.icon}
                </span>
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-900 mt-auto">
          <p className="text-[10px] text-slate-600 uppercase tracking-widest px-4 mb-2 font-bold">
            Developer Mode
          </p>
          <div className="px-4 py-2 text-xs text-slate-500 italic">
            v1.0.2 - Stable [cite: 97]
          </div>
        </div>
      </div>
    </>
  );
}