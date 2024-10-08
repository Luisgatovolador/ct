import { Asignaturas } from "./ejemplo";
import Navbar from "@/components/navbar/navbar";
import ImageCarousel from "@/components/carusel/Carusel"
import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CardActionArea from "@mui/material/CardActionArea";
import CardActions from "@mui/material/CardActions";


export default function Home() {
  return (
    <>
      <Navbar />
      <div className="px-44">
        <ImageCarousel></ImageCarousel>

        <h1 className="text-3xl font-bold my-10">Asignaturas</h1>

        <div className="grid grid-cols-3 gap-10">
          {Asignaturas.map((asignatura, i) => (
            <Card key={i} sx={{ maxWidth: 345 }}>
             
                <CardMedia
                  sx={{ height: 140 }}
                  image={asignatura.image}  
                  title={asignatura.nombre} 
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {asignatura.nombre}  
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Carrera: {asignatura.carrera} 
                    <br />
                    Profesor: {asignatura.catedratico.join(", ")} 
                  </Typography>
                </CardContent>
              
              <CardActions>
                <Button size="small">Detalles</Button>
                <Button size="small">Inscribirse</Button>
              </CardActions>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
