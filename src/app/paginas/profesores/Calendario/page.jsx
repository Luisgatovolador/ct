"use client";
import { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { es } from "date-fns/locale";
import { Container, Typography, Grid, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import Navbar from "@/components/Navbars/navbar";
import Footer from "@/components/footer/footer";
import { getUser } from "@/services/auth";

const API_URL = "https://control-de-tareas-backend-production.up.railway.app/api";

// calendario en español
const locales = {
  es: es,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }), 
  getDay,
  locales,
});

const CustomEvent = ({ event }) => {
  return (
    <span>
      <strong>{event.title}</strong>
    </span>
  );
};

const CustomDateCellWrapper = ({ children, value }) => (
  <div style={{ height: 'auto' }}>
    {children}
  </div>
);

const Page = () => {
  const [actividades, setActividades] = useState([]);
  const [busquedaPlaneacionID, setBusquedaPlaneacionID] = useState("");
  const [usuario, setUsuario] = useState(null);
  const [planeacionesAsignaturas, setPlaneacionesAsignaturas] = useState([]);
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    const fetchedUser = getUser();
    if (fetchedUser) {
      setUsuario(fetchedUser);
      fetchData(fetchedUser.id);
    }
  }, []);

  // Obtener actividades y planeaciones y asignaturas
  const fetchData = async (userId) => {
    try {
      const alumnoResponse = await fetch(`${API_URL}/profesor/${userId}`);
      const dataAlumno = await alumnoResponse.json();

      const actividadesResponse = await fetch(`${API_URL}/actividad`);
      const dataActividad = await actividadesResponse.json();

      if (dataAlumno.planeacionID && dataActividad.length > 0) {
        const filtroActividadesAlumno = dataActividad.filter((actividad) =>
          dataAlumno.planeacionID.includes(actividad.planeacionID)
        );
        setActividades(filtroActividadesAlumno);
      }

      const planeacionesResponse = await fetch(`${API_URL}/planeacion`);
      const dataPlaneaciones = await planeacionesResponse.json();

      // Asociar el nombre de la asignatura a cada planeación
      const planeacionesConAsignatura = await Promise.all(
        dataPlaneaciones.map(async (planeacion) => {
          const asignaturaResponse = await fetch(`${API_URL}/asignatura/${planeacion.asignatura}`);
          const dataAsignatura = await asignaturaResponse.json();
          return {
            ...planeacion,
            nombreAsignatura: dataAsignatura.nombre, 
          };
        })
      );

      const planeacionesFiltradas = planeacionesConAsignatura.filter((planeacion) =>
        dataAlumno.planeacionID.includes(planeacion._id)
      );

      setPlaneacionesAsignaturas(planeacionesFiltradas); 
      
    } catch (error) {
      console.error("Error al cargar las actividades o planeaciones:", error);
    }
  };

  // Filtro para mostrar actividades
  useEffect(() => {
    const actividadesFiltradas = actividades.filter(
      (actividad) => busquedaPlaneacionID === "" || actividad.planeacionID === busquedaPlaneacionID
    );

    setEventos(
      actividadesFiltradas.map((actividad) => ({
        title: actividad.titulo,
        start: new Date(actividad.fechaInicio),
        end: new Date(actividad.fechaFin),
        allDay: true,
      }))
    );
  }, [actividades, busquedaPlaneacionID]);

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
              value={busquedaPlaneacionID}
              onChange={(e) => setBusquedaPlaneacionID(e.target.value)}
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
          localizer={localizer}
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
            event: CustomEvent,
            month: {
              dateCellWrapper: CustomDateCellWrapper,
            },
          }}
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
      </Container>
      <br />
      <Footer />
    </>
  );
};

export default Page;
