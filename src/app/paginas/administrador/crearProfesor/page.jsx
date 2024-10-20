'use client';  // Asegúrate de que está en el lado del cliente

import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Navbar from '@/components/Navbars/navbar';
import Footer from '@/components/footer/footer';

const Page = () => {
  const [profesores, setProfesores] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [roles, setRoles] = useState([]);
  const [busquedaNombre, setBusquedaNombre] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const profesoresPorPagina = 5;

  const [nuevoProfesor, setNuevoProfesor] = useState({
    nombre: "",
    email: "",
    area: "",
    rol: "",  // Aquí guardaremos el ID del rol
    asignaturas: [],  // Aquí guardaremos los IDs de las asignaturas
    password: "",
    confirmarPassword: ""
  });

  const [modoEdicion, setModoEdicion] = useState(false);
  const [profesorAEditar, setProfesorAEditar] = useState(null);

  useEffect(() => {
    const fetchProfesores = async () => {
      try {
        const response = await fetch('https://control-de-tareas-backend-production.up.railway.app/api/profesor/');
        const data = await response.json();
        if (Array.isArray(data)) {
          setProfesores(data);
        } else {
          console.error('Los datos recibidos no son un array:', data);
        }
      } catch (error) {
        console.error('Error al obtener los profesores:', error);
      }
    };

    fetchProfesores();
  }, []);

  useEffect(() => {
    const fetchMateriasYRoles = async () => {
      try {
        const responseMaterias = await fetch('https://control-de-tareas-backend-production.up.railway.app/api/asignatura/');
        const dataMaterias = await responseMaterias.json();
        setMaterias(dataMaterias);

        const responseRoles = await fetch('https://control-de-tareas-backend-production.up.railway.app/api/rol/');
        const dataRoles = await responseRoles.json();
        setRoles(dataRoles);
      } catch (error) {
        console.error('Error al obtener materias y roles:', error);
      }
    };

    fetchMateriasYRoles();
  }, []);

  const profesoresFiltrados = Array.isArray(profesores)
    ? profesores.filter((profesor) =>
        profesor.nombre.toLowerCase().includes(busquedaNombre.toLowerCase())
      )
    : [];

  const inicioPagina = (paginaActual - 1) * profesoresPorPagina;
  const profesoresPaginados = profesoresFiltrados.slice(inicioPagina, inicioPagina + profesoresPorPagina);
  const totalPaginas = Math.ceil(profesoresFiltrados.length / profesoresPorPagina);

  const manejarAgregarProfesor = async () => {
    try {
      if (modoEdicion && profesorAEditar) {
        const response = await fetch(
          `https://control-de-tareas-backend-production.up.railway.app/api/profesor/${profesorAEditar._id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(nuevoProfesor),
          }
        );
      

        if (response.ok) {
          const updatedProfesor = await response.json();
          setProfesores(
            profesores.map((profesor) =>
              profesor.id === updatedProfesor.id ? updatedProfesor : profesor
            )
          );
          setModoEdicion(false);
          setProfesorAEditar(null);
          window.location.reload()
        }
      } else {
        const response = await fetch(
          'https://control-de-tareas-backend-production.up.railway.app/api/profesor/',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(nuevoProfesor),
          }
        );
        
        if (response.ok) {
          const nuevoProfesorResponse = await response.json();
          setProfesores([...profesores, nuevoProfesorResponse]);
        }
      }

      setNuevoProfesor({
        nombre: "",
        email: "",
        area: "",
        rol: "",  
        asignaturas: [],
        password: "",
        confirmarPassword: ""
      });
      window.location.reload()
    } catch (error) {
      console.error('Error al agregar o actualizar el profesor:', error);
    }
  };

  const manejarEliminarProfesor = async (id) => {
    try {
      const response = await fetch(
        `https://control-de-tareas-backend-production.up.railway.app/api/profesor/${id}`,
        {
          method: 'DELETE',
        }
      );

      if (response.ok) {
        setProfesores(profesores.filter((profesor) => profesor.id !== id));
        window.location.reload()
      }
    } catch (error) {
      console.error('Error al eliminar el profesor:', error);
    }
  };

  const manejarEditarProfesor = (profesor) => {
    setModoEdicion(true);
    setProfesorAEditar(profesor);
    setNuevoProfesor({
      nombre: profesor.nombre,
      email: profesor.email,
      area: profesor.area,
      rol: profesor.rol,
      asignaturas: profesor.asignaturas || [],
      password: "",
      confirmarPassword: ""
    });
  };

  return (
    <>
      <Navbar />

      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
       

        <Container maxWidth="lg" sx={{ mt: 4, flexGrow: 1 }}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h5" component="h3" gutterBottom>
              {modoEdicion ? "Editar Profesor" : "Agregar Nuevo Profesor"}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Nombre"
                  variant="outlined"
                  fullWidth
                  value={nuevoProfesor.nombre}
                  onChange={(e) => setNuevoProfesor({ ...nuevoProfesor, nombre: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  value={nuevoProfesor.email}
                  onChange={(e) => setNuevoProfesor({ ...nuevoProfesor, email: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel>Asignaturas</InputLabel>
                  <Select
                    label="Asignaturas"
                    multiple
                    value={nuevoProfesor.asignaturas}
                    onChange={(e) => setNuevoProfesor({ ...nuevoProfesor, asignaturas: e.target.value })}
                    renderValue={(selected) => selected.join(', ')}
                  >
                    {materias.map((asignaturas) => (
                      <MenuItem key={asignaturas._id} value={asignaturas._id}>
                        <Checkbox checked={nuevoProfesor.asignaturas.includes(asignaturas._id)} />
                        <ListItemText primary={asignaturas.nombre} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel>Rol</InputLabel>
                  <Select
                    label="Rol"
                    value={nuevoProfesor.rol}
                    onChange={(e) => setNuevoProfesor({ ...nuevoProfesor, rol: e.target.value })}
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
                <TextField
                  label="Contraseña"
                  type="password"
                  variant="outlined"
                  fullWidth
                  value={nuevoProfesor.password}
                  onChange={(e) => setNuevoProfesor({ ...nuevoProfesor, password: e.target.value })}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Confirmar Contraseña"
                  type="password"
                  variant="outlined"
                  fullWidth
                  value={nuevoProfesor.confirmarPassword}
                  onChange={(e) => setNuevoProfesor({ ...nuevoProfesor, confirmarPassword: e.target.value })}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={manejarAgregarProfesor}
                >
                  {modoEdicion ? "Guardar Cambios" : "Agregar Profesor"}
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Container>

        <Container maxWidth="lg" sx={{ mt: 4, flexGrow: 1 }}>
        
          <Paper elevation={3} sx={{ padding: 2 }}>
         
            <Typography variant="h5" component="h3" gutterBottom>
              Listado de Profesores
            </Typography>
           
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Buscar profesor por nombre"
                  variant="outlined"
                  fullWidth
                  value={busquedaNombre}
                  onChange={(e) => setBusquedaNombre(e.target.value)}
                />
              </Grid>

              <Grid item xs={12} md={2}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ height: '100%' }}
                  onClick={() => setBusquedaNombre("")}
                >
                  Limpiar 
                </Button>
              </Grid>
            </Grid>
       
       <br />

            <div className="grid grid-cols-2 gap-10">
            {profesoresPaginados.map((profesor) => (
              
              <Card key={profesor.id} sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6" component="h4">
                    {profesor.nombre}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    Email: {profesor.email}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    Rol: {profesor.rol}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    Asignaturas: {profesor.asignaturas.join(', ')}
                  </Typography>
                  <Box mt={2}>
                    <IconButton color="primary" onClick={() => manejarEditarProfesor(profesor)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="secondary" onClick={() => manejarEliminarProfesor(profesor._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardContent>
               
              </Card>
             
            ))}
             </div>

            <Pagination
              count={totalPaginas}
              page={paginaActual}
              onChange={(event, value) => setPaginaActual(value)}
              sx={{ mt: 2 }}
            />
            
          </Paper>
         
        </Container>
      </Box>

      <Footer />
    </>
  );
};

export default Page;
