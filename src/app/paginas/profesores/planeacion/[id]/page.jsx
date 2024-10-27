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
  InputLabel
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Navbar from "@/components/Navbars/navbarprofesores/navbar";
import Footer from "@/components/footer/footer";
import Link from "next/link";
import { useParams } from "next/navigation";
import DateRangeIcon from "@mui/icons-material/DateRange";
import DescriptionIcon from "@mui/icons-material/Description";

const API_URL =
  "https://control-de-tareas-backend-production.up.railway.app/api";


function Page() {
  const [planeacion, setPlaneacion] = useState(null);
  const [actividades, setActividades] = useState([]);
  const { id } = useParams();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalPlaneacionAbierto, setModalPlaneacionAbierto] = useState(false);
  const [nuevaActividad, setNuevaActividad] = useState({
    titulo: "",
    descripcion: "",
    fechaInicio: "",
    archivo: "",
    fechaFin: "",
    planeacionID: id,
  });
  const [actividadSeleccionada, setActividadSeleccionada] = useState(null);
  const [editarPlaneacion, setEditarPlaneacion] = useState({
    nombre: "",
    fechaComienzo: "",
    fechaFin: "",
    asignatura: id,
  });
  const estiloModal = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  // Obtener la planeación 
  useEffect(() => {
    const obtenerPlaneacion = async () => {
      if (id) {
        try {
          const response = await fetch(
            `${API_URL}/planeacion/${id}`
          );
          const data = await response.json();
          setPlaneacion(data);
          setEditarPlaneacion({
            nombre: data.nombre,
            fechaComienzo: data.fechaComienzo.split("T")[0],
            fechaFin: data.fechaFin.split("T")[0],
          });
        } catch (error) {
          console.error("Error al obtener la planeación:", error);
        }
      }
    };
    obtenerPlaneacion();
  }, [id]);

  // actividades de la planeación
  useEffect(() => {
    const obtenerActividades = async () => {
      try {
        const response = await fetch(
          `${API_URL}/actividad/`
        );
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

  // Función para agregar nueva actividad
  const manejarAgregarActividad = async () => {
    try {
      const response = await fetch(
        `${API_URL}/actividad/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(nuevaActividad),
        }
      );
      const resultado = await response.json();
      setActividades([...actividades, resultado]);
      setModalAbierto(false);
    } catch (error) {
      console.error("Error al agregar la actividad:", error);
    }
  };

  // Función para editar una actividad seleccionada
  const manejarEditarActividad = (actividad) => {
    setActividadSeleccionada(actividad);
    setModalAbierto(true);
  };

  // actualizar la actividad seleccionada
  const manejarActualizarActividad = async () => {
    if (actividadSeleccionada) {
      try {
        const response = await fetch(
         `${API_URL}/actividad/${actividadSeleccionada._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(actividadSeleccionada),
          }
        );
        const resultado = await response.json();

        setActividades((prevActividades) =>
          prevActividades.map((actividad) =>
            actividad._id === resultado._id ? resultado : actividad
          )
        );
        setModalAbierto(false);
      } catch (error) {
        console.error("Error al actualizar la actividad:", error);
      }
    }
  };

  // Función para actualizar la planeación 
  const manejarActualizarPlaneacion = async () => {
    try {
      const response = await fetch(
        `${API_URL}/planeacion/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editarPlaneacion),
        }
      );
      const resultado = await response.json();
      setPlaneacion(resultado);
      setModalPlaneacionAbierto(false);
    } catch (error) {
      console.error("Error al modificar la planeación:", error);
    }
  };

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
                          Fecha de inicio: {actividad.fechaInicio}
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
                          Fecha de entrega: {actividad.fechaFin}
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
                        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                          <Link href={`/paginas/profesores/actividad/${actividad._id}`}>
                            <Button
                              variant="outlined"
                              size="small"
                              sx={{ marginRight: 1 }}
                            >
                              Ver Más
                            </Button>
                          </Link>
                          <Button
                            variant="outlined"
                            size="small"
                            color="secondary"
                            onClick={() => manejarEditarActividad(actividad)}
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
                    Gestión de Actividades 
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setModalAbierto(true)}
                    sx={{ marginBottom: 2, width: "100%" }}
                  >
                    Agregar Actividad
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setModalPlaneacionAbierto(true)}
                    sx={{ width: "100%" }}
                  >
                    Editar Planeación
                  </Button>
                </Paper>
              </Grid>
            </Grid>
          </Paper>
        </div>

        {/* Modal para agregar o editar actividad */}
        <Modal
          open={modalAbierto}
          onClose={() => setModalAbierto(false)}
        >
          <Box sx={estiloModal}>
            <Typography variant="h6" component="h2">
              {actividadSeleccionada ? "Editar Actividad" : "Agregar Actividad"}
            </Typography>
            <TextField
              label="Título"
              value={actividadSeleccionada ? actividadSeleccionada.titulo : nuevaActividad.titulo}
              onChange={(e) => {
                const valor = e.target.value;
                if (actividadSeleccionada) {
                  setActividadSeleccionada({ ...actividadSeleccionada, titulo: valor });
                } else {
                  setNuevaActividad({ ...nuevaActividad, titulo: valor });
                }
              }}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Descripción"
              value={actividadSeleccionada ? actividadSeleccionada.descripcion : nuevaActividad.descripcion}
              onChange={(e) => {
                const valor = e.target.value;
                if (actividadSeleccionada) {
                  setActividadSeleccionada({ ...actividadSeleccionada, descripcion: valor });
                } else {
                  setNuevaActividad({ ...nuevaActividad, descripcion: valor });
                }
              }}
              fullWidth
              margin="normal"
            />
            <TextField
              type="date"
              label="Fecha de Inicio"
              value={actividadSeleccionada ? actividadSeleccionada.fechaInicio.split("T")[0] : nuevaActividad.fechaInicio}
              onChange={(e) => {
                const valor = e.target.value;
                if (actividadSeleccionada) {
                  setActividadSeleccionada({ ...actividadSeleccionada, fechaInicio: valor });
                } else {
                  setNuevaActividad({ ...nuevaActividad, fechaInicio: valor });
                }
              }}
              fullWidth
              margin="normal"
            />
            <TextField
              type="date"
              label="Fecha de Entrega"
              value={actividadSeleccionada ? actividadSeleccionada.fechaFin.split("T")[0] : nuevaActividad.fechaFin}
              onChange={(e) => {
                const valor = e.target.value;
                if (actividadSeleccionada) {
                  setActividadSeleccionada({ ...actividadSeleccionada, fechaFin: valor });
                } else {
                  setNuevaActividad({ ...nuevaActividad, fechaFin: valor });
                }
              }}
              fullWidth
              margin="normal"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={actividadSeleccionada ? manejarActualizarActividad : manejarAgregarActividad}
              sx={{ marginTop: 2 }}
            >
              {actividadSeleccionada ? "Actualizar" : "Agregar"}
            </Button>
          </Box>
        </Modal>

        {/* Modal para editar planeación */}
        <Modal
          open={modalPlaneacionAbierto}
          onClose={() => setModalPlaneacionAbierto(false)}
        >
          <Box sx={estiloModal}>
            <Typography variant="h6" component="h2">
              Editar Planeación
            </Typography>
            <TextField
              label="Nombre"
              value={editarPlaneacion.nombre}
              onChange={(e) => setEditarPlaneacion({ ...editarPlaneacion, nombre: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              type="date"
              label="Fecha de Comienzo"
              value={editarPlaneacion.fechaComienzo}
              onChange={(e) => setEditarPlaneacion({ ...editarPlaneacion, fechaComienzo: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              type="date"
              label="Fecha de Fin"
              value={editarPlaneacion.fechaFin}
              onChange={(e) => setEditarPlaneacion({ ...editarPlaneacion, fechaFin: e.target.value })}
              fullWidth
              margin="normal"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={manejarActualizarPlaneacion}
              sx={{ marginTop: 2 }}
            >
              Actualizar Planeación
            </Button>
          </Box>
        </Modal>
      </Box>
      <Footer />
    </>
  );
}

export default Page;
