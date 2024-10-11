"use client";

import React, { useState } from 'react';
import { Container, Grid, Card, CardContent, Typography, Button, List, ListItem, ListItemText, Box } from '@mui/material';
import Navbar from '@/components/navbar/navbar';
import Footer from '@/components/footer/footer';
import Paper from "@mui/material/Paper";

const ActivityPage = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [professorFiles] = useState([
    { name: "Documento del Profesor 1", link: "#" },
    { name: "Documento del Profesor 2", link: "#" },
  ]);

  const handleFileUpload = (event) => {
    const files = event.target.files;
    const newFiles = [];
    for (let i = 0; i < files.length; i++) {
      newFiles.push(files[i].name);
    }
    setUploadedFiles([...uploadedFiles, ...newFiles]);
  };

  return (
    <>
      <Navbar></Navbar>
      
      
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
                  <Typography variant="h5" gutterBottom>
                    Título de la Actividad
                  </Typography>
                  <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                    Fecha de entrega: 20 de Octubre de 2024
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Descripción de la actividad. Aquí se muestra una descripción detallada de la tarea que el alumno debe realizar.
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
              <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
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

export default ActivityPage;
