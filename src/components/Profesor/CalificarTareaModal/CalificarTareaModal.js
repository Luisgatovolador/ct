import React, { useState } from "react";
import { Box, Typography, Modal, Button, TextField, CircularProgress, Alert, } from "@mui/material";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const CalificarTareaModal = ({ abierto, cerrarModal, actividadId, estudianteId, profesorId, onCalificacionCompletada, }) => {
    const [calificacion, setCalificacion] = useState("");
    const [retroalimentacion, setRetroalimentacion] = useState("");
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);
    const [exito, setExito] = useState(false);

    const enviarCalificacion = async () => {
        setCargando(true);
        setError(null);
        setExito(false);
        const dataForm = {
            actividadId: actividadId,
            estudianteId: estudianteId._id,
            profesorId: profesorId,
            calificacion: parseFloat(calificacion),
            retroalimentacion: retroalimentacion,
        }

        try {
            const respuesta = await fetch(`${API_URL}/actividad-conjunto/calificar`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dataForm),
            });

            if (!respuesta.ok) {
                const errorData = await respuesta.json();
                throw new Error(errorData.message || "Error al calificar la tarea.");
            }

            setExito(true);
            onCalificacionCompletada(); // Llamar a un callback para actualizar la vista principal.
            cerrarModal();
        } catch (err) {
            setError(err.message);
        } finally {
            setCargando(false);
        }
    };

    return (
        <Modal open={abierto} onClose={cerrarModal}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 400,
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                }}
            >
                <Typography variant="h6" mb={2}>
                    Calificar Tarea
                </Typography>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {exito && <Alert severity="success" sx={{ mb: 2 }}>¡Calificación registrada con éxito!</Alert>}

                <TextField
                    label="Calificación"
                    type="number"
                    inputProps={{ min: 0, max: 10, step: 0.1 }}
                    fullWidth
                    value={calificacion}
                    onChange={(e) => setCalificacion(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Retroalimentación"
                    multiline
                    rows={4}
                    fullWidth
                    value={retroalimentacion}
                    onChange={(e) => setRetroalimentacion(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                    <Button variant="outlined" onClick={cerrarModal}>
                        Cancelar
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={enviarCalificacion}
                        disabled={cargando || !calificacion}
                    >
                        {cargando ? <CircularProgress size={24} /> : "Enviar"}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default CalificarTareaModal;
