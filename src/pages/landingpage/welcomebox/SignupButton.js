import React from "react";
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import '../../../style.css';

function SignupButton() {
    return (
        <Button
            component={Link}
            to="/signup"
            variant='contained'
            sx={{
                marginTop: '1rem',
                fontWeight: 'bold',
                fontSize: '1.25rem',
                minWidth: '150px',
                minHeight: '50px',
                bgcolor: 'var(--clr-purple-main)', // Background color
                color: 'var(--clr-white)', // Text color
                '&:hover': {
                    opacity: 0.8, // Make the button more transparent on hover
                },
            }}
        >
            ΕΓΓΡΑΦΗ
        </Button>
    );
}

export default SignupButton;