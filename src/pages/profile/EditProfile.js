import React from "react";
import { Box } from "@mui/material";
import Breadcrumbs from '../../layout/Breadcrumbs';
import ProfileFormParent from "../authentication/steps/ProfileFormParent";
import ProfileFormNanny from "../authentication/steps/ProfileFormNanny";
import { useAuthCheck as AuthCheck } from '../../AuthChecks';
import Loading from '../../layout/Loading';
import PageTitle from '../../PageTitle';

import '../../style.css';

// EditProfile page
function EditProfile() {
    const { userData, isLoading } = AuthCheck( true );

    if (isLoading) {
        return <Loading />;
    }

    return (
        <>
        {userData && (
            <>
            <PageTitle title="CareNest - Επεξεργασία Προφίλ" />
            <Breadcrumbs showPopup={true} />
                <h1 style={{ marginLeft: '1rem' }}>Επεξεργασία Προφίλ</h1>
            <Box style={{ 
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginTop: '2rem'
            }}>
                {/* Use profile forms from signup to edit data */}
                {userData.role === 'parent' ? ( 
                    <ProfileFormParent userData={userData} />   
                ) : (
                    <ProfileFormNanny userData={userData} />
                )}
            </Box>
            </>
        )}
        </>
    );
}

export default EditProfile;