"use client";

import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  TextField,
  Paper,
  Pagination,
  IconButton,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Checkbox,
  ListItemText,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Navbar from '@/components/Navbars/navbar';
import Footer from "@/components/footer/footer";

const Page = () => {
  const [alumnos, setAlumnos] = useState([]);
  const [busquedaNombre, setBusquedaNombre] = useState("");
  const [busquedaArea, setBusquedaArea] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [roles, setRoles] = useState([]);
  const [areas, setAreas] = useState([]);
  const alumnosPorPagina = 4;
  const [nuevoAlumno, setNuevoAlumno] = useState({
    nombre: "",
    email: "",
    rol: "",
    password: "",
    area: "",
  });
  const [modoEdicion, setModoEdicion] = useState(false);
  const [alumnoAEditar, setAlumnoAEditar] = useState(null);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const responseRoles = await fetch(
          "https://control-de-tareas-backend-production.up.railway.app/api/rol/"
        );
        const dataRoles = await responseRoles.json();
        setRoles(dataRoles);
      } catch (error) {
        console.error("Error al obtener roles:", error);
      }
    };
    fetchRoles();
  }, []);

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const responseAreas = await fetch(
          "https://control-de-tareas-backend-production.up.railway.app/api/area/"
        );
        const dataAreas = await responseAreas.json();
        setAreas(dataAreas);
      } catch (error) {
        console.error("Error al obtener areas:", error);
      }
    };
    fetchAreas();
  }, []);

  // Obtener los alumnos del backend al cargar el componente
  useEffect(() => {
    const fetchAlumnos = async () => {
      try {
        const response = await fetch(
          "https://control-de-tareas-backend-production.up.railway.app/api/alumno/"
        );
        const data = await response.json();
        setAlumnos(data);
      } catch (error) {
        console.error("Error al obtener los alumnos:", error);
      }
    };
    fetchAlumnos();
  }, []);

  // Filtro por nombre y área del alumno
  const alumnosFiltrados = alumnos.filter(
    (alumno) =>
      alumno.nombre.toLowerCase().includes(busquedaNombre.toLowerCase()) &&
      (areas.find((area) => area._id === alumno.area)?.nombre || "")
        .toLowerCase()
        .includes(busquedaArea.toLowerCase())
  );

  // Paginación de los alumnos
  const inicioPagina = (paginaActual - 1) * alumnosPorPagina;
  const alumnosPaginados = alumnosFiltrados.slice(
    inicioPagina,
    inicioPagina + alumnosPorPagina
  );
  const totalPaginas = Math.ceil(alumnosFiltrados.length / alumnosPorPagina);

  const manejarAgregarAlumno = async () => {
    // Validación simple
    if (!nuevoAlumno.nombre || !nuevoAlumno.email || !nuevoAlumno.rol || !nuevoAlumno.password) {
      alert("Por favor, completa todos los campos requeridos.");
      return;
    }
  
    try {
      if (modoEdicion) {
        // Actualizar alumno
        const response = await fetch(
          `https://control-de-tareas-backend-production.up.railway.app/api/alumno/${alumnoAEditar._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(nuevoAlumno),
          }
        );
  
        if (response.ok) {
          const updatedAlumno = await response.json();
          setAlumnos(
            alumnos.map((al) =>
              al._id === updatedAlumno._id ? updatedAlumno : al
            )
          );
          setModoEdicion(false);
          setAlumnoAEditar(null);
        }
      } else {
        // Crear nuevo alumno
        const response = await fetch(
          "https://control-de-tareas-backend-production.up.railway.app/api/alumno/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(nuevoAlumno),
          }
        );
  
        if (response.ok) {
          const nuevoAlumnoResponse = await response.json();
          setAlumnos([...alumnos, nuevoAlumnoResponse]);
        }
      }
  
      setNuevoAlumno({
        nombre: "",
        email: "",
        rol: "",
        password: "",
        area: "",
      });
    } catch (error) {
      console.error("Error al agregar o actualizar el alumno:", error);
    }
  };
  
  // Eliminar un alumno de la base de datos
  const manejarEliminarAlumno = async (id) => {
    try {
      const response = await fetch(
        `https://control-de-tareas-backend-production.up.railway.app/api/alumno/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setAlumnos(alumnos.filter((al) => al._id !== id));
      }
    } catch (error) {
      console.error("Error al eliminar el alumno:", error);
    }
  };

  // Preparar la edición de un alumno
  const manejarEditarAlumno = (alumno) => {
    setModoEdicion(true);
    setAlumnoAEditar(alumno);
    setNuevoAlumno({
      nombre: alumno.nombre,
      email: alumno.email,
      rol: alumno.rol,
      password: "",
      area: alumno.area,
    });
  };

  return (
    <>
      <Navbar />

      <Box
        sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
      >
        

        {/* Panel para agregar y editar alumnos */}
        <Container maxWidth="lg" sx={{ mt: 4, flexGrow: 1 }}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h5" component="h3" gutterBottom>
              {modoEdicion ? "Editar Alumno" : "Agregar Nuevo Alumno"}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Nombre"
                  variant="outlined"
                  fullWidth
                  value={nuevoAlumno.nombre}
                  onChange={(e) =>
                    setNuevoAlumno({ ...nuevoAlumno, nombre: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  value={nuevoAlumno.email}
                  onChange={(e) =>
                    setNuevoAlumno({ ...nuevoAlumno, email: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel>Rol</InputLabel>
                  <Select
                    label="Rol"
                    value={nuevoAlumno.rol}
                    onChange={(e) =>
                      setNuevoAlumno({ ...nuevoAlumno, rol: e.target.value })
                    }
                  >
                    {roles.map((rol) => (
                      <MenuItem key={rol._id} value={rol._id}>
                        {rol.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel>Area</InputLabel>
                  <Select
                    label="Area"
                    value={nuevoAlumno.area}
                    onChange={(e) =>
                      setNuevoAlumno({ ...nuevoAlumno, area: e.target.value })
                    }
                  >
                    {areas.map((area) => (
                      <MenuItem key={area._id} value={area._id}>
                        {area.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Contraseña"
                  variant="outlined"
                  fullWidth
                  type="password"
                  value={nuevoAlumno.password}
                  onChange={(e) =>
                    setNuevoAlumno({ ...nuevoAlumno, password: e.target.value })
                  }
                />
              </Grid>
            </Grid>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              onClick={manejarAgregarAlumno}
            >
              {modoEdicion ? "Actualizar Alumno" : "Agregar Alumno"}
            </Button>
          </Paper>
        </Container>
        <Container maxWidth="lg" sx={{ mt: 4, flexGrow: 1 }}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            {/* Filtro por nombre y área */}
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Buscar por nombre"
                  variant="outlined"
                  fullWidth
                  value={busquedaNombre}
                  onChange={(e) => setBusquedaNombre(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel>Buscar por área</InputLabel>
                  <Select
                    label="Buscar por área"
                    value={busquedaArea}
                    onChange={(e) => setBusquedaArea(e.target.value)}
                  >
                    <MenuItem value="">
                      <em>Todos</em>
                    </MenuItem>
                    {areas.map((area) => (
                      <MenuItem key={area.nombre} value={area.nombre}>
                        {area.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>
        </Container>

        {/* Lista de alumnos filtrados */}
        <Container maxWidth="lg" sx={{ mt: 4, flexGrow: 1 }}>
          <Grid container spacing={2}>
            {alumnosPaginados.map((alumno) => (
              <Grid item xs={12} md={6} key={alumno._id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" component="h2">
                      {alumno.nombre}
                    </Typography>
                    <Typography color="textSecondary">
                      Email: {alumno.email}
                    </Typography>
                    <Typography color="textSecondary">
                      Rol:{" "}
                      {roles.find((rol) => rol._id === alumno.rol)?.nombre ||
                        "Desconocido"}
                    </Typography>
                    <Typography color="textSecondary">
                      Área:{" "}
                      {areas.find((area) => area._id === alumno.area)?.nombre ||
                        "Desconocido"}
                    </Typography>
                  </CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      padding: 1,
                    }}
                  >
                    <IconButton onClick={() => manejarEditarAlumno(alumno)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => manejarEliminarAlumno(alumno._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Paginación */}
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Pagination
              count={totalPaginas}
              page={paginaActual}
              onChange={(e, page) => setPaginaActual(page)}
            />
          </Box>
        </Container>
      </Box>

      <Footer />
    </>
  );
};

export default Page;
