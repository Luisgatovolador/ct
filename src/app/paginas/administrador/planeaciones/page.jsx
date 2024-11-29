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
  MenuItem,
  Button
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';
import Navbar from '@/components/Navbars/navbar';
import Footer from '@/components/footer/footer';
import Link from "next/link";

const Page = () => {
  const [planeaciones, setPlaneaciones] = useState([]);
  const [busquedaNombre, setBusquedaNombre] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const planeacionesPorPagina = 5;
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL
  
  // Obtener planeaciones desde la API
  useEffect(() => {
    const obtenerPlaneaciones = async () => {
      try {
        const response = await fetch(
          `${API_URL}planeacion/`
        );
        const data = await response.json();
        setPlaneaciones(data);
      } catch (error) {
        console.error("Error al obtener las planeaciones:", error);
      }
    };
    obtenerPlaneaciones();
  }, []);

  // Actualizar estado de planeación en la API
  const actualizarPlaneacion = async (id, estado) => {
    try {
      const response = await fetch(
        `${API_URL}planeacion/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ estado }),
        }
      );
      if (!response.ok) throw new Error('Error al actualizar la planeación');
    } catch (error) {
      console.error("Error al actualizar la planeación:", error);
    }
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
                          <Typography color="textSecondary">Asignatura: {planeacion.asignatura}</Typography>
                          <Typography color="textSecondary">Fecha de Inicio: {planeacion.fechaComienzo}</Typography>
                          <Typography color="textSecondary">Fecha de término: {planeacion.fechaFin}</Typography>
                        </CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', pr: 2 }}>
                         
                          <Link href={`/paginas/administrador/planeacion/${planeacion._id}`} passHref>
                            <Button variant="outlined" sx={{ ml: 2 }}>
                              Ver Detalles
                            </Button>
                          </Link>
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

        <Footer />
      </Box>
    </>
  );
};

export default Page;
