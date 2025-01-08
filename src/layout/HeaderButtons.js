import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import { Button, Skeleton } from "@mui/material";
import { Link } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from '../firebase';
import AppDrawer from './Drawer';
import './layout.css';
import '../style.css';

import LoginIcon from '@mui/icons-material/Login';
import MenuIcon from '@mui/icons-material/Menu';
import HelpIcon from '@mui/icons-material/Help';
import MessageIcon from '@mui/icons-material/Message';

// Website Logo Button (takes you to the home page)
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
function FaqButton() {
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
function MessagesButton() {
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
function LoginButton() {
    return (
        <Box sx={{ marginLeft: '1rem' }}>
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
function MenuButton() {
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleDrawerOpen = () => {
        setDrawerOpen(true);
    };

    const handleDrawerClose = () => {
        setDrawerOpen(false);
    };

    return (
        <Box sx={{ marginLeft: '1rem' }}>
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

function HeaderButtons() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
            setIsLoggedIn(!!user);  // !! converts user to boolean
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Skeleton variant="rectangular" width={200} height={40} sx={{ borderRadius: '5px' }} animation="wave" />
                <Skeleton variant="rectangular" width={130} height={40} sx={{ borderRadius: '5px' }} animation="wave" />
                <Skeleton variant="rectangular" width={120} height={40} sx={{ borderRadius: '5px' }} animation="wave" />
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {isLoggedIn ? (
                <>
                    <FaqButton />
                    <MessagesButton />
                    <MenuButton />
                </>
            ) : (
                <>
                    <FaqButton />
                    <LoginButton />
                </>
            )}
        </Box>
    );
}

export { LogoButton, HeaderButtons };