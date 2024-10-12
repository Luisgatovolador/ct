"use client";

import React, { useState } from 'react';
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
import Navbar from '@/components/navbarprofesores/navbar';
import Footer from '@/components/footer/footer';

const Page = () => {
  const [archivosSubidos, setArchivosSubidos] = useState([]);
  const [busquedaAlumno, setBusquedaAlumno] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [paginaActual, setPaginaActual] = useState(1); // Página actual para la paginación
  const tareasPorPagina = 5; // Número de tareas por página
  const [calificacion, setCalificacion] = useState(""); // Estado para la calificación
  const [retroalimentacion, setRetroalimentacion] = useState(""); // Estado para la retroalimentación

  const [archivosProfesor] = useState([
    { name: "Documento del Profesor 1", link: "#" },
    { name: "Documento del Profesor 2", link: "#" },
  ]);

  const tareas = [
    { titulo: "Tarea 1", descripcion: "Descripción de la Tarea 1", estado: "Pendiente", alumno: "Karime Alejandra Caballero Campos" },
    { titulo: "Tarea 2", descripcion: "Descripción de la Tarea 2", estado: "Completada", alumno: "Luis Oswaldo Rodríguez López" },
    { titulo: "Tarea 3", descripcion: "Descripción de la Tarea 3", estado: "Pendiente", alumno: "Oscar Daniel Morales Navarro" },
    { titulo: "Tarea 4", descripcion: "Descripción de la Tarea 4", estado: "Completada", alumno: "Karime Alejandra Caballero Campos" },
    { titulo: "Tarea 5", descripcion: "Descripción de la Tarea 5", estado: "Pendiente", alumno: "Oscar Daniel Morales Navarro" },
    { titulo: "Tarea 6", descripcion: "Descripción de la Tarea 6", estado: "Pendiente", alumno: "Luis Oswaldo Rodríguez López" },
    { titulo: "Tarea 7", descripcion: "Descripción de la Tarea 7", estado: "Completada", alumno: "Karime Alejandra Caballero Campos" },
  ];

  const manejarSubidaArchivos = (event) => {
    const files = event.target.files;
    const nuevosArchivos = [];
    for (let i = 0; i < files.length; i++) {
      nuevosArchivos.push(files[i].name);
    }
    setArchivosSubidos([...archivosSubidos, ...nuevosArchivos]);
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

              {/* Filtro por grupo (placeholder para futuras implementaciones) */}
              <Grid item xs={12} md={3}>
                <TextField
                  label="Grupo"
                  variant="outlined"
                  fullWidth
                />
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
                >
                  Buscar
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Container>

        {/* Panel para calificar y retroalimentar (Actividad principal) */}
        <Container maxWidth="lg" sx={{ mt: 4, flexGrow: 1 }}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <div className="px-75" style={{ flexGrow: 1 }}>
              <Grid container spacing={2}>
                {/* Sección Principal Izquierda */}
                <Grid item xs={12} md={8}>
                  <Card>
                    <CardContent>
                      {/* Detalles de la actividad */}
                      <Typography variant="h5" gutterBottom>
                        Karime Alejandra Caballero Campos
                      </Typography>
                      <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                        Fecha de entrega: 20 de Octubre de 2024
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        Descripción de la actividad. Aquí se muestra una descripción detallada de la tarea que el alumno debe realizar.
                      </Typography>

                      {/* Archivos agregados por el profesor */}
                      <Typography variant="h6" gutterBottom>
                        Documentos del Alumno
                      </Typography>
                      <List>
                        {archivosProfesor.map((file, index) => (
                          <ListItem key={index} button component="a" href={file.link}>
                            <ListItemText primary={file.name} />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Panel Derecho */}
                <Grid item xs={12} md={4}>
                  {/* Agregar retroalimentación */}
                  <Card sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Agregar retroalimentación
                      </Typography>
                      <TextField
                        label="Retroalimentación"
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={4}
                        value={retroalimentacion}
                        onChange={(e) => setRetroalimentacion(e.target.value)}
                      />
                    </CardContent>
                  </Card>

                  {/* Asignar calificación */}
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Asignar calificación (1/10)
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
                    </CardContent>
                  </Card>

                
                  <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                    Calificar
                  </Button>
                  
                </Grid>
              </Grid>
            </div>
          </Paper>
        </Container>

       
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
                          <Button size="small" sx={{ marginTop: 1 }}>
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
