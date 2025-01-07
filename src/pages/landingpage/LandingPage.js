import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../firebase';
import { useFinishProfileRedirect } from '../../AuthChecks';

import Loggedout from './Loggedout';
import LoggedinParent from './LoggedinParent';
import LoggedinNanny from './LoggedinNanny';

import './landingPage.css';
import '../../style.css';

function LandingPage() {
    const [userData, setUserData] = useState(null);

    useFinishProfileRedirect();

    // Check if the user is logged in or not
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, async (user) => {
            if (user) {
                const userDoc = await getDoc(doc(FIREBASE_DB, 'users', user.uid));
                if (userDoc.exists()) {
                    setUserData(userDoc.data());
                }
            } else {
                setUserData(null);
            }
        });

        return () => unsubscribe();
    }, []);

    if (userData) {
        console.log(`Hello, ${userData.firstName} ${userData.lastName}. Your AMKA is ${userData.amka}.`);
        console.log(`Email: ${userData.email}`);
        console.log(`Role: ${userData.role}`);
        console.log(`Gender: ${userData.gender}`);
        console.log(`Birthday: ${userData.birthday}`);
        console.log(`Address: ${userData.address}`);
        console.log(`Postal Code: ${userData.postalCode}`);
        console.log(`Town: ${userData.town}`);
        console.log(`Phone Number: ${userData.phoneNumber}`);
        console.log(`Child Name: ${userData.childName}`);
        console.log(`Child Gender: ${userData.childGender}`);
        console.log(`Child Age Group: ${userData.childAgeGroup}`);
        console.log(`About Me: ${userData.aboutMe}`);
    }

    return (
        <>
            {userData ? (
                <>
                    {userData.role === 'parent' ? (
                        <LoggedinParent firstName={userData.firstName} />
                    ) : (
                        <LoggedinNanny />
                    )}
                </>
            ) : (
                <Loggedout />
            )}
        </>
    );
}

export default LandingPage;