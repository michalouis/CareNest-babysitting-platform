import React from "react";
import { Box } from "@mui/material";
import Breadcrumbs from '../../layout/Breadcrumbs';
import ProfileFormParent from "../authentication/steps/ProfileFormParent";
import ProfileFormNanny from "../authentication/steps/ProfileFormNanny";
import { useAuthCheck as AuthCheck } from '../../AuthChecks';
import Loading from '../../layout/Loading';
import PageTitle from '../../PageTitle';

import '../../style.css';

function EditProfile() {
    const { userData, isLoading } = AuthCheck( true );

    if (isLoading) {
        return <Loading />;
    }

    return (
        <>
            <PageTitle title="CareNest - Επεξεργασία Προφίλ" />
            <Breadcrumbs current="Επεξεργασία Προφίλ" showPopup={true} />
                <h1 style={{ marginLeft: '1rem' }}>Επεξεργασία Προφίλ</h1>
            <Box style={{ 
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginTop: '2rem'
            }}>
                {userData.role === 'parent' ? (
                    <ProfileFormParent userData={userData} />
                ) : (
                    <ProfileFormNanny userData={userData} />
                )}
            </Box>
        </>
    );
}

export default EditProfile;