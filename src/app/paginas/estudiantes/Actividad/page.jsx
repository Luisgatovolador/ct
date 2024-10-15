"use client";

import React, { useState, useEffect } from 'react';
import { Container, Grid, Card, CardContent, Typography, Button, List, ListItem, ListItemText, Box } from '@mui/material';
import Navbar from '@/components/Navbars/navbarUsuarios/navbar';
import Footer from '@/components/footer/footer';
import Paper from "@mui/material/Paper";

const Page = ({ actividadId, estudianteId }) => {
  const [actividad, setActividad] = useState(null);  // Información de la actividad
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [professorFiles, setProfessorFiles] = useState([]);
  
  // Cargar detalles de la actividad cuando el componente se monta
  useEffect(() => {
    // Llamada al backend para obtener los detalles de la actividad
    const fetchActividad = async () => {
      try {
        const response = await fetch(`/api/actividades/${actividadId}`);
        const data = await response.json();
        setActividad(data);
        setProfessorFiles(data.archivosProfesor || []);  // Asume que los archivos del profesor están en la actividad
      } catch (error) {
        console.error('Error al cargar la actividad:', error);
      }
    };
    
    fetchActividad();
  }, [actividadId]);

  // Manejar subida de archivos
  const handleFileUpload = async (event) => {
    const files = event.target.files;
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);  // Agregar cada archivo al FormData
    }

    try {
      // Petición al backend para subir archivos y crear una tarea
      const response = await fetch(`/api/tareas`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const fileNames = data.files.map(file => file.name);  // Obtener nombres de los archivos subidos
        setUploadedFiles([...uploadedFiles, ...fileNames]);  // Actualizar el estado con los nuevos archivos
      } else {
        console.error('Error al subir archivos');
      }
    } catch (error) {
      console.error('Error al subir archivos:', error);
    }
  };

  // Manejar la entrega de la tarea
  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/tareas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          actividad: actividadId,  // ID de la actividad
          estudiante: estudianteId,  // ID del estudiante
          archivo: uploadedFiles,  // Archivos subidos por el estudiante
          fechaSubida: new Date(),
          retroalimentacion: '',  // Retroalimentación vacía al inicio
          calificacion: null,  // Calificación inicial nula
        }),
      });

      if (response.ok) {
        alert('Tarea entregada con éxito');
      } else {
        console.error('Error al entregar la tarea');
      }
    } catch (error) {
      console.error('Error al entregar la tarea:', error);
    }
  };

  return (
    <>
      <Navbar />

      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Container maxWidth="lg" sx={{ mt: 4, flexGrow: 1 }}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <div className="px-75" style={{ flexGrow: 1 }}>
              <Grid container spacing={2}>
                {/* Sección Principal Izquierda */}
                <Grid item xs={12} md={8}>
                  <Card>
                    <CardContent>
                      {/* Detalles de la actividad */}
                      {actividad ? (
                        <>
                          <Typography variant="h5" gutterBottom>
                            {actividad.titulo}
                          </Typography>
                          <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                            Fecha de entrega: {actividad.fechaEntrega}
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            {actividad.descripcion}
                          </Typography>

                          {/* Archivos agregados por el profesor */}
                          <Typography variant="h6" gutterBottom>
                            Documentos del Profesor
                          </Typography>
                          <List>
                            {professorFiles.map((file, index) => (
                              <ListItem key={index} button component="a" href={file.link}>
                                <ListItemText primary={file.name} />
                              </ListItem>
                            ))}
                          </List>
                        </>
                      ) : (
                        <Typography variant="body1">
                          Cargando actividad...
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>

                {/* Panel Derecho */}
                <Grid item xs={12} md={4}>
                  {/* Subir archivos */}
                  <Card sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Subir Documentos
                      </Typography>
                      <Button variant="contained" component="label" fullWidth>
                        Seleccionar Archivos
                        <input hidden type="file" multiple onChange={handleFileUpload} />
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Documentos subidos por el alumno */}
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Documentos Subidos
                      </Typography>
                      {uploadedFiles.length > 0 ? (
                        <List>
                          {uploadedFiles.map((file, index) => (
                            <ListItem key={index}>
                              <ListItemText primary={file} />
                            </ListItem>
                          ))}
                        </List>
                      ) : (
                        <Typography variant="body2" color="textSecondary">
                          No se han subido archivos.
                        </Typography>
                      )}
                    </CardContent>
                  </Card>

                  {/* Botón para enviar */}
                  <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={handleSubmit}>
                    Entregar
                  </Button>
                </Grid>
              </Grid>
            </div>
          </Paper>
        </Container>

        {/* Footer siempre en la parte inferior */}
        <Footer />
      </Box>
    </>
  );
};

export default Page;
