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
        }
    }, [userData, isLoading, initiatedSave]);

    if (isLoading) {
        return <Loading />;
    }

    return (
        <>
        {userData && (
            <>
            <PageTitle title="CareNest - Create Job Listing" />
            <Breadcrumbs showPopup={!saved}/>
            <h1 style={{ margin: '1rem' }}>Create Job Listing</h1>
            {userData && userData.jobPosted ? ( // if job posted, show message
                <>         
                    <p style={{ fontSize: '1.2rem', maxWidth: '1080px', alignSelf: 'center' }}>
                        You have already submitted your job listing. Go back to the Job Posting section to view it.
                    </p>
                    <img src={`${process.env.PUBLIC_URL}/question-mark.png`} alt="Question Mark" style={{ width: '500px', margin: '1rem auto', alignSelf: 'center' }} />
                </>
            ) : (   // if job not posted, show form
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center'
                }}>
                    <JobPostingForm userData={userData} setSaved={setSaved}/>
                </Box>
            )}
            </>
        )}
        </>
    );    
}

export default EditJobPosting;