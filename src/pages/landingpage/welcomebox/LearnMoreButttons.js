import React from 'react';
import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import '../../../style.css';

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
                component="a"
                href="#info-parent"
                variant='outlined'
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    color: 'var(--clr-purple-main)',
                    borderColor: 'var(--clr-purple-main)',
                    '&:hover': {
                        bgcolor: 'var(--clr-purple-light)',
                        borderColor: 'var(--clr-purple-main)',
                    },
                    fontWeight: 'bold',
                    borderWidth: '2px',
                }}
            >
                ΓΙΑ ΤΟΥΣ ΓΟΝΕΙΣ
            </Button>
            <Button
                component="a"
                href="#info-ntanta"
                variant='outlined'
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    color: 'var(--clr-purple-main)',
                    borderColor: 'var(--clr-purple-main)',
                    '&:hover': {
                        bgcolor: 'var(--clr-purple-light)',
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