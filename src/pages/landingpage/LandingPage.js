import React from 'react';
import { useAuthCheck as AuthCheck } from '../../AuthChecks';
import PageTitle from '../../PageTitle';

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
        console.log(userData);
    }

    return (
        <>
            <PageTitle title="CareNest - Αρχική Σελίδα" />
            {userData ? (
                <>
                    {userData.role === 'parent' ? (
                        <LoggedinParent userData={userData} />
                    ) : (
                        <LoggedinNanny userData={userData}/>
                    )}
                </>
            ) : (
                <Loggedout />
            )}
        </>
    );
}

export default LandingPage;