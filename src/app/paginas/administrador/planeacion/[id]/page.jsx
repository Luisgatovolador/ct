"use client";

import React, { useState, useEffect } from "react";
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
import Navbar from "@/components/Navbars/navbarprofesores/navbar";
import Footer from "@/components/footer/footer";
import Link from "next/link";
import { useParams } from "next/navigation";
import DateRangeIcon from "@mui/icons-material/DateRange";
import DescriptionIcon from "@mui/icons-material/Description";

const API_URL = "http:localhost:3001/api";
const API_URL_PA_IMAGENES = "http:localhost:3001/uploads/";

function Page() {
  const [planeacion, setPlaneacion] = useState(null);
  const [actividades, setActividades] = useState([]);
  const { id } = useParams();

  // Obtener la planeación
  useEffect(() => {
    const obtenerPlaneacion = async () => {
      if (id) {
        try {
          const response = await fetch(`${API_URL}/planeacion/${id}`);
          const data = await response.json();
          setPlaneacion(data);
        } catch (error) {
          console.error("Error al obtener la planeación:", error);
        }
      }
    };
    obtenerPlaneacion();
  }, [id]);

  // Actividades de la planeación
  useEffect(() => {
    const obtenerActividades = async () => {
      try {
        const response = await fetch(`${API_URL}/actividad/`);
        const data = await response.json();
        const filtroActividadPorPlaneacion = data.filter((actividad) =>
          id.includes(actividad.planeacionID)
        );
        setActividades(filtroActividadPorPlaneacion);
      } catch (error) {
        console.error("Error al obtener las actividades:", error);
      }
    };
    obtenerActividades();
  }, [id]);

  return (
    <>
      <Navbar />
      <br />
      <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <div className="px-44" style={{ flexGrow: 1 }}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6" component="h3">
              {planeacion ? planeacion.nombre : "Cargando planeación..."}
            </Typography>
          </Paper>
          <br />

          <Paper elevation={3} sx={{ padding: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                <Box sx={{ padding: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 2,
                    }}
                  >
                    <Typography variant="h4" component="h2" gutterBottom>
                      Actividades Creadas 
                    </Typography>
                  </Box>

                  {actividades.map((actividad, index) => (
                    <Accordion key={index}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={`panel${index}-content`}
                        id={`panel${index}-header`}
                      >
                        <Typography variant="h6" color="textPrimary">
                          {actividad.titulo}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails
                        sx={{
                          backgroundColor: "#f0f0f0",
                          borderRadius: "8px",
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: 1,
                          }}
                        >
                          <DateRangeIcon sx={{ marginRight: 1 }} />
                          Fecha de inicio: {new Date(actividad.fechaInicio).toLocaleDateString()}
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: 1,
                          }}
                        >
                          <DateRangeIcon sx={{ marginRight: 1 }} />
                          Fecha de entrega: {new Date(actividad.fechaFin).toLocaleDateString()}
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: 1,
                          }}
                        >
                          <DescriptionIcon sx={{ marginRight: 1 }} />
                          Descripción: {actividad.descripcion}
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: 1,
                          }}
                        >
                          <DescriptionIcon sx={{ marginRight: 1 }} />
                          Archivo : {actividad.archivo}
                        </Typography>
                        {actividad.archivo && (
                          <a href={`${API_URL_PA_IMAGENES}${actividad.archivo}`} target="_blank" rel="noopener noreferrer">
                            <img src="/fileImg.png" alt="Archivo" width={50} />
                          </a>
                        )}
                      
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </div>
      </Box>
      <Footer />
    </>
  );
}

export default Page;
