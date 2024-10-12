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
  MenuItem,
  Pagination,
  IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Navbar from '@/components/navbar/navbar';
import Footer from '@/components/footer/footer';

const Page = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [busquedaNombre, setBusquedaNombre] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const usuariosPorPagina = 5;
  const [nuevoUsuario, setNuevoUsuario] = useState({ nombre: "", email: "", rol: "", asignaturas: [], area: "" });
  const [modoEdicion, setModoEdicion] = useState(false);
  const [usuarioAEditar, setUsuarioAEditar] = useState(null);

  // Obtener los usuarios del backend al cargar el componente
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await fetch('/api/usuarios');
        const data = await response.json();
        setUsuarios(data);
      } catch (error) {
        console.error('Error al obtener los usuarios:', error);
      }
    };

    fetchUsuarios();
  }, []);

  // Filtro por nombre del usuario
  const usuariosFiltrados = usuarios.filter((usuario) =>
    usuario.nombre.toLowerCase().includes(busquedaNombre.toLowerCase())
  );

  // Paginación de los usuarios
  const inicioPagina = (paginaActual - 1) * usuariosPorPagina;
  const usuariosPaginados = usuariosFiltrados.slice(inicioPagina, inicioPagina + usuariosPorPagina);
  const totalPaginas = Math.ceil(usuariosFiltrados.length / usuariosPorPagina);

  // Agregar o actualizar un usuario en la base de datos
  const manejarAgregarUsuario = async () => {
    try {
      if (modoEdicion) {
        // Actualizar usuario
        const response = await fetch(`/api/usuarios/${usuarioAEditar.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(nuevoUsuario),
        });

        if (response.ok) {
          const updatedUsuario = await response.json();
          setUsuarios(usuarios.map(usuario => (usuario.id === updatedUsuario.id ? updatedUsuario : usuario)));
          setModoEdicion(false);
          setUsuarioAEditar(null);
        }
      } else {
        // Crear nuevo usuario
        const response = await fetch('/api/usuarios', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(nuevoUsuario),
        });

        if (response.ok) {
          const nuevoUsuarioResponse = await response.json();
          setUsuarios([...usuarios, nuevoUsuarioResponse]);
        }
      }

      setNuevoUsuario({ nombre: "", email: "", rol: "", asignaturas: [], area: "" });
    } catch (error) {
      console.error('Error al agregar o actualizar el usuario:', error);
    }
  };

  // Eliminar un usuario de la base de datos
  const manejarEliminarUsuario = async (id) => {
    try {
      const response = await fetch(`/api/usuarios/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setUsuarios(usuarios.filter(usuario => usuario.id !== id));
      }
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
    }
  };

  // Preparar la edición de un usuario
  const manejarEditarUsuario = (usuario) => {
    setModoEdicion(true);
    setUsuarioAEditar(usuario);
    setNuevoUsuario({ nombre: usuario.nombre, email: usuario.email, rol: usuario.rol, asignaturas: usuario.asignaturas || [], area: usuario.area || "" });
  };

  return (
    <>
      <Navbar />

      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Container maxWidth="lg" sx={{ mt: 4, flexGrow: 1 }}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            {/* Filtro por nombre */}
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Buscar usuario por nombre"
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

        {/* Panel para agregar y editar usuarios */}
        <Container maxWidth="lg" sx={{ mt: 4, flexGrow: 1 }}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h5" component="h3" gutterBottom>
              {modoEdicion ? "Editar Usuario" : "Agregar Nuevo Usuario"}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Nombre"
                  variant="outlined"
                  fullWidth
                  value={nuevoUsuario.nombre}
                  onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, nombre: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  value={nuevoUsuario.email}
                  onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, email: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  label="Rol"
                  variant="outlined"
                  fullWidth
                  value={nuevoUsuario.rol}
                  onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, rol: e.target.value })}
                >
                  <MenuItem value="Profesor">Profesor</MenuItem>
                  <MenuItem value="Administrador">Administrador</MenuItem>
                  <MenuItem value="Estudiante">Estudiante</MenuItem>
                </TextField>
              </Grid>
              {nuevoUsuario.rol === "Estudiante" && (
                <>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Área"
                      variant="outlined"
                      fullWidth
                      value={nuevoUsuario.area}
                      onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, area: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Asignaturas (separar por comas)"
                      variant="outlined"
                      fullWidth
                      value={nuevoUsuario.asignaturas.join(", ")}
                      onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, asignaturas: e.target.value.split(",").map(item => item.trim()) })}
                    />
                  </Grid>
                </>
              )}
            </Grid>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              onClick={manejarAgregarUsuario}
            >
              {modoEdicion ? "Actualizar Usuario" : "Agregar Usuario"}
            </Button>
          </Paper>
        </Container>

        {/* Lista de usuarios filtrados */}
        <Container maxWidth="lg" sx={{ mt: 4, flexGrow: 1 }}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h5" component="h3" gutterBottom>
              Usuarios
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box sx={{ padding: 2 }}>
                  {usuariosPaginados.length > 0 ? (
                    usuariosPaginados.map((usuario) => (
                      <Card key={usuario.id} sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Typography variant="h6">{usuario.nombre} ({usuario.rol})</Typography>
                          <Typography color="textSecondary">Email: {usuario.email}</Typography>
                          <Typography color="textSecondary">Fecha de Registro: {usuario.fechaRegistro}</Typography>
                          {usuario.rol === "Estudiante" && (
                            <>
                              <Typography color="textSecondary">Área: {usuario.area}</Typography>
                              <Typography color="textSecondary">Asignaturas: {usuario.asignaturas.join(", ")}</Typography>
                            </>
                          )}
                        </CardContent>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <IconButton color="primary" onClick={() => manejarEditarUsuario(usuario)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton color="error" onClick={() => manejarEliminarUsuario(usuario.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Card>
                    ))
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      No hay usuarios que mostrar.
                    </Typography>
                  )}
                </Box>
              </Grid>
            </Grid>
            {totalPaginas > 1 && (
              <Pagination
                count={totalPaginas}
                page={paginaActual}
                onChange={(e, value) => setPaginaActual(value)}
                sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}
              />
            )}
          </Paper>
        </Container>

        <Footer />
      </Box>
    </>
  );
};

export default Page;
