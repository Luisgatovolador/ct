"use client";

import { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { es } from "date-fns/locale";
import {
  Container,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import Navbar from "@/components/Navbars/navbar";
import Footer from "@/components/footer/footer";
import { getUser } from "@/services/auth";

const API_URL = "http:localhost:3001/api";

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

const CustomDateCellWrapper = ({ children }) => (
  <div style={{ height: "auto" }}>{children}</div>
);

const Page = () => {
  const [actividades, setActividades] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [eventos, setEventos] = useState([]);
  const [nuevaActividad, setNuevaActividad] = useState({
    titulo: "",
    descripcion: "",
    fechaInicio: "",
    fechaFin: "",
    profesorID: "", 
  });

  const [open, setOpen] = useState(false); 

  useEffect(() => {
    const fetchedUser = getUser();
    if (fetchedUser) {
      setUsuario(fetchedUser);
      fetchData(fetchedUser.id);
      setNuevaActividad((prev) => ({ ...prev, profesorID: fetchedUser.id }));
    }
  }, []);

  // Obtener actividades filtradas 
  const fetchData = async (userId) => {
    try {
      const alumnoResponse = await fetch(`${API_URL}/profesor/${userId}`);
      const dataProfesor = await alumnoResponse.json();

      const actividadesResponse = await fetch(`${API_URL}/actividad`);
      const dataActividad = await actividadesResponse.json();

      const actividadesFiltradas = dataActividad.filter(
        (actividad) => actividad.planeacionID === userId
      );
      setActividades(actividadesFiltradas);
    } catch (error) {
      console.error("Error al cargar las actividades:", error);
    }
  };

  // Manejar la creación de una nueva actividad
  const manejarAgregarActividad = async () => {
    const nuevaActividadData = {
      titulo: nuevaActividad.titulo,
      descripcion: nuevaActividad.descripcion,
      fechaInicio: nuevaActividad.fechaInicio,
      fechaFin: nuevaActividad.fechaFin,
      planeacionID: nuevaActividad.profesorID,
    };

    try {
      await fetch(`${API_URL}/actividad`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevaActividadData),
      });
      // Volver a cargar actividades después de agregar una nueva
      fetchData(nuevaActividad.profesorID);
      // Limpiar el formulario
      setNuevaActividad({
        titulo: "",
        descripcion: "",
        fechaInicio: "",
        fechaFin: "",
        profesorID: nuevaActividad.profesorID,
      });
      handleClose(); // Cerrar el modal después de agregar
    } catch (error) {
      console.error("Error al agregar actividad:", error);
    }
  };

  // Filtro para mostrar actividades en el calendario
  useEffect(() => {
    setEventos(
      actividades.map((actividad) => ({
        title: actividad.titulo,
        start: new Date(actividad.fechaInicio),
        end: new Date(actividad.fechaFin),
        allDay: true,
      }))
    );
  }, [actividades]);

  // Manejar apertura del modal
  const handleClickOpen = () => {
    setOpen(true);
  };

  // Manejar cierre del modal
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Navbar />
      <br />
      <Container>
        <Typography variant="h4" gutterBottom>
          Calendario de Actividades
        </Typography>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "16px",
          }}
        >
          <Button variant="contained" color="primary" onClick={handleClickOpen}>
            Agregar Actividad Personal
          </Button>
        </div>

        {/* Modal para crear actividad */}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Agregar Nueva Actividad</DialogTitle>
          <DialogContent>
            <TextField
              label="Título"
              variant="outlined"
              fullWidth
              value={nuevaActividad.titulo}
              onChange={(e) =>
                setNuevaActividad({ ...nuevaActividad, titulo: e.target.value })
              }
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Descripción"
              variant="outlined"
              fullWidth
              value={nuevaActividad.descripcion}
              onChange={(e) =>
                setNuevaActividad({
                  ...nuevaActividad,
                  descripcion: e.target.value,
                })
              }
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Fecha de Inicio"
              type="date"
              variant="outlined"
              fullWidth
              value={nuevaActividad.fechaInicio}
              onChange={(e) =>
                setNuevaActividad({
                  ...nuevaActividad,
                  fechaInicio: e.target.value,
                })
              }
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Fecha de Entrega"
              type="date"
              variant="outlined"
              fullWidth
              value={nuevaActividad.fechaFin}
              onChange={(e) =>
                setNuevaActividad({
                  ...nuevaActividad,
                  fechaFin: e.target.value,
                })
              }
              sx={{ marginBottom: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button onClick={manejarAgregarActividad} color="primary">
              Agregar
            </Button>
          </DialogActions>
        </Dialog>

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
