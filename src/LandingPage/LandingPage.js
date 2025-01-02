import React from 'react';
import Header from '../Layout/Header';
import Footer from '../Layout/Footer';
import WelcomeBox from './WelcomeBox/WelcomeBox';
import Info from './Info/Info';
import Contact from './Contact';
import './landingPage.css';
import '../style.css';

function LandingPage() {
    return (
        <>
            <WelcomeBox />
            <Info />
            <Contact />
        </>
    );
}

export default LandingPage;