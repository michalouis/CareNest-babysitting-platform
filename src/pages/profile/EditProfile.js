import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import Breadcrumbs from '../../layout/Breadcrumbs';
import ProfileFormParent from "../authentication/steps/ProfileFormParent";
import ProfileFormNanny from "../authentication/steps/ProfileFormNanny";
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_AUTH } from '../../firebase';
import '../../style.css';

function EditProfile() {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const user = FIREBASE_AUTH.currentUser;
            if (user) {
                const userDoc = await getDoc(doc(FIREBASE_DB, 'users', user.uid));
                if (userDoc.exists()) {
                    setUserData(userDoc.data());
                }
            }
        };

        fetchUserData();
    }, []);

    if (!userData) {
        return <p>Loading...</p>;
    }

    return (
        <>
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