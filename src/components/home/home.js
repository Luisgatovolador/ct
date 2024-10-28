"use client";

import ImageCarousel from "@/components/carusel/Carusel";
import * as React from "react";
import Footer from "@/components/footer/footer";
import NavbarStandard from "@/components/Navbars/navbarUsuarios/navbar";
import { Card, CardContent, Typography, Grid, Button } from '@mui/material';
import { getUser } from "@/services/auth";
import Navbar from "../Navbars/navbar";

export default function HomeStandard() {
  return (
    <>
    <script src="//code.tidio.co/9fhtfgifxdbqzldzttuatuy1oa4f4gwz.js" async></script>
      <div className="px-44">
        <ImageCarousel />

        {/* Título antes de las tarjetas */}
        <Typography variant="h3" component="h2" gutterBottom className="mt-12" align="center">
        CONÓCENOS
        </Typography>

        <Grid container spacing={4} className="mt-6" >
          <Grid item xs={12} md={4} sx={{marginLeft: '-7%', marginRight: "3%"}}>
            <Card sx={{ height: '100%', backgroundColor:"#bfdae2"}}>
              <CardContent>
                <Typography variant="h5" component="div" gutterBottom>
                  Misión
                </Typography>
                <Typography variant="body1">
                  En CT, nuestra misión es proporcionar una plataforma educativa
                  eficiente y accesible que permita a estudiantes y profesores
                  gestionar de manera efectiva la entrega de tareas, mejorando
                  el aprendizaje y la organización académica.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}  sx={{marginRight:'3%'}}>
            <Card sx={{ height: '100%' , backgroundColor:"#bfdae2"}}>
              <CardContent>
                <Typography variant="h5" component="div" gutterBottom>
                  Visión
                </Typography>
                <Typography variant="body1">
                  Aspiramos a ser la plataforma líder en la gestión educativa,
                  ofreciendo soluciones innovadoras que faciliten la
                  comunicación y el seguimiento del progreso académico,
                  impulsando una educación más dinámica y personalizada.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4} sx={{marginRight:'1%'}}>
            <Card sx={{ height: '100%', backgroundColor:"#bfdae2" }}>
              <CardContent>
                <Typography variant="h5" component="div" gutterBottom>
                  Valores
                </Typography>
                <ul>
                  <li>Compromiso con la educación de calidad</li>
                  <li>Innovación constante en soluciones educativas</li>
                  <li>Accesibilidad para estudiantes y profesores</li>
                  <li>Responsabilidad y transparencia en el seguimiento académico</li>
                  <li>Colaboración para fomentar un ambiente de aprendizaje</li>
                </ul>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
      <br />
      <Footer />
    </>
  );
}
