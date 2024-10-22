"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Navbar from "@/components/Navbars/navbar";
import Footer from "@/components/footer/footer";
import { getUser } from "@/services/auth";

const API_URL = "https://control-de-tareas-backend-production.up.railway.app/api";

function Page() {
  const [user, setUser] = useState(null);
  const [dataUser, setDataUser] = useState({});
  const [asignaturas, setAsignaturas] = useState([]);
  const [areas, setAreas] = useState([]);

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

      const asignaturas = await fetch(`${API_URL}/asignatura`);
      const asignaturasData = await asignaturas.json();

      const areas = await fetch(`${API_URL}/area`);
      const areasData = await areas.json();

      setAreas(areasData);
      setAsignaturas(asignaturasData);
      setDataUser(alumnoData);
      
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  if (!user) {
    return <p>Loading...</p>;
  }
  const asignaturasAlumno = asignaturas.filter((asignatura) =>
    dataUser.asignatura?.includes(asignatura._id)
  );

  return (
    <>
      <Navbar />
      <br />
      <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <div className="px-44" style={{ flexGrow: 1 }}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6" component="h3">
              {areas.find((area) => area._id === dataUser.area)?.nombre}
            </Typography>
          </Paper>
          <br />

          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h4" component="h2" gutterBottom>
              Asignaturas
            </Typography>
            {asignaturasAlumno.length > 0 ? (
              asignaturasAlumno.map((asignatura) => (
                <Accordion key={asignatura._id}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`panel-${asignatura._id}-content`}
                    id={`panel-${asignatura._id}-header`}
                  >
                    <Typography>{asignatura.nombre}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>{asignatura.descripcion}</Typography>
                  </AccordionDetails>
                </Accordion>
              ))
            ) : (
              <Typography variant="body2">
                No tienes asignaturas registradas.
              </Typography>
            )}
          </Paper>
        </div>
        <Footer />
      </Box>
    </>
  );
}

export default Page;
