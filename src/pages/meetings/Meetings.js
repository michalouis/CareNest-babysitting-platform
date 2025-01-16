import React, { useState } from "react";
import { useAuthCheck as AuthCheck } from '../../AuthChecks';
import Loading from '../../layout/Loading';
import PageTitle from '../../PageTitle';
import Breadcrumbs from '../../layout/Breadcrumbs';
import { Box } from '@mui/material';
import { FilterBox, DateRangeDialog } from './FilterBox'; // Adjust the import path as needed

const checkboxOptions = [
    { label: "Εγκεκριμένα", value: "accepted" },
    { label: "Σε αναμονή", value: "pending" },
    { label: "Αππορίφθηκαν", value: "rejected" }
];

function Meetings() {
    const { userData, isLoading } = AuthCheck(true, false, false);
    const [filters, setFilters] = useState({
        accepted: true,
        pending: true,
        rejected: true,
        fromDate: {
            day: '',
            month: '',
            year: ''
        },
        toDate: {
            day: '',
            month: '',
            year: ''
        },
    });

    if (isLoading) {
        return <Loading />;
    }

    return (
        <>
        {userData && (
            <>
                <PageTitle title="CareNest - Ραντεβού" />
                <Breadcrumbs />
                <h1 style={{ marginLeft: '1rem' }}>Ραντεβού Γνωριμίας</h1>
                <p style={{ fontSize: '1.2rem', maxWidth: '1150px', alignSelf: 'center', textAlign: 'center', marginTop: '1rem' }}>
                Διαχειριστείτε τα ραντεβού γνωριμίας σας!
                Χρησιμοποιήστε τα φίλτρα για να βρείτε εύκολα ραντεβού με βάση την κατάστασή τους ή την ημερομηνία.
                Μπορείτε να παρακολουθείτε την τρέχουσα κατάσταση κάθε ραντεβού και να δείτε τις λεπτομέρειες τους.
                </p>
                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    flexWrap: { xs: 'nowrap', md: 'wrap' },
                    justifyContent: 'space-between',
                    gap: '1rem',
                    margin: '1rem'
                }}>
                    <FilterBox
                        filters={filters}
                        setFilters={setFilters}
                        checkboxOptions={checkboxOptions}
                    />
                </Box>
            </>
        )}
        </>
    );
}

export default Meetings;