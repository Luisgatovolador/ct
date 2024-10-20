"use client";

import Navbar from "@/components/Navbars/navbarprofesores/navbar";
import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CardActions from "@mui/material/CardActions";
import Footer from "@/components/footer/footer";
import Paper from "@mui/material/Paper";
import { useEffect } from "react";
import Link from "next/link"; 

export default function Home() {
  const [asignaturas, setAsignaturas] = React.useState([]);
  const [profesores, setProfesores] = React.useState([]);

  useEffect(() => {
   
    const obtenerProfesores = async () => {
      try {
        const response = await fetch(
          "https://control-de-tareas-backend-production.up.railway.app/api/profesor/"
        );
        const data = await response.json();
        setProfesores(data);
      } catch (error) {
        console.error("Error al obtener los profesores", error);
      }
    };
    obtenerProfesores();
  }, []);

  useEffect(() => {
 
    const obtenerAsignaturas = async () => {
      try {
        const response = await fetch(
          "https://control-de-tareas-backend-production.up.railway.app/api/asignatura/"
        );
        const data = await response.json();
        setAsignaturas(data);
      } catch (error) {
        console.error("Error al obtener las asignaturas", error);
      }
    };
    obtenerAsignaturas();
  }, []);

 
  const asignaturasConProfesor = asignaturas.filter(asignatura =>
    profesores.some(profesor => profesor.asignaturas.includes(asignatura._id))
  );

  return (
    <>
      <Navbar />
      <br />
      <div className="px-44">
        <Paper elevation={3} sx={{ padding: 2 }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Asignaturas
          </Typography>

          <div className="grid grid-cols-3 gap-10">
            {asignaturasConProfesor.map((asignatura, i) => {
             
              const profesor = profesores.find(prof => prof.asignaturas.includes(asignatura._id));

              return (
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
                      Área: {asignatura.area}
                      <br />
                      Profesor: {profesor ? profesor.nombre : "Sin profesor"}
                    </Typography>
                  </CardContent>

                  <CardActions>
                    <Link href={`/paginas/profesores/asignatura/${asignatura._id}`} >
                      <Button size="small">
                        Ver más
                      </Button>
                    </Link>
                  </CardActions>
                </Card>
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
