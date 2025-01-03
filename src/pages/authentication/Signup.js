import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../../layout/Breadcrumbs';
import { Box, Button } from '@mui/material';
import StepperComponent from './StepperComponent';
import RoleSelection from './steps/RoleSelection';
import Information from './steps/Information';
import LoginTaxisnet from './steps/LoginTaxisnet';
import Createprofile from './steps/Createprofile';
import './authentication.css';
import '../../style.css';

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import PsychologyAltIcon from '@mui/icons-material/PsychologyAlt';
import InfoIcon from '@mui/icons-material/Info';
import LoginIcon from '@mui/icons-material/Login';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const signupSteps = [
    { label: 'Επιλογή Ομάδας', icon: <PsychologyAltIcon style={{ fontSize: 50 }} /> },
    { label: 'Πληροφορίες', icon: <InfoIcon style={{ fontSize: 40 }} /> },
    { label: 'Εγγραφή', icon: <LoginIcon style={{ fontSize: 40 }} /> },
    { label: 'Δημιουργία Προφίλ', icon: <AccountCircleIcon style={{ fontSize: 40 }} /> },
];

function Signup() {
    const [activeStep, setActiveStep] = useState(0);

    const handleNext = () => {
        if (activeStep < signupSteps.length - 1) {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    return (
        <>
            <Breadcrumbs current="Εγγραφή" />
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', margin: '1rem', flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
                    <h1 className="login-header">Εγγραφή στη Πλατοφορμα</h1>
                    <p className="login-text">
                        Έχετε ήδη λογαριασμό; <Link to="/login" className="signup-link">Σύνδεση</Link>
                    </p>
                </Box>
                <Box sx={{ width: '100%', marginTop: '2rem' }}>
                    <StepperComponent steps={signupSteps} activeStep={activeStep} />
                </Box>
                <Box sx={{ marginTop: '2rem', width: '100%', flexGrow: 1 }}>
                    {activeStep === 0 && <RoleSelection />}
                    {activeStep === 1 && <Information />}
                    {activeStep === 2 && <LoginTaxisnet />}
                    {activeStep === 3 && <Createprofile />}
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
                        disabled={activeStep === signupSteps.length - 1}
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

export default Signup;