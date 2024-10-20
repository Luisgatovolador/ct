"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, TextField, Typography } from "@mui/material";
import Image from "next/image";
import { saveToken, saveUser, saveRol } from "@/services/auth";

const API_URL = "https://control-de-tareas-backend-production.up.railway.app/api";

const CustomTextField = ({ label, type, value, onChange }) => (
  <TextField
    label={label}
    type={type}
    variant="outlined"
    margin="normal"
    required
    fullWidth
    value={value}
    onChange={onChange}
  />
);

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); 
  const isPasswordValid = (password) => password.length >= 6;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); 
    setIsLoading(true); 

    // Validaciones
    if (!isEmailValid(email)) {
      setErrorMessage("Correo electrónico inválido.");
      setIsLoading(false);
      return;
    }
    if (!isPasswordValid(password)) {
      setErrorMessage("La contraseña debe tener al menos 6 caracteres.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        saveToken(data.token);
        saveUser(data.user);

        if (data.user.rol === "Alumno") {
          router.push("/paginas/estudiantes/Home");
        }
        if (data.user.rol==="Profesor"){
          router.push("/paginas/profesores/Home");
        }
        if (data.user.rol==="Administrador"){
          router.push("/paginas/administrador/Home");
        }
      } else {
        setErrorMessage(data.message || "Error al iniciar sesión");
      }
    } catch (error) {
      setErrorMessage("Error en la conexión con el servidor");
      console.log(error);
    } finally {
      setIsLoading(false); 
    }
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
        component="form"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          maxWidth: "400px",
          boxShadow: 1,
          padding: "2rem",
          bgcolor: "white",
          marginTop: { xs: "1rem", md: "0" },
        }}
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <Image
          src="/logo.png"
          alt="Logo"
          width={100}
          height={100}
          style={{ marginBottom: "1rem" }}
        />

        <Typography
          variant="h4"
          sx={{ marginBottom: "2rem", color: "black", textAlign: "center" }}
        >
          Iniciar Sesión
        </Typography>

        {errorMessage && (
          <Typography
            color="error"
            sx={{ marginBottom: "1rem" }}
            aria-live="assertive"
          >
            {errorMessage}
          </Typography>
        )}

        <CustomTextField
          label="Correo Electrónico"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <CustomTextField
          label="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          variant="contained"
          color="red"
          disabled={isLoading}
          sx={{
            marginTop: "1rem",
            bgcolor: "black",
            width: "100%",
            color: "white",
            "&:hover": { bgcolor: "gray" },
          }}
          type="submit"
        >
          {isLoading ? "Cargando..." : "Iniciar Sesión"}
        </Button>
      </Box>
    </Box>
  );
}
