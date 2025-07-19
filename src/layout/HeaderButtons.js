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
                component={Link} to="CareNest-babysitting-platform/"
                color="inherit"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5
                }}
            >
                <img src={`${process.env.PUBLIC_URL}/logo3.png`} style={{ width: '200px', height: '48px' }} alt="Home Page" />
            </Button>
        </Box>
    );
}

// FAQ Button (takes you to the FAQ page)
function FaqButton() {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button
                component={Link} to={'CareNest-babysitting-platform/faq'}
                color="inherit"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5
                }}
            >
                <HelpIcon sx={{ marginRight: 0.5 }} />
                <p className="header-button-text">{'FAQs'}</p>
            </Button>
        </Box>
    );
}

// Messages Button (takes you to the Messages page) - shows only if user logged in
function MessagesButton() {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button
                component={Link} to={'CareNest-babysitting-platform/messages'}
                color="inherit"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5
                }}
            >
                <MessageIcon sx={{ marginRight: 0.5 }} />
                <p className="header-button-text">{'Messages'}</p>
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
                to="CareNest-babysitting-platform/login"
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
                <p className="header-button-text">Login</p>
            </Button>
        </Box>
    );
}

// Menu Button to open drawer (shows only if user logged in)
function MenuButton() {
    const [drawerOpen, setDrawerOpen] = useState(false);    // Drawer state

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
                <p className="header-button-text">Menu</p>
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
            setIsLoggedIn(!!user);  // !! converts user's existance by turning it to boolean
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Show loading skeleton while checking if user is logged in
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
            {isLoggedIn ? (   // Show menu, faq and messages buttons if user logged in
                <>
                    <FaqButton />
                    <MessagesButton />
                    <MenuButton />
                </>
            ) : (   // Show login button if user not logged in
                <>
                    <FaqButton />
                    <LoginButton />
                </>
            )}
        </Box>
    );
}

export { LogoButton, HeaderButtons };