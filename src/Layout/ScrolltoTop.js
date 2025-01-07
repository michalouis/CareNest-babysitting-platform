import React, { useState, useEffect } from 'react';
import { Fab } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import '../style.css';

const ScrolltoTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    // Scroll to top of the page
    const handleScrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Show button when page is scrolled down
    const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    // Add and remove the window scroll event listener
    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    return (
        <Fab
            onClick={handleScrollToTop}
            color="primary"
            aria-label="scroll to top"
            sx={{
                zIndex: 100,    // Make sure the button is above everything else
                position: 'fixed',
                bottom: '5rem',
                right: '2rem',
                bgcolor: 'var(--clr-purple-main)',
                opacity: isVisible ? 1 : 0,
                pointerEvents: isVisible ? 'auto' : 'none',
                transition: 'opacity 0.5s ease-in-out',
                '&:hover': {
                    opacity: 0.8,
                },
            }}
        >
            <KeyboardArrowUpIcon />
        </Fab>
    );
};

export default ScrolltoTop;