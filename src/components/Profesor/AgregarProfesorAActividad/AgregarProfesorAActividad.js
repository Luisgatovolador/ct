"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  TextField,
  MenuItem,
  Alert,
  Modal,
  Fade,
  Backdrop,
} from "@mui/material";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const AgregarProfesorAActividadModal = ({ actividadId, abierto, cerrarModal }) => {
  const [profesores, setProfesores] = useState([]);
  const [profesorSeleccionado, setProfesorSeleccionado] = useState("");
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  // Función para obtener la lista de profesores disponibles
  const obtenerProfesores = async () => {
    try {
      const respuesta = await fetch(`${API_URL}/profesor`);
      if (!respuesta.ok) {
        throw new Error("Error al obtener la lista de profesores");
      }
      const datos = await respuesta.json();
      setProfesores(datos);
    } catch (error) {
      console.error("Error al obtener profesores:", error);
      setMensaje({ tipo: "error", texto: error.message });
    }
  };

  // Función para asignar un profesor a la actividad
  const asignarProfesor = async () => {
    if (!profesorSeleccionado) {
      setMensaje({ tipo: "error", texto: "Debes seleccionar un profesor." });
      return;
    }

    setCargando(true);
    setMensaje("");

    try {
      const respuesta = await fetch(`${API_URL}/actividad-conjunto/asignar-profesor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          actividadId,
          profesorId: profesorSeleccionado,
        }),
      });

      if (!respuesta.ok) {
        const errorData = await respuesta.json();
        throw new Error(errorData.message || "Error al asignar el profesor");
      }

      setMensaje({ tipo: "success", texto: "Profesor asignado correctamente." });
      setProfesorSeleccionado(""); // Limpiar selección
    } catch (error) {
      console.error("Error al asignar profesor:", error);
      setMensaje({ tipo: "error", texto: error.message });
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (abierto) {
      obtenerProfesores();
    }
  }, [abierto]);

  return (
    <Modal
      open={abierto}
      onClose={cerrarModal}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={abierto}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: "8px",
          }}
        >
          <Typography variant="h5" color="primary" sx={{ marginBottom: 2 }}>
            Asignar Profesor a Actividad
          </Typography>

          {mensaje && (
            <Alert severity={mensaje.tipo} sx={{ mb: 2 }}>
              {mensaje.texto}
            </Alert>
          )}

          <TextField
            select
            label="Seleccionar Profesor"
            value={profesorSeleccionado}
            onChange={(e) => setProfesorSeleccionado(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          >
            {profesores.map((profesor) => (
              <MenuItem key={profesor._id} value={profesor._id}>
                {profesor.nombre} - {profesor.email}
              </MenuItem>
            ))}
          </TextField>

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={cerrarModal}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={asignarProfesor}
              disabled={cargando}
            >
              {cargando ? <CircularProgress size={24} /> : "Asignar Profesor"}
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default AgregarProfesorAActividadModal;
