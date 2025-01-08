import React from "react";
import Box from '@mui/material/Box';
import { AppBar, Toolbar } from "@mui/material";
import { useLocation } from 'react-router-dom';
import { LogoButton, HeaderButtons } from "./HeaderButtons";

function Header() {
    const location = useLocation();

    // Different header for the login, signup and profile creation pages (forces user to complete their profile)
    const showLogoOnly = location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/create-profile' || location.pathname === '/profile/edit-profile';

    if (showLogoOnly) {
        return (
            <AppBar position="static" sx={{ height: '80px', width: '100%', justifyContent: 'center', backgroundColor: 'var(--clr-violet-dark)' }}>
                <Toolbar sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <img src="/logo2.png" style={{ width: '200px', height: '48px' }} alt="Αρχική Σελίδα" />
                    </Box>
                </Toolbar>
            </AppBar>
        );
    }

    // Regular header for the rest of the pages
    return (
        <AppBar position="static" sx={{ height: '80px', width: '100%', justifyContent: 'center', backgroundColor: 'var(--clr-purple-main)' }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <LogoButton />
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <HeaderButtons />
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Header;