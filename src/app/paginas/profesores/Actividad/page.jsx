"use client";

import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Box,
  TextField,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  MenuItem,
  Pagination
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Navbar from '@/components/Navbars/navbarprofesores/navbar';
import Footer from '@/components/footer/footer';

const Page = () => {
  const [archivosSubidos, setArchivosSubidos] = useState([]);
  const [busquedaAlumno, setBusquedaAlumno] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const tareasPorPagina = 5;
  const [calificacion, setCalificacion] = useState("");
  const [retroalimentacion, setRetroalimentacion] = useState("");
  const [tareas, setTareas] = useState([]); // Estado para almacenar las tareas desde la DB

  // 1. Cargar tareas desde la base de datos al montar el componente
  useEffect(() => {
    async function obtenerTareas() {
      try {
        const response = await fetch('/api/tareas'); // Aquí llamas a tu método para obtener las tareas
        const data = await response.json();
        setTareas(data);
      } catch (error) {
        console.error("Error al obtener las tareas", error);
      }
    }
    
    obtenerTareas();
  }, []);

  // 2. Función para actualizar la calificación de una tarea
  const manejarCalificacion = async (tareaId) => {
    try {
      await fetch(`/api/tareas/${tareaId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ calificacion, retroalimentacion })
      });
      // Actualiza las tareas en el frontend después de calificar
      const nuevasTareas = tareas.map((tarea) =>
        tarea.id === tareaId ? { ...tarea, calificacion, retroalimentacion } : tarea
      );
      setTareas(nuevasTareas);
    } catch (error) {
      console.error("Error al calificar la tarea", error);
    }
  };

  // Filtro por nombre del alumno y estado
  const tareasFiltradas = tareas
    .filter((tarea) =>
      tarea.alumno.toLowerCase().includes(busquedaAlumno.toLowerCase()) &&
      (filtroEstado === "" || tarea.estado === filtroEstado)
    );

  // Paginación de las tareas
  const inicioPagina = (paginaActual - 1) * tareasPorPagina;
  const tareasPaginadas = tareasFiltradas.slice(inicioPagina, inicioPagina + tareasPorPagina);
  const totalPaginas = Math.ceil(tareasFiltradas.length / tareasPorPagina);

  return (
    <>
      <Navbar></Navbar>

      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Container maxWidth="lg" sx={{ mt: 4, flexGrow: 1 }}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            {/* Filtros y navegación arriba */}
            <Grid container spacing={2}>
              {/* Filtro por estado */}
              <Grid item xs={12} md={3}>
                <TextField
                  select
                  label="Estado"
                  variant="outlined"
                  fullWidth
                  value={filtroEstado}
                  onChange={(e) => setFiltroEstado(e.target.value)}
                >
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value="Pendiente">Pendiente</MenuItem>
                  <MenuItem value="Completada">Completada</MenuItem>
                </TextField>
              </Grid>

              {/* Filtro por nombre del alumno */}
              <Grid item xs={12} md={4}>
                <TextField
                  label="Buscar alumno"
                  variant="outlined"
                  fullWidth
                  value={busquedaAlumno}
                  onChange={(e) => setBusquedaAlumno(e.target.value)}
                />
              </Grid>

              {/* Botón de búsqueda */}
              <Grid item xs={12} md={2}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ height: '100%' }}
                  onClick={() => setPaginaActual(1)}
                >
                  Buscar
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Container>

        {/* Panel para calificar y retroalimentar */}
        <Container maxWidth="lg" sx={{ mt: 4, flexGrow: 1 }}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <div className="px-75" style={{ flexGrow: 1 }}>
              <Grid container spacing={2}>
                {/* Panel derecho para calificación y retroalimentación */}
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Asignar calificación
                      </Typography>
                      <TextField
                        label="Calificación"
                        variant="outlined"
                        type="number"
                        fullWidth
                        inputProps={{ min: 1, max: 10 }}
                        value={calificacion}
                        onChange={(e) => setCalificacion(e.target.value)}
                      />
                      <TextField
                        label="Retroalimentación"
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={4}
                        value={retroalimentacion}
                        onChange={(e) => setRetroalimentacion(e.target.value)}
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                        onClick={() => manejarCalificacion(selectedTareaId)} // Aquí pasarías el ID de la tarea seleccionada
                      >
                        Calificar
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </div>
          </Paper>
        </Container>

        {/* Mostrar las tareas de los alumnos */}
        <Container maxWidth="lg" sx={{ mt: 4, flexGrow: 1 }}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h5" component="h3" gutterBottom>
              Tareas de los Alumnos
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box sx={{ padding: 2 }}>
                  {tareasPaginadas.length > 0 ? (
                    tareasPaginadas.map((tarea, index) => (
                      <Accordion key={index}>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls={`panel${index}-content`}
                          id={`panel${index}-header`}
                        >
                          <Typography>{tarea.titulo}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography>{tarea.descripcion}</Typography>
                          <Button size="small" sx={{ marginTop: 1 }} onClick={() => setSelectedTareaId(tarea.id)}>
                            Calificar
                          </Button>
                        </AccordionDetails>
                      </Accordion>
                    ))
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      No hay tareas que mostrar.
                    </Typography>
                  )}
                </Box>
              </Grid>
            </Grid>

            {/* Paginación */}
            {totalPaginas > 1 && (
              <Pagination
                count={totalPaginas}
                page={paginaActual}
                onChange={(e, value) => setPaginaActual(value)}
                sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}
              />
            )}
          </Paper>
        </Container>

        <Footer />
      </Box>
    </>
  );
};

export default Page;
