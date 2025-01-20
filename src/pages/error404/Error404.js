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
            <h2 className="error404-subtitle">Η σελίδα δεν βρέθηκε.</h2>
            <p className="error404-text">Λυπούμαστε, αλλά η σελίδα που αναζητάτε δεν υπάρχει ή έχει μετακινηθεί.</p>
            <p className="error404-text">
                <strong>Μη κλαις!</strong> Μπορείτε να επιστρέψετε στην <Link to="/" className="link">αρχική σελίδα</Link> ή να χρησιμοποιήσετε το μενού για να βρείτε αυτό που ψάχνετε.
            </p>
            <img src='/error404.jpg' alt='crying baby' className="image" />
        </div>
    );
}

export default Error404;