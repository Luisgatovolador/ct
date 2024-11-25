"use client";
import { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { es } from "date-fns/locale";
import {
  Container,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Modal,
  Box,
} from "@mui/material";
import Navbar from "@/components/Navbars/navbar";
import Footer from "@/components/footer/footer";
import { getUser } from "@/services/auth";


const URL_API = "http:localhost:3001/api";
const URL_API_PARA_IMAGENES = "http:localhost:3001/uploads/";

const localizaciones = {
  es: es,
};

const localizador = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }), 
  getDay,
  locales: localizaciones,
});

const EventoPersonalizado = ({ event }) => {
  return (
    <span>
      <strong>{event.title}</strong>
    </span>
  );
};

const ContenedorCeldaFechaPersonalizado = ({ children }) => (
  <div style={{ height: "auto" }}>{children}</div>
);

const Pagina = () => {
  const [actividades, setActividades] = useState([]);
  const [busquedaIdPlaneacion, setBusquedaIdPlaneacion] = useState("");
  const [usuario, setUsuario] = useState(null);
  const [planeacionesAsignaturas, setPlaneacionesAsignaturas] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [actividadSeleccionada, setActividadSeleccionada] = useState(null);
  const [abrirModal, setAbrirModal] = useState(false);

  useEffect(() => {
    const usuarioObtenido = getUser();
    if (usuarioObtenido) {
      setUsuario(usuarioObtenido);
      obtenerDatos(usuarioObtenido.id);
    }
  }, []);

  const obtenerDatos = async (idUsuario) => {
    try {
      const respuestaAlumno = await fetch(`${URL_API}/alumno/${idUsuario}`);
      const datosAlumno = await respuestaAlumno.json();

      const respuestaActividades = await fetch(`${URL_API}/actividad`);
      const datosActividades = await respuestaActividades.json();

      if (datosAlumno.planeacionID && datosActividades.length > 0) {
        const actividadesFiltradasAlumno = datosActividades.filter((actividad) =>
          datosAlumno.planeacionID.includes(actividad.planeacionID)
        );
        setActividades(actividadesFiltradasAlumno);
      }

      const respuestaPlaneaciones = await fetch(`${URL_API}/planeacion`);
      const datosPlaneaciones = await respuestaPlaneaciones.json();

      const planeacionesConAsignatura = await Promise.all(
        datosPlaneaciones.map(async (planeacion) => {
          const respuestaAsignatura = await fetch(
            `${URL_API}/asignatura/${planeacion.asignatura}`
          );
          const datosAsignatura = await respuestaAsignatura.json();
          return {
            ...planeacion,
            nombreAsignatura: datosAsignatura.nombre,
          };
        })
      );

      const planeacionesFiltradas = planeacionesConAsignatura.filter((planeacion) =>
        datosAlumno.planeacionID.includes(planeacion._id)
      );

      setPlaneacionesAsignaturas(planeacionesFiltradas);
    } catch (error) {
      console.error("Error al cargar las actividades o planeaciones:", error);
    }
  };

  useEffect(() => {
    const actividadesFiltradas = actividades.filter(
      (actividad) => busquedaIdPlaneacion === "" || actividad.planeacionID === busquedaIdPlaneacion
    );

    setEventos(
      actividadesFiltradas.map((actividad) => ({
        title: actividad.titulo,
        start: new Date(actividad.fechaInicio),
        end: new Date(actividad.fechaFin),
        allDay: true,
        actividad,
      }))
    );
  }, [actividades, busquedaIdPlaneacion]);

  const manejarClickEvento = (evento) => {
    setActividadSeleccionada(evento.actividad);
    setAbrirModal(true);
  };

  const manejarCerrarModal = () => {
    setAbrirModal(false);
    setActividadSeleccionada(null);
  };

  return (
    <>
      <Navbar />
      <br />
      <Container>
        <Typography variant="h4" gutterBottom>
          Calendario de Actividades
        </Typography>

        <Grid item xs={12} md={4}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel>Buscar por asignatura</InputLabel>
            <Select
              label="Buscar por asignatura"
              value={busquedaIdPlaneacion}
              onChange={(e) => setBusquedaIdPlaneacion(e.target.value)}
            >
              <MenuItem value="">
                <em>Todos</em>
              </MenuItem>
              {planeacionesAsignaturas.map((planeacion) => (
                <MenuItem key={planeacion._id} value={planeacion._id}>
                  {planeacion.nombreAsignatura}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Calendar
          localizer={localizador}
          events={eventos}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "auto", minHeight: "600px" }}
          culture="es"
          views={["month", "week", "day", "agenda"]}
          step={60}
          defaultView="month"
          toolbar={true}
          components={{
            event: EventoPersonalizado,
            month: {
              dateCellWrapper: ContenedorCeldaFechaPersonalizado,
            },
          }}
          onSelectEvent={manejarClickEvento}
          popup={false}
          messages={{
            next: "Siguiente",
            previous: "Anterior",
            today: "Hoy",
            month: "Mes",
            week: "Semana",
            day: "Día",
            agenda: "Agenda",
          }}
        />

        <Modal open={abrirModal} onClose={manejarCerrarModal}>
          <Box sx={{ p: 4, backgroundColor: "white", borderRadius: 2, maxWidth: 400, margin: "auto" }}>
            {actividadSeleccionada && (
              <>
                <Typography variant="h6" gutterBottom>
                  {actividadSeleccionada.titulo}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {actividadSeleccionada.descripcion}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Inicio: {new Date(actividadSeleccionada.fechaInicio).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Fin: {new Date(actividadSeleccionada.fechaFin).toLocaleDateString()}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {actividadSeleccionada.documento} 
                  <a href={`${URL_API_PARA_IMAGENES}${actividadSeleccionada.archivo}`} target="_blank" rel="noopener noreferrer">
                    <img src="/fileImg.png" alt="Archivo" width={50} />
                  </a>
                </Typography>
              </>
            )}
          </Box>
        </Modal>
      </Container>
      <br />
      <Footer />
    </>
  );
};

export default Pagina;
