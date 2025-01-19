import React from 'react';
import { Box } from '@mui/material';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useAuthCheck as AuthCheck } from '../../AuthChecks';
import PageTitle from '../../PageTitle';
import Breadcrumbs from '../../layout/Breadcrumbs';
import Loading from '../../layout/Loading';
import ApplicationForm from './ApplicationForm';

function CreateApplication() {
    const { userData, isLoading } = AuthCheck(true, false, false, 'parent');
    const location = useLocation();
    const { id } = useParams();
    const nannyId = id;

    if (isLoading) {
        return <Loading />;
    }

    return (
        <>
            <PageTitle title="CareNest - Δημιουργία Αίτησης" />
            <h1 style={{ marginLeft: '1rem' }}>Δημιουργία Αίτησης</h1>
            <Breadcrumbs showPopup={true} />
            {userData && (
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    margin: '1rem'
                }}>
                    <ApplicationForm userData={userData} nannyId={nannyId} />
                </Box>
            )}
        </>
    );
}

export default CreateApplication;