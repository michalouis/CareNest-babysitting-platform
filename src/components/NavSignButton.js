import React from "react";
import Box from '@mui/material/Box';
import { Typography, Button } from "@mui/material";

function NavSignButton(props) {
    return (
        <Box>
            <Button 
                variant="contained"
                sx={{
                    bgcolor: '#FFFFFF', // White background
                    color: '#815AC0', // Text color
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    '&:hover': {
                        bgcolor: '#EDE7F6', // Lighter hover background color
                    }
                }}
                disableElevation
            >
                <Typography
                    variant="h6"
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