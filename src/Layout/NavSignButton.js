import React from "react";
import Box from '@mui/material/Box';
import { Typography, Button } from "@mui/material";
import LoginIcon from '@mui/icons-material/Login';
import './navbutton.css';

function NavSignButton(props) {
    return (
            <Box>
                <Button 
                    variant="contained"
                    sx={{
                        bgcolor: 'var(--clr-white)',
                        color: 'var(--clr-purple-light)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        '&:hover': {
                            bgcolor: 'var(--clr-purple-hover)'
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