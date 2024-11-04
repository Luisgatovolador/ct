"use client"

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
import DescriptionIcon from "@mui/icons-material/Description";

const API_URL = "https://control-de-tareas-backend-production-222f.up.railway.app/api";
const API_URL_PA_IMAGENES = "https://control-de-tareas-backend-production-222f.up.railway.app/uploads/";

function Page() {
  const [user, setUser] = useState(null);
  const [actividades, setActividades] = useState([]);
  const [planeacion, setPlaneacion] = useState([]);
  const [tareasEnviadas, setTareasEnviadas] = useState([]);
  const [selectedActividad, setSelectedActividad] = useState(null);
  const [archivo, setArchivo] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [tareaEnviada, setTareaEnviada] = useState(false);

  useEffect(() => {
    const fetchedUser = getUser();
    if (fetchedUser) {
      setUser(fetchedUser);
      obtenerDatos(fetchedUser.id);
    }
  }, []);

  const obtenerDatos = async (idUsuario) => {
    try {
      const respuestaAlumno = await fetch(`${API_URL}/alumno/${idUsuario}`);
      const datosAlumno = await respuestaAlumno.json();

      const respuestaActividades = await fetch(`${API_URL}/actividad`);
      const datosActividades = await respuestaActividades.json();

      if (datosAlumno.planeacionID && datosActividades.length > 0) {
        const actividadesFiltradas = datosActividades.filter((actividad) =>
          datosAlumno.planeacionID.includes(actividad.planeacionID)
        );

        setActividades(actividadesFiltradas);
        console.log("Actividades Filtradas:", actividadesFiltradas);
      }

      const respuestaPlaneaciones = await fetch(`${API_URL}/planeacion`);
      const datosPlaneaciones = await respuestaPlaneaciones.json();

      setPlaneacion(datosPlaneaciones.filter((planeacion) =>
        datosAlumno.planeacionID.includes(planeacion._id)
      ));

      const respuestaTarea = await fetch(`${API_URL}/tarea`);
      const datosTarea = await respuestaTarea.json();

      setTareasEnviadas(datosTarea.filter(tarea => tarea.alumno === idUsuario)); // Filtrar tareas del usuario
      console.log("Tareas Enviadas:", datosTarea);

    } catch (error) {
      console.error("Error al cargar las actividades o planeaciones:", error);
    }
  };

  const handleFileChange = (e) => {
    setArchivo(e.target.files[0]);
  };

  const openModal = (actividad) => {
    const tarea = tareasEnviadas.find((tarea) => tarea.actividad === actividad._id);
    setSelectedActividad(actividad);
    setTareaEnviada(Boolean(tarea));
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedActividad(null);
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
      closeModal();
      window.location.reload()
    } catch (error) {
      console.error("Error submitting task:", error);
    }
  };

  return (
    <>
      <Navbar />
      <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <div className="px-44" style={{ flexGrow: 1 }}>
          <Typography variant="h3" component="h2" gutterBottom sx={{ marginTop: '2%', textAlign: 'center', fontWeight: 'bold' }}>
            ACTIVIDADES
          </Typography>
          <Paper elevation={3} sx={{ padding: 2, width: '120%', marginTop: '5%', marginLeft: '-10%' }}>
            {planeacion.length > 0 ? (
              planeacion.map((planeacion) => {
                const actividadesPlaneacion = actividades.filter(actividad => planeacion._id === actividad.planeacionID);
                
                // Filtrado de tareas
                const tareasPendientes = actividadesPlaneacion.filter(actividad =>
                  !tareasEnviadas.some(tarea => tarea.actividad === actividad._id)
                );

                const tareasEntregadas = actividadesPlaneacion.filter(actividad =>
                  tareasEnviadas.some(tarea => tarea.actividad === actividad._id)
                );

                const totalActividades = tareasPendientes.length + tareasEntregadas.length;
                const avance = totalActividades > 0 ? (tareasEntregadas.length / totalActividades) * 100 : 0;

                return (
                  <Accordion key={planeacion._id}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography sx={{ fontSize: '150%' }}>{planeacion.nombre}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>{planeacion.descripcion}</Typography>

                      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mt={2}>
                        <Box flex={1} mr={2}>
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            Actividades Pendientes:
                          </Typography>
                          {tareasPendientes.length > 0 ? (
                            tareasPendientes.map(actividad => (
                              <Box key={actividad._id} mb={2}>
                                <Typography>{actividad.titulo}</Typography>
                                <Button 
                                  variant="outlined" 
                                  onClick={() => openModal(actividad)} 
                                  disabled={new Date(actividad.fechaFin) < new Date()} // Desactiva el botón si la fecha ha pasado
                                >
                                  Ver Detalles
                                </Button>
                              </Box>
                            ))
                          ) : (
                            <Typography variant="body2">No tienes actividades pendientes.</Typography>
                          )}

                          <Typography variant="h6" sx={{ mt: 2, fontWeight: 'bold' }}>
                            Actividades Entregadas:
                          </Typography>
                          
                          {tareasEntregadas.length > 0 ? (
                            tareasEntregadas.map(actividad => (
                              <Box key={actividad._id} mb={2}>
                                <Typography>{actividad.titulo} (Entregada)</Typography>
                                <Button 
                                  variant="outlined" 
                                  color="primary" 
                                  onClick={() => openModal(actividad)} 
                                  sx={{ marginTop: '2%' }} 
                                  disabled={new Date(actividad.fechaFin) < new Date()} // Desactiva el botón si la fecha ha pasado
                                >
                                  Ver Detalles
                                </Button>
                              </Box>
                            ))
                          ) : (
                            <Typography variant="body2">No tienes actividades entregadas.</Typography>
                          )}
                        </Box>

                        <Box sx={{ width: 500 }}>
                          <Plot
                            data={[{
                              values: [tareasEntregadas.length, tareasPendientes.length],
                              labels: ["Entregadas", "Pendientes"],
                              type: "pie",
                            }]}
                            layout={{
                              title: `Avance: ${avance.toFixed(2)}%`,
                              showlegend: true,
                            }}
                          />
                        </Box>
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                );
              })
            ) : (
              <Typography>No tienes planeaciones disponibles.</Typography>
            )}
          </Paper>
        </div>
      </Box>

      <Modal open={modalOpen} onClose={closeModal}>
  <Box
    sx={{
      display: 'flex', // Habilita el uso de Flexbox
      justifyContent: 'center', // Centra horizontalmente
      alignItems: 'center', // Centra verticalmente
      height: '100vh', // Asegura que ocupe toda la altura de la ventana
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo oscuro con opacidad
    }}
  >
    <Box
      sx={{
        padding: 4,
        backgroundColor: 'white',
        borderRadius: 2,
        width: 500,
        boxShadow: 3,
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
        {selectedActividad ? selectedActividad.titulo : ""}
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: 2 }}>
        {selectedActividad ? selectedActividad.descripcion : ""}
      </Typography>

      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
        Fechas:
      </Typography>
      <Typography variant="body2">
        Inicio: {selectedActividad ? new Date(selectedActividad.fechaInicio).toLocaleDateString() : ""}
      </Typography>
      <Typography variant="body2">
        Fin: {selectedActividad ? new Date(selectedActividad.fechaFin).toLocaleDateString() : ""}
      </Typography>
      
      {/* Mensaje si la actividad está fuera de plazo */}
      {selectedActividad && new Date(selectedActividad.fechaFin) < new Date() ? (
        <Typography variant="body2" sx={{ color: 'red', fontWeight: 'bold', marginTop: 2 }}>
          Esta actividad ha pasado su fecha límite y no se puede entregar.
        </Typography>
      ) : null}

      {/* Mostrar el archivo si existe */}
      {selectedActividad && selectedActividad.archivo && (
        <Box sx={{ marginTop: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
            Archivo:
          </Typography>
          <Typography variant="body2">
            <DescriptionIcon sx={{ marginRight: 1 }} />
            {selectedActividad.archivo}
            <a 
              href={`${API_URL_PA_IMAGENES}${selectedActividad.archivo}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ marginLeft: 5 }}
            >
              <img src="/fileImg.png" alt="Archivo" width={20} />
            </a>
          </Typography>
        </Box>
      )}

      {/* Contenedor flex para alinear el input y el botón */}
      <Box sx={{ marginTop: 2, marginBottom: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            Agregar documento para entregar tarea:
          </Typography>
          <input
            type="file"
            onChange={handleFileChange}
            style={{ marginTop: 10, padding: 5 }}
            disabled={selectedActividad && new Date(selectedActividad.fechaFin) < new Date()} // Desactiva el input si la fecha ha pasado
          />
        </Box>
        
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{ mt: 2, bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' }, marginLeft: 2 }}
          disabled={selectedActividad && new Date(selectedActividad.fechaFin) < new Date()} // Desactiva el botón si la fecha ha pasado
        >
          Enviar Tarea
        </Button>
      </Box>
    </Box>
  </Box>
</Modal>


      <Footer />
    </>
  );
}

export default Page;
