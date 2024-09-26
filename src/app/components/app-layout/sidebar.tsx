// components/Sidebar.tsx
"use client";

import { Home, FileText, X } from "lucide-react";
import Link from "next/link";
import { FC } from "react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } bg-[#007041] text-white flex flex-col justify-between p-4`}
      aria-label="Barra lateral de navegación"
    >
      <div>
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold">Meso App</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-white/20"
            aria-label="Cerrar barra lateral"
          >
            <X size={24} />
          </button>
        </div>
        <nav className="space-y-2">
          <Link
            className="flex items-center space-x-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-white/20"
            href="/"
          >
            <Home className="h-5 w-5" />
            <span>Inicio</span>
          </Link>
          <Link
            className="flex items-center space-x-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-white/20"
            href="/pages/mantenimiento"
          >
            <FileText className="h-5 w-5" />
            <span>Mantenimiento</span>
          </Link>
          <Link
             className="flex items-center space-x-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-white/20"
            href="/pages/incidencia"
          >
            <FileText className="h-5 w-5" />
            <span>Incidencias</span>
          </Link>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
