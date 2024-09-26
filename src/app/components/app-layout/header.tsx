"use client";

import { Menu, X } from "lucide-react";

interface HeaderProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ isSidebarOpen, toggleSidebar }) => {
  return (
    <header className="flex h-16 items-center justify-between bg-[#007041] px-4 text-white">
      <div className="flex items-center space-x-2">
        <button
          onClick={toggleSidebar}
          className="rounded-lg p-2 hover:bg-white/20"
          aria-label="Alternar barra lateral"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <h1 className="text-2xl font-bold">Meso App</h1>
      </div>
    </header>
  );
};

export default Header;
