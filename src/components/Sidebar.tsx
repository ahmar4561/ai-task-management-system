"use client";

import { LayoutDashboard, CheckSquare, Settings, BrainCircuit } from "lucide-react";
import Link from "next/link"; 
import { usePathname } from "next/navigation"; 

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, href: "/" },
    { name: "My Tasks", icon: <CheckSquare size={20} />, href: "/tasks" },
    { name: "AI Insights", icon: <BrainCircuit size={20} />, href: "/insights" },
    { name: "Settings", icon: <Settings size={20} />, href: "/settings" },
  ];

  return (
    <div className="w-64 h-screen bg-slate-950 border-r border-slate-800 p-4 flex flex-col sticky top-0">
      {/* Logo Section */}
      <div className="flex items-center gap-2 mb-10 px-2">
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

      {/* Footer / User Profile shortcut (Optional) */}
      <div className="pt-4 border-t border-slate-900 mt-auto">
        <p className="text-[10px] text-slate-600 uppercase tracking-widest px-4 mb-2 font-bold">
          Developer Mode
        </p>
        <div className="px-4 py-2 text-xs text-slate-500 italic">
          v1.0.2 - Stable
        </div>
      </div>
    </div>
  );
}