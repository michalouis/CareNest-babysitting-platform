import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../../layout/Breadcrumbs';
import { Box, Button, Snackbar, Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import StepperComponent from './StepperComponent';
import { useAuthCheck as AuthCheck } from '../../AuthChecks';
import Loading from '../../layout/Loading';
import PageTitle from '../../PageTitle';

import './authentication.css';
import '../../style.css';

// Steps
import RoleSelection from './steps/RoleSelection';
import Information from './steps/Information';
import CreateAccount from './steps/CreateAccount';

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

function Signup() {
    const [activeStep, setActiveStep] = useState(0);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showError, setShowError] = useState(false);
    const [openConfirmModal, setOpenConfirmModal] = useState(false);
    const [signupData, setsignupData] = useState({  // Store the data of the signup process
        selectedRole: '',
        isInfoRead: false,
    });

    const { isLoading } = AuthCheck( false, true);

    if (isLoading) {
        return <Loading />;
    }

    // Handle the next button (check for errors)
    const handleNext = () => {
        if (activeStep === 0 && !signupData.selectedRole) {
            setErrorMessage('Please select a group to continue.');
            setError(true);
            setShowError(true);
        } else if (activeStep === 0 && signupData.selectedRole) {
            setOpenConfirmModal(true);
        } else if (activeStep === 1 && !signupData.isInfoRead) {
            setErrorMessage('Please confirm that you have read the terms.');
            setError(true);
            setShowError(true);
        } else {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
            setShowError(false);
        }
    };

    // Handle the back button
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
        setShowError(false);
    };

    // Handle the role selection
    const handleRoleSelection = (selectedRole) => {
        setsignupData((prevState) => ({ // update signup data
            ...prevState,
            selectedRole,
        }));
        setError(false);
    };

    // Handle the information read
    const handleInfoRead = (isInfoRead) => {
        setsignupData((prevState) => ({ // update signup data
            ...prevState,
            isInfoRead,
        }));
        setError(false);
    };

    /////////////// DIALOG (Confirm Role) ///////////////

    // Confirm the selected role
    const handleConfirmRole = () => {
        setOpenConfirmModal(false);
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    // Close the dialog
    const handleCloseDialog = () => {
        setOpenConfirmModal(false);
    };

    return (
        <>
            <PageTitle title="CareNest - Sign up" />
            <Breadcrumbs showPopup={true} />
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                margin: '1rem',
                flexGrow: 1
            }}>
                {/* Title & switch to log-in */}
                <Box sx={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '1rem'
                }}>
                    <h1 className="login-header">Sign up</h1>
                    <p className="login-text">
                        Already have an account? <Link to="/login" className="signup-link">Log in</Link>
                    </p>
                </Box>

                {/* Stepper */}
                <Box sx={{ width: '100%', marginTop: '2rem' }}>
                    <StepperComponent activeStep={activeStep} />
                </Box>

                {/* Step's component. Steps: RoleSelection, Inform User, CreateAccount, ProfileCreation (different page) */}
                <Box sx={{ marginTop: '2rem', width: '100%', flexGrow: 1 }}>
                    {activeStep === 0 && <RoleSelection
                        selectedRole={signupData.selectedRole}
                        onRoleSelect={handleRoleSelection}
                        showError={showError} 
                    />}
                    {activeStep === 1 && <Information
                        selectedRole={signupData.selectedRole}
                        isInfoRead={signupData.isInfoRead}
                        onInfoRead={handleInfoRead}
                        showError={showError}
                    />}
                    {activeStep === 2 && <CreateAccount
                        role={signupData.selectedRole}
                    />}
                </Box>
                
                {/* Buttons */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: activeStep === 0 ? 'flex-end' : 'space-between',
                    marginTop: '2rem',
                    padding: '0 2rem',
                    width: '100%'
                }}>
                    {/* Back */}
                    {activeStep !== 0 && (  // Don't show up on the first step
                        <Button
                            variant='contained'
                            onClick={handleBack}
                            sx={{
                                padding: '0.75rem 1.5rem',
                                backgroundColor: 'var(--clr-violet)',
                                '&:hover': {
                                    opacity: 0.8,
                                },
                            }}
                            startIcon={<ArrowBackIosIcon />}
                        >
                            <p className='big-button-text'>Back</p>
                        </Button>
                    )}

                    {/* Next */}
                    {activeStep !== 2 && (  // Don't show up on the last step
                        <Button
                            variant="contained"
                            onClick={handleNext}
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
                            <p className='big-button-text'>Next</p>
                        </Button>
                    )}
                </Box>

                {/* Error Snackbar */}
                <Snackbar open={error} autoHideDuration={5000} onClose={() => setError(false)}>
                    <Alert onClose={() => setError(false)} severity="error" sx={{ width: '100%' }}>
                        {errorMessage}
                    </Alert>
                </Snackbar>

                {/* Confirm role dialog */}
                <Dialog
                    open={openConfirmModal}
                    onClose={handleCloseDialog}
                >
                    <DialogTitle id="confirm-role-title"><strong>Are you sure?</strong></DialogTitle>
                    <DialogContent>
                        <DialogContentText id="confirm-role-description">
                            You have selected the role <strong>{signupData.selectedRole === 'parent' ? 'Parent' : 'Nanny'}</strong>.
                            Are you sure you want to continue?<br /> <strong>YOU CANNOT CHANGE YOUR SELECTION AFTER SINGING UP!</strong>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button variant='text' onClick={handleCloseDialog} sx={{ color: 'var(--clr-black)' }}>
                            <p className='button-text'>Cancel</p>
                        </Button>
                        <Button variant='contained' onClick={handleConfirmRole} sx={{ backgroundColor: 'var(--clr-violet)', '&:hover': { opacity: 0.8 } }} >
                            <p className='button-text'>Confirm</p>
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </>
    );
}

export default Signup;