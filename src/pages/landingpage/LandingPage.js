import React from 'react';
import { useAuthCheck as AuthCheck } from '../../AuthChecks';

import Loading from '../../layout/Loading';
import Loggedout from './Loggedout';
import LoggedinParent from './LoggedinParent';
import LoggedinNanny from './LoggedinNanny';

import './landingPage.css';
import '../../style.css';

function LandingPage() {
    const { userData, isLoading } = AuthCheck();

    if (isLoading) {
        return <Loading />;
    }

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
                        <LoggedinNanny firstName={userData.firstName}/>
                    )}
                </>
            ) : (
                <Loggedout />
            )}
        </>
    );
}

export default LandingPage;