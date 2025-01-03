import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LandingPage from './pages/landingpage/LandingPage';
import Faq from './pages/faq/Faq';
import Messages from './pages/messages/Messages';
import Contact from './pages/contact/Contact';
import Error404 from './pages/error404/Error404';
import Login from './pages/authentication/Login';
import Signup from './pages/authentication/Signup';

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<Error404 />} />
        </Routes>
    );
}

export default AppRoutes;