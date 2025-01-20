import React from 'react';
import { Box } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useAuthCheck as AuthCheck } from '../../AuthChecks';
import PageTitle from '../../PageTitle';
import Breadcrumbs from '../../layout/Breadcrumbs';
import Loading from '../../layout/Loading';
import ApplicationForm from './ApplicationForm';

// View application page
function ViewApplication() {
    const { userData, isLoading } = AuthCheck(true, false, false, 'parent');
    const { id } = useParams();
    const applicationId = id;

    if (isLoading) {
        return <Loading />;
    }

    return (
        <>
            <PageTitle title="CareNest - Προβολή Αίτησης" />
            <Breadcrumbs showPopup={true} />
            <h1 style={{ marginLeft: '1rem' }}>Προβολή Αίτησης</h1>
            {userData && (
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    margin: '1rem'
                }}>
                    <ApplicationForm userData={userData} applicationId={applicationId} />   {/* Show application form */}
                </Box>
            )}
        </>
    );
}

export default ViewApplication;