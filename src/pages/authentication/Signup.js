import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../../layout/Breadcrumbs';
import { Box } from '@mui/material';
import StepperComponent from './StepperComponent';
import RoleSelection from './steps/RoleSelection';
import Information from './steps/Information';
import LoginTaxisnet from './steps/LoginTaxisnet';
import Createprofile from './steps/Createprofile';
import StepNavigation from './StepNavigation';
import './authentication.css';
import '../../style.css';

import PsychologyAltIcon from '@mui/icons-material/PsychologyAlt';
import InfoIcon from '@mui/icons-material/Info';
import LoginIcon from '@mui/icons-material/Login';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const signupSteps = [
    { label: 'Step 1', icon: <PsychologyAltIcon style={{ fontSize: 50 }} /> },
    { label: 'Step 2', icon: <InfoIcon style={{ fontSize: 40 }} /> },
    { label: 'Step 3', icon: <LoginIcon style={{ fontSize: 40 }} /> },
    { label: 'Step 4', icon: <AccountCircleIcon style={{ fontSize: 40 }} /> },
];

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
                    <StepperComponent steps={signupSteps} activeStep={activeStep} />
                </Box>
                <Box sx={{ marginTop: '2rem', width: '100%', flexGrow: 1 }}>
                    {activeStep === 0 && <RoleSelection selectedRole={signupData.selectedRole} onRoleSelect={handleRoleSelection} showError={showError} />}
                    {activeStep === 1 && <Information isInfoRead={signupData.isInfoRead} onInfoRead={handleInfoRead} showError={showError} />}
                    {activeStep === 2 && <LoginTaxisnet />}
                    {activeStep === 3 && <Createprofile />}
                </Box>
                <StepNavigation
                    activeStep={activeStep}
                    stepsLength={signupSteps.length}
                    handleBack={handleBack}
                    handleNext={handleNext}
                    error={error}
                    errorMessage={errorMessage}
                    openConfirmModal={openConfirmModal}
                    handleCloseModal={handleCloseModal}
                    handleConfirmRole={handleConfirmRole}
                    selectedRole={signupData.selectedRole}
                    setError={setError}
                />
            </Box>
        </>
    );
}

export default Signup;