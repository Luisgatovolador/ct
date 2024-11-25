"use client";
import React from "react";
import { Button, Box, Typography } from "@mui/material";
import { getUser, logout } from "@/services/auth"; 
import { useRouter } from "next/navigation";  

const Permisos = () => {
  const router = useRouter();
  const usuario = getUser(); 

  //  home por rol
  const manejarRedireccionarHome = () => {
    if (!usuario) {
      alert("No estás logueado");
      router.push("/paginas/auth/login");
      return;
    }

    if (usuario.rol === "Alumno") {
      router.push("/paginas/estudiantes/home");
    } else if (usuario.rol === "Profesor") {
      router.push("/paginas/profesores/home");
    } else if (usuario.rol === "Administrador") {
      router.push("/paginas/administrador/home");
    } else {
      alert("Rol desconocido");
      router.push("/paginas/auth/login");
    }
  };

  // F cerrar sesión
  const manejarIniciarSesionOtroUsuario = () => {
    logout(); 
    router.push("/paginas/auth/login"); 
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        bgcolor: "#f5f5f5",
      }}
    >
      <Box
        sx={{
          padding: "2rem",
          boxShadow: 1,
          backgroundColor: "white",
          textAlign: "center",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <Typography variant="h5" sx={{ marginBottom: "1.5rem" }}>
          Opciones de Usuario
        </Typography>

        {usuario ? (
          <>
            <Typography sx={{ marginBottom: "1rem" }}>
              Bienvenido, {usuario.nombre}
            </Typography>

            <Button
              variant="contained"
              color="primary"
              sx={{ marginBottom: "1rem", width: "100%" }}
              onClick={manejarRedireccionarHome}
            >
              Ir a mi página principal
            </Button>
          </>
        ) : (
          <Typography sx={{ marginBottom: "1rem" }}>
            No estás logueado. Inicia sesión para continuar.
          </Typography>
        )}

        <Button
          variant="outlined"
          color="secondary"
          sx={{ marginBottom: "1rem", width: "100%" }}
          onClick={manejarIniciarSesionOtroUsuario}
        >
          Iniciar sesión con otro usuario
        </Button>


      </Box>
    </Box>
  );
};

export default Permisos;
