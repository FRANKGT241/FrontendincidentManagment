// app/maintenance/page.tsx
"use client";

import React from "react";

const Maintenance: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="max-w-md text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Estamos en Mantenimiento</h1>
        <p className="text-lg text-gray-600 mb-6">
          Actualmente estamos realizando mejoras en nuestro sitio. Por favor, vuelve a intentarlo más tarde.
        </p>
        <svg
          className="mx-auto h-12 w-12 text-gray-400 mb-6"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-sm text-gray-500">
          Si tienes alguna pregunta, contáctanos en{" "}
          <a href="mailto:soporte@greenapp.com" className="text-blue-500 underline">
            soporte@greenapp.com
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default Maintenance;
