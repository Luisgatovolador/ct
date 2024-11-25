"use client";

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
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Navbar from '@/components/Navbars/navbar';
import Footer from '@/components/footer/footer';

const Page = () => {
  const [administradores, setAdministradores] = useState([]);
  const [roles, setRoles] = useState([]);
  const [busquedaNombre, setBusquedaNombre] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const administradoresPorPagina = 5;
  const [nuevoAdministrador, setNuevoAdministrador] = useState({ nombre: "", email: "", password: "", rol: "" });
  const [modoEdicion, setModoEdicion] = useState(false);
  const [administradorAEditar, setAdministradorAEditar] = useState(null);
  
  const API_URL = "http:localhost:3001/api/";
  // Obtener los administradores del backend
  useEffect(() => {
    const fetchAdministradores = async () => {
      try {
        const response = await fetch(`${API_URL}administrador`);
        const data = await response.json();
        
        if (Array.isArray(data)) {
          setAdministradores(data);
        } else {
          console.error('La respuesta no es un arreglo:', data);
          setAdministradores([]);
        }
      } catch (error) {
        console.error('Error al obtener los administradores:', error);
      }
    };

    fetchAdministradores();
  }, []);

  // Obtener los roles del backend
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const responseRoles = await fetch(`${API_URL}rol/`);
        const dataRoles = await responseRoles.json();
        setRoles(dataRoles);
      } catch (error) {
        console.error("Error al obtener roles:", error);
      }
    };
    fetchRoles();
  }, []);

  // Filtro por nombre del administrador
  const administradoresFiltrados = administradores.filter((admin) =>
    admin.nombre.toLowerCase().includes(busquedaNombre.toLowerCase())
  );

  // Paginación de los administradores
  const inicioPagina = (paginaActual - 1) * administradoresPorPagina;
  const administradoresPaginados = administradoresFiltrados.slice(inicioPagina, inicioPagina + administradoresPorPagina);
  const totalPaginas = Math.ceil(administradoresFiltrados.length / administradoresPorPagina);

  // Agregar o actualizar un administrador en la base de datos
  const manejarAgregarAdministrador = async () => {
    const { nombre, email, password, rol } = nuevoAdministrador;

    // Validación de campos
    if (!nombre || !email || !password || !rol) {
      console.error("Todos los campos deben estar completos.");
      return;
    }

    try {
      if (modoEdicion) {
        const response = await fetch(`${API_URL}administrador/${administradorAEditar._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(nuevoAdministrador),
        });

        if (response.ok) {
          const updatedAdministrador = await response.json();
          setAdministradores(administradores.map(admin => (admin._id === updatedAdministrador._id ? updatedAdministrador : admin)));
          setModoEdicion(false);
          setAdministradorAEditar(null);
        }
      } else {
        const response = await fetch(`${API_URL}administrador`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(nuevoAdministrador),
        });
        console.log("Datos que se envían:", nuevoAdministrador);


        if (response.ok) {
          const nuevoAdministradorResponse = await response.json();
          setAdministradores([...administradores, nuevoAdministradorResponse]);
        }
      }

      // Resetear formulario
      setNuevoAdministrador({ nombre: "", email: "", password: "", rol: "" });
    } catch (error) {
      console.error('Error al agregar o actualizar el administrador:', error);
    }
  };

  // Eliminar un administrador de la base de datos
  const manejarEliminarAdministrador = async (id) => {
    try {
      const response = await fetch(`${API_URL}administrador/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setAdministradores(administradores.filter(admin => admin._id !== id));
      }
    } catch (error) {
      console.error('Error al eliminar el administrador:', error);
    }
  };

  // Preparar la edición de un administrador
  const manejarEditarAdministrador = (admin) => {
    setModoEdicion(true);
    setAdministradorAEditar(admin);
    setNuevoAdministrador({ nombre: admin.nombre, email: admin.email, password: "", rol: admin.rol });
  };

  return (
    <>
      <Navbar />

      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Container maxWidth="lg" sx={{ mt: 4, flexGrow: 1 }}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Buscar administrador por nombre"
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
                  Buscar
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Container>

        {/* Panel para agregar y editar administradores */}
        <Container maxWidth="lg" sx={{ mt: 4, flexGrow: 1 }}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h5" component="h3" gutterBottom>
              {modoEdicion ? "Editar Administrador" : "Agregar Nuevo Administrador"}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Nombre"
                  variant="outlined"
                  fullWidth
                  value={nuevoAdministrador.nombre}
                  onChange={(e) => setNuevoAdministrador({ ...nuevoAdministrador, nombre: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  value={nuevoAdministrador.email}
                  onChange={(e) => setNuevoAdministrador({ ...nuevoAdministrador, email: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Contraseña"
                  variant="outlined"
                  type="password"
                  fullWidth
                  value={nuevoAdministrador.password}
                  onChange={(e) => setNuevoAdministrador({ ...nuevoAdministrador, password: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel>Rol</InputLabel>
                  <Select
                    label="Rol"
                    value={nuevoAdministrador.rol}
                    onChange={(e) =>
                      setNuevoAdministrador({ ...nuevoAdministrador, rol: e.target.value })
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
            </Grid>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              onClick={manejarAgregarAdministrador}
            >
              {modoEdicion ? "Actualizar Administrador" : "Agregar Administrador"}
            </Button>
          </Paper>
        </Container>

        {/* Lista de administradores filtrados */}
        <Container maxWidth="lg" sx={{ mt: 4, flexGrow: 1 }}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h5" component="h3" gutterBottom>
              Administradores
            </Typography>
            {administradoresPaginados.map((admin) => (
              <Card key={admin._id} sx={{ marginBottom: 2 }}>
                <CardContent>
                  <Typography variant="h6">{admin.nombre}</Typography>
                  <Typography variant="body1">Email: {admin.email}</Typography>
                  <Typography variant="body2">Rol: {admin.rol}</Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <IconButton color="primary" onClick={() => manejarEditarAdministrador(admin)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => manejarEliminarAdministrador(admin._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Paper>
        </Container>

        <Container sx={{ display: 'flex', justifyContent: 'center', padding: 2 }}>
          <Pagination
            count={totalPaginas}
            page={paginaActual}
            onChange={(event, value) => setPaginaActual(value)}
            color="primary"
          />
        </Container>
      </Box>

      <Footer />
    </>
  );
};

export default Page;
