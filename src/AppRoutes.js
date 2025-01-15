import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LandingPage from './pages/landingpage/LandingPage';
import Faq from './pages/faq/Faq';
import Messages from './pages/messages/Messages';
import Contact from './pages/contact/Contact';
import Error404 from './pages/error404/Error404';
import Login from './pages/authentication/Login';
import Signup from './pages/authentication/Signup';
import CreateProfile from './pages/authentication/steps/CreateProfile';
import SignupComplete from './pages/authentication/steps/SignupComplete';
import { Profile } from './pages/profile/Profile';
import EditProfile from './pages/profile/EditProfile';
import Search from './pages/search/Search';
import Results from './pages/search/Results';
import ViewNanny from './pages/search/ViewNanny';
import Favorites from './pages/search/Favorites';
import Meetings from './pages/meetings/Meetings';
import ViewMeeting from './pages/meetings/ViewMeeting';
import Applications from './pages/applications/Applications';
import Contracts from './pages/contracts/Contracts';
import Partnerships from './pages/partnerships/Partnerships';
import JobPosting from './pages/job_posting/JobPosting';
import EditJobPosting from './pages/job_posting/EditJobPosting';

function AppRoutes() {
    return (
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/faq" element={<Faq />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/create-profile" element={<CreateProfile />} />
                <Route path="/signup-complete" element={<SignupComplete />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/profile/edit-profile" element={<EditProfile />} />
                <Route path="/search" element={<Search />} />
                <Route path="/search/results" element={<Results />} />
                <Route path="/search/view-nanny" element={<ViewNanny />} />
                <Route path="/search/favorites" element={<Favorites />} />
                <Route path="/meetings" element={<Meetings />} />
                <Route path="/meetings/view-meeting" element={<ViewMeeting />} />
                <Route path="/applications" element={<Applications />} />
                <Route path="/contracts" element={<Contracts />} />
                <Route path="/partnerships" element={<Partnerships />} />
                <Route path="/job-posting" element={<JobPosting />} />
                <Route path="/job-posting/edit-job-posting" element={<EditJobPosting />} />
                <Route path="/error404" element={<Error404 />} />
                <Route path="*" element={<Error404 />} />
            </Routes>
    );
}

export default AppRoutes;