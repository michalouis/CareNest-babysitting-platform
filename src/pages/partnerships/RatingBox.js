import React from 'react';
import { Box, Button, Divider, Rating } from '@mui/material';

import GradeIcon from '@mui/icons-material/Grade';

const RatingBox = ({ partnershipData, rating }) => {
    const lastPaymentStatus = partnershipData.payments[partnershipData.payments.length - 1];

    return (
        <Box sx={{
            width: '90%',
            maxWidth: '900px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--clr-white)',
            padding: '1rem',
            borderRadius: '1rem',
            boxShadow: '2',
            margin: '1rem auto'
        }}>
            <h1>Αξιολόγηση</h1>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', marginTop: '1rem', gap: '1rem' }}>
                {rating ? (
                    <>
                        <Rating value={rating.score} readOnly />
                        <p style={{ fontSize: '1.3rem' }}>{rating.comment}</p>
                    </>
                ) : (
                    <>
                        <Button 
                            variant="contained" 
                            sx={{ backgroundColor: 'var(--clr-violet)', padding: '0.5rem 1rem', width: 'fit-content' }} 
                            disabled={lastPaymentStatus !== 'verified'}
                            startIcon={<GradeIcon style={{ fontSize: '2.2rem'}} />}
                        >
                            <p className='big-button-text'>Προσθήκη Αξιολόγησης</p>
                        </Button>
                        <p style={{ fontSize: '1.3rem' }}>
                            {lastPaymentStatus === 'verified' 
                                ? 'Για να ολοκληρώσετε την εγγραφή σας αξιολογήστε πως ήταν η συνεργασία σας μαζι της.' 
                                : 'Ολοκληρώστε τις πληρωμές σας για να να μπορέσετε να αξιολογήστε τη συνεργασία σας.'}
                        </p>
                    </>
                )}
            </Box>
        </Box>
    );
};

export default RatingBox;