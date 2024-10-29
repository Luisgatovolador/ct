"use client";


import Navbar from "@/components/Navbars/navbarprofesores/navbar";



import ImageCarousel from "@/components/carusel/Carusel";
import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CardActionArea from "@mui/material/CardActionArea";
import CardActions from "@mui/material/CardActions";
import Footer from "@/components/footer/footer";
import Paper from "@mui/material/Paper";
import { useEffect } from "react";

export default function Home() {
  const [asignaturas, setAsignatura] = React.useState([]);

  useEffect(() => {
    const Asignaturas = async () => {
      try {
        const response = await fetch(
          "https://control-de-tareas-backend-production.up.railway.app/api/asignatura/"
        );
        const data = await response.json();
        setAsignatura(data);
      } catch (error) {
        console.error("Error al obtener las asignaturas", error);
      }
    };
    Asignaturas();
  }, []);
  return (
    <>
      <Navbar />
      <div className="px-44">
        <ImageCarousel />

        <Paper elevation={3} sx={{ padding: 2, width: '120%', marginLeft:'-10%' }}>
          <Typography variant="h4" component="h2" gutterBottom sx={{textAlign:'center'}}>
            Asignaturas
          </Typography>

          <div className="grid grid-cols-3 gap-10">
            {asignaturas.map((asignatura, i) => (
              <Card key={i} sx={{ maxWidth: 345 , marginTop:'2%'}}>
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
                    Area: {asignatura.area}
                    <br />
                    Profesor: {asignatura.catedratico}
                  </Typography>
                </CardContent>

                <CardActions>
                 
                  <Button size="small">Inscribirse</Button>
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
