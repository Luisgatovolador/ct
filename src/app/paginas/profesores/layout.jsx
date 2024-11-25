
"use client"; 

import ProxyRutas from "@/services/proxyControlAcesso";

export default function LayoutProfesores({ children }) {
  return (
    <ProxyRutas rolesPermitidos={["Profesor"]}> 
      {children}
    </ProxyRutas>
  );
}
