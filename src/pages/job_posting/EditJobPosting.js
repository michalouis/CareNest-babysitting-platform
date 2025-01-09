import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import PageTitle from '../../PageTitle';
import Breadcrumbs from '../../layout/Breadcrumbs';
import JobPostingForm from './JobPostingForm';
import { useAuthCheck as AuthCheck } from '../../AuthChecks';
import Loading from '../../layout/Loading';

import '../../style.css';

function EditJobPosting() {
    const { userData, isLoading } = AuthCheck(true, false, false, 'nanny');
    const [initiatedSave, setInitiatedSave] = useState(false);
    const [saved, setSaved] = useState(false);
    
    useEffect(() => {
        if (!isLoading && !initiatedSave) {
            setSaved(!!userData.jobPostingData);    // !! to turn to boolean
            setInitiatedSave(true);
            console.log('initiatedSave');
        }
    }, [userData]);

    if (isLoading) {
        return <Loading />;
    }

    return (
        <>

            <PageTitle title="CareNest - Δημιουργία Αγγελίας" />
            <Breadcrumbs showPopup={!saved}/>
            <h1 style={{ margin: '1rem' }}>Δημιουργία Αγγελίας</h1>
            <Box sx={{
                display: 'flex',
                justifyContent: 'center'
            }}>
                <JobPostingForm userData={userData} setSaved={setSaved}/>
            </Box>
        </>
    );
}

export default EditJobPosting;