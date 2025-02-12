import NavbarForLogin from '@/components/Navbars/NavBarForLogin/Navbar';
import { Button, Container, Typography, Box } from '@mui/material';
import Link from 'next/link';

export default function NotFound() {
    return (
        <Box>
            <NavbarForLogin />
            <Container
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh', // Ocupa toda la altura de la pantalla
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
                                maxWidth: '250px', // Ajusta el tamaño de la imagen
                                height: 'auto',
                            }}
                        />
                    </Box>

                    {/* Contenido de texto */}
                    <Box style={{ textAlign: 'center' }}>
                        <Typography variant="h1" color="primary">
                            404
                        </Typography>
                        <Typography variant="h6" color="textSecondary" gutterBottom>
                            Lo intentamos, pero no pudo funcionar. No lo pudimos encontrar.
                        </Typography>
                        <Typography variant="body1" color="textSecondary" gutterBottom>
                            Asegúrese de ingresar la URL correcta. Si algún
                            elemento lo dirigió aquí, por favor háganoslo
                            saber. Intente utilizar alguno de los enlaces que
                            se encuentran debajo.
                        </Typography>
                        <br />
                        <Link href="/" passHref>
                            <Button variant="contained" color="primary">
                                Volver al Inicio
                            </Button>
                        </Link>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}
