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
} from "@mui/material";
import Navbar from "@/components/Navbars/navbarprofesores/navbar";
import Footer from "@/components/footer/footer";
import Link from "next/link"; // Asegúrate de importar Link
import { getUser } from "@/services/auth";

const API_URL =
  "https://control-de-tareas-backend-production.up.railway.app/api";

function Home() {
  const [user, setUser] = useState(null);
  const [profesorData, setProfesorData] = useState(null);
  const [asignaturas, setAsignaturas] = useState([]);
  const [asignaturasFiltradas, setAsignaturasFiltradas] = useState([]);

  useEffect(() => {
    const fetchedUser = getUser();
    if (fetchedUser) {
      setUser(fetchedUser);
      fetchData(fetchedUser.id); // Obtener los datos del profesor logueado
    }
  }, []);

  const fetchData = async (userId) => {
    try {
     
      const profesorResponse = await fetch(`${API_URL}/profesor/${userId}`);
      const profesor = await profesorResponse.json();
      setProfesorData(profesor); 

      // Obtener asignaturas
      const asignaturasResponse = await fetch(`${API_URL}/asignatura`);
      const asignaturasData = await asignaturasResponse.json();
      setAsignaturas(asignaturasData); // Guardar todas las asignaturas

      // Filtrar las asignaturas del profesor logueado
      if (profesor.asignaturas && asignaturasData.length > 0) {
        const filteredAsignaturas = asignaturasData.filter((asignatura) =>
          profesor.asignaturas.includes(asignatura._id)
        );
        setAsignaturasFiltradas(filteredAsignaturas); 

      
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };


   // Función para agregar nueva planeación
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
      const result = await response.json();
      setOpenPlaneacionModal(false); 
    } catch (error) {
      console.error("Error al agregar la planeación:", error);
    }
  };

  if (!user) {
    return <p>Cargando datos del profesor...</p>;
  }

  if (!profesorData) {
    return <p>Cargando datos del profesor...</p>; // Muestra un mensaje mientras se cargan los datos del profesor
  }

  return (
    <>
      <Navbar />
      <br />
      <Box
        sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
      >
        <div className="px-44" style={{ flexGrow: 1 }}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h4" component="h2" gutterBottom>
              Asignaturas de {profesorData.nombre}
            </Typography>
            <div className="grid grid-cols-3 gap-10">
              {asignaturasFiltradas.length > 0 ? (
                asignaturasFiltradas.map((asignatura) => (
                  <Card key={asignatura._id}>
                    <CardMedia
                      sx={{ height: 140 }}
                      image={"https://via.placeholder.com/150"}
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
                      <Link
                        href={`/paginas/profesores/asignatura/${asignatura._id}`}
                      >
                        <Button size="small">Ver más</Button>
                      </Link>
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
        <Footer />
      </Box>
    </>
  );
}

export default Home;
