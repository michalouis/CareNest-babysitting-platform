import React, { useState } from 'react';
import Breadcrumbs from '../../layout/Breadcrumbs';
import ContactBox from './ContactBox';

function Contact() {
    return (
        <>
            <Breadcrumbs current="Επικοινωνία" />
            <ContactBox />
        </>
    );
}

export default Contact;