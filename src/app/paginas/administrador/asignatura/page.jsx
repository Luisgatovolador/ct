"use client";

import React, { useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Paper,
  MenuItem,
  IconButton,
  Box,
  Pagination,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Navbar from '@/components/navbar/navbar';
import Footer from '@/components/footer/footer';

const PaginaAsignaturas = () => {
  const [asignaturas, setAsignaturas] = useState([
    { id: 1, nombre: "Matemáticas", catedratico: ["1", "2"], estudiantes: ["3", "4"], area: "Ciencias" },
    { id: 2, nombre: "Biología", catedratico: ["3"], estudiantes: ["5"], area: "Ciencias" },
    { id: 3, nombre: "Historia", catedratico: ["1"], estudiantes: [], area: "Humanidades" }
  ]);

  const [busquedaNombre, setBusquedaNombre] = useState("");
  const [filtroArea, setFiltroArea] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const asignaturasPorPagina = 5;
  const [nuevoAsignatura, setNuevoAsignatura] = useState({ nombre: "", catedratico: [], estudiantes: [], area: "" });
  const [modoEdicion, setModoEdicion] = useState(false);
  const [asignaturaAEditar, setAsignaturaAEditar] = useState(null);

  // Filtro por nombre y área
  const asignaturasFiltradas = asignaturas.filter((asignatura) =>
    asignatura.nombre.toLowerCase().includes(busquedaNombre.toLowerCase()) &&
    (filtroArea ? asignatura.area === filtroArea : true)
  );

  const inicioPagina = (paginaActual - 1) * asignaturasPorPagina;
  const asignaturasPaginadas = asignaturasFiltradas.slice(inicioPagina, inicioPagina + asignaturasPorPagina);
  const totalPaginas = Math.ceil(asignaturasFiltradas.length / asignaturasPorPagina);

  const manejarAgregarAsignatura = () => {
    if (modoEdicion) {
      setAsignaturas(asignaturas.map(asignatura => asignatura.id === asignaturaAEditar.id ? { ...asignaturaAEditar, ...nuevoAsignatura } : asignatura));
      setModoEdicion(false);
      setAsignaturaAEditar(null);
    } else {
      const nuevoId = asignaturas.length ? Math.max(...asignaturas.map(asignatura => asignatura.id)) + 1 : 1;
      const asignaturaConId = { id: nuevoId, ...nuevoAsignatura };
      setAsignaturas([...asignaturas, asignaturaConId]);
    }
    setNuevoAsignatura({ nombre: "", catedratico: [], estudiantes: [], area: "" });
  };

  const manejarEliminarAsignatura = (id) => {
    setAsignaturas(asignaturas.filter(asignatura => asignatura.id !== id));
  };

  const manejarEditarAsignatura = (asignatura) => {
    setModoEdicion(true);
    setAsignaturaAEditar(asignatura);
    setNuevoAsignatura({ nombre: asignatura.nombre, catedratico: asignatura.catedratico, estudiantes: asignatura.estudiantes, area: asignatura.area });
  };

  return (
    <>
      <Navbar />

      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Container maxWidth="lg" sx={{ mt: 4, flexGrow: 1 }}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            {/* Filtro por nombre y área */}
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
                  onClick={() => setBusquedaNombre("")} // Reiniciar búsqueda
                >
                  Buscar
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Container>

        {/* Panel para agregar y editar asignaturas */}
        <Container maxWidth="lg" sx={{ mt: 4, flexGrow: 1 }}>
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
                <TextField
                  label="Área"
                  variant="outlined"
                  fullWidth
                  value={nuevoAsignatura.area}
                  onChange={(e) => setNuevoAsignatura({ ...nuevoAsignatura, area: e.target.value })}
                />
              </Grid>
              {/* Catedráticos y Estudiantes pueden ser ingresados como texto por simplicidad */}
              <Grid item xs={12} md={6}>
                <TextField
                  label="Catedrático (separar por comas)"
                  variant="outlined"
                  fullWidth
                  value={nuevoAsignatura.catedratico.join(", ")}
                  onChange={(e) => setNuevoAsignatura({ ...nuevoAsignatura, catedratico: e.target.value.split(",").map(item => item.trim()) })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Estudiantes (separar por comas)"
                  variant="outlined"
                  fullWidth
                  value={nuevoAsignatura.estudiantes.join(", ")}
                  onChange={(e) => setNuevoAsignatura({ ...nuevoAsignatura, estudiantes: e.target.value.split(",").map(item => item.trim()) })}
                />
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

        {/* Lista de asignaturas filtradas */}
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
                          <Typography color="textSecondary">Catedrático: {asignatura.catedratico.join(", ")}</Typography>
                          <Typography color="textSecondary">Estudiantes: {asignatura.estudiantes.join(", ")}</Typography>
                        </CardContent>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <IconButton color="primary" onClick={() => manejarEditarAsignatura(asignatura)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton color="error" onClick={() => manejarEliminarAsignatura(asignatura.id)}>
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

        {/* Footer siempre en la parte inferior */}
        <Footer />
      </Box>
    </>
  );
};

export default PaginaAsignaturas;
