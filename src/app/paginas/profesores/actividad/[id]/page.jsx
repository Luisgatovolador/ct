"use client";

import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  TextField,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  MenuItem,
  Snackbar,
  Pagination,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Navbar from "@/components/Navbars/navbar";
import Footer from "@/components/footer/footer";
import { useParams } from "next/navigation";

const API_URL =
  "https://control-de-tareas-backend-production.up.railway.app/api";
const API_URL_PA_IMAGENES =
  "https://control-de-tareas-backend-production.up.railway.app/uploads/";

const Page = () => {
  const [busquedaAlumno, setBusquedaAlumno] = useState("");
  const [actividad, setActividad] = useState({});
  const [filtroEstado, setFiltroEstado] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const tareasPorPagina = 5;
  const { id } = useParams();
  const [tareas, setTareas] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [calificacionTemp, setCalificacionTemp] = useState({});
  const [retroalimentacionTemp, setRetroalimentacionTemp] = useState({});
  const [estadoTemp, setEstadoTemp] = useState({});

  useEffect(() => {
    const obtenerActividad = async () => {
      if (id) {
        try {
          const response = await fetch(`${API_URL}/actividad/${id}`);
          const data = await response.json();
          setActividad(data);
        } catch (error) {
          console.error("Error al obtener la actividad:", error);
        }
      }
    };
    obtenerActividad();
  }, [id]);

  useEffect(() => {
    const obtenerTareas = async () => {
      try {
        const response = await fetch(`${API_URL}/tarea/`);
        const data = await response.json();
        const tareasFiltradas = data.filter((tarea) => tarea.actividad === id);
        const tareasConNombreAlumno = await Promise.all(
          tareasFiltradas.map(async (tarea) => {
            const response = await fetch(`${API_URL}/alumno/${tarea.alumno}`);
            const dataAlumnos = await response.json();
            return {
              ...tarea,
              NombredelAlumno: dataAlumnos.nombre,
            };
          })
        );
        setTareas(tareasConNombreAlumno);
      } catch (error) {
        console.error("Error al obtener las tareas", error);
      }
    };

    obtenerTareas();
  }, [id]);

  const manejarCalificacion = async (tareaID) => {
    const calificacion = calificacionTemp[tareaID] || 0;
    const retroalimentacion = retroalimentacionTemp[tareaID] || "";
    const estado = estadoTemp[tareaID] || "Revisado";

    try {
      const response = await fetch(`${API_URL}/tarea/${tareaID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ calificacion, retroalimentacion, estado }),
      });

      if (!response.ok) {
        throw new Error("Error al guardar la calificación");
      }

      const tareaActualizada = await response.json();

      const nuevasTareas = tareas.map((tarea) =>
        tarea._id === tareaID
          ? { ...tarea, calificacion, retroalimentacion, estado }
          : tarea
      );

      setTareas(nuevasTareas);
      setSnackbarMessage("Calificación guardada con éxito");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error al calificar la tarea", error);
      setSnackbarMessage("Error al guardar la calificación");
      setSnackbarOpen(true);
    }
  };

  const tareasFiltradas = tareas.filter(
    (tarea) =>
      tarea.NombredelAlumno.toLowerCase().includes(
        busquedaAlumno.toLowerCase()
      ) &&
      (filtroEstado === "" || tarea.estado === filtroEstado)
  );

  const inicioPagina = (paginaActual - 1) * tareasPorPagina;

  const tareasPaginadas = tareasFiltradas.slice(
    inicioPagina,
    inicioPagina + tareasPorPagina
  );
  const totalPaginas = Math.ceil(tareasFiltradas.length / tareasPorPagina);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Navbar />
      <Box
        sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
      >
        <Container maxWidth="lg" sx={{ mt: 4, flexGrow: 1 }}>
          <Typography variant="h4" component="h2" gutterBottom>
            {actividad.titulo}
          </Typography>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <TextField
                  select
                  label="Estado"
                  variant="outlined"
                  fullWidth
                  value={filtroEstado}
                  onChange={(e) => setFiltroEstado(e.target.value)}
                >
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value="Pendiente">Pendiente</MenuItem>
                  <MenuItem value="Revisado">Revisado</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Buscar alumno"
                  variant="outlined"
                  fullWidth
                  value={busquedaAlumno}
                  onChange={(e) => setBusquedaAlumno(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ height: "100%" }}
                  onClick={() => setPaginaActual(1)}
                >
                  Buscar
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Container>

        <Container maxWidth="lg" sx={{ mt: 4, flexGrow: 1, minHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h5" component="h3" gutterBottom>
              Tareas de los Alumnos
            </Typography>
            <Box sx={{ padding: 2 }}>
              {tareasPaginadas.length > 0 ? (
                tareasPaginadas.map((tarea, index) => (
                  <Accordion key={tarea._id}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls={`panel${index}-content`}
                      id={`panel${index}-header`}
                    >
                      <Typography>{tarea.NombredelAlumno}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <div className="grid grid-cols-2 gap-10">
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            flexGrow: 1,
                          }}
                        >
                          <Typography variant="h6">
                            Detalles de la Tarea
                          </Typography>
                          <br />
                          <Typography>
                            Nombre de la actividad: {actividad.titulo}
                          </Typography>
                          <Typography>
                            Instrucciones de la actividad:
                          </Typography>
                          <Typography>{actividad.descripcion}</Typography>
                          <Typography>
                            Fecha de entrega: {tarea.fechaSubida}
                          </Typography>
                          <br />
                          <Typography>Archivo:{tarea.archivo}</Typography>
                          <Typography variant="body2">
                            {tarea.archivo && (
                              <a
                                href={`${API_URL_PA_IMAGENES}${tarea.archivo}`}
                                target="_blank"
                                text align-self-center
                                rel="noopener noreferrer"
                              >
                                <img
                                  src="/fileImg.png"
                                  alt="Archivo"
                                  width={50}
                                />
                              </a>
                            )}
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            flexGrow: 1,
                          }}
                        >
                          <Typography variant="h6">Calificar Tarea</Typography>
                          <TextField
                            label="Calificación"
                            variant="outlined"
                            type="number"
                            fullWidth
                            inputProps={{ min: 0, max: 10 }}
                            value={
                              calificacionTemp[tarea._id] !== undefined
                                ? calificacionTemp[tarea._id]
                                : tarea.calificacion
                            }
                            onChange={(e) => {
                              const value = e.target.value;
                              setCalificacionTemp((prev) => ({
                                ...prev,
                                [tarea._id]: value,
                              }));
                            }}
                          />
                          <br />
                          <TextField
                            label="Retroalimentación"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={4}
                            value={
                              retroalimentacionTemp[tarea._id] !== undefined
                                ? retroalimentacionTemp[tarea._id]
                                : tarea.retroalimentacion
                            }
                            onChange={(e) => {
                              const value = e.target.value;
                              setRetroalimentacionTemp((prev) => ({
                                ...prev,
                                [tarea._id]: value,
                              }));
                            }}
                          />
                          <br />
                          <TextField
                            label="Estado"
                            variant="outlined"
                            disabled
                            fullWidth
                            value={
                              estadoTemp[tarea._id] !== undefined
                                ? estadoTemp[tarea._id]
                                : tarea.estado
                            }
                            onChange={(e) => {
                              const value = e.target.value;
                              setEstadoTemp((prev) => ({
                                ...prev,
                                [tarea._id]: value,
                              }));
                            }}
                          />
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => manejarCalificacion(tarea._id)}
                            sx={{ mt: 2 }}
                          >
                            Guardar Calificación
                          </Button>
                        </Box>
                      </div>
                    </AccordionDetails>
                  </Accordion>
                ))
              ) : (
                <Typography>No hay tareas disponibles.</Typography>
              )}
            </Box>
          </Paper>
        </Container>

        <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
          <Pagination
            count={totalPaginas}
            page={paginaActual}
            onChange={(event, value) => setPaginaActual(value)}
            color="primary"
          />
        </Box>
      </Box>
      <Footer />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </>
  );
};

export default Page;
