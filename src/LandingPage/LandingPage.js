import React from 'react';
import Header from '../Layout/Header';
import Footer from '../Layout/Footer';
import WelcomeBox from './WelcomeBox/WelcomeBox';
import Info from './Info/Info';
import Contact from './Contact';
import './LandingPage.css';
import '../style.css';

function LandingPage() {
    return (
        <>
            <Header />
            <WelcomeBox />
            <Info />
            <Contact />
            <Footer />
        </>
    );
}

export default LandingPage;