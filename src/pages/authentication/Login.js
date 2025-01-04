import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../../layout/Breadcrumbs';
import { Box } from '@mui/material';
import StepperComponent from './StepperComponent';
import RoleSelection from './steps/RoleSelection';
import LoginTaxisnet from './steps/LoginTaxisnet';
import StepNavigation from './StepNavigation';
import './authentication.css';
import '../../style.css';

import PsychologyAltIcon from '@mui/icons-material/PsychologyAlt';
import LoginIcon from '@mui/icons-material/Login';

const loginSteps = [
    { label: 'Επιλογή Ομάδας', icon: <PsychologyAltIcon style={{ fontSize: 50 }} /> },
    { label: 'Σύνδεση', icon: <LoginIcon style={{ fontSize: 40 }} /> },
];

function Login() {
    const [activeStep, setActiveStep] = useState(0);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [loginData, setLoginData] = useState({
        selectedRole: '',
    });
    const [showError, setShowError] = useState(false);
    const [openConfirmModal, setOpenConfirmModal] = useState(false);

    const handleNext = () => {
        if (activeStep === 0 && !loginData.selectedRole) {
            setErrorMessage('Please select a role before proceeding.');
            setError(true);
            setShowError(true);
        } else if (activeStep === 0 && loginData.selectedRole) {
            setOpenConfirmModal(true);
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
        setLoginData((prevState) => ({
            ...prevState,
            selectedRole,
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
                    {activeStep === 0 && <RoleSelection selectedRole={loginData.selectedRole} onRoleSelect={handleRoleSelection} showError={showError} />}
                    {activeStep === 1 && <LoginTaxisnet />}
                </Box>
                <StepNavigation
                    activeStep={activeStep}
                    stepsLength={loginSteps.length}
                    handleBack={handleBack}
                    handleNext={handleNext}
                    error={error}
                    errorMessage={errorMessage}
                    openConfirmModal={openConfirmModal}
                    handleCloseModal={handleCloseModal}
                    handleConfirmRole={handleConfirmRole}
                    selectedRole={loginData.selectedRole}
                    setError={setError}
                />
            </Box>
        </>
    );
}

export default Login;