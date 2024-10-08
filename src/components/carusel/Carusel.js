"use client"; // Asegúrate de que este es el primer elemento en el archivo

import React, { useState } from "react";
import { Box, Card, CardMedia, Toolbar, Typography, IconButton } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const images = [
  "https://via.placeholder.com/800x300?text=Image+1",
  "https://via.placeholder.com/800x300?text=Image+2",
  "https://via.placeholder.com/800x300?text=Image+3",
  "https://via.placeholder.com/800x300?text=Image+4",
];

export default function Carusel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <Box sx={{ width: "100%", position: "relative", padding: 2 }}>
      <Card>
        <CardMedia
          component="img"
          height="300"
          image={images[currentIndex]}
          alt={`Slide ${currentIndex + 1}`}
        />
        
        <Toolbar sx={{ position: "relative", width: "100%", top: "100%", transform: "translateY(-50%)", justifyContent: "space-between", background: "rgba(0, 0, 0, 0.5)" }}>
          <IconButton onClick={handlePrev} sx={{ color: "white" }}>
            <ArrowBackIcon />
          </IconButton>
      
          <IconButton onClick={handleNext} sx={{ color: "white" }}>
            <ArrowForwardIcon />
          </IconButton>
        </Toolbar>
      </Card>
    </Box>
  );
}
