import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../../layout/Breadcrumbs';
import { Box, Button, Snackbar, Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import StepperComponent from './StepperComponent';
import RoleSelection from './steps/RoleSelection';
import Information from './steps/Information';
import Register from './steps/Register';
import Createprofile from './steps/Createprofile';
import './authentication.css';
import '../../style.css';

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

function Signup() {
    const [activeStep, setActiveStep] = useState(0);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [signupData, setsignupData] = useState({
        selectedRole: '',
        isInfoRead: false,
    });
    const [showError, setShowError] = useState(false);
    const [openConfirmModal, setOpenConfirmModal] = useState(false);

    const handleNext = () => {
        if (activeStep === 0 && !signupData.selectedRole) {
            setErrorMessage('Please select a role before proceeding.');
            setError(true);
            setShowError(true);
        } else if (activeStep === 0 && signupData.selectedRole) {
            setOpenConfirmModal(true);
        } else if (activeStep === 1 && !signupData.isInfoRead) {
            setErrorMessage('Please read the information and check the box before proceeding.');
            setError(true);
            setShowError(true);
        } else {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
            setShowError(false);
        }
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
        setShowError(false);
    };

    const handleRoleSelection = (selectedRole) => {
        setsignupData((prevState) => ({
            ...prevState,
            selectedRole,
        }));
        setError(false);
    };

    const handleInfoRead = (isInfoRead) => {
        setsignupData((prevState) => ({
            ...prevState,
            isInfoRead,
        }));
        setError(false);
    };

    const handleConfirmRole = () => {
        setOpenConfirmModal(false);
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleCloseModal = () => {
        setOpenConfirmModal(false);
    };

    return (
        <>
            <Breadcrumbs current="Signup" />
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', margin: '1rem', flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
                    <h1 className="login-header">Signup</h1>
                    <p className="login-text">
                        Already have an account? <Link to="/login" className="signup-link">Login</Link>
                    </p>
                </Box>
                <Box sx={{ width: '100%', marginTop: '2rem' }}>
                    <StepperComponent activeStep={activeStep} />
                </Box>
                <Box sx={{ marginTop: '2rem', width: '100%', flexGrow: 1 }}>
                    {activeStep === 0 && <RoleSelection selectedRole={signupData.selectedRole} onRoleSelect={handleRoleSelection} showError={showError} />}
                    {activeStep === 1 && <Information selectedRole={signupData.selectedRole} isInfoRead={signupData.isInfoRead} onInfoRead={handleInfoRead} showError={showError} />}
                    {activeStep === 2 && <Register />}
                    {activeStep === 3 && <Createprofile />}
                </Box>
                <Box sx={{ display: 'flex', justifyContent: activeStep === 0 ? 'flex-end' : 'space-between', marginTop: '2rem', padding: '0 2rem', width: '100%' }}>
                    {activeStep !== 0 && (
                        <Button
                            variant='contained'
                            onClick={handleBack}
                            sx={{
                                padding: '0.75rem 1.5rem',
                                fontSize: '1rem',
                                backgroundColor: 'var(--clr-blue)',
                                '&:hover': {
                                    opacity: 0.8,
                                },
                            }}
                            startIcon={<ArrowBackIosIcon />}
                        >
                            Πίσω
                        </Button>
                    )}
                    {activeStep !== 2 && (
                        <Button
                            variant="contained"
                            onClick={handleNext}
                            sx={{
                                padding: '0.75rem 1.5rem',
                                fontSize: '1rem',
                                backgroundColor: 'var(--clr-blue)',
                                '&:hover': {
                                    opacity: 0.8,
                                },
                            }}
                            endIcon={<ArrowForwardIosIcon />}
                        >
                            Συνέχεια
                        </Button>
                    )}
                </Box>
                <Snackbar open={error} autoHideDuration={5000} onClose={() => setError(false)}>
                    <Alert onClose={() => setError(false)} severity="error" sx={{ width: '100%' }}>
                        {errorMessage}
                    </Alert>
                </Snackbar>
                <Dialog
                    open={openConfirmModal}
                    onClose={handleCloseModal}
                >
                    <DialogTitle id="confirm-role-title">Confirm Role Selection</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="confirm-role-description">
                            You have selected the role: <strong>{signupData.selectedRole}</strong>. Are you sure you want to proceed with this role?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseModal} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleConfirmRole} color="primary" autoFocus>
                            Confirm
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </>
    );
}

export default Signup;