import React, { useEffect, useState } from "react";
import { Box, Typography, Button, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const ListaActividadesConjuntas = ({ idProfesor }) => {
  const [actividades, setActividades] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const obtenerActividades = async () => {
    try {
      const respuesta = await fetch(`${API_URL}/actividad-conjunto/actividad-por-profesor/${idProfesor}`);
      if (!respuesta.ok) {
        throw new Error("Error al obtener las actividades");
      }
      const datos = await respuesta.json();
      setActividades(datos);
    } catch (err) {
      console.error("Error al obtener las actividades:", err);
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerActividades();
  }, []);

  if (cargando) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Typography variant="h6" color="error">
          Ocurrió un error: {error}
        </Typography>
        <Button onClick={obtenerActividades} variant="contained" color="primary">
          Reintentar
        </Button>
      </Box>
    );
  }

  if (actividades.length === 0) {
    return (
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Typography variant="h6">No hay actividades conjuntas disponibles.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4, p: 2 }}>
      <Typography variant="h5" color="primary" sx={{ marginBottom: 2 }}>
        Lista de Actividades Conjuntas
      </Typography>
      {actividades.map((actividad) => (
        <Box
          key={actividad._id}
          sx={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "16px",
            backgroundColor: "#f9f9f9",
            marginBottom: "16px",
          }}
        >
          <Typography variant="h6">{actividad.nombre}</Typography>
          <Typography variant="body1">Descripción: {actividad.descripcion}</Typography>
          <Typography variant="body2">Creador: {actividad.profesorCreador?.nombre}</Typography>
          <Typography variant="body2">Asignatura: {actividad.asignatura?._id}</Typography>
          
          <Typography variant="subtitle1" sx={{ mt: 2 }}>Tareas:</Typography>
          {actividad.tareas.length > 0 ? (
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Alumno</TableCell>
                    <TableCell>Archivo</TableCell>
                    <TableCell>Fecha de Subida</TableCell>
                    <TableCell>Calificación Promedio</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {actividad.tareas.map((tarea) => (
                    <TableRow key={tarea._id}>
                      <TableCell>{tarea.alumno?.nombre || "No disponible"}</TableCell>
                      <TableCell>
                        {tarea.archivo ? (
                          <Button href={tarea.archivo} target="_blank" rel="noopener noreferrer" variant="outlined">
                            Ver Archivo
                          </Button>
                        ) : (
                          "No enviado"
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(tarea.fechaSubida).toLocaleDateString("es-ES") || "N/A"}
                      </TableCell>
                      <TableCell>{tarea.calificacionPromedio || "No calificado"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body2">No hay tareas disponibles.</Typography>
          )}
        </Box>
      ))}
    </Box>
  );
};

export default ListaActividadesConjuntas;
