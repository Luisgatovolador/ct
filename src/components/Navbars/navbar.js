"use client";
import { useState, useEffect } from "react";
import { getToken, getUser } from "@/services/auth";
import NavbarWithoutLogin from "./navbarWithoutLogin/navbar";
import NavbarAlumno from "./navbarUsuarios/navbar";
import NavbarProfesor from "./navbarprofesores/navbar";
import NavbarAdmin from "./navbaradmins/navbar";

export default function Navbar() {
  const dataUser = getUser()
  const token = getToken()

  return (
    <>
      {(!dataUser && !token) && <NavbarWithoutLogin />}
      {dataUser?.rol === "Alumno" && <NavbarAlumno />}
      {dataUser?.rol === "Profesor" && <NavbarProfesor />}
      {dataUser?.rol === "Administrador" && <NavbarAdmin />}
    </>
  );
}
