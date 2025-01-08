import React from 'react';
import Breadcrumbs from '../../layout/Breadcrumbs';
import ContactBox from './ContactBox';
import { useAuthCheck as AuthCheck } from '../../AuthChecks';
import Loading from '../../layout/Loading';

function Contact() {
    const { isLoading } = AuthCheck();

    if (isLoading) {
        return <Loading />;
    }
    
    return (
        <>
            <Breadcrumbs current="Επικοινωνία" />
            <ContactBox />
        </>
    );
}

export default Contact;