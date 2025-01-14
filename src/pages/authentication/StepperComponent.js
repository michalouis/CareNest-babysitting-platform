import React from 'react';
import { Stepper, Step, StepLabel } from '@mui/material';
import { styled } from '@mui/material/styles';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import PsychologyAltIcon from '@mui/icons-material/PsychologyAlt';
import InfoIcon from '@mui/icons-material/Info';
import LoginIcon from '@mui/icons-material/Login';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

// STEPPER BASED ON MATERIAL UI EXAMPLE FROM THEIR WEBSITE (https://mui.com/material-ui/react-stepper/)

const ColorConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
        top: 22,
    },
    [`&.${stepConnectorClasses.active}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            backgroundImage:
                'linear-gradient( 95deg, var(--clr-pink) 0%,var(--clr-magenta) 50%,var(--clr-purple-dark) 100%)',
        },
    },
    [`&.${stepConnectorClasses.completed}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            backgroundImage:
                'linear-gradient( 95deg, var(--clr-pink) 0%,var(--clr-magenta) 50%,var(--clr-purple-dark) 100%)',
        },
    },
    [`& .${stepConnectorClasses.line}`]: {
        height: 3,
        border: 0,
        backgroundColor: 'var(--clr-grey)',
        borderRadius: 1,
    },
}));

const ColorStep = styled('div')(({ theme, ownerState }) => ({
    backgroundColor: 'var(--clr-grey)',
    zIndex: 1,
    color: '#fff',
    width: 60, 
    height: 60, 
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    ...(ownerState.active && {
        backgroundImage:
            'linear-gradient( 95deg, var(--clr-pink) 0%, var(--clr-magenta) 50%, var(--clr-purple-dark) 100%)',
        boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
    }),
    ...(ownerState.completed && {
        backgroundImage:
            'linear-gradient( 95deg, var(--clr-pink) 0%, var(--clr-magenta) 50%, var(--clr-purple-dark) 100%)',
    }),
}));

function ColorlibStepIcon(props) {
    const { active, completed, className, icon } = props;

    return (
        <ColorStep ownerState={{ completed, active }} className={className}>
            {icon}
        </ColorStep>
    );
}

const signupSteps = [
    { label: 'Επιλογή Ομάδας', icon: <PsychologyAltIcon style={{ fontSize: 50 }} /> },
    { label: 'Πληροφορίες', icon: <InfoIcon style={{ fontSize: 40 }} /> },
    { label: 'Εγγραφή', icon: <LoginIcon style={{ fontSize: 40 }} /> },
    { label: 'Δημιουργία Προφίλ', icon: <AccountCircleIcon style={{ fontSize: 40 }} /> },
];

function StepperComponent({ activeStep }) {
    return (
        <Stepper alternativeLabel activeStep={activeStep} connector={<ColorConnector />}>
            {signupSteps.map((step, index) => (
                <Step key={index}>
                    <StepLabel slots={{ stepIcon: (props) => <ColorlibStepIcon {...props} icon={step.icon} /> }}>{step.label}</StepLabel>
                </Step>
            ))}
        </Stepper>
    );
}

export default StepperComponent;