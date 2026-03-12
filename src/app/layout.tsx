import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "../components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TaskAI - AI Task Architect",
  description: "Build and manage projects with AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex bg-slate-950 text-white min-h-screen antialiased`}>
        {/* Sidebar left side par fix rahega */}
        <Sidebar /> 
        
        {/* Main content right side par overflow handle karega */}
        <main className="flex-1 h-screen overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}