import React, { useState, useEffect } from 'react';
import { Box, Button, Snackbar, Alert, Grid } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../firebase';
import { useAuthCheck as AuthCheck } from '../../AuthChecks';
import PageTitle from '../../PageTitle';
import Breadcrumbs from '../../layout/Breadcrumbs';
import Loading from '../../layout/Loading';
import ApplicationForm from './ApplicationForm';

function CreateApplication() {
    const { userData, isLoading } = AuthCheck(true, false, false, 'parent');

    if (isLoading) {
        return <Loading />;
    }

    return (
        <>
            <PageTitle title="CareNest - Δημιουργία Αίτησης" />
            <h1 style={{ marginLeft: '1rem' }}>Δημιουργία Αίτησης</h1>
            <Breadcrumbs showPopup={true}/>
            {userData && (
                <>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    margin: '1rem'
                }}>
                    <ApplicationForm userData={userData}/>
                </Box>
                </>
            )}
        </>
    );
}

export default CreateApplication;