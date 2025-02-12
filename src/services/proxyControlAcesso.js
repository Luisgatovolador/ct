"use client";
import React, { useEffect } from "react";
import { getUser } from "@/services/auth";
import { useRouter } from "next/navigation";

class ServicioAutenticacion {
  static obtenerUsuarioActual() {
    const usuario = getUser();
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
      // Redirigir con código 401
      router.push("/paginas/auth/error?reason=not-authenticated&status=401");
      return;
    }

    if (!ServicioAutenticacion.tieneRol(usuario, rolesPermitidos)) {
      // Redirigir con código 403
      router.push("/paginas/auth/error?reason=not-authorized&status=403");
      return;
    }
  }, [rolesPermitidos, router]);

  return children;
};

export default ProxyRutas;
