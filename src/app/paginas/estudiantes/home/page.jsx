"use client";

import Navbar from '@/components/Navbars/navbar';
import ImageCarousel from "@/components/carusel/Carusel";
import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CardActions from "@mui/material/CardActions";
import Footer from "@/components/footer/footer";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import { getUser } from '@/services/auth';

const API_URL = "http:localhost:3001/api";

export default function Home() {
  const [asignaturas, setAsignaturas] = useState([]);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [planeaciones, setPlaneaciones] = useState([]);

  useEffect(() => {
    const fetchedUser = getUser();
    if (fetchedUser) {
      setUser(fetchedUser);
      fetchData(fetchedUser.id);
    }

    fetchAsignaturas();
    fetchPlaneaciones();
  }, []);

  const fetchAsignaturas = async () => {
    try {
      const response = await fetch(`${API_URL}/asignatura/`);
      const data = await response.json();
      setAsignaturas(data);
    } catch (error) {
      console.error("Error al obtener las asignaturas", error);
    }
  };

  const fetchPlaneaciones = async () => {
    try {
      const response = await fetch(`${API_URL}/planeacion/`);
      const data = await response.json();
      setPlaneaciones(data);
    } catch (error) {
      console.error("Error al obtener las planeaciones", error);
    }
  };

  const fetchData = async (userId) => {
    try {
      const response = await fetch(`${API_URL}/alumno/${userId}`);
      const alumnoData = await response.json();
      setUserData(alumnoData);
    } catch (error) {
      console.error("Error al obtener los datos del alumno", error);
    }
  };

  const inscribirse = async (asignaturaId) => {
    try {
      const inscripcionResponse = await fetch(`${API_URL}/alumno/inscribirse/${userData._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          alumnoId: userData._id,
          asignaturaId,
         
        }),
      });

      if (!inscripcionResponse.ok) {
        const errorData = await inscripcionResponse.json();
        throw new Error(errorData.error || "Error desconocido");
      }

    } catch (error) {
      console.error("Error en el proceso de inscripción:", error);
    }
  };

  const getPlaneacionesPorAsignatura = (asignaturaId) => {
    return planeaciones.filter(planeacion => planeacion.asignatura === asignaturaId);
  };

  return (
    <>
      <Navbar />
      <div className="px-44">
        <ImageCarousel />

        <Paper elevation={3} sx={{ padding: 2, width: '120%', marginLeft: '-10%' }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Asignaturas
          </Typography>

          <div className="grid grid-cols-4 gap-10">
            {asignaturas.map((asignatura, i) => {
              const planeacionesAsignatura = getPlaneacionesPorAsignatura(asignatura._id);
              return (
                planeacionesAsignatura.length > 0 && (
                  <Card key={i} sx={{ maxWidth: 380 }}>
                    <CardMedia
                      sx={{ height: 140 }}
                      image={'https://www.unadmexico.mx/images/OfertaEducativa/presPEsmall/20_GestionIndustrial.webp'}
                      title={asignatura.nombre}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {asignatura.nombre}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "text.secondary" }}>
                        Área: {asignatura.area}
                        <br />
                        Profesor: {asignatura.catedratico}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      {planeacionesAsignatura.map((planeacion) => (
                        <Button
                          key={planeacion._id}
                          size="small"
                          onClick={() => inscribirse( planeacion._id)} // Pasamos el ID de la planeación
                        >
                          Inscribirse a {planeacion.nombre}
                        </Button>
                      ))}
                    </CardActions>
                  </Card>
                )
              );
            })}
          </div>
        </Paper>
      </div>
      <br />
      <Footer />
    </>
  );
}
