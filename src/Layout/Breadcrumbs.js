import React from 'react';
import { Breadcrumbs as MUIBreadcrumbs, Link, Typography, IconButton } from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { useNavigate, useLocation } from 'react-router-dom';
import "../style.css";

function Breadcrumbs({ current }) {
    const navigate = useNavigate();
    const location = useLocation();

    const handleNavigateBefore = () => {
        const pathArray = location.pathname.split('/').filter(Boolean);
        if (pathArray.length > 1) {
            const previousPath = `/${pathArray.slice(0, -1).join('/')}`;
            navigate(previousPath);
        } else {
            navigate('/');
        }
    };

    return (
        <MUIBreadcrumbs sx={{ marginTop: '1rem', marginLeft: '1rem', display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={handleNavigateBefore} >
                <NavigateBeforeIcon />
            </IconButton>
            <Link underline="hover" color="var(--clr-grey)" href="/">
                Αρχική Σελίδα
            </Link>
            <Typography color="var(--clr-black)">{current}</Typography>
        </MUIBreadcrumbs>
    );
}

export default Breadcrumbs;