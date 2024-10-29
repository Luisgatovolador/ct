"use client";
import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Modal,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Navbar from "@/components/Navbars/navbar";
import Footer from "@/components/footer/footer";
import Plot from "react-plotly.js";
import { getUser } from "@/services/auth";

const API_URL = "https://control-de-tareas-backend-production.up.railway.app/api";

const API_URL_PA_IMAGENES = "https://control-de-tareas-backend-production.up.railway.app/";

function Page() {
  const [user, setUser] = useState(null);
  const [dataUser, setDataUser] = useState({});
  const [asignaturas, setAsignaturas] = useState([]);
  const [actividades, setActividades] = useState([]);
  const [planeacion, setPlaneacion] = useState([]);
  const [tareasEnviadas, setTareasEnviadas] = useState([]);
  const [selectedActividad, setSelectedActividad] = useState(null);
  const [selectedTarea, setSelectedTarea] = useState(null);
  const [archivo, setArchivo] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [tareaEnviada, setTareaEnviada] = useState(false);

  useEffect(() => {
    const fetchedUser = getUser();
    if (fetchedUser) {
      setUser(fetchedUser);
      fetchData(fetchedUser.id);
    }
  }, []);

  const fetchData = async (userId) => {
    try {
      const alumno = await fetch(`${API_URL}/alumno/${userId}`);
      const alumnoData = await alumno.json();
      const tareas = await fetch(`${API_URL}/tarea?alumno=${userId}`);
      const tareasData = await tareas.json();
      const asignaturas = await fetch(`${API_URL}/asignatura`);
      const asignaturasData = await asignaturas.json();
      const planeaciones = await fetch(`${API_URL}/planeacion`);
      const planeacionData = await planeaciones.json();
      const actividades = await fetch(`${API_URL}/actividad`);
      const actividadesData = await actividades.json();

      setDataUser(alumnoData);
      setPlaneacion(planeacionData);
      setActividades(actividadesData);
      setTareasEnviadas(tareasData);

      // Filtrar las asignaturas del alumno
      const asignaturasFiltradas = asignaturasData.filter((asignatura) =>
        alumnoData.asignatura.includes(asignatura._id)
      );
      setAsignaturas(asignaturasFiltradas);

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleFileChange = (e) => {
    setArchivo(e.target.files[0]);
  };

  const openModal = (actividad) => {
    const tarea = tareasEnviadas.find((tarea) => tarea.actividad === actividad._id);
    setSelectedActividad(actividad);
    setSelectedTarea(tarea || null);
    setTareaEnviada(Boolean(tarea));
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedActividad(null);
    setSelectedTarea(null);
    setArchivo(null);
    setModalOpen(false);
  };

  const handleSubmit = async () => {
    if (!archivo || !selectedActividad) return;

    const formData = new FormData();
    formData.append("actividad", selectedActividad._id);
    formData.append("alumno", user.id);
    formData.append("archivo", archivo);
    formData.append("fechaSubida", new Date().toDateString());
    formData.append("retroalimentacion", "");
    formData.append("calificacion", 0);

    try {
      const response = await fetch(`${API_URL}/tarea`, {
        method: "POST",
        body: formData,
      });
      const tareaData = await response.json();

      await fetch(`${API_URL}/actividad/${selectedActividad._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tareas: [...selectedActividad.tareas, tareaData._id],
        }),
      });

      setTareaEnviada(true);
      setSelectedTarea(tareaData);
      closeModal();
    } catch (error) {
      console.error("Error submitting task:", error);
    }
  };

  const asignaturasAlumno = asignaturas.map((asignatura) => {
    const planeacionesAsignatura = planeacion.filter(
      (p) => p.asignatura === asignatura._id
    );

    const actividadesAsignatura = actividades.filter((actividad) =>
      planeacionesAsignatura.some((p) => p._id === actividad.planeacionID)
    );

    const actividadesPendientes = actividadesAsignatura.filter(
      (actividad) =>
        !tareasEnviadas.some((tarea) => tarea.actividad === actividad._id) &&
        new Date(actividad.fechaFin) > new Date()
    );

    const actividadesEntregadas = actividadesAsignatura.filter((actividad) =>
      tareasEnviadas.some((tarea) => tarea.actividad === actividad._id)
    );

    return {
      ...asignatura,
      actividadesPendientes,
      actividadesEntregadas,
    };
  });

  return (
    <>
      <Navbar />
      <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column"  }}>
        <div className="px-44" style={{ flexGrow: 1 }}>
        <Typography variant="h3" component="h2" gutterBottom sx={{marginTop:'2%', textAlign:'center',fontWeight: 'bold'}}>
              ASIGNATURAS
            </Typography>
          <Paper elevation={3} sx={{ padding: 2, width: '120%', marginTop:' 5%', marginLeft:'-10%' }}>
          
            {asignaturasAlumno.length > 0 ? (
              asignaturasAlumno.map((asignatura) => {
                const totalActividades =
                  asignatura.actividadesPendientes.length + asignatura.actividadesEntregadas.length;
                const avance = (asignatura.actividadesEntregadas.length / totalActividades) * 100;

                return (
                  <Accordion key={asignatura._id}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography sx={{fontSize:'150%'}}>{asignatura.nombre}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>{asignatura.descripcion}</Typography>

                      {/* Contenedor principal en "flex" para alinear los Box horizontalmente */}
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="flex-start"
                        mt={2}
                      >
                        {/* Box para las actividades a la izquierda */}
                        <Box flex={1} mr={2}>
                          <Typography variant="h6" sx={{fontWeight: 'bold'}}>
                            Actividades Pendientes:
                          </Typography>
                          {asignatura.actividadesPendientes.length > 0 ? (
                            asignatura.actividadesPendientes.map(
                              (actividad) => (
                                <Box key={actividad._id} mb={2}>
                                  <Typography>{actividad.titulo}</Typography>
                                  <Button
                                    variant="outlined"
                                    onClick={() => openModal(actividad)}
                                  >
                                    Ver Detalles 
                                  </Button>
                                </Box>
                              )
                            )
                          ) : (
                            <Typography variant="body2">
                              No tienes actividades pendientes.
                            </Typography>
                          )}

                          <Typography variant="h6" sx={{ mt: 2, fontWeight: 'bold'}}>
                            Actividades Entregadas:
                          </Typography>
                          {asignatura.actividadesEntregadas.length > 0 ? (
                            asignatura.actividadesEntregadas.map(
                              (actividad) => (
                                <Box key={actividad._id} mb={2}>
                                  <Typography >
                                    {actividad.titulo} (Entregada)
                                  </Typography>
                                  <Button
                                    variant="outlined"
                                    color="primary" 
                                    onClick={() => openModal(actividad)}
                                    sx= {{marginTop: '2%'}}

                                  >
                                    Ver Detalles
                                  </Button>
                                </Box>
                              )
                            )
                          ) : (
                            <Typography variant="body2">
                              No tienes actividades entregadas.
                            </Typography>
                          )}
                        </Box>

                        {/* Box para la gráfica a la derecha */}
                        <Box sx={{ width: 500 }}>
                          <Plot
                            data={[
                              {
                                values: [
                                  asignatura.actividadesEntregadas.length,
                                  asignatura.actividadesPendientes.length,
                                ],
                                labels: ["Entregadas", "Pendientes"],
                                type: "pie",
                              },
                            ]}
                            layout={{
                              title: `Avance: ${avance.toFixed(2)}%`,
                              height: 400, // Tamaño de la gráfica ajustado
                              width: 400,
                            }}
                          />
                        </Box>
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                );
              })
            ) : (
              <Typography>No tienes asignaturas registradas.</Typography>
            )}
          </Paper>
        </div>
        <Footer />
      </Box>

      <Modal open={modalOpen} onClose={closeModal}>
        <Box sx={{ padding: 4, backgroundColor: "white", maxWidth: 600, margin: "auto", mt: 10 }}>
          {selectedActividad && (
            <>
              <Typography variant="h6">{selectedActividad.titulo}</Typography>
              <Typography>{selectedActividad.descripcion}</Typography>
              <Typography>Fecha de entrega: {new Date(selectedActividad.fechaFin).toLocaleDateString()}</Typography>

              {tareaEnviada ? (
                <>
                  <Typography variant="h6">Detalles de la Tarea:</Typography>
                  <Typography>Calificación: {selectedTarea.calificacion}</Typography>
                  <Typography>
                    Retroalimentación:{" "}
                    {selectedTarea.retroalimentacion?.trim() || "Sin retroalimentación"}
                  </Typography>
                  {selectedTarea.archivo && (
                    <a href={`${API_URL_PA_IMAGENES}${selectedTarea.archivo}`} target="_blank" rel="noopener noreferrer">
                      Ver tarea
                      <img src="/fileImg.png" alt="Archivo" width={50} />
                    </a>
                  )}
                </>
              ) : (
                <>
                  <Typography variant="h6">Subir Tarea:    </Typography>
                  <input type="file" onChange={handleFileChange} />
                  <Button variant="contained" onClick={handleSubmit} disabled={tareaEnviada}>
                    Enviar Tarea
                  </Button>
                </>
              )}
            </>
          )}
        </Box>
      </Modal>
    </>
  );
}

export default Page;
