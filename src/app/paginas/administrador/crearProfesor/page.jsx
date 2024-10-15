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
  Pagination,
  IconButton,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Navbar from '@/components/Navbars/navbaradmins/navbar';
import Footer from '@/components/footer/footer';

const Page = () => {
  const [profesores, setProfesores] = useState([]);
  const [busquedaNombre, setBusquedaNombre] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const profesoresPorPagina = 5;
  
  const [nuevoProfesor, setNuevoProfesor] = useState({ 
    nombre: "", 
    email: "", 
    area: "", 
    rol: "",   // Añadimos el campo rol
    password: "",   // Añadimos el campo password
    confirmarPassword: ""  // Añadimos el campo confirmarPassword
  });

  const [modoEdicion, setModoEdicion] = useState(false);
  const [profesorAEditar, setProfesorAEditar] = useState(null);

  // Obtener los profesores del backend al cargar el componente
  useEffect(() => {
    const fetchProfesores = async () => {
      try {
        const response = await fetch('https://control-de-tareas-backend-production.up.railway.app/api/profesor/');
        const data = await response.json();
        if (Array.isArray(data)) {
          setProfesores(data);
        } else {
          console.error('Los datos recibidos no son un array:', data);
        }
      } catch (error) {
        console.error('Error al obtener los profesores:', error);
      }
    };

    fetchProfesores();
  }, []);

  // Filtro por nombre del profesor
  const profesoresFiltrados = Array.isArray(profesores) ? profesores.filter((profesor) =>
    profesor.nombre.toLowerCase().includes(busquedaNombre.toLowerCase())
  ) : [];

  // Paginación de los profesores
  const inicioPagina = (paginaActual - 1) * profesoresPorPagina;
  const profesoresPaginados = profesoresFiltrados.slice(inicioPagina, inicioPagina + profesoresPorPagina);
  const totalPaginas = Math.ceil(profesoresFiltrados.length / profesoresPorPagina);

  // Agregar o actualizar un profesor en la base de datos
  const manejarAgregarProfesor = async () => {
    try {
      if (modoEdicion && profesorAEditar) {
        // Actualizar profesor
        const response = await fetch(`https://control-de-tareas-backend-production.up.railway.app/api/profesor/${profesorAEditar.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(nuevoProfesor),
        });

        if (response.ok) {
          const updatedProfesor = await response.json();
          setProfesores(profesores.map(profesor => (profesor.id === updatedProfesor.id ? updatedProfesor : profesor)));
          setModoEdicion(false);
          setProfesorAEditar(null);
        }
      } else {
        // Crear nuevo profesor
        const response = await fetch('https://control-de-tareas-backend-production.up.railway.app/api/profesor/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(nuevoProfesor),
        });

        if (response.ok) {
          const nuevoProfesorResponse = await response.json();
          setProfesores([...profesores, nuevoProfesorResponse]);
        }
      }

      setNuevoProfesor({ nombre: "", email: "", area: "", rol: "", password: "", confirmarPassword: "" });
    } catch (error) {
      console.error('Error al agregar o actualizar el profesor:', error);
    }
  };

  // Eliminar un profesor de la base de datos
  const manejarEliminarProfesor = async (id) => {
    try {
      const response = await fetch(`https://control-de-tareas-backend-production.up.railway.app/api/profesor/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProfesores(profesores.filter(profesor => profesor.id !== id));
      }
    } catch (error) {
      console.error('Error al eliminar el profesor:', error);
    }
  };

  // Preparar la edición de un profesor
  const manejarEditarProfesor = (profesor) => {
    setModoEdicion(true);
    setProfesorAEditar(profesor);
    setNuevoProfesor({ nombre: profesor.nombre, email: profesor.email, area: profesor.area, rol: profesor.rol, password: "", confirmarPassword: "" });
  };

  return (
    <>
      <Navbar />

      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Container maxWidth="lg" sx={{ mt: 4, flexGrow: 1 }}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            {/* Filtro por nombre */}
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Buscar profesor por nombre"
                  variant="outlined"
                  fullWidth
                  value={busquedaNombre}
                  onChange={(e) => setBusquedaNombre(e.target.value)}
                />
              </Grid>

              <Grid item xs={12} md={2}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ height: '100%' }}
                  onClick={() => setBusquedaNombre("")}
                >
                  Limpiar Filtros
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Container>

        {/* Panel para agregar y editar profesores */}
        <Container maxWidth="lg" sx={{ mt: 4, flexGrow: 1 }}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h5" component="h3" gutterBottom>
              {modoEdicion ? "Editar Profesor" : "Agregar Nuevo Profesor"}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Nombre"
                  variant="outlined"
                  fullWidth
                  value={nuevoProfesor.nombre}
                  onChange={(e) => setNuevoProfesor({ ...nuevoProfesor, nombre: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  value={nuevoProfesor.email}
                  onChange={(e) => setNuevoProfesor({ ...nuevoProfesor, email: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel>Asignatura</InputLabel>
                  <Select
                    label="Asignatura"
                    value={nuevoProfesor.Asignatura}
                    onChange={(e) => setNuevoProfesor({ ...nuevoProfesor, rol: e.target.value })}
                  >
                    <MenuItem value="">
                      <em>Selecciona Asignatura</em>
                    </MenuItem>
                    <MenuItem value="652d6f21f1b9a1e544b0d3b2">Matematicas</MenuItem>
                    <MenuItem value="652d6f21f1b9a1e544b0d3b3">Administracion</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel>Rol</InputLabel>
                  <Select
                    label="Rol"
                    value={nuevoProfesor.rol}
                    onChange={(e) => setNuevoProfesor({ ...nuevoProfesor, rol: e.target.value })}
                  >
                    <MenuItem value="">
                      <em>Selecciona un rol</em>
                    </MenuItem>
                    <MenuItem value="652d6f21f1b9a1e544b0d3b2">Profesor</MenuItem>
                    <MenuItem value="652d6f21f1b9a1e544b0d3b3">Administrador</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Contraseña"
                  variant="outlined"
                  fullWidth
                  value={nuevoProfesor.password}
                  onChange={(e) => setNuevoProfesor({ ...nuevoProfesor, password: e.target.value })}
                  type="password"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Confirmar Contraseña"
                  variant="outlined"
                  fullWidth
                  value={nuevoProfesor.confirmarPassword}
                  onChange={(e) => setNuevoProfesor({ ...nuevoProfesor, confirmarPassword: e.target.value })}
                  type="password"
                />
              </Grid>
            </Grid>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              onClick={manejarAgregarProfesor}
            >
              {modoEdicion ? "Guardar Cambios" : "Agregar Profesor"}
            </Button>
          </Paper>
        </Container>

        {/* Lista de profesores */}
        <Container maxWidth="lg" sx={{ mt: 4, flexGrow: 1 }}>
          <Grid container spacing={2}>
            {profesoresPaginados.map((profesor) => (
              <Grid item xs={12} md={6} key={profesor.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{profesor.nombre}</Typography>
                    <Typography variant="body2">{profesor.email}</Typography>
                    <Typography variant="body2">Área: {profesor.area}</Typography>
                    <Typography variant="body2">Rol: {profesor.rol}</Typography>
                    <Box sx={{ mt: 2 }}>
                      <IconButton
                        color="primary"
                        onClick={() => manejarEditarProfesor(profesor)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="secondary"
                        onClick={() => manejarEliminarProfesor(profesor.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Pagination
              count={totalPaginas}
              page={paginaActual}
              onChange={(e, page) => setPaginaActual(page)}
              color="primary"
            />
          </Box>
        </Container>
      </Box>

      <Footer />
    </>
  );
};

export default Page;
