import React from 'react';
import { Box } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useAuthCheck as AuthCheck } from '../../AuthChecks';
import PageTitle from '../../PageTitle';
import Breadcrumbs from '../../layout/Breadcrumbs';
import Loading from '../../layout/Loading';
import ApplicationForm from './ApplicationForm';

// Create Application page
function CreateApplication() {
    const { userData, isLoading } = AuthCheck(true, false, false, 'parent');
    const { id } = useParams();
    const nannyId = id;

    if (isLoading) {
        return <Loading />;
    }

    return (
        <>
            <PageTitle title="CareNest - Create Application" />
            <h1 style={{ marginLeft: '1rem' }}>Create Application</h1>
            <Breadcrumbs showPopup={true} />
            {userData && (
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    margin: '1rem'
                }}>
                    <ApplicationForm userData={userData} nannyId={nannyId} />   {/* Pass userData and nannyId as props */}
                </Box>
            )}
        </>
    );
}

export default CreateApplication;