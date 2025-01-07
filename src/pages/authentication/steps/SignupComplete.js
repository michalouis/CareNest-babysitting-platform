import React from 'react';
import { Box, Typography } from '@mui/material';

function SignupComplete() {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', textAlign: 'center' }}>
            <Typography variant="h1" sx={{ marginBottom: '1rem' }}>
                Congratulations!
            </Typography>
            <Typography variant="h5">
                Your signup is complete.
            </Typography>
        </Box>
    );
}

export default SignupComplete;