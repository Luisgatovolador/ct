"use client";

import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  TextField,
  Button,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
  IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Navbar from '@/components/Navbars/navbarUsuarios/navbar';
import Footer from '@/components/footer/footer';

const Page = () => {
  const [actividades, setActividades] = useState([]);
  const [nuevaActividad, setNuevaActividad] = useState({
    titulo: '',
    descripcion: '',
    fechaInicio: '',
    fechaFin: '',
    planeacionID: ''
  });

  // Cargar actividades desde la base de datos cuando el componente se monta
  useEffect(() => {
    const fetchActividades = async () => {
      try {
        const response = await fetch('/api/actividades'); // Aquí haces una petición GET a tu API
        const data = await response.json();
        setActividades(data);
      } catch (error) {
        console.error('Error al cargar actividades:', error);
      }
    };
    fetchActividades();
  }, []);

  // Manejar el agregar actividad
  const manejarAgregarActividad = async () => {
    if (
      nuevaActividad.titulo &&
      nuevaActividad.descripcion &&
      nuevaActividad.fechaInicio &&
      nuevaActividad.fechaFin &&
      nuevaActividad.planeacionID
    ) {
      try {
        const response = await fetch('/api/actividades', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(nuevaActividad),
        });

        if (response.ok) {
          const actividadGuardada = await response.json();
          setActividades([...actividades, actividadGuardada]);
          setNuevaActividad({
            titulo: '',
            descripcion: '',
            fechaInicio: '',
            fechaFin: '',
            planeacionID: ''
          });
        } else {
          console.error('Error al agregar actividad');
        }
      } catch (error) {
        console.error('Error al agregar actividad:', error);
      }
    } else {
      alert('Por favor, completa todos los campos.');
    }
  };

  // Manejar eliminar actividad
  const manejarEliminarActividad = async (id, index) => {
    try {
      const response = await fetch(`/api/actividades/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const actividadesActualizadas = actividades.filter((_, i) => i !== index);
        setActividades(actividadesActualizadas);
      } else {
        console.error('Error al eliminar actividad');
      }
    } catch (error) {
      console.error('Error al eliminar actividad:', error);
    }
  };

  return (
    <>
      <Navbar />

      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Container maxWidth="lg" sx={{ mt: 4, flexGrow: 1 }}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h5" component="h3" gutterBottom>
              Crear Actividad
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Título de la Actividad"
                  variant="outlined"
                  fullWidth
                  value={nuevaActividad.titulo}
                  onChange={(e) => setNuevaActividad({ ...nuevaActividad, titulo: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Descripción"
                  variant="outlined"
                  fullWidth
                  value={nuevaActividad.descripcion}
                  onChange={(e) => setNuevaActividad({ ...nuevaActividad, descripcion: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Fecha de Inicio"
                  type="date"
                  variant="outlined"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={nuevaActividad.fechaInicio}
                  onChange={(e) => setNuevaActividad({ ...nuevaActividad, fechaInicio: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Fecha de Fin"
                  type="date"
                  variant="outlined"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={nuevaActividad.fechaFin}
                  onChange={(e) => setNuevaActividad({ ...nuevaActividad, fechaFin: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="ID de Planeación"
                  variant="outlined"
                  fullWidth
                  value={nuevaActividad.planeacionID}
                  onChange={(e) => setNuevaActividad({ ...nuevaActividad, planeacionID: e.target.value })}
                />
              </Grid>
            </Grid>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              onClick={manejarAgregarActividad}
            >
              Agregar Actividad
            </Button>
          </Paper>
        </Container>

        {/* Lista de actividades */}
        <Container maxWidth="lg" sx={{ mt: 4, flexGrow: 1 }}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h5" component="h3" gutterBottom>
              Actividades
            </Typography>
            <List>
              {actividades.length > 0 ? (
                actividades.map((actividad, index) => (
                  <ListItem key={index} secondaryAction={
                    <IconButton edge="end" aria-label="delete" onClick={() => manejarEliminarActividad(actividad.id, index)}>
                      <DeleteIcon />
                    </IconButton>
                  }>
                    <ListItemText
                      primary={actividad.titulo}
                      secondary={`Descripción: ${actividad.descripcion} | Inicio: ${actividad.fechaInicio} | Fin: ${actividad.fechaFin} | Planeación ID: ${actividad.planeacionID}`}
                    />
                  </ListItem>
                ))
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No hay actividades creadas.
                </Typography>
              )}
            </List>
          </Paper>
        </Container>

        {/* Footer */}
        <Footer />
      </Box>
    </>
  );
};

export default Page;
