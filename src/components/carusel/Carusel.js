"use client"; // Asegúrate de que este es el primer elemento en el archivo

import React, { useState, useEffect } from "react";
import { Box, Card, CardMedia, Toolbar, IconButton } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const images = [
  "/imagen1.jpg",
  "/imagen2.jpg",
  "/imagen3.jpg",
  "/tabla.png"
];

export default function Carusel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Cambiar a la siguiente imagen automáticamente cada 3 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Cambia el valor para ajustar la velocidad del carrusel

    return () => clearInterval(interval); // Limpia el intervalo al desmontar
  }, []);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <Box sx={{ width: "130%", position: "relative", padding: 2, marginLeft: "-15%" }}>
      <Card>
        <CardMedia
          component="img"
          image={images[currentIndex]}
          alt={`Slide ${currentIndex + 1}`}
          sx={{
            height: "500px",  // Altura fija para todas las imágenes
            width: "100%",  // Ancho al 100% del contenedor
            objectFit: "cover"  // Ajusta las imágenes al contenedor sin deformarlas
          }}
        />
        
       
      </Card>
    </Box>
  );
}
