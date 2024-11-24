import { getToken } from "@/services/auth";

class Estudiante {
    constructor() {
        this.token = getToken(); // Obtener el token de autenticación
        this.uploadedFiles = []; // Manejar archivos subidos (si necesario)
    }

    async fetchActividad(actividadId, setActividad, setProfessorFiles) {
        if (this.token) {
            try {
                const response = await fetch(`/api/actividades/${actividadId}`, {
                    headers: {
                        Authorization: `Bearer ${this.token}`, // Añadir token en las cabeceras
                    },
                });
                const data = await response.json();
                setActividad(data);
                setProfessorFiles(data.archivosProfesor || []);
            } catch (error) {
                console.error('Error al cargar la actividad:', error);
            }
        } else {
            console.error('Usuario no autenticado');
        }
    }

    // Método para subir archivos
    async uploadFile(event, setUploadedFiles) {
        if (this.token) {
            const files = event.target.files;
            const formData = new FormData();

            for (let i = 0; i < files.length; i++) {
                formData.append('files', files[i]);
            }

            try {
                const response = await fetch(`/api/tareas`, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        Authorization: `Bearer ${this.token}`, // Añadir token en las cabeceras
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    const fileNames = data.files.map(file => file.name);
                    setUploadedFiles([...this.uploadedFiles, ...fileNames]); // Actualizar lista de archivos subidos
                } else {
                    console.error('Error al subir archivos');
                }
            } catch (error) {
                console.error('Error al subir archivos:', error);
            }
        } else {
            console.error('Usuario no autenticado');
        }
    }
}

export default Estudiante;
