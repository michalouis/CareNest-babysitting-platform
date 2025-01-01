import React from "react";
import Box from '@mui/material/Box';
import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

function Footer() {
    return (
        <AppBar position="static" sx={{ top: 'auto', bottom: 0, backgroundColor: '#815AC0', height: '100px' }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>
                <Typography variant="body1" sx={{ color: '#FFFFFF' }}>
                    © 2023 CareNest
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton color="inherit" href="https://www.facebook.com" target="_blank">
                        <FacebookIcon />
                    </IconButton>
                    <IconButton color="inherit" href="https://www.twitter.com" target="_blank">
                        <TwitterIcon />
                    </IconButton>
                    <IconButton color="inherit" href="https://www.instagram.com" target="_blank">
                        <InstagramIcon />
                    </IconButton>
                    <IconButton color="inherit" href="https://www.linkedin.com" target="_blank">
                        <LinkedInIcon />
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Footer;