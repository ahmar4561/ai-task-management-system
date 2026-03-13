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
      {/* --- Mobile Navbar (Isse Dashboard nazar aayega) --- */}
      <nav className="md:hidden flex items-center justify-between p-4 bg-slate-950 border-b border-slate-800 w-full fixed top-0 left-0 z-[50]">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <BrainCircuit size={18} className="text-white" />
          </div>
          <span className="text-lg font-bold text-white uppercase tracking-tighter">TaskAI</span>
        </div>
        <button 
          onClick={() => setIsOpen(true)}
          className="p-2 text-slate-400 hover:text-white bg-slate-900 rounded-lg"
        >
          <Menu size={24} />
        </button>
      </nav>

      {/* --- Mobile Overlay --- */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* --- Sidebar Main Container --- */}
      <aside className={`
        fixed inset-y-0 left-0 z-[110] w-[280px] bg-slate-950 border-r border-slate-800 p-6 
        transform transition-transform duration-300 ease-in-out flex flex-col
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:static md:h-screen md:min-w-[260px]
      `}>
        
        {/* Sidebar Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-2 px-2">
            <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-500/20">
              <BrainCircuit className="text-white" size={22} />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">TaskAI</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="md:hidden text-slate-400 p-1">
            <X size={24} />
          </button>
        </div>
        
        {/* Links */}
        <nav className="flex-1 space-y-1.5">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)} 
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                  ? "bg-blue-600 text-white" 
                  : "text-slate-400 hover:bg-slate-900 hover:text-white"
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="pt-4 border-t border-slate-900">
           <div className="px-4 py-2 text-[10px] text-slate-500 font-mono">v1.0.2 STABLE</div>
        </div>
      </aside>
    </>
  );
}