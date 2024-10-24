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
  Modal,
  TextField,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Navbar from "@/components/Navbars/navbarprofesores/navbar";
import Footer from "@/components/footer/footer";
import Link from "next/link";
import { useParams } from "next/navigation";
import DateRangeIcon from "@mui/icons-material/DateRange";
import DescriptionIcon from "@mui/icons-material/Description";

function Page() {
  const [planeacion, setPlaneacion] = useState(null); 
  const [actividades, setActividad] = useState([]); 
  const { id } = useParams(); 
  const [openModal, setOpenModal] = useState(false); 
  const [openPlaneacionModal, setOpenPlaneacionModal] = useState(false); 
  const [newActivity, setNewActivity] = useState({
    titulo: "",
    descripcion: "",
    fechaInicio: "",
    fechaFin: "",
    planeacionID: id, // Aquí se usa el ID de la planeación
  });
  const [selectedActivity, setSelectedActivity] = useState(null); 

  const [newPlaneacion, setNewPlaneacion] = useState({
    nombre: "",
    fechaComienzo: "",
    fechaFin: "",
    asignatura: id, 
  });

  // Obtener la planeación basada en el ID
  useEffect(() => {
    const obtenerPlaneacion = async () => {
      if (id) {
        try {
          const response = await fetch(
            `https://control-de-tareas-backend-production.up.railway.app/api/planeacion/${id}`
          );
          const data = await response.json();
          setPlaneacion(data);
        } catch (error) {
          console.error("Error al obtener la planeación:", error);
        }
      }
    };
    obtenerPlaneacion();
  }, [id]);

  // Obtener las actividades relacionadas con la planeación
  useEffect(() => {
    const obtenerActividad = async () => {
      try {
        const response = await fetch(
          "https://control-de-tareas-backend-production.up.railway.app/api/actividad/"
        );
        const data = await response.json();
        const filtroActividadPorPlaneacion = data.filter((actividad) =>
          id.includes(actividad.planeacionID)
        );
        setActividad(filtroActividadPorPlaneacion);
      } catch (error) {
        console.error("Error al obtener tarea:", error);
      }
    };
    obtenerActividad();
  }, [id]);

  // Función para agregar nueva actividad
  const handleAddActivity = async () => {
    try {
      const response = await fetch(
        "https://control-de-tareas-backend-production.up.railway.app/api/actividad/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newActivity),
        }
      );
      const result = await response.json();
      setActividad([...actividades, result]); 
      setOpenModal(false);
    } catch (error) {
      console.error("Error al agregar la actividad:", error);
    }
  };

  // Función para editar una actividad seleccionada
  const handleEditActivity = (activity) => {
    setSelectedActivity(activity);
    setOpenModal(true);
  };

  // Función para actualizar la actividad seleccionada
  const handleUpdateActivity = async () => {
    if (selectedActivity) {
      try {
        const response = await fetch(
          `https://control-de-tareas-backend-production.up.railway.app/api/actividad/${selectedActivity._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(selectedActivity),
          }
        );
        const result = await response.json();
        setActividad((prevActividades) =>
          prevActividades.map((activity) =>
            activity._id === result._id ? result : activity
          )
        );
        setOpenModal(false); 
      } catch (error) {
        console.error("Error al actualizar la actividad:", error);
      }
    }
  };

  return (
    <>
      <Navbar />
      <br />
      <Box
        sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
      >
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
                      Actividades Pendientes
                    </Typography>
                  </Box>

                  {actividades.map((activity, index) => (
                    <Accordion key={index}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={`panel${index}-content`}
                        id={`panel${index}-header`}
                      >
                        <Typography variant="h6" color="textPrimary">
                          {activity.titulo}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails sx={{ backgroundColor: "#f0f0f0", borderRadius: "8px" }}>
                        <Typography variant="body1" sx={{ display: "flex", alignItems: "center", marginBottom: 1 }}>
                          <DateRangeIcon sx={{ marginRight: 1 }} /> 
                          Fecha de inicio: {activity.fechaInicio}
                        </Typography>
                        <Typography variant="body1" sx={{ display: "flex", alignItems: "center", marginBottom: 1 }}>
                          <DateRangeIcon sx={{ marginRight: 1 }} /> 
                          Fecha de entrega: {activity.fechaFin}
                        </Typography>
                        <Typography variant="body1" sx={{ display: "flex", alignItems: "center", marginBottom: 1 }}>
                          <DescriptionIcon sx={{ marginRight: 1 }} /> 
                          Descripción: {activity.descripcion}
                        </Typography>
                        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                          <Link href={`/paginas/profesores/actividad/${activity._id}`}>
                            <Button variant="outlined" size="small" sx={{ marginRight: 1 }}>
                              Ver Más
                            </Button>
                          </Link>
                          <Button
                            variant="outlined"
                            size="small"
                            color="secondary"
                            onClick={() => handleEditActivity(activity)}
                          >
                            Editar
                          </Button>
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <Paper
                  elevation={4}
                  sx={{
                    padding: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "stretch",
                    justifyContent: "flex-start",
                    height: "100%",
                  }}
                >
                  <Typography variant="h5" component="h2" gutterBottom>
                    Actividades Completadas
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setOpenModal(true)}
                    sx={{ marginBottom: 2, width: "100%" }} // Ocupa todo el ancho
                  >
                    Agregar Actividad
                  </Button>
                </Paper>
              </Grid>
            </Grid>
          </Paper>
        </div>
        <Footer />
      </Box>

      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-title" variant="h6" component="h2">
            {selectedActivity ? "Editar Actividad" : "Agregar Actividad"}
          </Typography>

          <TextField
            label="Título"
            fullWidth
            value={newActivity.titulo}
            onChange={(e) => setNewActivity({ ...newActivity, titulo: e.target.value })}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Descripción"
            fullWidth
            value={newActivity.descripcion}
            onChange={(e) => setNewActivity({ ...newActivity, descripcion: e.target.value })}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Fecha de Inicio"
            fullWidth
            type="date"
            value={newActivity.fechaInicio}
            onChange={(e) => setNewActivity({ ...newActivity, fechaInicio: e.target.value })}
            sx={{ marginBottom: 2 }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Fecha de Entrega"
            fullWidth
            type="date"
            value={newActivity.fechaFin}
            onChange={(e) => setNewActivity({ ...newActivity, fechaFin: e.target.value })}
            sx={{ marginBottom: 2 }}
            InputLabelProps={{ shrink: true }}
          />

          <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}>
            <Button onClick={() => setOpenModal(false)} sx={{ marginRight: 1 }}>
              Cancelar
            </Button>
            <Button variant="contained" onClick={handleAddActivity}>
              {selectedActivity ? "Guardar Cambios" : "Agregar"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}

export default Page;
