import React from 'react';
import Header from '../Header/Header';
import WelcomeBox from './WelcomeBox/WelcomeBox';
import Info from './Info/Info';
import './LandingPage.css';
import '../style.css';

function LandingPage() {
    return (
        <>
            <Header />
            <WelcomeBox />
            <Info />
        </>
    );
}

export default LandingPage;