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
  const [asignaturas, setAsignaturas] = useState(null); // Asignatura específica
  const [actividades, setActividad] = useState([]); // Actividades de la asignatura
  const { id } = useParams(); // Obtener el ID de la URL
  const [openModal, setOpenModal] = useState(false); // Estado para el modal de actividad
  const [openPlaneacionModal, setOpenPlaneacionModal] = useState(false); // Estado para el modal de planeación
  const [newActivity, setNewActivity] = useState({
    titulo: "",
    descripcion: "",
    fechaInicio: "",
    fechaFin: "",
    planeacionID: id, // Usar el ID de la asignatura como referencia
  });
  const [selectedActivity, setSelectedActivity] = useState(null); // Para actividad seleccionada

  const [newPlaneacion, setNewPlaneacion] = useState({
    nombre: "",
    fechaComienzo: "",
    fechaFin: "",
    asignatura: id, // ID de la asignatura a la que pertenece la planeación
  });

  // Obtener la asignatura basada en el ID
  useEffect(() => {
    const obtenerAsignatura = async () => {
      if (id) {
        try {
          const response = await fetch(
            `https://control-de-tareas-backend-production.up.railway.app/api/asignatura/${id}`
          );
          const data = await response.json();
          setAsignaturas(data);
        } catch (error) {
          console.error("Error al obtener la asignatura:", error);
        }
      }
    };
    obtenerAsignatura();
  }, [id]);

  // Obtener las actividades relacionadas con la asignatura
  useEffect(() => {
    const obtenerActividad = async () => {
      try {
        const response = await fetch(
          "https://control-de-tareas-backend-production.up.railway.app/api/actividad/"
        );
        const data = await response.json();
        const filtroActividadporAsignarutas = data.filter((actividad)=>
        id.includes(actividad.planeacionID)
        );
        setActividad(filtroActividadporAsignarutas);
      } catch (error) {
        console.error("Error al obtener tarea:", error);
      }
    };
    obtenerActividad();
  }, []); // Solo carga las actividades al montar el componente

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
      setActividad([...actividades, result]); // Actualiza el estado de actividades
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
        // Actualiza la lista de actividades con la actividad modificada
        setActividad((prevActividades) =>
          prevActividades.map((activity) =>
            activity._id === result._id ? result : activity
          )
        );
        setOpenModal(false); // Cierra el modal después de actualizar
      } catch (error) {
        console.error("Error al actualizar la actividad:", error);
      }
    }
  };

  // Función para agregar nueva planeación
  const handleAddPlaneacion = async () => {
    try {
      const response = await fetch(
        "https://control-de-tareas-backend-production.up.railway.app/api/planeacion/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newPlaneacion),
        }
      );
      const result = await response.json();
      setOpenPlaneacionModal(false); // Cerrar el modal
    } catch (error) {
      console.error("Error al agregar la planeación:", error);
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
              {asignaturas ? asignaturas.nombre : "Cargando asignatura..."}
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
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setOpenPlaneacionModal(true)}
                    sx={{ width: "100%" }} // Ocupa todo el ancho
                  >
                    Agregar Planeación
                  </Button>
                </Paper>
              </Grid>
            </Grid>
          </Paper>
        </div>
        <Footer />
      </Box>

      {/* Modal para agregar o editar una actividad */}
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
            {selectedActivity ? "Editar Actividad" : "Agregar Nueva Actividad"}
          </Typography>
          <TextField
            label="Título de la actividad"
            fullWidth
            sx={{ marginBottom: 2 }}
            value={selectedActivity ? selectedActivity.titulo : newActivity.titulo}
            onChange={(e) =>
              selectedActivity
                ? setSelectedActivity({
                    ...selectedActivity,
                    titulo: e.target.value,
                  })
                : setNewActivity({ ...newActivity, titulo: e.target.value })
            }
          />
          <TextField
            label="Descripción de la actividad"
            fullWidth
            sx={{ marginBottom: 2 }}
            value={selectedActivity ? selectedActivity.descripcion : newActivity.descripcion}
            onChange={(e) =>
              selectedActivity
                ? setSelectedActivity({
                    ...selectedActivity,
                    descripcion: e.target.value,
                  })
                : setNewActivity({ ...newActivity, descripcion: e.target.value })
            }
          />
          <TextField
            label="Fecha de Inicio"
            fullWidth
            type="date"
            sx={{ marginBottom: 2 }}
            InputLabelProps={{ shrink: true }}
            value={selectedActivity ? selectedActivity.fechaInicio : newActivity.fechaInicio}
            onChange={(e) =>
              selectedActivity
                ? setSelectedActivity({
                    ...selectedActivity,
                    fechaInicio: e.target.value,
                  })
                : setNewActivity({ ...newActivity, fechaInicio: e.target.value })
            }
          />
          <TextField
            label="Fecha de Fin"
            fullWidth
            type="date"
            sx={{ marginBottom: 2 }}
            InputLabelProps={{ shrink: true }}
            value={selectedActivity ? selectedActivity.fechaFin : newActivity.fechaFin}
            onChange={(e) =>
              selectedActivity
                ? setSelectedActivity({
                    ...selectedActivity,
                    fechaFin: e.target.value,
                  })
                : setNewActivity({ ...newActivity, fechaFin: e.target.value })
            }
          />
          <Button
            variant="contained"
            color="primary"
            onClick={selectedActivity ? handleUpdateActivity : handleAddActivity}
          >
            {selectedActivity ? "Actualizar Actividad" : "Guardar Actividad"}
          </Button>
        </Box>
      </Modal>

      {/* Modal para agregar planeación */}
      <Modal
        open={openPlaneacionModal}
        onClose={() => setOpenPlaneacionModal(false)}
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
            Agregar Planeación
          </Typography>
          <TextField
            label="Nombre de la Planeación"
            fullWidth
            sx={{ marginBottom: 2 }}
            value={newPlaneacion.nombre}
            onChange={(e) =>
              setNewPlaneacion({ ...newPlaneacion, nombre: e.target.value })
            }
          />
          <TextField
            label="Fecha de Comienzo"
            fullWidth
            type="date"
            sx={{ marginBottom: 2 }}
            InputLabelProps={{ shrink: true }}
            value={newPlaneacion.fechaComienzo}
            onChange={(e) =>
              setNewPlaneacion({
                ...newPlaneacion,
                fechaComienzo: e.target.value,
              })
            }
          />
          <TextField
            label="Fecha de Fin"
            fullWidth
            type="date"
            sx={{ marginBottom: 2 }}
            InputLabelProps={{ shrink: true }}
            value={newPlaneacion.fechaFin}
            onChange={(e) =>
              setNewPlaneacion({
                ...newPlaneacion,
                fechaFin: e.target.value,
              })
            }
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddPlaneacion}
          >
            Guardar Planeación
          </Button>
        </Box>
      </Modal>
    </>
  );
}

export default Page;
