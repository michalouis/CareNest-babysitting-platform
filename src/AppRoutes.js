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
import ViewProfile from './pages/search/ViewProfile';
import Favorites from './pages/search/Favorites';
import Meetings from './pages/meetings/Meetings';
import ViewMeeting from './pages/meetings/ViewMeeting';
import Applications from './pages/applications/Applications';
import CreateApplication from './pages/applications/CreateApplication';
import ViewApplication from './pages/applications/ViewApplication';
import Contracts from './pages/contracts/Contracts';
import ViewContract from './pages/contracts/ViewContract';
import Partnerships from './pages/partnerships/Partnerships';
import ViewPartnership from './pages/partnerships/ViewPartnership';
import JobPosting from './pages/job_posting/JobPosting';
import EditJobPosting from './pages/job_posting/EditJobPosting';

// App routes
function AppRoutes() {
    return (
            <Routes>
                <Route path="/CareNest-babysitting-platform" element={<LandingPage />} />
                <Route path="/CareNest-babysitting-platform/contact" element={<Contact />} />
                <Route path="/CareNest-babysitting-platform/faq" element={<Faq />} />
                <Route path="/CareNest-babysitting-platform/messages" element={<Messages />} />
                <Route path="/CareNest-babysitting-platform/login" element={<Login />} />
                <Route path="/CareNest-babysitting-platform/signup" element={<Signup />} />
                <Route path="/CareNest-babysitting-platform/create-profile" element={<CreateProfile />} />
                <Route path="/CareNest-babysitting-platform/signup-complete" element={<SignupComplete />} />

                {/* Profile */}
                <Route path="/CareNest-babysitting-platform/profile" element={<Profile />} />
                <Route path="/CareNest-babysitting-platform/profile/edit-profile" element={<EditProfile />} />
                
                {/* Job Posting */}
                <Route path="/CareNest-babysitting-platform/job-posting" element={<JobPosting />} />
                <Route path="/CareNest-babysitting-platform/job-posting/edit-job-posting" element={<EditJobPosting />} />

                {/* Search */}
                <Route path="/CareNest-babysitting-platform/search" element={<Search />} />
                <Route path="/CareNest-babysitting-platform/search/favorites" element={<Favorites />} />
                <Route path="/CareNest-babysitting-platform/search/results" element={<Results />} />
                <Route path="/CareNest-babysitting-platform/search/view-profile/:id" element={<ViewProfile />} />
                <Route path="/CareNest-babysitting-platform/search/view-profile/:id/create-application/:id" element={<CreateApplication />} />

                {/* Meetings */}
                <Route path="/CareNest-babysitting-platform/meetings" element={<Meetings />} />
                <Route path="/CareNest-babysitting-platform/meetings/view-meeting/:id" element={<ViewMeeting />} />
                <Route path="/CareNest-babysitting-platform/meetings/view-meeting/:id/view-profile/:id" element={<ViewProfile />} />

                {/* Applications */}
                <Route path="/CareNest-babysitting-platform/applications" element={<Applications />} />
                <Route path="/CareNest-babysitting-platform/applications/view-application/:id" element={<ViewApplication />} />
                <Route path="/CareNest-babysitting-platform/applications/create-application/:id" element={<CreateApplication />} />

                {/* Contracts */}
                <Route path="/CareNest-babysitting-platform/contracts" element={<Contracts />} />
                <Route path="/CareNest-babysitting-platform/contracts/view-contract/:id" element={<ViewContract />} />
                
                {/* Partnerships */}
                <Route path="/CareNest-babysitting-platform/partnerships" element={<Partnerships />} />
                <Route path="/CareNest-babysitting-platform/partnerships/view-partnership/:id" element={<ViewPartnership />} />

                {/* Error 404 */}
                <Route path="/CareNest-babysitting-platform/error404" element={<Error404 />} />
                <Route path="*" element={<Error404 />} />
            </Routes>
    );
}

export default AppRoutes;