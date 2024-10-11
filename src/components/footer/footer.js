'user client'

import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box 
      component="footer" 
      sx={{ 
        py: 3, 
        px: 2, 
        mt: 'auto', 
        backgroundColor: 'black', 
        textAlign: 'center'
      }}
    >
      <Typography variant="body2" color="white">
        © 2024 - Empresa, Inc. Todos los derechos reservados.
      </Typography>
    
    </Box>
  );
};

export default Footer;
