"use client";

import { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { es } from "date-fns/locale";
import { Container, Typography } from "@mui/material";
import Navbar from '@/components/Navbars/navbar';
import Footer from "@/components/footer/footer";

// Configuración de locales para el calendario en español
const locales = {
  es: es,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }), // Semana empieza en lunes
  getDay,
  locales,
});

const Page = () => {
  const [actividades, setActividades] = useState([]);

  // Obtener las actividades desde el backend cuando se carga la página
  useEffect(() => {
    const fetchActividades = async () => {
      try {
        const response = await fetch("/api/actividades");
        const data = await response.json();
        setActividades(data);
      } catch (error) {
        console.error("Error al cargar las actividades:", error);
      }
    };

    fetchActividades();
  }, []);

  // Mapeo de las actividades a eventos que el calendario pueda mostrar
  const [eventos, setEventos] = useState(
    actividades.map((actividad) => ({
      title: actividad.titulo,
      start: new Date(actividad.fechaInicio),
      end: new Date(actividad.fechaFin),
      allDay: true,
    }))
  );

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

  return (
    <>
      <Navbar />
      <br />
      <Container>
        <Typography variant="h4" gutterBottom>
          Calendario de Actividades
        </Typography>
        <Calendar
          localizer={localizer}
          events={eventos}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          culture="es" // Localización en español
          views={["month", "week", "day", "agenda"]} // Habilitar vistas de mes, semana, día y agenda
          step={60} // Intervalo de tiempo en minutos
          defaultView="month" // Vista predeterminada es "mes"
          toolbar={true} // Habilitar la barra de herramientas
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