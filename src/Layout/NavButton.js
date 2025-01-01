import React from "react";
import Box from '@mui/material/Box';
import { Typography, Button } from "@mui/material";
import { Link } from 'react-router-dom';
import './NavButton.css';

function NavButton(props) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button
                component={Link} to={props.to}
                color="inherit"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5
                }}
            >
                <img src={props.src} style={{ width: props.width, height: props.height }} alt={props.altText} />
                {props.text && (
                    <Typography
                        variant="h6"
                        className="nav-button-text"
                        sx={{
                            fontSize: '1rem',
                            textTransform: 'capitalize',
                            fontWeight: 'bold'
                        }}
                    >
                        {props.text}
                    </Typography>
                )}
            </Button>
        </Box>
    );
}

export default NavButton;