import React from 'react';
import { Box } from '@mui/material';
import PageTitle from '../../PageTitle';
import Breadcrumbs from '../../layout/Breadcrumbs';
import JobPostingForm from './JobPostingForm';

import '../../style.css';

function EditJobPosting() {
    return (
        <>
            <PageTitle title="CareNest - Δημιουργία Αγγελίας" />
            <Breadcrumbs showPopup={true}/>
            <h1 style={{ margin: '1rem' }}>Δημιουργία Αγγελίας</h1>
            <Box sx={{
                display: 'flex',
                justifyContent: 'center'
            }}>
                <JobPostingForm/>
            </Box>
        </>
    );
}

export default EditJobPosting;