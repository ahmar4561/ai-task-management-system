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
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-slate-950 text-white min-h-screen antialiased selection:bg-blue-500/30`}>
        <div className="flex flex-col md:flex-row min-h-screen relative">
          <Sidebar /> 
          
          <main className="flex-1 flex flex-col min-w-0">
            {/* Content Container with better spacing */}
            <div className="flex-1 p-5 md:p-10 pt-28 md:pt-10 overflow-y-auto">
              <div className="max-w-6xl mx-auto space-y-8">
                {children}
              </div>
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}