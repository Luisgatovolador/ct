"use client";

import React, { useState, useEffect } from 'react';
import {
  Container, Grid, Card, CardContent, Typography, Button, TextField,
  Paper, MenuItem, IconButton, Box, Pagination, FormControl, InputLabel, Select
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Footer from '@/components/footer/footer';
import Navbar from '@/components/Navbars/navbar';

const Page = () => {
  const [asignaturas, setAsignaturas] = useState([]);
  const [busquedaNombre, setBusquedaNombre] = useState("");
  const [filtroArea, setFiltroArea] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const asignaturasPorPagina = 4;
  const [areas, setAreas] = useState([]);
  const [nuevoAsignatura, setNuevoAsignatura] = useState({ nombre: "", catedratico: [], estudiantes: [], area: "" });
  const [modoEdicion, setModoEdicion] = useState(false);
  const [asignaturaAEditar, setAsignaturaAEditar] = useState(null);

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const responseAreas = await fetch(
          "https://control-de-tareas-backend-production.up.railway.app/api/area/"
        );
        const dataAreas = await responseAreas.json();
        setAreas(dataAreas);
      } catch (error) {
        console.error("Error al obtener áreas:", error);
      }
    };
    fetchAreas();
  }, []);

  // Obtener las asignaturas del backend al cargar el componente
  useEffect(() => {
    const fetchAsignaturas = async () => {
      try {
        const response = await fetch('https://control-de-tareas-backend-production.up.railway.app/api/asignatura/');
        const data = await response.json();
        setAsignaturas(data);
      } catch (error) {
        console.error('Error al obtener las asignaturas:', error);
      }
    };
    fetchAsignaturas();
  }, []);

  // Filtro por nombre y área
  const asignaturasFiltradas = asignaturas.filter((asignatura) =>
    asignatura.nombre.toLowerCase().includes(busquedaNombre.toLowerCase()) &&
    (filtroArea ? asignatura.area === filtroArea : true)
  );

  const inicioPagina = (paginaActual - 1) * asignaturasPorPagina;
  const asignaturasPaginadas = asignaturasFiltradas.slice(inicioPagina, inicioPagina + asignaturasPorPagina);
  const totalPaginas = Math.ceil(asignaturasFiltradas.length / asignaturasPorPagina);

  // Manejar agregar o actualizar asignatura
  const manejarAgregarAsignatura = async () => {
    try {
      if (modoEdicion) {
        const response = await fetch(`https://control-de-tareas-backend-production.up.railway.app/api/asignatura/${asignaturaAEditar._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(nuevoAsignatura),
        });

        if (response.ok) {
          const updatedAsignatura = await response.json();
          setAsignaturas(asignaturas.map(asignatura => asignatura.id === updatedAsignatura.id ? updatedAsignatura : asignatura));
          setModoEdicion(false);
          setAsignaturaAEditar(null);
          window.location.reload();
        }
      } else {
        // Crear nueva asignatura
        const response = await fetch('https://control-de-tareas-backend-production.up.railway.app/api/asignatura', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(nuevoAsignatura),
        });

        if (response.ok) {
          const nuevaAsignatura = await response.json();
          setAsignaturas([...asignaturas, nuevaAsignatura]);
          window.location.reload();
        }
      }

      setNuevoAsignatura({ nombre: "", catedratico: [], estudiantes: [], area: "" });
    } catch (error) {
      console.error('Error al agregar o actualizar la asignatura:', error);
    }
  };

  // Manejar eliminar asignatura
  const manejarEliminarAsignatura = async (id) => {
    try {
      const response = await fetch(`https://control-de-tareas-backend-production.up.railway.app/api/asignatura/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setAsignaturas(asignaturas.filter(asignatura => asignatura.id !== id));
        window.location.reload();
      }
    } catch (error) {
      console.error('Error al eliminar la asignatura:', error);
    }
  };

  // Preparar edición de asignatura
  const manejarEditarAsignatura = (asignatura) => {
    setModoEdicion(true);
    setAsignaturaAEditar(asignatura);
    setNuevoAsignatura({ nombre: asignatura.nombre, catedratico: asignatura.catedratico, estudiantes: asignatura.estudiantes, area: asignatura.area });
  };

  return (
    <>
      <Navbar />

      <div className='px-44'>
        <br />
        <Typography variant="h4" component="h2" gutterBottom>
          Administración de Asignaturas
        </Typography>

        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Container maxWidth="lg" sx={{ mt: 4, flexGrow: 1 }}>
            <br />

            <Paper elevation={3} sx={{ padding: 2 }}>
              <Typography variant="h5" component="h3" gutterBottom>
                {modoEdicion ? "Editar Asignatura" : "Agregar Nueva Asignatura"}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Nombre"
                    variant="outlined"
                    fullWidth
                    value={nuevoAsignatura.nombre}
                    onChange={(e) => setNuevoAsignatura({ ...nuevoAsignatura, nombre: e.target.value })}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel>Área</InputLabel>
                    <Select
                      label="Área"
                      value={nuevoAsignatura.area}
                      onChange={(e) =>
                        setNuevoAsignatura({ ...nuevoAsignatura, area: e.target.value })
                      }
                    >
                      {areas.map((area) => (
                        <MenuItem key={area._id} value={area._id}>
                          {area.nombre}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                onClick={manejarAgregarAsignatura}
              >
                {modoEdicion ? "Actualizar Asignatura" : "Agregar Asignatura"}
              </Button>
            </Paper>
          </Container>

          <Container maxWidth="lg" sx={{ mt: 4, flexGrow: 1 }}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Buscar asignatura por nombre"
                    variant="outlined"
                    fullWidth
                    value={busquedaNombre}
                    onChange={(e) => setBusquedaNombre(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    select
                    label="Filtrar por área"
                    variant="outlined"
                    fullWidth
                    value={filtroArea}
                    onChange={(e) => setFiltroArea(e.target.value)}
                  >
                    <MenuItem value="">Todas</MenuItem>
                    <MenuItem value="Ciencias">Ciencias</MenuItem>
                    <MenuItem value="Humanidades">Humanidades</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ height: '100%' }}
                    onClick={() => setBusquedaNombre("")}
                  >
                    Buscar
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Container>

          <Container maxWidth="lg" sx={{ mt: 4, flexGrow: 1 }}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <Typography variant="h5" component="h3" gutterBottom>
                Asignaturas
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box sx={{ padding: 2 }}>
                    {asignaturasPaginadas.length > 0 ? (
                      asignaturasPaginadas.map((asignatura) => (
                        <Card key={asignatura.id} sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <CardContent sx={{ flexGrow: 1 }}>
                            <Typography variant="h6">{asignatura.nombre}</Typography>
                            <Typography color="textSecondary">Área: {asignatura.area}</Typography>
                          </CardContent>
                          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <IconButton color="primary" onClick={() => manejarEditarAsignatura(asignatura)}>
                              <EditIcon />
                            </IconButton>
                            <IconButton color="error" onClick={() => manejarEliminarAsignatura(asignatura._id)}>
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </Card>
                      ))
                    ) : (
                      <Typography variant="body2" color="textSecondary">
                        No hay asignaturas que mostrar.
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
        </Box>
      </div>
      <Footer />
    </>
  );
};

export default Page;
