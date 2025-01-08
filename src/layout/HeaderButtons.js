import React, { useState } from "react";
import Box from '@mui/material/Box';
import { Button } from "@mui/material";
import { Link } from 'react-router-dom';
import './layout.css';
import '../style.css';
import AppDrawer from './Drawer';

import LoginIcon from '@mui/icons-material/Login';
import MenuIcon from '@mui/icons-material/Menu';
import HelpIcon from '@mui/icons-material/Help';
import MessageIcon from '@mui/icons-material/Message';

// WebSite Logo Image (does nothing)
function LogoImage() {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img src="/logo2.png" style={{ width: '200px', height: '48px' }} alt="Αρχική Σελίδα" />
        </Box>
    );
}

// WebSite Logo Button (takes you to the home page)
function LogoButton() {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button
                component={Link} to="/"
                color="inherit"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5
                }}
            >
                <img src="logo3.png" style={{ width: '200px', height: '48px' }} alt="Αρχική Σελίδα" />
            </Button>
        </Box>
    );
}

// FAQ Button (takes you to the FAQ page)
function FaqButton(props) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button
                component={Link} to={'/faq'}
                color="inherit"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5
                }}
            >
                <HelpIcon sx={{ marginRight: 0.5 }} />
                <p className="header-button-text">{'Συχνές Ερωτήσεις'}</p>
            </Button>
        </Box>
    );
}

// Messages Button (takes you to the Messages page) - shows only if user logged in
function MessagesButton(props) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button
                component={Link} to={'/messages'}
                color="inherit"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5
                }}
            >
                <MessageIcon sx={{ marginRight: 0.5 }} />
                <p className="header-button-text">{'Μηνύματα'}</p>
            </Button>
        </Box>
    );
}

// Login Button (takes you to the Login page) - shows only if user not logged in
function LoginButton(props) {
    return (
        <Box>
            <Button
                component={Link}
                to="/login"
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
                <p className="header-button-text">Σύνδεση</p>
            </Button>
        </Box>
    );
}

// Menu Button (shows only if user logged in)
function MenuButton(props) {
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleDrawerOpen = () => {
        setDrawerOpen(true);
    };

    const handleDrawerClose = () => {
        setDrawerOpen(false);
    };

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
                onClick={handleDrawerOpen}
                disableElevation
            >
                <MenuIcon sx={{ marginRight: 0.5 }} />
                <p className="header-button-text">Μενού</p>
            </Button>
            <AppDrawer open={drawerOpen} onClose={handleDrawerClose} />
        </Box>
    );
}

export { LogoImage, LogoButton, FaqButton, MessagesButton, LoginButton, MenuButton };