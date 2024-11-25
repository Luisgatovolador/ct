"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  InputLabel,
  Button,
  Modal,
} from "@mui/material";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const ModalCrearActividad = ({ abierto, onCerrar, asignaturaId, profesorId }) => {
  const [actividad, setActividad] = useState({
    nombre: "",
    descripcion: "",
    profesorId: profesorId,
    asignaturaId: asignaturaId,
    archivo: null,
  });

  const estiloModal = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: "8px",
  };

  const manejarCambio = (e) => {
    const { name, value, files } = e.target;
    setActividad((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const manejarGuardarActividad = async () => {
    console.log(actividad)
    if (!actividad.nombre || !actividad.descripcion || !actividad.profesorId || !actividad.asignaturaId) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    const formData = new FormData();
    formData.append("nombre", actividad.nombre);
    formData.append("descripcion", actividad.descripcion);
    formData.append("profesorId", actividad.profesorId);
    formData.append("asignaturaId", actividad.asignaturaId);
    if (actividad.archivo) {
      formData.append("archivo", actividad.archivo);
    }

    try {
      const respuesta = await fetch(`${API_URL}/actividad-conjunto/crear`, {
        method: "POST",
        body: formData,
      });

      if (respuesta.ok) {
        alert("Actividad creada con éxito.");
        setActividad({
          nombre: "",
          descripcion: "",
          profesorId: profesorId,
          asignaturaId: asignaturaId,
          archivo: null,
        });
        onCerrar();
      } else {
        alert("Error al crear la actividad.");
      }
    } catch (error) {
      console.error("Error al guardar la actividad:", error);
      alert("Ocurrió un error al intentar guardar la actividad.");
    }
  };

  return (
    <Modal open={abierto} onClose={onCerrar}>
      <Box sx={estiloModal}>
        <Typography variant="h6" component="h2">
          Crear Actividad
        </Typography>
        <Box
          component="form"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            mt: 2,
          }}
        >
          <TextField
            label="Nombre de la Actividad"
            name="nombre"
            value={actividad.nombre}
            onChange={manejarCambio}
            fullWidth
          />
          <TextField
            label="Descripción"
            name="descripcion"
            value={actividad.descripcion}
            onChange={manejarCambio}
            multiline
            rows={4}
            fullWidth
          />
          <InputLabel htmlFor="archivo">Subir Archivo .docx, .xlsx, .pptx, .pdf, .png</InputLabel>
          <input
            type="file"
            name="archivo"
            id="archivo"
            onChange={manejarCambio}
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button onClick={onCerrar} variant="outlined" color="primary">
              Cancelar
            </Button>
            <Button
              onClick={manejarGuardarActividad}
              variant="contained"
              color="primary"
            >
              Guardar
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalCrearActividad;
