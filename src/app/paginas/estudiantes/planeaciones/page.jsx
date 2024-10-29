"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  CardActions,
  Modal,
  TextField,
} from "@mui/material";
import Navbar from "@/components/Navbars/navbarprofesores/navbar";
import Footer from "@/components/footer/footer";
import Link from "next/link";
import { getUser } from "@/services/auth";

const API_URL =
  "https://control-de-tareas-backend-production.up.railway.app/api";

function Page() {
  const [user, setUser] = useState(null);
  const [profesorData, setProfesorData] = useState(null);
  const [planeaciones, setPlaneaciones] = useState([]);
  const [asignaturasFiltradas, setAsignaturasFiltradas] = useState([]);
  const [openPlaneacionModal, setOpenPlaneacionModal] = useState(false);
  const [newPlaneacion, setNewPlaneacion] = useState({
    nombre: "",
    fechaComienzo: "",
    fechaFin: "",
    asignatura: null,
  });

  // Este useEffect obtiene al usuario y datos relacionados
  useEffect(() => {
    const fetchedUser = getUser();
    if (fetchedUser) {
      setUser(fetchedUser);
      fetchProfesorData(fetchedUser.id);
    }
  }, []);

  const fetchProfesorData = async (userId) => {
    try {
      const profesorResponse = await fetch(`${API_URL}/profesor/${userId}`);
      const profesor = await profesorResponse.json();
      setProfesorData(profesor);

      const asignaturasResponse = await fetch(`${API_URL}/asignatura`);
      const asignaturasData = await asignaturasResponse.json();

      if (profesor.asignaturas && asignaturasData.length > 0) {
        const filteredAsignaturas = asignaturasData.filter((asignatura) =>
          profesor.asignaturas.includes(asignatura._id)
        );
        setAsignaturasFiltradas(filteredAsignaturas);
      }

      fetchPlaneaciones(); 
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchPlaneaciones = async () => {
    try {
      const planeacionesResponse = await fetch(`${API_URL}/planeacion`);
      const planeacionesData = await planeacionesResponse.json();
      setPlaneaciones(planeacionesData); 
    } catch (error) {
      console.error("Error al obtener las planeaciones:", error);
    }
  };

  const getPlaneacionesAsignatura = (asignaturaId) => {
    return planeaciones.filter(
      (planeacion) => planeacion.asignatura === asignaturaId
    );
  };

  const handleAddPlaneacion = async () => {
    try {
      const response = await fetch(
        "https://control-de-tareas-backend-production.up.railway.app/api/planeacion/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newPlaneacion),
        }
      );

      if (response.ok) {
        const result = await response.json();
        setPlaneaciones([...planeaciones, result]); // Añadir la nueva planeación a la lista
        setOpenPlaneacionModal(false);
        setNewPlaneacion({
          nombre: "",
          fechaComienzo: "",
          fechaFin: "",
          asignatura: null,
        });
      } else {
        console.error("Error al agregar la planeación:", response.statusText);
      }
      
    } catch (error) {
      console.error("Error al agregar la planeación:", error);
    }
  };

  const handleOpenPlaneacionModal = (asignatura) => {
    setNewPlaneacion({
      ...newPlaneacion,
      asignatura: asignatura._id,
    });
    setOpenPlaneacionModal(true);
  };

  if (!user) {
    return <p>Cargando datos del profesor...</p>;
  }

  if (!profesorData) {
    return <p>Cargando datos del profesor...</p>;
  }

  return (
    <>
      <Navbar />
      <br />
      <Box
        sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
      >
        <div className="px-44" style={{ flexGrow: 1 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{textAlign: 'center'}}>
              Asignaturas de {profesorData.nombre}
            </Typography>
          <Paper elevation={3} sx={{ padding: 2, width: '120%', marginLeft: '-10% '}}>
           
            <div className="grid grid-cols-3 gap-10">
              {asignaturasFiltradas.length > 0 ? (
                asignaturasFiltradas.map((asignatura) => (
                  <Card key={asignatura._id}>
                    <CardMedia
                      sx={{ height: 140 }}
                      image={"https://www.unadmexico.mx/images/OfertaEducativa/presPEsmall/20_GestionIndustrial.webp"}
                      title={asignatura.nombre}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {asignatura.nombre}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                      >
                        Área: {asignatura.area}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      {getPlaneacionesAsignatura(asignatura._id).length > 0 ? (
                        <Link
                          href={`/paginas/profesores/planeacion/${
                            getPlaneacionesAsignatura(asignatura._id)[0]._id
                          }`}
                        >
                          <Button size="small">Ver más</Button>
                        </Link>
                      ) : (
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => handleOpenPlaneacionModal(asignatura)}
                        >
                          Inicializar Asignatura
                        </Button>
                      )}
                    </CardActions>
                  </Card>
                ))
              ) : (
                <Typography variant="body2">
                  No hay asignaturas registradas.
                </Typography>
              )}
            </div>
          </Paper>
        </div>

        <Modal
          open={openPlaneacionModal}
          onClose={() => setOpenPlaneacionModal(false)}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              borderRadius: 2,
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography id="modal-title" variant="h6" component="h2">
              Agregar Planeación
            </Typography>
            <TextField
              label="Nombre de la Planeación"
              fullWidth
              sx={{ marginBottom: 2 }}
              value={newPlaneacion.nombre}
              onChange={(e) =>
                setNewPlaneacion({ ...newPlaneacion, nombre: e.target.value })
              }
            />
            <TextField
              label="Fecha de Comienzo"
              fullWidth
              type="date"
              sx={{ marginBottom: 2 }}
              InputLabelProps={{ shrink: true }}
              value={newPlaneacion.fechaComienzo}
              onChange={(e) =>
                setNewPlaneacion({
                  ...newPlaneacion,
                  fechaComienzo: e.target.value,
                })
              }
            />
            <TextField
              label="Fecha de Fin"
              fullWidth
              type="date"
              sx={{ marginBottom: 2 }}
              InputLabelProps={{ shrink: true }}
              value={newPlaneacion.fechaFin}
              onChange={(e) =>
                setNewPlaneacion({
                  ...newPlaneacion,
                  fechaFin: e.target.value,
                })
              }
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddPlaneacion}
            >
              Guardar Planeación
            </Button>
          </Box>
        </Modal>

        <Footer />
      </Box>
    </>
  );
}

export default Page;
