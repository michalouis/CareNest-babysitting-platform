import React, { useState, useEffect } from 'react';
import { Fab } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import '../style.css';

const ScrolltoTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    const handleScrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

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
                zIndex: 100,
                position: 'fixed',
                bottom: '5rem',
                right: '2rem',
                bgcolor: 'var(--clr-purple-main)',
                color: 'var(--clr-white)',
                opacity: isVisible ? 1 : 0,
                pointerEvents: isVisible ? 'auto' : 'none',
                transition: 'opacity 0.5s ease-in-out',
                '&:hover': {
                    bgcolor: 'var(--clr-purple-hover)',
                },
            }}
        >
            <KeyboardArrowUpIcon />
        </Fab>
    );
};

export default ScrolltoTop;