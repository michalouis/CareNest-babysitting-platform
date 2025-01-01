import React from "react";
import { Button } from '@mui/material';

function SignupButton() {
    return (
        <Button
            variant='contained'
            color='var(--clr-purple-main)'
            sx={{
                marginTop: '1rem',
                fontWeight: 'bold',
                fontSize: '1.25rem',
                minWidth: '150px',
                minHeight: '50px',
            }}
        >
            ΕΓΓΡΑΦΗ
        </Button>
    );
}

export default SignupButton;