import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../../layout/Breadcrumbs';
import { Box } from '@mui/material';

function Login() {
    return (
        <>
            <Breadcrumbs current="Σύνδεση" />
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', margin: '1rem', flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
                    <h1 className="login-header">Σύνδεση στη Πλατοφορμα</h1>
                    <p className="login-text">
                        Δεν έχετε λογαριασμό; <Link to="/signup" className="signup-link">Κάντε εγγραφή</Link>
                    </p>
                </Box>
            </Box>
        </>
    );
}

export default Login;