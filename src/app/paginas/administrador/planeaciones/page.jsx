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
import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';
import Navbar from '@/components/Navbars/navbaradmins/navbar';
import Footer from '@/components/footer/footer';

const Page = () => {
  const [planeaciones, setPlaneaciones] = useState([
    { id: 1, nombre: "Matemáticas", area: "Ciencias", estado: "Pendiente" },
    { id: 2, nombre: "Biología", area: "Ciencias", estado: "Pendiente" },
    { id: 3, nombre: "Historia", area: "Humanidades", estado: "Aceptada" },
    { id: 4, nombre: "Química", area: "Ciencias", estado: "Rechazada" }
  ]);

  const [busquedaNombre, setBusquedaNombre] = useState("");
  const [filtroArea, setFiltroArea] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const planeacionesPorPagina = 5;

  // Filtro por nombre, área y estado
  const planeacionesFiltradas = planeaciones.filter((planeacion) =>
    planeacion.nombre.toLowerCase().includes(busquedaNombre.toLowerCase()) &&
    (filtroArea ? planeacion.area === filtroArea : true) &&
    (filtroEstado ? planeacion.estado === filtroEstado : true)
  );

  const inicioPagina = (paginaActual - 1) * planeacionesPorPagina;
  const planeacionesPaginadas = planeacionesFiltradas.slice(inicioPagina, inicioPagina + planeacionesPorPagina);
  const totalPaginas = Math.ceil(planeacionesFiltradas.length / planeacionesPorPagina);

  const manejarAceptarPlaneacion = (id) => {
    setPlaneaciones(planeaciones.map(planeacion => planeacion.id === id ? { ...planeacion, estado: "Aceptada" } : planeacion));
  };

  const manejarRechazarPlaneacion = (id) => {
    setPlaneaciones(planeaciones.map(planeacion => planeacion.id === id ? { ...planeacion, estado: "Rechazada" } : planeacion));
  };

  return (
    <>
      <Navbar />

      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Container maxWidth="lg" sx={{ mt: 4, flexGrow: 1 }}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            {/* Filtro por nombre, área y estado */}
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Buscar planeación por materia"
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
              <Grid item xs={12} md={4}>
                <TextField
                  select
                  label="Filtrar por estado"
                  variant="outlined"
                  fullWidth
                  value={filtroEstado}
                  onChange={(e) => setFiltroEstado(e.target.value)}
                >
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value="Pendiente">Pendiente</MenuItem>
                  <MenuItem value="Aceptada">Aceptada</MenuItem>
                  <MenuItem value="Rechazada">Rechazada</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </Paper>
        </Container>

        {/* Lista de planeaciones filtradas */}
        <Container maxWidth="lg" sx={{ mt: 4, flexGrow: 1 }}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h5" component="h3" gutterBottom>
              Planeaciones
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box sx={{ padding: 2 }}>
                  {planeacionesPaginadas.length > 0 ? (
                    planeacionesPaginadas.map((planeacion) => (
                      <Card key={planeacion.id} sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Typography variant="h6">{planeacion.nombre}</Typography>
                          <Typography color="textSecondary">Área: {planeacion.area}</Typography>
                          <Typography color="textSecondary">Estado: {planeacion.estado}</Typography>
                        </CardContent>
                        <Box sx={{ display: 'flex' }}>
                          <IconButton color="success" onClick={() => manejarAceptarPlaneacion(planeacion.id)} disabled={planeacion.estado !== "Pendiente"}>
                            <CheckIcon />
                          </IconButton>
                          <IconButton color="error" onClick={() => manejarRechazarPlaneacion(planeacion.id)} disabled={planeacion.estado !== "Pendiente"}>
                            <CancelIcon />
                          </IconButton>
                        </Box>
                      </Card>
                    ))
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      No hay planeaciones que mostrar.
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

export default Page;
