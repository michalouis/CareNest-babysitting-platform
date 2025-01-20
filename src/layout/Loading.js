import React from 'react';
import { Box, CircularProgress } from '@mui/material';

// Loading component
function Loading() {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', textAlign: 'center' }}>
            <p style={{ fontSize: '2rem', marginBottom: '1rem' }}>
                Παρακαλω Περιμένετε...
            </p>
            <CircularProgress sx={{ color: 'var(--clr-purple-main)' }} />
        </Box>
    );
}

export default Loading;