import React from 'react';
import Box from '@mui/material/Box';
import { Button } from '@mui/material';

function LearnMoreButtons() {
    return (
        <Box
            sx={{
                marginTop: '1rem',
                display: 'flex',
                flexWrap: 'wrap',
                alignContent: 'center',
                justifyContent: 'space-between',
                gap: 5,
            }}
        >
            <Button
                variant='outlined'
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    color: 'var(--clr-purple-main)',
                    borderColor: 'var(--clr-purple-main)',
                    '&:hover': {
                        bgcolor: 'var(--clr-purple-hover)',
                        borderColor: 'var(--clr-purple-main)',
                    },
                    fontWeight: 'bold',
                    borderWidth: '2px',
                }}
            >
                ΓΙΑ ΤΟΥΣ ΓΟΝΕΙΣ
            </Button>
            <Button
                variant='outlined'
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    color: 'var(--clr-purple-main)',
                    borderColor: 'var(--clr-purple-main)',
                    '&:hover': {
                        bgcolor: 'var(--clr-purple-hover)',
                        borderColor: 'var(--clr-purple-main)',
                    },
                    fontWeight: 'bold',
                    borderWidth: '2px',
                }}
            >
                ΓΙΑ ΤΙΣ ΝΤΑΝΤΑΔΕΣ
            </Button>
        </Box>
    );
}

export default LearnMoreButtons;