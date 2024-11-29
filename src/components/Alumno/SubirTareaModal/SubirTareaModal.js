import React, { useState } from "react";
import {
    Modal,
    Box,
    Typography,
    TextField,
    Button,
    CircularProgress,
} from "@mui/material";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const SubirTareaModal = ({ abierto, cerrarModal, actividadId, estudianteId }) => {
    const [archivo, setArchivo] = useState(null);
    const [subiendo, setSubiendo] = useState(false);
    const [mensaje, setMensaje] = useState("");

    const manejarCambioArchivo = (e) => {
        setArchivo(e.target.files[0]);
    };

    const manejarSubida = async () => {
        if (!archivo) {
            setMensaje("Por favor, selecciona un archivo.");
            return;
        }

        const formData = new FormData();
        formData.append("archivo", archivo);
        formData.append("actividadId", actividadId);
        formData.append("estudianteId", estudianteId);

        setSubiendo(true);
        setMensaje("");
        try {
            const respuesta = await fetch(`${API_URL}/actividad-conjunto/subir-tarea`, {
                method: "POST",
                body: formData,
            });
            console.log(respuesta)
            if (!respuesta.ok) {
                throw new Error("Error al subir la tarea.");
            }

            setMensaje("Tarea subida exitosamente.");
            cerrarModal();
        } catch (error) {
            console.error("Error al subir tarea:", error);
            setMensaje("Hubo un problema al subir la tarea. Inténtalo de nuevo.");
        } finally {
            setSubiendo(false);
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
                <Typography variant="h6" sx={{ mb: 2 }}>
                    Subir Tarea
                </Typography>
                <input
                    type="file"
                    onChange={manejarCambioArchivo}
                    style={{ marginBottom: 16 }}
                />
                {subiendo ? (
                    <CircularProgress />
                ) : (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={manejarSubida}
                        sx={{ margin: 2 }}
                    >
                        Subir
                    </Button>
                )}
                {mensaje && (
                    <Typography
                        variant="body2"
                        color={mensaje.includes("exitosamente") ? "green" : "error"}
                        sx={{ padding: 2}}
                    >
                        {mensaje}
                    </Typography>
                )}
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={cerrarModal}
                    disabled={subiendo}
                >
                    Cancelar
                </Button>
            </Box>
        </Modal>
    );
};

export default SubirTareaModal;
