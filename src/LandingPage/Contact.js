import React from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import '../style.css';

function Contact() {
    return (
        <Box
            sx={{
                backgroundColor: 'var(--clr-white)',
                padding: '2rem',
                margin: '1rem',
                borderRadius: '1rem',
                boxShadow: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Typography variant="h4" sx={{ color: 'var(--clr-purple-main)', marginBottom: '1rem' }}>
                Επικοινωνήστε μαζί μας
            </Typography>
            <Typography variant="body1" sx={{ color: 'var(--clr-purple-main)', marginBottom: '2rem', textAlign: 'center' }}>
                Συμπληρώστε την παρακάτω φόρμα για να επικοινωνήσετε μαζί μας. Θα χαρούμε να σας βοηθήσουμε!
            </Typography>
            <TextField
                label="Όνομα"
                variant="outlined"
                fullWidth
                InputLabelProps={{ shrink: true }}
                sx={{ marginBottom: '1rem' }}
            />
            <TextField
                label="Email"
                variant="outlined"
                fullWidth
                InputLabelProps={{ shrink: true }}
                sx={{ marginBottom: '1rem' }}
            />
            <TextField
                label="Μήνυμα"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                InputLabelProps={{ shrink: true }}
                sx={{ marginBottom: '1rem' }}
            />
            <Button
                variant="contained"
                sx={{
                    backgroundColor: 'var(--clr-purple-main)',
                    color: 'var(--clr-white)',
                    '&:hover': {
                        opacity: 0.8,
                    },
                }}
            >
                Αποστολή
            </Button>
        </Box>
    );
}

export default Contact;