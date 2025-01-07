import React from 'react';
import { Box } from '@mui/material';

function WelcomeBox() {
  return (
    <Box  sx={{
        backgroundColor: 'var(--clr-white)',
        padding: '1rem',
        margin: '1rem',
        borderRadius: '1rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        border: '1px',
        boxShadow: 2,
    }}>
        <p>Rodakina</p>
    </Box>
  );
}

function LoggedinNanny() {
  return (
    <Box>
      <WelcomeBox />
    </Box>
  );
}

export default LoggedinNanny;