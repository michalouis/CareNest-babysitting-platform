import React from "react";
import { Box, Button } from "@mui/material";
import { useAuthCheck as AuthCheck } from '../../AuthChecks';
import Loading from '../../layout/Loading';
import PageTitle from '../../PageTitle';
import Breadcrumbs from '../../layout/Breadcrumbs';

import '../../style.css'

function JobPosting() {
    const { isLoading } = AuthCheck( true, false, false, 'nanny' );

    if (isLoading) {
        return <Loading />;
    }

    return (
        <>  
            <PageTitle title="CareNest - Αγγελία" />
            <Breadcrumbs />
            <h1 style={{ margin: '1rem' }}>Αγγελία</h1>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    margin: '1rem 1rem',
            }}>
                <p style={{ fontSize: '1.2rem', maxWidth: '1080px' }}>
                    <strong>Δημιουργήστε την αγγελία σας και βρείτε την ιδανική συνεργασία!</strong><br />
                    Δηλώστε τις προτιμήσεις και τη διαθεσιμότητά σας, ώστε να σας
                    βρουν οι κατάλληλες οικογένειες. Συμπληρώστε στοιχεία όπως τον
                    χρόνο απασχόλησης, την τοποθεσία εργασίας και το ηλικιακό γκρουπ
                    που προτιμάτε να φροντίζετε.
                </p>
                <Button 
                    variant="contained"
                    sx={{
                        width: '450px',
                        marginTop: '4rem',
                        padding: '0.5rem 1rem',
                        backgroundColor: 'var(--clr-violet)',
                }}>
                    <p className="big-button-text">Δημιουργία Νέας Αγγελίας</p>
                </Button>
                <Button
                    variant="contained"
                    sx={{
                        width: '450px',
                        marginTop: '1.5rem',
                        padding: '0.5rem 1rem',
                }}>
                    <p className="big-button-text">Προσωρινά Αποθηκευμένη Αγγελία</p>  
                </Button>
            </Box>
        </>
    );
}

export default JobPosting;