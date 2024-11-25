import React, { useEffect, useState } from "react";
import { Box, Typography, Button, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import AgregarProfesorAActividadModal from "../AgregarProfesorAActividad/AgregarProfesorAActividad";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const ListaActividadesConjuntasCreadas = ({ idProfesor }) => {
    const [actividades, setActividades] = useState([]);
    const [profesores, setProfesores] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [modalAbierto, setModalAbierto] = useState(false);
    const [actividadSeleccionada, setActividadSeleccionada] = useState(null); // Guardamos la actividad seleccionada para pasarla al modal

    const abrirModal = (actividadId) => {
        setActividadSeleccionada(actividadId);
        setModalAbierto(true);
    };

    const cerrarModal = () => {
        setModalAbierto(false);
        setActividadSeleccionada(null);
        obtenerActividades(); // Recargar las actividades después de asignar un profesor
    };

    const obtenerProfesores = async () => {
        try {
            const respuesta = await fetch(`${API_URL}/profesor`);
            if (!respuesta.ok) {
                throw new Error("Error al obtener la lista de profesores");
            }
            const datos = await respuesta.json();
            setProfesores(datos); // Guardamos los datos de los profesores
        } catch (error) {
            console.error("Error al obtener profesores:", error);
            setError(error.message);
        }
    };

    const obtenerActividades = async () => {
        try {
            const respuesta = await fetch(`${API_URL}/actividad-conjunto/actividad-creadas-por-profesor/${idProfesor}`);
            if (!respuesta.ok) {
                throw new Error("Error al obtener las actividades");
            }
            const datos = await respuesta.json();
            setActividades(datos);
        } catch (err) {
            console.error("Error al obtener las actividades:", err);
            setError(err.message);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        obtenerActividades();
        obtenerProfesores();
    }, []);

    const obtenerProfesorPorId = (profesorId) => {
        return profesores.find(profesor => profesor._id === profesorId);
    };

    if (cargando) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ mt: 4, textAlign: "center" }}>
                <Typography variant="h6" color="error">
                    Ocurrió un error: {error}
                </Typography>
                <Button onClick={obtenerActividades} variant="contained" color="primary">
                    Reintentar
                </Button>
            </Box>
        );
    }

    if (actividades.length === 0) {
        return (
            <Box sx={{ mt: 4, textAlign: "center" }}>
                <Typography variant="h6">No hay actividades conjuntas disponibles.</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ mt: 4, p: 2 }}>
            <Typography variant="h5" color="primary" sx={{ marginBottom: 2 }}>
                Lista de Actividades Conjuntas Creadas
            </Typography>
            {actividades.map((actividad) => (
                <Box
                    key={actividad._id}
                    sx={{
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        padding: "16px",
                        backgroundColor: "#f9f9f9",
                        marginBottom: "16px",
                    }}
                >
                    <Typography variant="h6">{actividad.nombre}</Typography>
                    <Typography variant="body1">Descripción: {actividad.descripcion}</Typography>
                    <Typography variant="body2">Creador: {actividad.profesorCreador?.nombre}</Typography>
                    <Typography variant="body2">Asignatura: {actividad.asignatura?._id}</Typography>

                    {/* Mostrar profesores asignados */}
                    <Typography variant="subtitle1" sx={{ mt: 2 }}>Profesores Asignados:</Typography>
                    {actividad.profesores && actividad.profesores.length > 0 ? (
                        <TableContainer component={Paper} sx={{ mt: 2 }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Profesor</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {actividad.profesores.map((profesorId) => {
                                        const profesor = obtenerProfesorPorId(profesorId);
                                        return (
                                            <TableRow key={profesorId}>
                                                <TableCell>{profesor ? profesor.nombre : "Profesor no encontrado"}</TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    ) : (
                        <Typography variant="body2">No hay profesores asignados aún.</Typography>
                    )}

                    <div>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={() => abrirModal(actividad._id)}
                            sx={{marginTop: 2}}    
                        >
                            Asignar Profesor
                        </Button>

                        <AgregarProfesorAActividadModal
                            actividadId={actividad._id}
                            abierto={modalAbierto && actividadSeleccionada === actividad._id}
                            cerrarModal={cerrarModal}
                        />
                    </div>

                    <Typography variant="subtitle1" sx={{ mt: 2 }}>Tareas:</Typography>
                    {actividad.tareas.length > 0 ? (
                        <TableContainer component={Paper} sx={{ mt: 2 }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Alumno</TableCell>
                                        <TableCell>Archivo</TableCell>
                                        <TableCell>Fecha de Subida</TableCell>
                                        <TableCell>Calificación Promedio</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {actividad.tareas.map((tarea) => (
                                        <TableRow key={tarea._id}>
                                            <TableCell>{tarea.alumno?.nombre || "No disponible"}</TableCell>
                                            <TableCell>
                                                {tarea.archivo ? (
                                                    <Button href={tarea.archivo} target="_blank" rel="noopener noreferrer" variant="outlined">
                                                        Ver Archivo
                                                    </Button>
                                                ) : (
                                                    "No enviado"
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {new Date(tarea.fechaSubida).toLocaleDateString("es-ES") || "N/A"}
                                            </TableCell>
                                            <TableCell>{tarea.calificacionPromedio || "No calificado"}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    ) : (
                        <Typography variant="body2">No hay tareas disponibles.</Typography>
                    )}
                </Box>
            ))}
        </Box>
    );
};

export default ListaActividadesConjuntasCreadas;
