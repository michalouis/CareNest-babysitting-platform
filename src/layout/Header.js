import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import { AppBar, Toolbar } from "@mui/material";
import { useLocation } from 'react-router-dom';
import { LogoImage, LogoButton, FaqButton, MessagesButton, LoginButton, MenuButton } from "./HeaderButtons";
import { onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from '../firebase';

function Header() {
    const location = useLocation();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check if the user is logged in or not
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
            setIsAuthenticated(!!user);
        });

        return () => unsubscribe();
    }, []);

    // Different header for the login, signup and profile creation pages (forces user to complete their profile)
    const showLogoOnly = location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/create-profile' || location.pathname === '/profile/edit-profile';

    if (showLogoOnly) {
        return (
            <AppBar position="static" sx={{ height: '80px', width: '100%', justifyContent: 'center', backgroundColor: 'var(--clr-violet-dark)' }}>
                <Toolbar sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <LogoImage />
                </Toolbar>
            </AppBar>
        );
    }

    return (
        <AppBar position="static" sx={{ height: '80px', width: '100%', justifyContent: 'center', backgroundColor: 'var(--clr-purple-main)' }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <LogoButton />
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <FaqButton />
                    {isAuthenticated && <MessagesButton />} {/* Show messages button only if user is logged in */}
                    <Box sx={{ ml: 2 }}>
                        {isAuthenticated ? <MenuButton /> : <LoginButton />}    {/* Show menu button if user is logged in, otherwise show login button */}
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Header;