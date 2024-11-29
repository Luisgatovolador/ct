import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Button,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from "@mui/material";
import AgregarProfesorAActividadModal from "../AgregarProfesorAActividad/AgregarProfesorAActividad";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const ListaActividadesConjuntasCreadas = ({ idProfesor }) => {
    const [actividades, setActividades] = useState([]);
    const [profesores, setProfesores] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [modalAbierto, setModalAbierto] = useState(false);
    const [actividadSeleccionada, setActividadSeleccionada] = useState(null);

    const abrirModal = (actividadId) => {
        setActividadSeleccionada(actividadId);
        setModalAbierto(true);
    };

    const cerrarModal = () => {
        setModalAbierto(false);
        setActividadSeleccionada(null);
        obtenerActividades();
    };

    const obtenerProfesores = async () => {
        try {
            const respuesta = await fetch(`${API_URL}/profesor`);
            if (!respuesta.ok) {
                throw new Error("Error al obtener la lista de profesores");
            }
            const datos = await respuesta.json();
            setProfesores(datos);
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

    const eliminarActividad = async (actividadId) => {
        try {
            const respuesta = await fetch(`${API_URL}/actividad-conjunto/delete/${actividadId}`, {
                method: "DELETE",
            });
            if (!respuesta.ok) {
                throw new Error("Error al eliminar la actividad");
            }
            // Filtrar las actividades eliminadas
            setActividades((prevActividades) =>
                prevActividades.filter((actividad) => actividad._id !== actividadId)
            );
        } catch (error) {
            console.error("Error al eliminar la actividad:", error);
            alert("Ocurrió un error al intentar eliminar la actividad.");
        }
    };

    useEffect(() => {
        obtenerActividades();
        obtenerProfesores();
    }, []);

    const obtenerProfesorPorId = (profesorId) => {
        return profesores.find((profesor) => profesor._id === profesorId);
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

                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => eliminarActividad(actividad._id)}
                        sx={{ marginTop: 2 }}
                    >
                        Eliminar Actividad
                    </Button>

                    <div>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => abrirModal(actividad._id)}
                            sx={{ marginTop: 2 }}
                        >
                            Asignar Profesor
                        </Button>

                        <AgregarProfesorAActividadModal
                            actividadId={actividad._id}
                            abierto={modalAbierto && actividadSeleccionada === actividad._id}
                            cerrarModal={cerrarModal}
                        />
                    </div>
                </Box>
            ))}
        </Box>
    );
};

export default ListaActividadesConjuntasCreadas;
