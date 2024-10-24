"use client";

import { useState,useEffect } from "react";
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
  const [actividad,setActividad] = useState([]);

  useEffect(() => {
    const obtenerActividad = async () => {
      try {
        const response = await fetch(
          "https://control-de-tareas-backend-production.up.railway.app/api/actividad/"
        );
        const data = await response.json();
        const filtroActividadporAsignarutas = data.filter((actividad)=>
        id.includes(actividad.planeacionID)
        );
        setActividad(filtroActividadporAsignarutas);
      } catch (error) {
        console.error("Error al obtener tarea:", error);
      }
    };
    obtenerActividad();
  }, []); 


  const actividades = [
    {
      _id: "1",
      planeacionID: "123",
      titulo: "Revisión de Proyectos",
      descripcion: "Revisar los proyectos entregados.",
      fechaInicio: new Date(2024, 9, 15),
      fechaFin: new Date(2024, 9, 17),
      tareas: ["tarea1", "tarea2"],
    },
    {
      _id: "2",
      planeacionID: "124",
      titulo: "Entrega de reportes",
      descripcion: "Entrega de reportes de los avances.",
      fechaInicio: new Date(2024, 9, 20),
      fechaFin: new Date(2024, 9, 20),
      tareas: ["tarea3"],
    },
    {
      _id: "3",
      planeacionID: "124",
      titulo: "Proyecto",
      descripcion: "Entrega de reportes de los avances.",
      fechaInicio: new Date(2024, 11, 20),
      fechaFin: new Date(2024, 11, 21),
      tareas: ["tarea4"],
    },
  ];

  // Mapeo de las actividades a eventos que el calendario pueda mostrar
  const [eventos, setEventos] = useState(
    actividades.map((actividad) => ({
      title: actividad.titulo,
      start: actividad.fechaInicio,
      end: actividad.fechaFin,
      allDay: true,
    }))
  );

  return (
    <>
      <Navbar></Navbar>
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
      <Footer></Footer>
    </>
  );
};

export default Page;
