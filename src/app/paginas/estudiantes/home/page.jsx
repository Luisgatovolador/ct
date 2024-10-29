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

const API_URL = "http://localhost:3001/api";

export default function Home() {
  const [asignaturas, setAsignaturas] = useState([]);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchedUser = getUser();
    if (fetchedUser) {
      setUser(fetchedUser);
      fetchData(fetchedUser.id);
    }

    const fetchAsignaturas = async () => {
      try {
        const response = await fetch(`${API_URL}/asignatura/`);
        const data = await response.json();
        setAsignaturas(data);
      } catch (error) {
        console.error("Error al obtener las asignaturas", error);
      }
    };
    fetchAsignaturas();
  }, []);

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
      console.log(userData._id, asignaturaId)
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
  

  return (
    <>
      <Navbar />
      <div className="px-44">
        <ImageCarousel />
        <Paper elevation={3} sx={{ padding: 2 }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Asignaturas
          </Typography>
          <div className="grid grid-cols-3 gap-10">
            {asignaturas.map((asignatura, i) => (
              <Card key={i} sx={{ maxWidth: 345 }}>
                <CardMedia
                  sx={{ height: 140 }}
                  image={'https://via.placeholder.com/150'}
                  title={asignatura.nombre}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {asignatura.nombre}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Area: {asignatura.area}
                    <br />
                    Profesor: {asignatura.catedratico}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => inscribirse(asignatura._id)}>
                    Inscribirse
                  </Button>
                </CardActions>
              </Card>
            ))}
          </div>
        </Paper>
      </div>
      <br />
      <Footer />
    </>
  );
}
