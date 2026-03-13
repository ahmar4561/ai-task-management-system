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
      <body className={`${inter.className} bg-slate-950 text-white min-h-screen antialiased overflow-x-hidden`}>
        <div className="flex flex-col md:flex-row min-h-screen">
          {/* Sidebar - Mobile par drawer aur Desktop par side mein */}
          <Sidebar /> 
          
          {/* Main Content Area */}
          <main className="flex-1 flex flex-col min-w-0">
            {/* Mobile par top-bar ki vajah se content niche karne ke liye 'pt-20'.
               Desktop par padding normal karne ke liye 'md:pt-0'.
            */}
            <div className="flex-1 p-4 md:p-8 pt-20 md:pt-8 overflow-y-auto">
              <div className="max-w-7xl mx-auto">
                {children}
              </div>
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}