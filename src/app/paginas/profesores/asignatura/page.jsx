"use client";

import React from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Navbar from '@/components/Navbars/navbar';
import Footer from "@/components/footer/footer";
import { useRouter } from "next/navigation"; // Importa useRouter

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

function Page() {
  const router = useRouter(); // Hook para manejar la navegación

  const handleRedirect = () => {
    // Esta es la función que manejará la redirección
    router.push("/paginas/profesores/asignatura/[id]"); // Reemplaza [id] con la ruta específica
  };

  return (
    <>
      <Navbar />
      <br />
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div className="px-44" style={{ flexGrow: 1 }}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6" component="h3">
              {carreraInfo.name}
            </Typography>
          </Paper>
          <br />

          <Paper elevation={3} sx={{ padding: 2 }}>
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
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            marginTop: 1,
                          }}
                        >
                          <Button size="small" sx={{ marginTop: 1 }} onClick={handleRedirect}>
                            Ver Más
                          </Button>
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <br />
                <br />
                <br />
                <Paper elevation={4} sx={{ padding: 2 }}>
                  <Typography variant="h5" component="h2" gutterBottom>
                    Tareas Completadas
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Tarea 1
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Paper>
        </div>
        <Footer />
      </Box>
    </>
  );
}

export default Page;
