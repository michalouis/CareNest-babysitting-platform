import React from "react";
import Box from '@mui/material/Box';
import { AppBar, Toolbar, IconButton } from "@mui/material";
import { Link } from 'react-router-dom';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import './layout.css'; // Import the CSS file

function Footer() {
    return (
        <AppBar position="static" sx={{ top: 'auto', bottom: 0, backgroundColor: '#815AC0', height: '100px', marginTop: 'auto' }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>
                <div className="footer-text">
                    © 2023 CareNest
                </div>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <div className="footer-link" style={{ marginRight: '1rem' }}>
                        <Link to="/contact" className="footer-link">
                            Επικοινωνία
                        </Link>
                    </div>
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