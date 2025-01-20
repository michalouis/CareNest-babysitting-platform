import React from 'react';
import Breadcrumbs from '../../layout/Breadcrumbs';
import ContactBox from './ContactBox';
import { useAuthCheck as AuthCheck } from '../../AuthChecks';
import Loading from '../../layout/Loading';
import PageTitle from '../../PageTitle';


// Contact page
function Contact() {
    const { isLoading } = AuthCheck();

    if (isLoading) {
        return <Loading />;
    }
    
    return (
        <>
            <PageTitle title="CareNest - Επικοινωνία" />
            <Breadcrumbs />
            <ContactBox />  {/* Contact form - in separate file bc its used also in HomePage */}
        </>
    );
}

export default Contact;