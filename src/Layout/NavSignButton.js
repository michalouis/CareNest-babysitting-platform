import React from "react";
import Box from '@mui/material/Box';
import { Typography, Button } from "@mui/material";
import LoginIcon from '@mui/icons-material/Login';
import './layout.css';

function NavSignButton(props) {
    return (
            <Box>
                <Button 
                    variant="contained"
                    sx={{
                        bgcolor: 'var(--clr-white)',
                        color: 'var(--clr-purple-main)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        '&:hover': {
                            opacity: 0.8,
                        }
                    }}
                    disableElevation
                >
                    <LoginIcon sx={{ marginRight: 0.5 }} />
                    <Typography
                        variant="h6"
                        className="nav-button-text"
                        sx={{
                            fontSize: '1rem',
                            textTransform: 'capitalize',
                            fontWeight: 'bold',
                        }}
                        >
                        Σύνδεση
                    </Typography>
                </Button>
            </Box>
    );
}

export default NavSignButton;