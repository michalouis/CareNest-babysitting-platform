import React from 'react';
import { Link } from 'react-router-dom';
import './error404.css';
import { useAuthCheck as AuthCheck } from '../../AuthChecks';
import Loading from '../../layout/Loading';
import PageTitle from '../../PageTitle';

// Error 404 page
function Error404() {
    const { isLoading } = AuthCheck();

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className="error404-container">
            <PageTitle title="CareNest - Error 404" />
            <h1 className="error404-title">ERROR 404 :(</h1>
            <h2 className="error404-subtitle">Page not found.</h2>
            <p className="error404-text">Sorry, but the page you are looking for does not exist or has been moved.</p>
            <p className="error404-text">
                <strong>Don't cry!</strong> You can return to the <Link to="/CareNest-babysitting-platform" className="link">homepage</Link> or use the menu to find what you're looking for.
            </p>
            <img src={`${process.env.PUBLIC_URL}/error404.jpg`} alt='crying baby' className="image" />
        </div>
    );    
}

export default Error404;