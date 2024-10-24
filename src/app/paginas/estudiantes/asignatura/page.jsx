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
  TextField,
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
  const [tareas, setTareas] = useState([]);
  const [archivo, setArchivo] = useState(null);

  useEffect(() => {
    const fetchedUser = getUser();
    if (fetchedUser) {
      setUser(fetchedUser);
      fetchData(fetchedUser.id);
      fetchTareas(fetchedUser.id);
    }
  }, []);

  const fetchData = async (userId) => {
    try {
      const alumno = await fetch(`${API_URL}/alumno/${userId}`);
      const alumnoData = await alumno.json();

      const asignaturas = await fetch(`${API_URL}/asignatura`);
      const asignaturasData = await asignaturas.json();

      setAsignaturas(asignaturasData);
      setDataUser(alumnoData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchTareas = async (userId) => {
    try {
      const response = await fetch(`${API_URL}/tareas/alumno/${userId}`);
      const tareasData = await response.json();
      setTareas(tareasData);
    } catch (error) {
      console.error("Error fetching tareas:", error);
    }
  };

  const handleFileChange = (e) => {
    setArchivo(e.target.files[0]);
  };

  const handleSubmit = async (tareaId) => {
    const formData = new FormData();
    formData.append("archivo", archivo);

    try {
      const response = await fetch(`${API_URL}/tareas/${tareaId}/completar`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Tarea completada");
        fetchTareas(user.id);  // Refrescar las tareas
      }
    } catch (error) {
      console.error("Error submitting tarea:", error);
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
              Asignaturas del alumno
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
                    <Box>
                      <Typography variant="h6">Tareas:</Typography>
                      {tareas
                        .filter((tarea) => tarea.asignatura === asignatura._id)
                        .map((tarea) => (
                          <Box key={tarea._id} sx={{ marginBottom: 2 }}>
                            <Typography variant="body1">
                              {tarea.descripcion}
                            </Typography>
                            <Button
                              variant="contained"
                              component="label"
                              sx={{ marginRight: 2 }}
                            >
                              Subir archivo
                              <input
                                type="file"
                                hidden
                                onChange={handleFileChange}
                              />
                            </Button>
                            <Button
                              variant="contained"
                              onClick={() => handleSubmit(tarea._id)}
                            >
                              Completar Tarea
                            </Button>
                          </Box>
                        ))}
                    </Box>
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
