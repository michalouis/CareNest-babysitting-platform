import React from "react";
import Box from '@mui/material/Box';
import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import NavButton from "./NavButton";
import NavSignButton from "./NavSignButton";
import Face2 from '@mui/icons-material/Face2';

function Header() {
    return (
        <AppBar position="static" sx={{ height: '80px', width: '100%', justifyContent: 'center', backgroundColor: '#815AC0' }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <NavButton src="logo3.png" width="200px" height="48px" altText="Αρχική Σελίδα" />
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <NavButton src="info.png" width="28px" height="28px" altText="Information Icon" text="Συχνές Ερωτήσεις" />
                    <NavButton src="message.png" width="28px" height="28px" altText="Information Icon" text="Μηνύματα" />
                    <NavButton src="notification.png" width="28px" height="28px" altText="Information Icon" text="Ειδοποιήσεις" />
                    <Box sx={{ ml: 2 }}>
                        <NavSignButton />
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Header;