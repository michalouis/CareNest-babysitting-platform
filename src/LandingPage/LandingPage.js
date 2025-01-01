import React from 'react';
import Header from '../Header/Header';
import './LandingPage.css';
import '../style.css';

import WelcomeBox from './WelcomeBox/WelcomeBox';   

function LandingPage() {
    return (
        <>
            <Header />
            <WelcomeBox />
        </>
    );
}

export default LandingPage;