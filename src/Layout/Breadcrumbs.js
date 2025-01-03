import React from 'react';
import { Breadcrumbs as MUIBreadcrumbs, Link, Typography } from '@mui/material';
import "../style.css";

function Breadcrumbs({ current }) {
    return (
        <MUIBreadcrumbs sx={{ marginTop: '1rem', marginLeft: '1rem' }}>
            <Link underline="hover" color="var(--clr-grey)" href="/">
                Αρχική Σελίδα
            </Link>
            <Typography color="var(--clr-black)">{current}</Typography>
        </MUIBreadcrumbs>
    );
}

export default Breadcrumbs;