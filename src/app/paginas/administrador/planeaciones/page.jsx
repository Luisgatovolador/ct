"use client";

import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Paper,
  IconButton,
  Box,
  Pagination,
  MenuItem
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';
import Navbar from '@/components/Navbars/navbar';
import Footer from '@/components/footer/footer';

const Page = () => {
  const [planeaciones, setPlaneaciones] = useState([]);
  const [busquedaNombre, setBusquedaNombre] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const planeacionesPorPagina = 5;

  // Función para obtener las planeaciones desde la API
  useEffect(() => {
    const obtenerPlaneaciones = async () => {
      try {
        const response = await fetch(
          "https://control-de-tareas-backend-production.up.railway.app/api/planeacion/"
        );
        const data = await response.json();
        setPlaneaciones(data);
      } catch (error) {
        console.error("Error al obtener las planeaciones:", error);
      }
    };
    obtenerPlaneaciones();
  }, []);

  // Función para actualizar la planeación en la API
  const actualizarPlaneacion = async (id, estado) => {
    try {
      const response = await fetch(
        `https://control-de-tareas-backend-production.up.railway.app/api/planeacion/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ estado }),
        }
      );
      if (!response.ok) throw new Error('Error al actualizar la planeación');
    } catch (error) {
      console.error("Error al actualizar la planeación:", error);
    }
  };

  // Manejar aceptación de una planeación
  const manejarAceptarPlaneacion = (id) => {
    setPlaneaciones(planeaciones.map(planeacion =>
      planeacion._id === id ? { ...planeacion, estado: "Aceptada" } : planeacion
    ));
    actualizarPlaneacion(id, "Aceptada");
  };

  // Manejar rechazo de una planeación
  const manejarRechazarPlaneacion = (id) => {
    setPlaneaciones(planeaciones.map(planeacion =>
      planeacion._id === id ? { ...planeacion, estado: "Rechazada" } : planeacion
    ));
    actualizarPlaneacion(id, "Rechazada");
  };

  // Filtrar planeaciones por nombre y estado
  const planeacionesFiltradas = planeaciones.filter((planeacion) =>
    planeacion.nombre.toLowerCase().includes(busquedaNombre.toLowerCase()) &&
    (filtroEstado ? planeacion.estado === filtroEstado : true)
  );

  const inicioPagina = (paginaActual - 1) * planeacionesPorPagina;
  const planeacionesPaginadas = planeacionesFiltradas.slice(inicioPagina, inicioPagina + planeacionesPorPagina);
  const totalPaginas = Math.ceil(planeacionesFiltradas.length / planeacionesPorPagina);

  return (
    <>
      <Navbar />

      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Container maxWidth="lg" sx={{ mt: 4, flexGrow: 1 }}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            {/* Filtro por nombre y estado */}
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Buscar planeación por materia"
                  variant="outlined"
                  fullWidth
                  value={busquedaNombre}
                  onChange={(e) => setBusquedaNombre(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
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
                      <Card key={planeacion._id} sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Typography variant="h6">{planeacion.nombre}</Typography>
                          <Typography color="textSecondary">Estado: {planeacion.estado}</Typography>
                        </CardContent>
                        <Box sx={{ display: 'flex' }}>
                          <IconButton color="success" onClick={() => manejarAceptarPlaneacion(planeacion._id)} disabled={planeacion.estado !== "Pendiente"}>
                            <CheckIcon />
                          </IconButton>
                          <IconButton color="error" onClick={() => manejarRechazarPlaneacion(planeacion._id)} disabled={planeacion.estado !== "Pendiente"}>
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
