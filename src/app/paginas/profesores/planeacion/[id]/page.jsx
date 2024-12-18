"use client";

import React, { useState, useEffect } from "react";
import { Box, Grid, Paper, Typography, Accordion, AccordionSummary, AccordionDetails, Button, Modal, TextField, InputLabel, Select, MenuItem } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Navbar from "@/components/Navbars/navbarprofesores/navbar";
import Footer from "@/components/footer/footer";
import Link from "next/link";
import { useParams } from "next/navigation";
import DateRangeIcon from "@mui/icons-material/DateRange";
import DescriptionIcon from "@mui/icons-material/Description";
import ModalCrearActividad from "@/components/Profesor/ActividadConjunto/ModalCrearActividad";
import { getUser } from "@/services/auth";
import ListaActividadesConjuntas from "@/components/Profesor/ListarActividadesConjunto/ListaActividades";
import ListaActividadesConjuntasCreadas from "@/components/Profesor/ListarActividadesCreadas/ListarActividades";

const API_URL = process.env.NEXT_PUBLIC_API_URL
const API_URL_PA_IMAGENES = "http://localhost:3001/uploads/";

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
    archivo: null,
    fechaFin: "",
    unidad: "",
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
  const [ModalCrearActividadConjunto, setModalCrearActividadConjunto] = useState(false);
  const [userData, setUserData] = useState(null);
  const [idAsignatura, SetidAsignatura] = useState(null);
  // Obtener la planeación 
  useEffect(() => {
    const obtenerPlaneacion = async () => {
      const user = getUser()
      if (user) {
        setUserData(user)
        console.log(user)
      }
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
          SetidAsignatura(data.asignatura)
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
    const formData = new FormData();
    formData.append("titulo", nuevaActividad.titulo);
    formData.append("descripcion", nuevaActividad.descripcion);
    formData.append("fechaInicio", nuevaActividad.fechaInicio);
    formData.append("fechaFin", nuevaActividad.fechaFin);
    formData.append("planeacionID", nuevaActividad.planeacionID);
    formData.append("unidad", nuevaActividad.unidad);
    if (nuevaActividad.archivo) {
      formData.append("archivo", nuevaActividad.archivo);
    }

    try {
      const response = await fetch(
        `${API_URL}/actividad/`,
        {
          method: "POST",
          body: formData,
        }
      );
      const resultado = await response.json();
      setActividades([...actividades, resultado]);
      setModalAbierto(false);

      await enviarCorreosAEstudiantes();

    } catch (error) {
      console.error("Error al agregar la actividad:", error);
    }
  };

  // Enviar correos a estudiantes
  const enviarCorreosAEstudiantes = async () => {
    try {
      const response = await fetch(`${API_URL}/alumno`);
      const alumnos = await response.json();

      // alumnos inscritos
      const alumnosAsignados = alumnos.filter((alumno) =>
        alumno.planeacionID.includes(id)
      );


      const envioCorreos = alumnosAsignados.map(alumno =>
        fetch(`${API_URL}/mandarCorreo`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            correo: alumno.email,
            asunto: "Nueva actividad disponible",
            mensaje: `Se ha añadido una nueva actividad a la asignatura ${planeacion.nombre}`,
          }),
        })
      );


      console.log("Correos enviados a todos los estudiantes inscritos.");

    } catch (error) {
      console.error("Error al enviar los correos:", error);
    }
  };

  // Función para editar una actividad seleccionada
  const manejarEditarActividad = (actividad) => {
    setActividadSeleccionada(actividad);
    setModalAbierto(true);
  };

  // Actualizar la actividad seleccionada
  const manejarActualizarActividad = async () => {
    if (actividadSeleccionada) {
      const formData = new FormData();
      formData.append("titulo", actividadSeleccionada.titulo);
      formData.append("descripcion", actividadSeleccionada.descripcion);
      formData.append("fechaInicio", actividadSeleccionada.fechaInicio);
      formData.append("fechaFin", actividadSeleccionada.fechaFin);
      formData.append("unidad", actividadSeleccionada.unidad);

      try {
        const response = await fetch(
          `${API_URL}/actividad/${actividadSeleccionada._id}`,
          {
            method: "PUT",
            body: formData,
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

  // actividades por unidad
  const actividadesPorUnidad = actividades.reduce((acc, actividad) => {
    const unidad = actividad.unidad || "Sin unidad";
    if (!acc[unidad]) acc[unidad] = [];
    acc[unidad].push(actividad);
    return acc;
  }, {});

  if (!userData || !idAsignatura) {
    return (
      <p>Cargando...</p>
    )
  }

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

                  {/* Iteramos sobre cada unidad para mostrar las actividades agrupadas */}
                  {Object.keys(actividadesPorUnidad).map((unidad) => (
                    <Box key={unidad} sx={{ marginBottom: 4 }}>
                      <Typography variant="h5" color="primary" sx={{ marginBottom: 2 }}>
                        Unidad {unidad}
                      </Typography>

                      {actividadesPorUnidad[unidad].map((actividad, index) => (
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
                            {actividad.archivo && (
                              <Typography
                                variant="body1"
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  marginBottom: 1,
                                }}
                              >
                                <DescriptionIcon sx={{ marginRight: 1 }} />
                                Archivo:
                                <a href={`${API_URL_PA_IMAGENES}${actividad.archivo}`} target="_blank" rel="noopener noreferrer">
                                  <img src="/fileImg.png" alt="Archivo" width={50} style={{ marginLeft: 8 }} />
                                </a>
                              </Typography>
                            )}

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

                    height: "100%",
                  }}
                >
                  <Typography variant="h5" gutterBottom>
                    Agregar Nueva Actividad
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setModalAbierto(true)}
                  >
                    Agregar Actividad
                  </Button>

                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setModalCrearActividadConjunto(true)}
                    sx={{ marginTop: 2 }}
                  >
                    Agregar Actividad en Conjunto
                  </Button>

                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => setModalPlaneacionAbierto(true)}
                    sx={{ marginTop: 2 }}
                  >
                    Modificar Planeación
                  </Button>
                </Paper>
              </Grid>
            </Grid>
            <ListaActividadesConjuntasCreadas idProfesor={userData.id} />
            <ListaActividadesConjuntas idProfesor={userData.id}/>
          </Paper>
        </div>
      
      </Box>

              
      <ModalCrearActividad
        abierto={ModalCrearActividadConjunto}
        asignaturaId={idAsignatura}
        profesorId={userData.id}
        onCerrar={() => setModalCrearActividadConjunto(false)}
      />

      {/* Modal para agregar o editar actividad */}
      <Modal open={modalAbierto} onClose={() => setModalAbierto(false)}>
        <Box sx={estiloModal}>
          <Typography variant="h6" component="h2" gutterBottom>
            {actividadSeleccionada ? "Editar Actividad" : "Agregar Actividad"}
          </Typography>
          <TextField
            label="Título"
            variant="outlined"
            fullWidth
            value={actividadSeleccionada ? actividadSeleccionada.titulo : nuevaActividad.titulo}
            onChange={(e) =>
              actividadSeleccionada
                ? setActividadSeleccionada({ ...actividadSeleccionada, titulo: e.target.value })
                : setNuevaActividad({ ...nuevaActividad, titulo: e.target.value })
            }
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Descripción"
            variant="outlined"
            fullWidth
            value={actividadSeleccionada ? actividadSeleccionada.descripcion : nuevaActividad.descripcion}
            onChange={(e) =>
              actividadSeleccionada
                ? setActividadSeleccionada({ ...actividadSeleccionada, descripcion: e.target.value })
                : setNuevaActividad({ ...nuevaActividad, descripcion: e.target.value })
            }
            sx={{ marginBottom: 2 }}
          />

          <InputLabel>Unidad</InputLabel>
          <Select
            label="Unidad"
            fullWidth
            value={actividadSeleccionada ? actividadSeleccionada.unidad : nuevaActividad.unidad}
            onChange={(e) =>
              actividadSeleccionada
                ? setActividadSeleccionada({ ...actividadSeleccionada, unidad: e.target.value })
                : setNuevaActividad({ ...nuevaActividad, unidad: e.target.value })
            }
            sx={{ marginBottom: 2 }}
          >
            <MenuItem value="1">Unidad 1</MenuItem>
            <MenuItem value="2">Unidad 2</MenuItem>
            <MenuItem value="3">Unidad 3</MenuItem>
            <MenuItem value="4">Unidad 4</MenuItem>
            <MenuItem value="5">Unidad 5</MenuItem>
          </Select>



          <InputLabel htmlFor="fechaInicio">Fecha de Inicio</InputLabel>
          <TextField
            type="date"
            variant="outlined"
            fullWidth
            value={actividadSeleccionada ? actividadSeleccionada.fechaInicio.split("T")[0] : nuevaActividad.fechaInicio}
            onChange={(e) =>
              actividadSeleccionada
                ? setActividadSeleccionada({ ...actividadSeleccionada, fechaInicio: e.target.value })
                : setNuevaActividad({ ...nuevaActividad, fechaInicio: e.target.value })
            }
            sx={{ marginBottom: 2 }}
          />
          <InputLabel htmlFor="fechaFin">Fecha de Entrega</InputLabel>
          <TextField
            type="date"
            variant="outlined"
            fullWidth
            value={actividadSeleccionada ? actividadSeleccionada.fechaFin.split("T")[0] : nuevaActividad.fechaFin}
            onChange={(e) =>
              actividadSeleccionada
                ? setActividadSeleccionada({ ...actividadSeleccionada, fechaFin: e.target.value })
                : setNuevaActividad({ ...nuevaActividad, fechaFin: e.target.value })
            }
            sx={{ marginBottom: 2 }}
          />
          <InputLabel htmlFor="archivo">Archivo</InputLabel>
          <input
            type="file"
            onChange={(e) =>
              actividadSeleccionada
                ? setActividadSeleccionada({ ...actividadSeleccionada, archivo: e.target.files[0] })
                : setNuevaActividad({ ...nuevaActividad, archivo: e.target.files[0] })
            }
            style={{ marginBottom: 16 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={actividadSeleccionada ? manejarActualizarActividad : manejarAgregarActividad}
          >
            {actividadSeleccionada ? "Actualizar" : "Agregar"}
          </Button>
        </Box>
      </Modal>

      {/* Modal para editar planeación */}
      <Modal open={modalPlaneacionAbierto} onClose={() => setModalPlaneacionAbierto(false)}>
        <Box sx={estiloModal}>
          <Typography variant="h6" component="h2" gutterBottom>
            Editar Planeación
          </Typography>
          <TextField
            label="Nombre"
            variant="outlined"
            fullWidth
            value={editarPlaneacion.nombre}
            onChange={(e) => setEditarPlaneacion({ ...editarPlaneacion, nombre: e.target.value })}
            sx={{ marginBottom: 2 }}
          />
          <InputLabel htmlFor="fechaComienzo">Fecha de Comienzo</InputLabel>
          <TextField
            type="date"
            variant="outlined"
            fullWidth
            value={editarPlaneacion.fechaComienzo}
            onChange={(e) => setEditarPlaneacion({ ...editarPlaneacion, fechaComienzo: e.target.value })}
            sx={{ marginBottom: 2 }}
          />
          <InputLabel htmlFor="fechaFin">Fecha de Fin</InputLabel>
          <TextField
            type="date"
            variant="outlined"
            fullWidth
            value={editarPlaneacion.fechaFin}
            onChange={(e) => setEditarPlaneacion({ ...editarPlaneacion, fechaFin: e.target.value })}
            sx={{ marginBottom: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={manejarActualizarPlaneacion}
          >
            Actualizar Planeación
          </Button>
        </Box>
      </Modal>
      <Footer />
    </>
  );
}

export default Page;
