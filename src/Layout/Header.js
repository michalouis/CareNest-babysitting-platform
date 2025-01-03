import React from "react";
import Box from '@mui/material/Box';
import { AppBar, Toolbar } from "@mui/material";
import { useLocation } from 'react-router-dom';
import NavButton from "./NavButton";
import NavLoginButton from "./NavLoginButton";

function Header() {
    const location = useLocation();
    const hideNavButtons = location.pathname === '/login' || location.pathname === '/signup';

    return (
        <AppBar position="static" sx={{ height: '80px', width: '100%', justifyContent: 'center', backgroundColor: 'var(--clr-purple-main)' }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <NavButton to="/" src="logo3.png" width="200px" height="48px" altText="Αρχική Σελίδα" />
                {!hideNavButtons && (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <NavButton to="/faq" src="info.png" width="28px" height="28px" altText="Information Icon" text="Συχνές Ερωτήσεις" />
                        <NavButton to="/messages" src="message.png" width="28px" height="28px" altText="Information Icon" text="Μηνύματα" />
                        <Box sx={{ ml: 2 }}>
                            <NavLoginButton />
                        </Box>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
}

export default Header;