import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
} from "@mui/material";
import SubirTareaModal from "../SubirTareaModal/SubirTareaModal";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const VistaAlumno = ({ idAlumno, idAsignatura }) => {
    const [actividades, setActividades] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [modalAbierto, setModalAbierto] = useState(false);
    const [actividadSeleccionada, setActividadSeleccionada] = useState(null);
    const [profesor, setProfesor] = useState([]);

    const obtenerActividades = async () => {
        try {
            const respuesta = await fetch(`${API_URL}/actividad-conjunto/${idAlumno}/${idAsignatura}`);
            if (!respuesta.ok) {
                throw new Error("Error al obtener las actividades");
            }
            const datos = await respuesta.json();
            setActividades(datos);
        } catch (err) {
            setError("Error al cargar las actividades. Inténtalo más tarde.");
        } finally {
            setCargando(false);
        }
    };

    const fecthData = async () => {
        try {
            const respuesta = await fetch(`${API_URL}/profesor`);
            if (!respuesta.ok) {
                throw new Error("Error al obtener las actividades");
            }
            const datos = await respuesta.json();
            setProfesor(datos);
        } catch (error) {
            setError("en vivo desde hermosillo sonora")
        }
    }

    useEffect(() => {
        obtenerActividades();
        fecthData();
    }, [idAlumno, idAsignatura]);

    if (cargando) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ mt: 1, textAlign: "center" }}>
                <Typography variant="h6">{error}</Typography>
            </Box>
        );
    }

    if (actividades.length === 0) {
        return (
            <Box sx={{ mt: 4, textAlign: "center" }}>
                <Typography variant="h6">No tienes actividades asignadas.</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ mt: 4, p: 2 }}>
            <Typography variant="h5" color="primary" sx={{ marginBottom: 2 }}>
                Actividades Asignadas
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
                    <Button
                        href={`http://localhost:3001/uploads/${actividad.archivo}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="outlined"
                    >
                        Ver Archivo
                    </Button>
                    <Typography variant="body2">Profesor(es) asignado(s):</Typography>
                    {actividad.profesores && actividad.profesores.length > 0 ? (
                        <ul>
                            {actividad.profesores.map((profesor) => (
                                <li key={profesor._id}>{profesor.nombre || "Sin nombre"}</li>
                            ))}
                        </ul>
                    ) : (
                        <Typography variant="body2">No hay profesores asignados aún.</Typography>
                    )}

                    <Typography variant="subtitle1" sx={{ mt: 2 }}>Tareas:</Typography>
                    {actividad.tareas.length > 0 ? (
                        <TableContainer component={Paper} sx={{ mt: 2 }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Estado de Tarea</TableCell>
                                        <TableCell>Archivo Enviado</TableCell>
                                        <TableCell>Fecha de Subida</TableCell>
                                        <TableCell>Calificación Promedio</TableCell>
                                        <TableCell>Calificaciones Detalladas</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {actividad.tareas
                                        .filter((tarea) => tarea.alumno === idAlumno) // Mostrar solo las tareas del alumno
                                        .map((tarea) => (
                                            <TableRow key={tarea._id}>
                                                <TableCell>
                                                    {tarea.archivo ? "Tarea Enviada" : "Pendiente de Enviar"}
                                                </TableCell>
                                                <TableCell>
                                                    {tarea.archivo ? (
                                                        <Button
                                                            href={`http://localhost:3001/uploads/${tarea.archivo}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            variant="outlined"
                                                        >
                                                            Ver Archivo
                                                        </Button>
                                                    ) : (
                                                        "No enviado"
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {tarea.fechaSubida
                                                        ? new Date(tarea.fechaSubida).toLocaleDateString("es-ES")
                                                        : "N/A"}
                                                </TableCell>
                                                <TableCell>{tarea.calificacionPromedio || "No calificado"}</TableCell>
                                                <TableCell>
                                                    {tarea.calificaciones.length > 0 ? (
                                                        <Table size="small">
                                                            <TableHead>
                                                                <TableRow>
                                                                    <TableCell>Profesor</TableCell>
                                                                    <TableCell>Calificación</TableCell>
                                                                    <TableCell>Retroalimentación</TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {tarea.calificaciones.map((calificacion) => (
                                                                    <TableRow key={calificacion._id}>
                                                                        <TableCell>
                                                                            {profesor.find((p) => p._id === calificacion.profesor)?.nombre || "Anónimo"}
                                                                        </TableCell>

                                                                        <TableCell>{calificacion.calificacion}</TableCell>
                                                                        <TableCell>{calificacion.retroalimentacion || "Sin comentarios"}</TableCell>
                                                                    </TableRow>
                                                                ))}

                                                            </TableBody>
                                                        </Table>
                                                    ) : (
                                                        "No hay calificaciones asignadas."
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    ) : (
                        <Typography variant="body2">No hay tareas disponibles para esta actividad.</Typography>
                    )}

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            setActividadSeleccionada(actividad._id);
                            setModalAbierto(true);
                        }}
                        sx={{ mt: 2 }}
                    >
                        Subir Tarea
                    </Button>
                </Box>
            ))}

            {actividadSeleccionada && (
                <SubirTareaModal
                    abierto={modalAbierto}
                    cerrarModal={() => setModalAbierto(false)}
                    actividadId={actividadSeleccionada}
                    estudianteId={idAlumno}
                />
            )}
        </Box>
    );
};

export default VistaAlumno;
