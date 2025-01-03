import React from 'react';
import { Link } from 'react-router-dom';

function Error404() {
    return (
        <div style={styles.errorContainer}>
            <h1 style={styles.errorTitle}>ERROR 404 :(</h1>
            <h2 style={styles.errorSubtitle}>Η σελίδα δεν βρέθηκε.</h2>
            <p style={styles.errorText}>Λυπούμαστε, αλλά η σελίδα που αναζητάτε δεν υπάρχει ή έχει μετακινηθεί.</p>
            <p style={styles.errorText}>
                <strong>Μη κλαις!</strong> Μπορείτε να επιστρέψετε στην <Link to="/" style={styles.link}>αρχική σελίδα</Link> ή να χρησιμοποιήσετε το μενού για να βρείτε αυτό που ψάχνετε.
            </p>
            <img src='error404.jpg' alt='crying baby' style={styles.image} />
        </div>
    );
}

const styles = {
    errorContainer: {
        display: 'flex',
        margin: '2rem',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
    },
    errorTitle: {
        fontSize: '4rem',
        marginBottom: '1rem',
        color: 'var(--clr-black)',
    },
    errorSubtitle: {
        fontSize: '2rem',
        marginBottom: '1rem',
        color: 'var(--clr-black)',
    },
    errorText: {
        fontSize: '1rem',
        marginBottom: '1rem',
        color: 'var(--clr-black)',
    },
    link: {
        color: 'var(--clr-black)',
        textDecoration: 'underline',
    },
    image: {
        width: '100%',
        maxWidth: '500px',
        height: 'auto',
        '@media (max-width: 42rem)': {
            display: 'none',
        },
    },
};

export default Error404;