"use client"; 
import React, { useEffect } from "react";
import { getUser } from '@/services/auth';
import { useRouter } from "next/navigation"; 

class ServicioAutenticacion {
  
  static obtenerUsuarioActual() {
    const usuario = getUser();
    console.log(usuario); 
    return usuario; 
  }

  static tieneRol(usuario, rolesPermitidos) {
    return usuario && rolesPermitidos.includes(usuario.rol);
  }
}

const ProxyRutas = ({ rolesPermitidos, children }) => {
  const router = useRouter(); 

  useEffect(() => {
    const usuario = ServicioAutenticacion.obtenerUsuarioActual(); 

    if (!usuario) {
      alert("Acceso no autorizado. Por favor, inicia sesión.");
      window.location.href = "/paginas/auth/login"; 
      return; 
    }

    if (!ServicioAutenticacion.tieneRol(usuario, rolesPermitidos)) {
      alert("No tienes permisos para acceder a esta ruta.");
      window.location.href = "/paginas/auth/permisos";
      return; 
    }
  }, [rolesPermitidos, router]);

  return children;
}

export default ProxyRutas;
