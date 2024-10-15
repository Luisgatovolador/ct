"use client";

import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  TextField,
  Paper,
  MenuItem,
  Pagination,
  IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Navbar from '@/components/Navbars/navbaradmins/navbar';
import Footer from '@/components/footer/footer';

const Page = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [busquedaNombre, setBusquedaNombre] = useState("");
  const [busquedaGrupo, setBusquedaGrupo] = useState("");
  const [busquedaArea, setBusquedaArea] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const estudiantesPorPagina = 5;
  const [nuevoEstudiante, setNuevoEstudiante] = useState({ nombre: "", email: "", grupo: "", area: "", asignaturas: [] });
  const [modoEdicion, setModoEdicion] = useState(false);
  const [estudianteAEditar, setEstudianteAEditar] = useState(null);

  // Obtener los estudiantes del backend al cargar el componente
  useEffect(() => {
    const fetchEstudiantes = async () => {
      try {
        const response = await fetch('/api/estudiantes');
        const data = await response.json();
        setEstudiantes(data);
      } catch (error) {
        console.error('Error al obtener los estudiantes:', error);
      }
    };

    fetchEstudiantes();
  }, []);

  // Filtro por nombre, grupo y área del estudiante
  const estudiantesFiltrados = estudiantes.filter((estudiante) =>
    estudiante.nombre.toLowerCase().includes(busquedaNombre.toLowerCase()) &&
    estudiante.grupo.toLowerCase().includes(busquedaGrupo.toLowerCase()) &&
    estudiante.area.toLowerCase().includes(busquedaArea.toLowerCase())
  );

  // Paginación de los estudiantes
  const inicioPagina = (paginaActual - 1) * estudiantesPorPagina;
  const estudiantesPaginados = estudiantesFiltrados.slice(inicioPagina, inicioPagina + estudiantesPorPagina);
  const totalPaginas = Math.ceil(estudiantesFiltrados.length / estudiantesPorPagina);

  // Agregar o actualizar un estudiante en la base de datos
  const manejarAgregarEstudiante = async () => {
    try {
      if (modoEdicion) {
        // Actualizar estudiante
        const response = await fetch(`/api/estudiantes/${estudianteAEditar.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(nuevoEstudiante),
        });

        if (response.ok) {
          const updatedEstudiante = await response.json();
          setEstudiantes(estudiantes.map(est => (est.id === updatedEstudiante.id ? updatedEstudiante : est)));
          setModoEdicion(false);
          setEstudianteAEditar(null);
        }
      } else {
        // Crear nuevo estudiante
        const response = await fetch('/api/estudiantes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(nuevoEstudiante),
        });

        if (response.ok) {
          const nuevoEstudianteResponse = await response.json();
          setEstudiantes([...estudiantes, nuevoEstudianteResponse]);
        }
      }

      setNuevoEstudiante({ nombre: "", email: "", grupo: "", area: "", asignaturas: [] });
    } catch (error) {
      console.error('Error al agregar o actualizar el estudiante:', error);
    }
  };

  // Eliminar un estudiante de la base de datos
  const manejarEliminarEstudiante = async (id) => {
    try {
      const response = await fetch(`/api/estudiantes/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setEstudiantes(estudiantes.filter(est => est.id !== id));
      }
    } catch (error) {
      console.error('Error al eliminar el estudiante:', error);
    }
  };

  // Preparar la edición de un estudiante
  const manejarEditarEstudiante = (estudiante) => {
    setModoEdicion(true);
    setEstudianteAEditar(estudiante);
    setNuevoEstudiante({ nombre: estudiante.nombre, email: estudiante.email, grupo: estudiante.grupo, area: estudiante.area, asignaturas: estudiante.asignaturas || [] });
  };

  return (
    <>
      <Navbar />

      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Container maxWidth="lg" sx={{ mt: 4, flexGrow: 1 }}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            {/* Filtro por nombre, grupo y área */}
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Buscar por nombre"
                  variant="outlined"
                  fullWidth
                  value={busquedaNombre}
                  onChange={(e) => setBusquedaNombre(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Buscar por grupo"
                  variant="outlined"
                  fullWidth
                  value={busquedaGrupo}
                  onChange={(e) => setBusquedaGrupo(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Buscar por área"
                  variant="outlined"
                  fullWidth
                  value={busquedaArea}
                  onChange={(e) => setBusquedaArea(e.target.value)}
                />
              </Grid>
            </Grid>
          </Paper>
        </Container>

        {/* Panel para agregar y editar estudiantes */}
        <Container maxWidth="lg" sx={{ mt: 4, flexGrow: 1 }}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h5" component="h3" gutterBottom>
              {modoEdicion ? "Editar Estudiante" : "Agregar Nuevo Estudiante"}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Nombre"
                  variant="outlined"
                  fullWidth
                  value={nuevoEstudiante.nombre}
                  onChange={(e) => setNuevoEstudiante({ ...nuevoEstudiante, nombre: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  value={nuevoEstudiante.email}
                  onChange={(e) => setNuevoEstudiante({ ...nuevoEstudiante, email: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Grupo"
                  variant="outlined"
                  fullWidth
                  value={nuevoEstudiante.grupo}
                  onChange={(e) => setNuevoEstudiante({ ...nuevoEstudiante, grupo: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Área"
                  variant="outlined"
                  fullWidth
                  value={nuevoEstudiante.area}
                  onChange={(e) => setNuevoEstudiante({ ...nuevoEstudiante, area: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Asignaturas (separar por comas)"
                  variant="outlined"
                  fullWidth
                  value={nuevoEstudiante.asignaturas.join(", ")}
                  onChange={(e) => setNuevoEstudiante({ ...nuevoEstudiante, asignaturas: e.target.value.split(",").map(item => item.trim()) })}
                />
              </Grid>
            </Grid>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              onClick={manejarAgregarEstudiante}
            >
              {modoEdicion ? "Actualizar Estudiante" : "Agregar Estudiante"}
            </Button>
          </Paper>
        </Container>

        {/* Lista de estudiantes filtrados */}
        <Container maxWidth="lg" sx={{ mt: 4, flexGrow: 1 }}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h5" component="h3" gutterBottom>
              Estudiantes
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box sx={{ padding: 2 }}>
                  {estudiantesPaginados.length > 0 ? (
                    estudiantesPaginados.map((estudiante) => (
                      <Card key={estudiante.id} sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Typography variant="h6">{estudiante.nombre}</Typography>
                          <Typography color="textSecondary">Email: {estudiante.email}</Typography>
                          <Typography color="textSecondary">Grupo: {estudiante.grupo}</Typography>
                          <Typography color="textSecondary">Área: {estudiante.area}</Typography>
                          <Typography color="textSecondary">Asignaturas: {estudiante.asignaturas.join(", ")}</Typography>
                        </CardContent>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <IconButton color="primary" onClick={() => manejarEditarEstudiante(estudiante)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton color="secondary" onClick={() => manejarEliminarEstudiante(estudiante.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Card>
                    ))
                  ) : (
                    <Typography>No se encontraron estudiantes.</Typography>
                  )}
                </Box>
              </Grid>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Pagination
                  count={totalPaginas}
                  page={paginaActual}
                  onChange={(e, page) => setPaginaActual(page)}
                  color="primary"
                />
              </Grid>
            </Grid>
          </Paper>
        </Container>

        <Footer />
      </Box>
    </>
  );
};

export default Page;
