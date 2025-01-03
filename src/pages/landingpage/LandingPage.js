import React from 'react';
import WelcomeBox from './welcomebox/WelcomeBox';
import Info from './info/Info';
import ContactBox from '../contact/ContactBox';
import './landingPage.css';
import '../../style.css';

function LandingPage() {
    return (
        <>
            <WelcomeBox />
            <Info />
            <ContactBox />
        </>
    );
}

export default LandingPage;