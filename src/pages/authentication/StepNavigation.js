import React from 'react';
import { Box, Button, Snackbar, Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

function StepNavigation({ activeStep, stepsLength, handleBack, handleNext, error, errorMessage, openConfirmModal, handleCloseModal, handleConfirmRole, selectedRole, setError }) {
    return (
        <>
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
                {activeStep !== stepsLength - 1 && (
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
                        You have selected the role: <strong>{selectedRole}</strong>. Are you sure you want to proceed with this role?
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
        </>
    );
}

export default StepNavigation;