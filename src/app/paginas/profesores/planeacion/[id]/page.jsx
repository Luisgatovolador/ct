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

function Page() {
  const [asignaturas, setAsignaturas] = useState(null);
  const [planeaccion, setPlaneacion] = useState(null);
  const [actividades, setActividad] = useState([]);
  const { id } = useParams();
  const [openModal, setOpenModal] = useState(false);
  const [openPlaneacionModal, setOpenPlaneacionModal] = useState(false);
  const [newActivity, setNewActivity] = useState({
    titulo: "",
    descripcion: "",
    fechaInicio: "",
    archivo: "",
    fechaFin: "",
    planeacionID: id,
  });
  const [selectedActivity, setSelectedActivity] = useState(null);

  const [editPlaneacion, setEditPlaneacion] = useState({
    nombre: "",
    fechaComienzo: "",
    fechaFin: "",
    asignatura: id,
  });
  const modalStyle = {
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
          setEditPlaneacion({
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

  // Obtener las actividades relacionadas con la planeación
  useEffect(() => {
    const obtenerActividad = async () => {
      try {
        const response = await fetch(
          "https://control-de-tareas-backend-production.up.railway.app/api/actividad/"
        );
        const data = await response.json();
        const filtroActividadporPlaneacion = data.filter((actividad) =>
          id.includes(actividad.planeacionID)
        );
        setActividad(filtroActividadporPlaneacion);
      } catch (error) {
        console.error("Error al obtener las actividades:", error);
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

  // Función para actualizar la planeación existente
  const handleUpdatePlaneacion = async () => {
    try {
      const response = await fetch(
        `https://control-de-tareas-backend-production.up.railway.app/api/planeacion/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editPlaneacion),
        }
      );
      const result = await response.json();
      setPlaneacion(result);
      setOpenPlaneacionModal(false);
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
              {planeaccion ? planeaccion.nombre : "Cargando planeación..."}
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
                          Fecha de inicio: {activity.fechaInicio}
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
                          Fecha de entrega: {activity.fechaFin}
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
                          Descripción: {activity.descripcion}
                        </Typography>
                        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                          <Link href={`/paginas/profesores/actividad/${activity._id}`}>
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
                    sx={{ marginBottom: 2, width: "100%" }}
                  >
                    Agregar Actividad
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setOpenPlaneacionModal(true)}
                    sx={{ width: "100%" }}
                  >
                    Modificar Planeación
                  </Button>
                </Paper>
              </Grid>
            </Grid>
          </Paper>
        </div>
        <Footer />
      </Box>

{/* Modal para agregar/editar actividad */}
<Modal
  open={openModal}
  onClose={() => setOpenModal(false)}
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
>
  <Box sx={{ ...modalStyle, padding: 3 }}>
    <Typography id="modal-title" variant="h6" component="h2" sx={{ marginBottom: 2 }}>
      {selectedActivity ? "Editar Actividad" : "Agregar Actividad"}
    </Typography>

    <TextField
      fullWidth
      label="Título"
      margin="normal"
      variant="outlined"
      value={selectedActivity ? selectedActivity.titulo : newActivity.titulo}
      onChange={(e) =>
        selectedActivity
          ? setSelectedActivity({ ...selectedActivity, titulo: e.target.value })
          : setNewActivity({ ...newActivity, titulo: e.target.value })
      }
      InputLabelProps={{ shrink: true }} // Mantiene la etiqueta arriba
    />
    
    <TextField
      fullWidth
      label="Descripción"
      margin="normal"
      variant="outlined"
      value={selectedActivity ? selectedActivity.descripcion : newActivity.descripcion}
      onChange={(e) =>
        selectedActivity
          ? setSelectedActivity({ ...selectedActivity, descripcion: e.target.value })
          : setNewActivity({ ...newActivity, descripcion: e.target.value })
      }
      InputLabelProps={{ shrink: true }} // Mantiene la etiqueta arriba
    />
    
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <TextField
          fullWidth
          type="date"
          label="Fecha de inicio"
          margin="normal"
          variant="outlined"
          value={selectedActivity ? selectedActivity.fechaInicio.split("T")[0] : newActivity.fechaInicio}
          onChange={(e) =>
            selectedActivity
              ? setSelectedActivity({ ...selectedActivity, fechaInicio: e.target.value })
              : setNewActivity({ ...newActivity, fechaInicio: e.target.value })
          }
          InputLabelProps={{ shrink: true }} // Mantiene la etiqueta arriba
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          fullWidth
          type="date"
          label="Fecha de entrega"
          margin="normal"
          variant="outlined"
          value={selectedActivity ? selectedActivity.fechaFin.split("T")[0] : newActivity.fechaFin}
          onChange={(e) =>
            selectedActivity
              ? setSelectedActivity({ ...selectedActivity, fechaFin: e.target.value })
              : setNewActivity({ ...newActivity, fechaFin: e.target.value })
          }
          InputLabelProps={{ shrink: true }} // Mantiene la etiqueta arriba
        />
      </Grid>
    </Grid>

    {/* Campo para seleccionar archivo */}
    <Box sx={{ margin: 2 }}>
      <InputLabel htmlFor="file-input">Seleccionar archivo</InputLabel>
      <input
        id="file-input"
        type="file"
        accept=".pdf,.doc,.docx,.ppt,.pptx"
        style={{ marginTop: 8 }}
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) {
            selectedActivity
              ? setSelectedActivity({ ...selectedActivity, archivo: file })
              : setNewActivity({ ...newActivity, archivo: file });
          }
        }}
      />
    </Box>

    <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}>
      <Button variant="outlined" onClick={() => setOpenModal(false)} sx={{ marginRight: 1 }}>
        Cancelar
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={selectedActivity ? handleUpdateActivity : handleAddActivity}
      >
        {selectedActivity ? "Actualizar" : "Agregar"}
      </Button>
    </Box>
  </Box>
</Modal>


      {/* Modal para modificar planeación */}
      <Modal
        open={openPlaneacionModal}
        onClose={() => setOpenPlaneacionModal(false)}
        aria-labelledby="modal-planeacion-title"
        aria-describedby="modal-planeacion-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-planeacion-title" variant="h6" component="h2">
            Modificar Planeación
          </Typography>
          <TextField
            label="Nombre"
            value={editPlaneacion.nombre}
            onChange={(e) => setEditPlaneacion({ ...editPlaneacion, nombre: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Fecha Comienzo"
            type="date"
            value={editPlaneacion.fechaComienzo}
            onChange={(e) =>
              setEditPlaneacion({ ...editPlaneacion, fechaComienzo: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Fecha Fin"
            type="date"
            value={editPlaneacion.fechaFin}
            onChange={(e) =>
              setEditPlaneacion({ ...editPlaneacion, fechaFin: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <Button variant="contained" color="primary" onClick={handleUpdatePlaneacion}>
            Guardar Cambios
          </Button>
        </Box>
      </Modal>
    </>
  );
}

export default Page;
