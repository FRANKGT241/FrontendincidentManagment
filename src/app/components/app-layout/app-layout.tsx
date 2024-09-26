// components/AppLayout.tsx
"use client";

import { useState, ReactNode } from "react";
import Footer from "./footer";
import Header from "./header";
import Sidebar from "./sidebar";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Contenido y Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

        {/* Overlay para cerrar el sidebar al hacer clic fuera */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
            onClick={closeSidebar}
          ></div>
        )}

        {/* Contenido Principal */}
        <main className="flex-1 overflow-auto p-4">
          {children}
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
