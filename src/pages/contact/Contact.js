import React from 'react';
import Breadcrumbs from '../../layout/Breadcrumbs';
import ContactBox from './ContactBox';
import { useFinishProfileRedirect } from '../../AuthChecks';    // if logged in unfinished profile, redirect to finish profile
function Contact() {
    useFinishProfileRedirect();
    return (
        <>
            <Breadcrumbs current="Επικοινωνία" />
            <ContactBox />
        </>
    );
}

export default Contact;