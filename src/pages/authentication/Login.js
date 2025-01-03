import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../../layout/Breadcrumbs';
import { Box, Button } from '@mui/material';
import StepperComponent from './StepperComponent';
import RoleSelection from './steps/RoleSelection';
import LoginTaxisnet from './steps/LoginTaxisnet';
import './authentication.css';
import '../../style.css';

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import PsychologyAltIcon from '@mui/icons-material/PsychologyAlt';
import LoginIcon from '@mui/icons-material/Login';

const loginSteps = [
    { label: 'Επιλογή Ομάδας', icon: <PsychologyAltIcon style={{ fontSize: 50 }} /> },
    { label: 'Σύνδεση', icon: <LoginIcon style={{ fontSize: 40 }} /> },
];

function Login() {
    const [activeStep, setActiveStep] = useState(0);

    const handleNext = () => {
        if (activeStep < loginSteps.length - 1) {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

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
                <Box sx={{ width: '100%', marginTop: '2rem' }}>
                    <StepperComponent steps={loginSteps} activeStep={activeStep} />
                </Box>
                <Box sx={{ marginTop: '2rem', width: '100%', flexGrow: 1 }}>
                    {activeStep === 0 && <RoleSelection />}
                    {activeStep === 1 && <LoginTaxisnet />}
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', width: '100%' }}>
                    <Button
                        variant='contained'
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        sx={{
                            padding: '0.75rem 1.5rem',
                            fontSize: '1rem',
                            backgroundColor: 'var(--clr-violet)',
                            '&:hover': {
                                opacity: 0.8,
                            },
                        }}
                        startIcon={<ArrowBackIosIcon />}
                    >
                        Πίσω
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleNext}
                        disabled={activeStep === loginSteps.length - 1}
                        sx={{
                            padding: '0.75rem 1.5rem',
                            fontSize: '1rem',
                            backgroundColor: 'var(--clr-violet)',
                            '&:hover': {
                                opacity: 0.8,
                            },
                        }}
                        endIcon={<ArrowForwardIosIcon />}
                    >
                        Επόμενο
                    </Button>
                </Box>
            </Box>
        </>
    );
}

export default Login;