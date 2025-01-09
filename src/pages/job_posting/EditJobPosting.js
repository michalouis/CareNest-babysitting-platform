import React from 'react';
import { Box } from '@mui/material';
import PageTitle from '../../PageTitle';
import Breadcrumbs from '../../layout/Breadcrumbs';
import JobPostingForm from './JobPostingForm';
import { useAuthCheck as AuthCheck } from '../../AuthChecks';
import Loading from '../../layout/Loading';

import '../../style.css';

function EditJobPosting() {
    const { userData, isLoading } = AuthCheck(true, false, false, 'nanny');
    
    if (isLoading) {
        return <Loading />;
    }

    return (
        <>
            <PageTitle title="CareNest - Δημιουργία Αγγελίας" />
            <Breadcrumbs showPopup={true}/>
            <h1 style={{ margin: '1rem' }}>Δημιουργία Αγγελίας</h1>
            <Box sx={{
                display: 'flex',
                justifyContent: 'center'
            }}>
                <JobPostingForm userData={userData}/>
            </Box>
        </>
    );
}

export default EditJobPosting;