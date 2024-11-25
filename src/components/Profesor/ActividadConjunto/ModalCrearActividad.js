"use client";

import React, { useState } from "react";
import { Box, Typography, TextField, InputLabel, Button, Modal } from "@mui/material";

const ModalCrearActividad = ({ abierto, asignaturaId, profesorId }) => {
  const [actividad, setActividad] = useState({
    nombre: "",
    descripcion: "",
    profesorId: profesorId,
    asignaturaId: asignaturaId,
    archivo: ""
  });

  const estiloModal = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const manejarGuardarActividad = async () => {
    if (!actividad.actividadId || !actividad.estudianteId || !actividad.archivo) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    const formData = new FormData();
    formData.append("actividadId", actividad.actividadId);
    formData.append("estudianteId", actividad.estudianteId);
    formData.append("archivo", actividad.archivo);

    try {
      const respuesta = await fetch("http:localhost:3001/api/actividad/subir-tarea", {
        method: "POST",
        body: formData,
      });

      if (!respuesta.ok) {
        const error = await respuesta.json();
        throw new Error(error.mensaje || "Error al subir la tarea.");
      }

      const resultado = await respuesta.json();
      console.log("Tarea subida exitosamente:", resultado);
      alert("Tarea subida exitosamente.");
      cerrarModal();
    } catch (error) {
      console.error("Error al subir la tarea:", error.message);
      alert("No se pudo subir la tarea: " + error.message);
    }
  };

  return (
    <Modal open={abierto} onClose={cerrarModal}>
      <Box sx={estiloModal}>
        <Typography variant="h6" component="h2" gutterBottom>
          Subir Tarea
        </Typography>
        <TextField
          label="ID de Actividad"
          variant="outlined"
          fullWidth
          value={actividad.actividadId}
          onChange={(e) =>
            setActividad({ ...actividad, actividadId: e.target.value })
          }
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="ID de Estudiante"
          variant="outlined"
          fullWidth
          value={actividad.estudianteId}
          onChange={(e) =>
            setActividad({ ...actividad, estudianteId: e.target.value })
          }
          sx={{ marginBottom: 2 }}
        />
        <InputLabel htmlFor="archivo">Archivo</InputLabel>
        <input
          type="file"
          onChange={(e) =>
            setActividad({ ...actividad, archivo: e.target.files[0] })
          }
          style={{ marginBottom: 16 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={manejarGuardarActividad}
        >
          Subir Tarea
        </Button>
      </Box>
    </Modal>
  );
};

export default ModalCrearActividad;
