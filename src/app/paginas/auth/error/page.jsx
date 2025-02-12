"use client"
import { useSearchParams } from "next/navigation";
import { Container, Typography, Button, Box } from "@mui/material";
import Link from "next/link";
import NavbarForLogin from "@/components/Navbars/NavBarForLogin/Navbar";

const ErrorPage = () => {
    const searchParams = useSearchParams();
    const reason = searchParams.get("reason");
    const status = searchParams.get("status") || "500"; // Código por defecto 500

    let errorMessage = "Ocurrió un error inesperado.";
    if (reason === "not-authenticated") {
        errorMessage = "No estás autenticado. Por favor, inicia sesión.";
    } else if (reason === "not-authorized") {
        errorMessage = "No tienes permisos para acceder a esta página.";
    }

    return (
        <Box>
            <NavbarForLogin />
            <Container
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "90vh",
                    textAlign: "center",
                }}
            >

                <Box
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: '2rem', // Espacio entre la imagen y el texto
                    }}
                >
                    {/* Imagen */}
                    <Box>
                        <img
                            src="/404.gif" // Cambia esto por la ruta a tu imagen
                            alt="Not Found Illustration"
                            style={{
                                maxWidth: '400px', // Ajusta el tamaño de la imagen
                                height: 'auto',
                            }}
                        />
                    </Box>

                    {/* Contenido de texto */}
                    <Box style={{ textAlign: 'center' }} sx={{
                        textAlign:"center",
                        alignContent:"center",
                        alignItems: "center"
                    }}>
                        <Typography variant="h1" color="primary">
                            Error {status}
                        </Typography>
                        <Typography variant="h6" color="textSecondary" gutterBottom>
                            Lo intentamos, pero no pudo funcionar.
                        </Typography>
                        <Typography variant="body1" color="textSecondary" gutterBottom>
                            {errorMessage}
                        </Typography>
                        <br />
                        <Box sx={{
                            gap:2,
                            display:"flex",
                            alignItems: "center"
                        }}>
                            <Link href="/" passHref>
                                <Button variant="contained" color="primary">
                                    Volver al Inicio
                                </Button>
                            </Link>
                            <Link href="/paginas/auth/login" passHref>
                                <Button variant="contained" color="primary">
                                    Ir a Login
                                </Button>
                            </Link>
                        </Box>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default ErrorPage;
