// layout.jsx

"use client"; // Asegura que este archivo sea un Client Component

import ProxyRutas from "@/services/proxyControlAcesso";

export default function LayoutProfesores({ children }) {
  return (
    <ProxyRutas rolesPermitidos={["Alumno"]}> {/* ID de rol para Profesor */}
      {children}
    </ProxyRutas>
  );
}
