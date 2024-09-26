// app/layout.tsx
"use client";

import AppLayout from './components/app-layout/app-layout';
import { ReactNode } from "react";
import './globals.css'; // Asegúrate de importar los estilos globales

interface AppProps {
  children: ReactNode;
}

export default function RootLayout({ children }: AppProps) {
  return (
    <html lang="es">
      <body>
        <AppLayout>
          {children}
        </AppLayout>
      </body>
    </html>
  );
}
