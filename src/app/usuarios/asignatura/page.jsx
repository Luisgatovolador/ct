"use client";
import React from 'react'
import { Box, Grid, Paper, Typography, Accordion, AccordionSummary, AccordionDetails, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Navbar from '@/components/navbar/navbar';

const activities = [
  {
    title: "Actividad 1",
    description: "Descripción de la actividad 1.",
  },
  {
    title: "Actividad 2",
    description: "Descripción de la actividad 2.",
  },
  {
    title: "Actividad 3",
    description: "Descripción de la actividad 3.",
  },
];

const carreraInfo = {
  name: "Ingeniería en Desarrollo y Gestión de Software",
  description: "La carrera se enfoca en la creación y gestión de software.",
  semester: "Séptimo Semestre",
};

function page() {
  return (
    <>
    <Navbar/>
    <br/>
    <div className='px-44'>
    <Paper elevation={3} sx={{ padding: 2 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Información de la Carrera
          </Typography>
          <Typography variant="h6" component="h3">
            {carreraInfo.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {carreraInfo.description}
          </Typography>
          <Typography variant="body1">
            Semestre: {carreraInfo.semester}
          </Typography>
        </Paper>
    <Grid container spacing={2}>
      <Grid item xs={12} md={8}>
      
        
        <Box sx={{ padding: 2 }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Tareas Pendientes
          </Typography>
          {activities.map((activity, index) => (
            <Accordion key={index}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${index}-content`}
                id={`panel${index}-header`}
              >
                <Typography>{activity.title}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>{activity.description}</Typography>
                <Box sx={{ marginTop: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Progreso:
                  </Typography>
                  <Button variant="contained" color="primary" sx={{ marginTop: 1 }}>
                    Actualizar Progreso
                  </Button>
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Grid>
     
      <Grid item xs={12} md={4}>
      <br/>
      <br/>
      <br/>
      <Paper elevation={4} sx={{ padding: 2 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Información de la Carrera
          </Typography>
          <Typography variant="h6" component="h3">
            {carreraInfo.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {carreraInfo.description}
          </Typography>
          <Typography variant="body1">
            Semestre: {carreraInfo.semester}
          </Typography>
        </Paper>
      </Grid>
    </Grid>
    </div>
    </>
  )
}

export default page